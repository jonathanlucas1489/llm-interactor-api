import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LlmService {
  private readonly hfApiUrl = 'https://api-inference.huggingface.co/models/';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async queryModel(prompt: string): Promise<string> {
    const model = 'gpt2';
    const apiKey = this.configService.get<string>('HF_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException('Hugging Face API key not configured.');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.hfApiUrl}${model}`,
          { inputs: prompt },
          { headers: { Authorization: `Bearer ${apiKey}` } },
        ),
      );

      return response.data[0].generated_text || 'No response from model.';
    } catch (error) {
      console.error('Error querying Hugging Face model:', error.message);
      throw new InternalServerErrorException('Failed to query Hugging Face model.');
    }
  }
}
