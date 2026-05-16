import { Injectable, NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UploadsService {
  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = join(process.cwd(), 'uploads', filename);
    try {
      await unlink(filepath);
    } catch {
      throw new NotFoundException('Файл не найден');
    }
  }
}