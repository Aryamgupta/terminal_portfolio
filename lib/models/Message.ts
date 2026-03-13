import mongoose, { Schema, model, models } from "mongoose";

export interface IMessage {
  senderName: string;
  senderEmail: string;
  message: string;
  time: Date;
}

const messageSchema = new Schema<IMessage>({
  senderName: { type: String },
  senderEmail: { type: String },
  message: { type: String },
  time: { type: Date, default: Date.now },
});

const Message = models.Message || model<IMessage>("Message", messageSchema);

export default Message;
