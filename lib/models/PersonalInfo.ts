import mongoose, { Schema, model, models } from "mongoose";

export interface IPersonalInfo {
  personalInfo: string;
}

const personalInfoSchema = new Schema<IPersonalInfo>({
  personalInfo: { type: String },
});

const PersonalInfo = models.PersonalInfo || model<IPersonalInfo>("PersonalInfo", personalInfoSchema);

export default PersonalInfo;
