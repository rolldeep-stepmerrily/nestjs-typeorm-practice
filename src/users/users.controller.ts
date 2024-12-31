import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiExceptionResponse } from 'nestjs-swagger-api-exception-response';

import { CreateUserRequestDto } from './dto/users.request.dto';
import { CreateUserResponseDto } from './dto/users.response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'create user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'create user success', type: CreateUserResponseDto })
  @ApiExceptionResponse(HttpStatus.BAD_REQUEST, [{ message: 'invalid request', errorCode: 'E0001' }])
  @ApiExceptionResponse(HttpStatus.CONFLICT, [{ message: 'username already exists', errorCode: 'E0002' }])
  @ApiExceptionResponse(HttpStatus.INTERNAL_SERVER_ERROR, [{ message: 'unknown error', errorCode: 'E0003' }])
  @Post()
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return await this.usersService.createUser(createUserRequestDto);
  }
}
