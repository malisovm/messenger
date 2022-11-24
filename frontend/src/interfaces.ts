export interface IMessage {
  recipient: string,
  sender: string,
  title: string,
  body: string,
  date: string,
  _id?: string
}