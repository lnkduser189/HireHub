import "dotenv/config";
import express from "express";
import prisma from "./lib/prisma.js";

const app = express();

const PORT = 5000;

app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to HireHub API",
  });
});

// GET all jobs
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

// GET one job
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const job = await prisma.job.findUnique({
      where: {
        id: id,
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch job",
    });
  }
});

// CREATE job
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

// UPDATE job
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      title,
      company,
      location,
      type,
      salary,
      description,
    } = req.body;

    const job = await prisma.job.update({
      where: {
        id: id,
      },
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
      },
    });

    res.json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update job",
    });
  }
});

// DELETE job
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.job.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete job",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HireHub backend running on http://localhost:${PORT}`);
});