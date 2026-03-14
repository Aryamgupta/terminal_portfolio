const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const envPath = "/var/www/html/aryam-portfolio/.env.local";
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const MONGODB_URI = process.env.DATABASE_LINK;

if (!MONGODB_URI) {
  console.error("DATABASE_LINK not found in .env.local");
  process.exit(1);
}

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String },
  link: { type: String },
  givenBy: { type: String },
});

const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);

async function seedCertificates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    console.log("Cleaning up existing certificates...");
    await Certificate.deleteMany({});

    console.log("Seeding new certificates...");
    await Certificate.create([
      {
        name: "Full Stack Web Development",
        givenBy: "Coursera / Meta",
        link: "https://coursera.org/verify/example1",
        img: "https://via.placeholder.com/150",
      },
      {
        name: "Advanced React Patterns",
        givenBy: "Frontend Masters",
        link: "https://frontendmasters.com/certificates/example2",
        img: "https://via.placeholder.com/150",
      },
      {
        name: "Mobile App Development",
        givenBy: "Google",
        link: "https://example.com/verify/mobile",
        img: "https://via.placeholder.com/150",
      },
    ]);
    console.log("Seeded certificates successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding certificates:", err);
    process.exit(1);
  }
}

seedCertificates();
