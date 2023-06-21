export interface message {
  title: string;
  body: string;
  from: string;
  to: string;
  threadId?: string;
}
export interface messageFromDb extends message {
  _id: string;
  read: boolean;
  date: Date;
}
