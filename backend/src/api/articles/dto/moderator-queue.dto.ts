import { Date } from 'mongoose';

export class ModeratorQueueDto {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  publisher: string;
  submittedAt: Date;
}
