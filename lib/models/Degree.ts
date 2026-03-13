import mongoose, { Schema, model, models } from "mongoose";

export interface IDegree {
  DegreeName: string;
  DegreeInstitude: string;
  DegreePercentage: string;
  DegreeYear: string;
}

const degreeSchema = new Schema<IDegree>({
  DegreeName: { type: String },
  DegreeInstitude: { type: String },
  DegreePercentage: { type: String },
  DegreeYear: { type: String },
});

const Degree = models.Degree || model<IDegree>("Degree", degreeSchema);

export default Degree;
