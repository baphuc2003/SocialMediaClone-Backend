export interface IReceivedMessage {
  content: string;
  senderId: string;
  receiverId: string;
  created_at: Date;
}
