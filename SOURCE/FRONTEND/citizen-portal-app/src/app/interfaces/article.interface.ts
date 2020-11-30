import { TranslateItem } from './';
import { User } from './user.interface';

/**
 * An Article represents a informatical post of the municipality
 */
export interface Article {
  /** A generic (mongodb) id */
  _id?: string;

  /** Author is the who created the article */
  author?: User;

  /** Is article activated? */
  activated: boolean;

  /** Unique article key */
  key: string;

  /** Article title */
  title: TranslateItem;

  /** Description as markdown */
  description: TranslateItem;

  /** Thumbnail url */
  thumbnail: string;

  /** Article categories */
  categories: ArticleCategory[];
}

/** All available article categories */
export type ArticleCategory = 'corona' | 'kfz';
