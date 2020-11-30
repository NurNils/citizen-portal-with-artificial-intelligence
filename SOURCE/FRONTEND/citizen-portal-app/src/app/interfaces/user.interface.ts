/**
 * A User represents a citizen with any entered information
 */
export interface User {
  /** A generic (mongodb) id */
  _id?: string;

  /** Username (e.q.: Nils) */
  username: string;

  /** E-Mail (e.q.: mail@example.com) */
  email: string;

  /** Rank */
  rank: UserRank;
}

export enum UserRank {
  user = 'user',
  admin = 'admin',
}
