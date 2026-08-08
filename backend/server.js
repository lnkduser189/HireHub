import "dotenv/config";
import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";
import jwt from "jsonwebtoken";
import prisma from "./lib/prisma.js";

const app = express();
app.use(cors());
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
app.post(
  "/api/jobs",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const {
        title,
        company,
        location,
        type,
        salary,
        description,
      } = req.body;

      if (
        !title ||
        !company ||
        !location ||
        !type ||
        !salary ||
        !description
      ) {
        return res.status(400).json({
          message: "All job fields are required",
        });
      }

      const job = await prisma.job.create({
        data: {
          title,
          company,
          location,
          type,
          salary,
          description,
          recruiterId: req.user.userId,
        },
      });

      res.status(201).json(job);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create job",
      });
    }
  }
);
// UPDATE job
app.put(
  "/api/jobs/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
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

      const existingJob = await prisma.job.findUnique({
        where: {
          id,
        },
      });

      if (!existingJob) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      if (existingJob.recruiterId !== req.user.userId) {
        return res.status(403).json({
          message: "You can only update your own jobs",
        });
      }

      const job = await prisma.job.update({
        where: {
          id,
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
  }
);

// DELETE job
app.delete(
  "/api/jobs/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const existingJob = await prisma.job.findUnique({
        where: {
          id,
        },
      });

      if (!existingJob) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      if (existingJob.recruiterId !== req.user.userId) {
        return res.status(403).json({
          message: "You can only delete your own jobs",
        });
      }

      await prisma.job.delete({
        where: {
          id,
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
  }
);
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "candidate",
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});
app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});
app.get(
  "/api/recruiter/dashboard",
  authMiddleware,
  roleMiddleware("recruiter"),
  (req, res) => {
    res.json({
      message: "Welcome to recruiter dashboard",
      user: req.user,
    });
  }
);
app.post(
  "/api/jobs/:id/apply",
  authMiddleware,
  roleMiddleware("candidate"),
  async (req, res) => {
    try {
      const jobId = Number(req.params.id);

      const job = await prisma.job.findUnique({
        where: {
          id: jobId,
        },
      });

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      const existingApplication = await prisma.application.findUnique({
        where: {
          candidateId_jobId: {
            candidateId: req.user.userId,
            jobId: jobId,
          },
        },
      });

      if (existingApplication) {
        return res.status(409).json({
          message: "You have already applied for this job",
        });
      }

      const application = await prisma.application.create({
        data: {
          candidateId: req.user.userId,
          jobId: jobId,
        },
      });

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to submit application",
      });
    }
  }
);
app.get(
  "/api/applications/my",
  authMiddleware,
  roleMiddleware("candidate"),
  async (req, res) => {
    try {
      const applications = await prisma.application.findMany({
        where: {
          candidateId: req.user.userId,
        },
        include: {
          job: true,
        },
        orderBy: {
          appliedAt: "desc",
        },
      });

      res.json(applications);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch applications",
      });
    }
  }
);
app.get(
  "/api/recruiter/applications",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const applications = await prisma.application.findMany({
        where: {
          job: {
            recruiterId: req.user.userId,
          },
        },
        include: {
          candidate: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              company: true,
            },
          },
        },
        orderBy: {
          appliedAt: "desc",
        },
      });

      res.json(applications);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch applications",
      });
    }
  }
);
app.put(
  "/api/recruiter/applications/:id/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const applicationId = Number(req.params.id);
      const { status } = req.body;

      const allowedStatuses = [
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid application status",
        });
      }

      const application = await prisma.application.findUnique({
        where: {
          id: applicationId,
        },
        include: {
          job: true,
        },
      });

      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      if (application.job.recruiterId !== req.user.userId) {
        return res.status(403).json({
          message: "You can only update applications for your own jobs",
        });
      }

      const updatedApplication = await prisma.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status,
        },
      });

      res.json({
        message: "Application status updated successfully",
        application: updatedApplication,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update application status",
      });
    }
  }
);
app.listen(PORT, () => {
  console.log(`HireHub backend running on http://localhost:${PORT}`);
});