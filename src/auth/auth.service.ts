/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(
    email: string,
    password: string,
  ): Promise<{ message: string; user: User }> {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user: User = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return { message: 'User created successfully', user };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; userId: string }> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error('User not found');

    const isValid: boolean = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');

    const token: string = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    return { token, userId: user.id };
  }
}
