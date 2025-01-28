import { Controller, Post, Body } from '@nestjs/common';
import { OcrService } from '../ocr/ocr.service';
import { LlmService } from '../llm/llm.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly llmService: LlmService,
  ) {}

  @Post('upload')
  async uploadDocument(@Body() { filePath }: { filePath: string }) {
    const text = await this.ocrService.extractText(filePath);
    const llmResponse = await this.llmService.queryModel(text);
    return { llmResponse };
  }

  @Post('generate')
  async generateText(@Body('prompt') prompt: string): Promise<string> {
    return await this.llmService.queryModel(prompt);
  }
}