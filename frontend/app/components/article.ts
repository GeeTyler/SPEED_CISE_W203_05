export interface Article {
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi: string;
    publisher: string;
  }
  
  export const DefaultEmptyArticle: Article = {
    title: '',
    authors: '',
    journal: '',
    year: 0,
    doi: '',
    publisher: '',
  };