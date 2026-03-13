import mongoose, { Schema, model, models } from "mongoose";

export interface IProject {
  title: string;
  imageLink: string;
  des: string;
  techStack: string;
  link: string;
  date: string;
}

const projectSchema = new Schema<IProject>({
  title: { type: String },
  imageLink: { type: String },
  des: { type: String },
  techStack: { type: String },
  link: { type: String },
  date: { type: String },
});

const Project = models.Project || model<IProject>("Project", projectSchema);

export default Project;
