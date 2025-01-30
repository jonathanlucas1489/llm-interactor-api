/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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

  async queryModel(prompt: string, context: string): Promise<string> {
    const model = 'openai-community/gpt2';
    const apiKey = this.configService.get<string>('HF_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'Hugging Face API key not configured.',
      );
    }
    const fullPrompt = `Context:${context}\n\nQuestion:${prompt}\n\nIn the context above. Response:`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.hfApiUrl}${model}`,
          {
            inputs: fullPrompt,
            parameters: {
              temperature: 0.29,
              top_p: 0.8,
              top_k: 70,
              repetition_penalty: 1.6,
              max_new_tokens: 500,
            },
          },
          { headers: { Authorization: `Bearer ${apiKey}` } },
        ),
      );
      const generatedText = response.data[0].generated_text;
      const match = generatedText.match(/Response:\s*(.*)/s);

      return match ? match[1].trim() : 'No valid response found.';
    } catch (error) {
      console.error('Error querying Hugging Face model:', error);
      throw new InternalServerErrorException(
        'Failed to query Hugging Face model.',
      );
    }
  }
}
