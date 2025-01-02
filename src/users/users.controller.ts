import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiExceptionResponse } from 'nestjs-swagger-api-exception-response';

import { GLOBAL_ERRORS } from '@@exceptions';

import { CreateUserRequestDto, SignInRequestDto } from './dto/users.request.dto';
import { CreateUserResponseDto, SignInResponseDto } from './dto/users.response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'create user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'create user success', type: CreateUserResponseDto })
  @ApiExceptionResponse(HttpStatus.BAD_REQUEST, [GLOBAL_ERRORS.INVALID_REQUEST])
  @ApiExceptionResponse(HttpStatus.CONFLICT, [GLOBAL_ERRORS.USERNAME_ALREADY_EXISTS])
  @Post('sign-up')
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return await this.usersService.createUser(createUserRequestDto);
  }

  @ApiOperation({ summary: 'sign in' })
  @ApiResponse({ status: HttpStatus.OK, description: 'sign in success', type: SignInResponseDto })
  @ApiExceptionResponse(HttpStatus.NOT_FOUND, [GLOBAL_ERRORS.USER_NOT_FOUND])
  @ApiExceptionResponse(HttpStatus.UNAUTHORIZED, [GLOBAL_ERRORS.INVALID_PASSWORD])
  @Post('sign-in')
  async signIn(@Body() signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
    return await this.usersService.signIn(signInRequestDto);
  }
}
