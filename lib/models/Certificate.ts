import mongoose, { Schema, model, models } from "mongoose";

export interface ICertificate {
  img: string;
  link: string;
  givenBy: string;
}

const certificateSchema = new Schema<ICertificate>({
  img: { type: String },
  link: { type: String },
  givenBy: { type: String },
});

const Certificate = models.Certificate || model<ICertificate>("Certificate", certificateSchema);

export default Certificate;
