import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Get,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserInputDto } from '../../types/user/DTOs/inputs/user-input.dto';
import { changePasswordDto } from '../../types/user/DTOs/inputs/change-password-input.dto';
import { Public, Roles } from '@traffic-hub/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.appService.getUser(id);
  }

  @Public()
  @Post()
  async register(@Body() model: UserInputDto) {
    return await this.appService.register(model);
  }

  @Roles({ roles: ['admin'] })
  @Put(':id')
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: UserInputDto,
  ) {
    return await this.appService.editUser(id, model);
  }

  @Roles({ roles: ['admin'] })
  @Put('changePassword/:id')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: changePasswordDto,
  ) {
    console.log(id, model);
  }

  @Roles({ roles: ['admin'] })
  @Put('assign/:id/:roleName')
  async assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleName') roleName: string,
  ) {
    return this.appService.assignRole(id, roleName);
  }

  @Roles({ roles: ['admin'] })
  @Delete('unassign/:id/:roleName')
  async unassignRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleName') roleName: string,
  ) {
    return await this.appService.unassignRole(id, roleName);
  }

  @Roles({ roles: ['admin'] })
  @Delete(':id')
  async removeUser(@Param('id', ParseIntPipe) id: number) {
    return await this.appService.removeUser(id);
  }
}
