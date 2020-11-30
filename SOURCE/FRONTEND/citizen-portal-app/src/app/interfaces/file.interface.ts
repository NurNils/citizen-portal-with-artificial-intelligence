/**
 * A file represents an image, zip file etc.
 */
export interface File {
  /** A generic (mongodb) id */
  _id: string;

  /** File base64 content */
  base64?: string;

  /** Name of file */
  name: string;

  /** Size of file (Bytes) */
  size: number;

  /** Type of file */
  type: string;
}
