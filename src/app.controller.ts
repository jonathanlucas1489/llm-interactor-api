import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('mock-data')
  async createMockData(@Body() body: { email: string; password: string }) {
    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    return { message: 'User created successfully', user };
  }

  @Get('users')
  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return { users };
  }
}
