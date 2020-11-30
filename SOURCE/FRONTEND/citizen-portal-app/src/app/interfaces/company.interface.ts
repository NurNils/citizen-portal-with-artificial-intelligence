import { TranslateItem } from './';

/**
 * A company represents a business, natural person or a personal company
 */
export interface Company {
  /** A generic (mongodb) id */
  _id?: string;

  /** A generic (mongodb) id of the user who created the company */
  userId: string;

  /** Is business activated? */
  activated: boolean;

  /** Unique business key */
  key: string;

  /** Displayed name for business (e.q.: Example Inc.) */
  displayname: string;

  /** Description as markdown */
  description: TranslateItem;

  /** Address of the company */
  address: {
    street: string;
    postcode: string;
    city: string;
    location: {
      lat: number;
      lng: number;
    };
  };
}
