/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RedisClient } from '@traffic-hub/shared';
import { PrismaService } from '../prisma/prisma.service';
import { UserInputDto } from '../../types/user/DTOs/inputs/user-input.dto';
import { Roles } from '../../types/user/domain/enums/roles';
import { KeyCloakHelper } from '../../utils/keyCloak.helper';
import { REDIS } from '../../utils/constants';
import messages from '../../utils/messages.json';
import { Gender, User } from '../../utils/prisma';
import { changePasswordDto } from '../../types/user/DTOs/inputs/change-password-input.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly keyCloakHelper: KeyCloakHelper,
    private readonly prismaService: PrismaService,
  ) {}

  async getUser(id: number) {
    const redisKey = REDIS.USER_DETAILS.replace('_ID', id.toString());
    const cachedResult = await this.redisClient.get(redisKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: id
      },
    });

    const { password, KC_ID, ...result } = user;

    await this.redisClient.set(redisKey, JSON.stringify(result));
    Logger.log(
      `user-service => AppService => getUser: Details of user cached: ${JSON.stringify(result)}`,
    );

    return result;
  }

  async register(model: UserInputDto) {
    const checkUser = await this.checkUserEmailAndUsername(
      model.email,
      model.username,
    );
    if (!(checkUser === true)) {
      return checkUser;
    }

    // Fetching admin access to interact with KeyCloak
    const adminAccessToken = await this.getAdminAccessToken();

    // Creating a user on KeyCloak and getting its userId for mapping with the database user
    const keyCloakUserId = await this.keyCloakHelper.createUser(
      {
        email: model.email,
        enabled: true,
        firstName: model.firstName,
        lastName: model.lastName,
        username: model.username,
        credentials: [
          {
            temporary: false,
            type: 'password',
            value: model.password,
          },
        ],
      },
      adminAccessToken,
    );

    // Assign default(member) role to newly created user
    await this.keyCloakHelper.assignRoleToUser(
      keyCloakUserId,
      Roles.MEMBER,
      adminAccessToken,
    );

    // Adding a user to the database
    const hashedPassword = bcrypt.hashSync(model.password, 10);

    let newUser: User;
    await this.prismaService.$transaction(async (prisma) => {
      newUser = await prisma.user.create({
        data: {
          email: model.email,
          username: model.username,
          firstName: model.firstName,
          lastName: model.lastName,
          address: model.address,
          age: model.age,
          gender: model.gender as Gender,
          KC_ID: keyCloakUserId,
          password: hashedPassword,
          phone: model.phone,
        },
      });

      Logger.log(
        `user-service => AppService => register: A new user created - ${JSON.stringify(newUser)}`,
      );

      // Finding properiate role from database to assign it to the newly created user
      const role = await prisma.role.findUniqueOrThrow({
        where: {
          title: Roles.MEMBER,
        },
      });

      // Assigning role to new user
      const newUserRole = await prisma.userRole.create({
        data: {
          roleId: role.id,
          userId: newUser.id,
        },
      });

      Logger.log(
        `user-service => AppService => register: The basic role has been assigned to the new user - ${JSON.stringify(newUserRole)}`,
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { password, KC_ID, ...result } = newUser!;
    return result;
  }

  async editUser(id: number, model: UserInputDto) {
    // Update user with new values
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        address: model.address,
        firstName: model.firstName,
        lastName: model.lastName,
        gender: model.gender as Gender,
        phone: model.phone,
        age: model.age,
      },
    });

    this.redisClient.del(REDIS.USER_DETAILS.replace('_ID', '*'));

    Logger.log(
      `user-service => AppService => updateProfile: A user updadated in database - User id ${id} - Updated values ${JSON.stringify(model)}`,
    );

    // Fetching admin access to interact with KeyCloak
    const adminAccessToken = await this.getAdminAccessToken();

    await this.keyCloakHelper.updateUser(
      user.KC_ID,
      {
        firstName: model.firstName,
        lastName: model.lastName,
      },
      adminAccessToken,
    );

    Logger.log(
      `user-service => AppService => updateProfile: A user updadated on KeyCloak - User id ${user.KC_ID} - Updated values ${JSON.stringify(
        {
          firstName: model.firstName,
          lastName: model.lastName,
        },
      )}`,
    );

    return true;
  }

  async changePassword(id: number, model: changePasswordDto) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    if (!bcrypt.compareSync(model.oldPassword, user.password)) {
      return new UnauthorizedException(messages.ACCESS_DENIED);
    }

    const adminAccessToken = await this.getAdminAccessToken();

    await this.keyCloakHelper.updateUser(
      user.KC_ID,
      {
        credentials: [
          {
            type: 'password',
            value: model.newPassword,
            temporary: false,
          },
        ],
      },
      adminAccessToken,
    );

    Logger.log(
      `user-service => AppService => changePassword: A users password updadated on KeyCloak - User id ${user.KC_ID}`,
    );

    const hashedPassword = bcrypt.hashSync(model.newPassword, 10);
    await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        password: hashedPassword,
      },
    });

    Logger.log(
      `user-service => AppService => changePassword: A users password updadated in database - User id ${user.id}`,
    );

    return true;
  }

  async assignRole(id: number, roleName: string) {
    // Getting role based on its title to ensure it is exist
    const role = await this.prismaService.role.findUniqueOrThrow({
      where: {
        title: roleName,
      },
    });

    // Getting user to ensure the is correct
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    // Get users roles to check if user currently has this specific role
    const userRoles = await this.prismaService.userRole.findMany({
      where: {
        userId: id,
      },
    });

    // Check if user has this role
    if (userRoles.some((x) => x.roleId === role.id)) {
      return userRoles;
    }

    const adminAccessToken = await this.getAdminAccessToken();

    await this.keyCloakHelper.assignRoleToUser(
      user.KC_ID,
      roleName,
      adminAccessToken,
    );

    Logger.log(
      `user-service => AppService => assignRole: A new role assigned to the user on KeyCloak - User id: ${user.KC_ID} - Role name: ${roleName}`,
    );

    // Assign role to the user in database
    const newUserRole = await this.prismaService.userRole.create({
      data: {
        roleId: role.id,
        userId: id,
      },
    });

    Logger.log(
      `user-service => AppService => assignRole: A new role assigned to the user in database - User id: ${id} - User role: ${JSON.stringify(newUserRole)}`,
    );

    return [...userRoles, newUserRole];
  }

  async unassignRole(id: number, roleName: string) {
    // Getting role based on its title to ensure it is exist
    const role = await this.prismaService.role.findUniqueOrThrow({
      where: {
        title: roleName,
      },
    });

    // Getting user to ensure the is correct
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    // Get users roles to check if user currently has this specific role
    const userRoles = await this.prismaService.userRole.findMany({
      where: {
        userId: id,
      },
    });

    // Check if user has this role
    if (!userRoles.some((x) => x.roleId === role.id)) {
      return new BadRequestException(messages.USER_DOES_NOT_HAVE_ROLE);
    }

    const adminAccessToken = await this.getAdminAccessToken();

    await this.keyCloakHelper.unassignRole(
      user.KC_ID,
      roleName,
      adminAccessToken,
    );

    Logger.log(
      `user-service => AppService => unassignRole: Role unassigned from user on KeyCloak - User id: ${user.KC_ID} - Role name: ${roleName}`,
    );

    // Unassign role from the user in database
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userRoleToDelete = userRoles.find((x) => x.roleId === role.id)!;
    const newUserRole = await this.prismaService.userRole.delete({
      where: {
        id: userRoleToDelete.id,
      },
    });

    Logger.log(
      `user-service => AppService => unassignRole: Role unassigned from user in database - User id: ${id} - User role: ${JSON.stringify(newUserRole)}`,
    );

    return userRoles.filter((x) => x.roleId !== role.id);
  }

  async removeUser(id: number) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    const adminAccessToken = await this.getAdminAccessToken();

    await this.keyCloakHelper.deleteUser(user.KC_ID, adminAccessToken);

    Logger.log(
      `user-service => AppService => removeUser: User removed from KeyCloak - User id: ${user.KC_ID}`,
    );

    await this.prismaService.user.delete({
      where: {
        id: user.id,
      },
    });

    Logger.log(
      `user-service => AppService => removeUser: User removed from database - User: ${JSON.stringify(user)}`,
    );

    this.redisClient.del(REDIS.USER_DETAILS.replace('_ID', '*'));

    return user;
  }

  private async checkUserEmailAndUsername(email: string, username: string) {
    // Check if is there any user with inputed username or email
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return new BadRequestException(messages.DUPLICATE_EMAIL);
      }

      if (existingUser.username === username) {
        return new BadRequestException(messages.DUPLICATE_USERNAME);
      }
    }

    return true;
  }

  private async getAdminAccessToken() {
    // Fetching admin access to interact with KeyCloak
    let adminAccessToken = await this.redisClient.get(
      REDIS.KC_ADMIN_ACCESS_TOKEN,
    );

    if (!adminAccessToken) {
      const kcResponse = await this.keyCloakHelper.getAdminAccessToken();
      adminAccessToken = kcResponse.access_token;
      this.redisClient.set(
        REDIS.KC_ADMIN_ACCESS_TOKEN,
        kcResponse.access_token,
        kcResponse.expires_in,
      );
    }

    return adminAccessToken;
  }
}
