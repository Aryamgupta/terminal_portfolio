import mongoose, { Schema, model, models } from "mongoose";

export interface ILink {
  link: string;
  linkName: string;
}

const linkSchema = new Schema<ILink>({
  link: { type: String },
  linkName: { type: String },
});

const Link = models.Link || model<ILink>("Link", linkSchema);

export default Link;
