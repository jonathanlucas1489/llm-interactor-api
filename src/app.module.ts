import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { LlmModule } from './llm/llm.module';
import { OcrModule } from './ocr/ocr.module';
import { DocumentsController } from './documents/documents.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    LlmModule,
    OcrModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [AppController, DocumentsController, AuthController],
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule {}
