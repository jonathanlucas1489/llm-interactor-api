import { Controller, Post, Body } from '@nestjs/common';
import { OcrService } from '../ocr/ocr.service';
import { LlmService } from '../llm/llm.service';
import { PrismaService } from 'prisma/prisma.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly llmService: LlmService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  async uploadDocument(
    @Body() { filePath, userId }: { filePath: string; userId: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const text = await this.ocrService.extractText(filePath);

    const document = await this.prisma.document.create({
      data: {
        userId,
        filename: filePath,
        textExtract: text,
        imageUrl: filePath,
      },
    });

    const llmResponse = `Extracted Text: ${text}\n\n Ask me about.`;

    await this.prisma.interaction.create({
      data: {
        documentId: document.id,
        content: llmResponse,
        isFromUser: false,
      },
    });

    return { llmResponse, documentId: document.id };
  }

  @Post('generate')
  async generateText(
    @Body('prompt') prompt: string,
    @Body('documentId') documentId: string,
  ) {
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
      },
    });
    const llmResponse = await this.llmService.queryModel(
      prompt,
      document.textExtract,
    );

    if (document) {
      await this.prisma.interaction.create({
        data: {
          documentId: document.id,
          content: prompt,
          isFromUser: true,
        },
      });

      await this.prisma.interaction.create({
        data: {
          documentId: document.id,
          content: llmResponse,
          isFromUser: false,
        },
      });
    }

    return { llmResponse };
  }

  @Post('get-documents')
  async getDocuments(@Body('userId') userId: string) {
    const documents = await this.prisma.document.findMany({
      where: {
        userId,
      },
      include: {
        interactions: true,
      },
    });

    return { documents };
  }
}
