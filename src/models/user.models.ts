export interface user {
  email: string;
  password: string;
  //   messages: string [];
}
export interface userFromDb extends user {
  _id: string;
  threads: Array<string>;
}
