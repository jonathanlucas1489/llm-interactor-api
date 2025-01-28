import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { LlmModule } from './llm/llm.module';
import { OcrModule } from './ocr/ocr.module';
import { DocumentsController } from './documents/documents.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LlmModule, OcrModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, DocumentsController],
  providers: [AppService, PrismaService],
})
export class AppModule { }