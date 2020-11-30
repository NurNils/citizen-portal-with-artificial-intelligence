/**
 * A Training represents a object for training the neural network
 */
export interface Training {
  /** A generic (mongodb) id */
  _id?: string;

  /** Search term */
  search: string;

  /** Category (output of neural network) */
  category: string;

  /** A generic (mongodb) id of the user who added the training */
  userId: string;
}
