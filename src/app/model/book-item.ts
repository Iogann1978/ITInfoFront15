import { Author } from "./author";
import { Info } from "./info";

export interface BookItem extends Info {
  isbn: string;
  pages: number;
  authors: Author[];
}
