import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractText(imagePath: string): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
      
      return text;
    } catch (error) {
      console.error('Error during OCR processing:', error.message || error);
      throw new Error('Failed to process the image. Please ensure the file path is correct and the image is in a supported format.');
    }
  }
}