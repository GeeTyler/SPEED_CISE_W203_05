export interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  publisher: string;
  doi: string;
  averageRating?: number | null;
}