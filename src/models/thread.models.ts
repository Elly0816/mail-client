export interface threadFromDb {
  _id: string;
  createdAt: Date;
  lastModified: Date;
  messages: [string];
  lastMessage: string;
  lastTitle: string;
}
