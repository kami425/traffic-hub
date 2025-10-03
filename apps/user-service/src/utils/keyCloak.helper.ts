/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { KeyCloakUserDto } from '../types/ketCloak/keyCloak-user.dto';
import { KeyCloakAdminTokenDto } from '../types/ketCloak/keyCloak-admin-token.dto';
import { KeyCloakConfigDto } from '../types/ketCloak/keyCloak-config.dto';
import messages from './messages.json';

@Injectable()
export class KeyCloakHelper {
  private logger: Logger;
  private keyCloakConfig: KeyCloakConfigDto;

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.keyCloakConfig = {
      clientId: configService.get<string>('KC_CLIENT_ID')!,
      clientSecret: configService.get<string>('KC_CLIENT_SECRET')!,
      realm: configService.get<string>('KC_REALM')!,
      url: configService.get<string>('KC_URL')!,
    };
  }

  async getAdminAccessToken() {
    const url = `${this.keyCloakConfig.url}/realms/${this.keyCloakConfig.realm}/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.keyCloakConfig.clientId);
    params.append('client_secret', this.keyCloakConfig.clientSecret);

    const response = await firstValueFrom(
      this.httpService.post<KeyCloakAdminTokenDto>(url, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    Logger.log(
      `user-service => KeyCloakHelper => getAdminAccessToken: A new token was obtained for the administrator from KeyCloak - ${response.data.access_token}`,
    );

    return response.data;
  }

  async createUser(user: KeyCloakUserDto, adminAccessToken: string) {
    const url = `${this.keyCloakConfig.url}/admin/realms/${this.keyCloakConfig.realm}/users`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, user, {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      // KeyCloak will always return the newly created userId in its response header
      const locationHeader =
        response.headers['location'] || response.headers['Location'];
      if (!locationHeader) {
        throw new InternalServerErrorException(
          messages.keyCloak.Fail_TO_GET_LOCATION_HEADER,
        );
      }

      // Extract userId from location URL
      const userId = locationHeader.split('/').pop();

      Logger.log(
        `user-service => KeyCloakHelper => createUser: A new User created on KeyCloak - User id: ${userId} - User data: ${JSON.stringify(user)}`,
      );

      return userId;
    } catch (error: any) {
      if (error.status === 409) {
        throw new BadRequestException(messages.DUPLICATE_EMAIL);
      }
    }
  }

  async assignRoleToUser(
    userId: string,
    roleName: string,
    adminAccessToken: string,
  ) {
    const roleUrl = `${this.keyCloakConfig.url}/admin/realms/${this.keyCloakConfig.realm}/roles/${roleName}`;

    // 1. Fetch the role representation
    const roleResponse = await firstValueFrom(
      this.httpService.get(roleUrl, {
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      }),
    );

    const role = roleResponse.data;

    if (!role || !role.id) {
      throw new InternalServerErrorException();
    }

    // 2. Assign the role to the user
    const assignUrl = `${this.keyCloakConfig.url}/admin/realms/${this.keyCloakConfig.realm}/users/${userId}/role-mappings/realm`;

    await firstValueFrom(
      this.httpService.post(assignUrl, [role], {
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    Logger.log(
      `user-service => KeyCloakHelper => assignRoleToUser: Assigned role "${roleName}" to user ${userId}`,
    );
  }

  async unassignRole(
    userId: string,
    roleName: string,
    adminAccessToken: string,
  ) {
    const roleUrl = `${this.keyCloakConfig.url}/admin/realms/${this.keyCloakConfig.realm}/roles/${roleName}`;

    // Get the role to unassign it from user
    const roleResponse = await firstValueFrom(
      this.httpService.get(roleUrl, {
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      }),
    );

    const role = roleResponse.data;

    if (!role || !role.id) {
      throw new InternalServerErrorException();
    }

    // Unassign the role from the user
    const unassignUrl = `${this.keyCloakConfig.url}/admin/realms/${this.keyCloakConfig.realm}/users/${userId}/role-mappings/realm`;

    await firstValueFrom(
      this.httpService.delete(unassignUrl, {
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json',
        },
        data: [role],
      }),
    );

    Logger.log(
      `user-service => KeyCloakHelper => unassignRole: Removed role: ${roleName} - User: ${userId}`,
    );
  }

  async updateUser(
    userId: string,
    user: Partial<KeyCloakUserDto>,
    adminAccessToken: string,
  ) {
    const url = `${this.keyCloakConfig.url}/admin/realms/${this.keyCloakConfig.realm}/users/${userId}`;

    try {
      await firstValueFrom(
        this.httpService.put(url, user, {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      Logger.log(
        `user-service => KeyCloakHelper => updateUser: User updated on Keycloak - User id: ${userId} - Updated data: ${JSON.stringify(user)}`,
      );
    } catch (error: any) {
      if (error.status === 409) {
        throw new BadRequestException(messages.DUPLICATE_EMAIL);
      }
    }

    return true;
  }

  async deleteUser(userId: string, adminAccessToken: string) {
    const deleteUrl = `${this.keyCloakConfig.url}/admin/realms/${this.keyCloakConfig.realm}/users/${userId}`;

    await firstValueFrom(
      this.httpService.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      }),
    );

    Logger.log(
      `user-service => KeyCloakHelper => deleteUser: Deleted user ${userId}`,
    );
  }
}
