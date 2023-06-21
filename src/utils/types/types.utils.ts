export interface message {
  title: string;
  body: string;
  from: string;
  to: string;
  threadId: string;
}

export interface user {
  email: string;
  password: string;
  //   messages: string [];
}
