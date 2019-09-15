import {User} from "./user";

export interface Message {
  from: User,
  to: User,
  message: any,
  isFile?: boolean,
  fileUrl?: string,
  date: string
}
