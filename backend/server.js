import "dotenv/config";
import express from "express";
import prisma from "./lib/prisma.js";

const app = express();

const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to HireHub API",
  });
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();

    res.json(jobs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
});
app.post("/api/jobs", async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      recruiterId,
    } = req.body;

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        recruiterId: Number(recruiterId),
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create job",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HireHub backend running on http://localhost:${PORT}`);
});