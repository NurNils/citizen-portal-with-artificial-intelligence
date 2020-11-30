import { TranslateItem } from './';

/**
 * A service represents a service from a citizen
 */
export interface Service {
  /** A generic (mongodb) id */
  _id?: string;

  /** Is business activated? */
  activated: boolean;

  /** Unique business key */
  key: string;

  /** Displayed name for business (e.q.: Example Inc.) */
  displayname: string;

  /** Description as markdown */
  description: TranslateItem;
}
