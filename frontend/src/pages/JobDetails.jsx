import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Job not found"
          );
        }

        setJob(data);
      } catch (error) {
        console.error("Job details error:", error);
        setMessage(
          error.message || "Unable to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkApplication = async () => {
      if (!token || user?.role !== "candidate") {
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const applications = await response.json();

        const existingApplication =
          applications.some(
            (application) =>
              application.jobId === Number(id)
          );

        setAlreadyApplied(existingApplication);
      } catch (error) {
        console.error(
          "Check application error:",
          error
        );
      }
    };

    checkApplication();
  }, [id, token, user?.role]);

  const handleApply = async () => {
    if (!token) {
      setMessage(
        "Please login as a candidate to apply."
      );
      return;
    }

    if (!user || user.role !== "candidate") {
      setMessage(
        "Only candidates can apply for jobs."
      );
      return;
    }

    if (alreadyApplied) {
      setMessage(
        "You have already applied for this job."
      );
      return;
    }

    setApplying(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${id}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to apply for this job."
        );

        if (
          data.message
            ?.toLowerCase()
            .includes("already")
        ) {
          setAlreadyApplied(true);
        }

        return;
      }

      setAlreadyApplied(true);

      setMessage(
        data.message ||
          "Application submitted successfully!"
      );
    } catch (error) {
      console.error(
        "Apply job error:",
        error
      );

      setMessage(
        "Unable to apply. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-card">
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-error">
          <h2>Job Not Found</h2>

          <p>
            {message || "This job could not be found."}
          </p>

          <Link to="/jobs">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">

      <Link
        to="/jobs"
        className="back-to-jobs"
      >
        ← Back to Jobs
      </Link>

      <div className="job-details-card">

        <div className="job-details-header">

          <div className="company-logo large-logo">
            {job.company
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div>
            <h1>{job.title}</h1>

            <p className="details-company">
              {job.company}
            </p>
          </div>

        </div>

        <div className="job-details-info">

          <div>
            <span>📍</span>
            <strong>Location</strong>
            <p>{job.location}</p>
          </div>

          <div>
            <span>💼</span>
            <strong>Job Type</strong>
            <p>{job.type}</p>
          </div>

          <div>
            <span>💰</span>
            <strong>Salary</strong>
            <p>{job.salary}</p>
          </div>

          <div>
            <span>🎓</span>
            <strong>Experience</strong>
            <p>{job.experience}</p>
          </div>

        </div>

        <div className="job-description-section">

          <h2>Job Description</h2>

          <p>
            {job.description ||
              "No description provided."}
          </p>

        </div>

        {job.createdAt && (
          <p className="job-posted-date">
            Posted on{" "}
            {new Date(
              job.createdAt
            ).toLocaleDateString()}
          </p>
        )}

        {message && (
          <p
            className={
              alreadyApplied
                ? "application-success"
                : "application-message"
            }
          >
            {message}
          </p>
        )}

        <div className="job-details-actions">

          <Link
            to="/jobs"
            className="back-button"
          >
            Back to Jobs
          </Link>

          <button
            type="button"
            className={
              alreadyApplied
                ? "details-apply-button applied-details-btn"
                : "details-apply-button"
            }
            onClick={handleApply}
            disabled={
              applying ||
              alreadyApplied ||
              user?.role === "recruiter"
            }
          >
            {applying
              ? "Applying..."
              : alreadyApplied
              ? "✓ Applied"
              : "Apply Now"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default JobDetails;
