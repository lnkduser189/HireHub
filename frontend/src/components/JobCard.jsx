import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function JobCard({ job }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Check whether this candidate has already applied
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

        const existingApplication = applications.some(
          (application) => application.jobId === job.id
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
  }, [job.id, token, user?.role]);

  const handleApply = async () => {
    if (!token) {
      setMessage("Please login as a candidate to apply.");
      return;
    }

    if (!user || user.role !== "candidate") {
      setMessage("Only candidates can apply for jobs.");
      return;
    }

    if (alreadyApplied) {
      setMessage("You have already applied for this job.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${job.id}/apply`,
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

        // If backend says duplicate application
        if (
          data.message?.toLowerCase().includes("already")
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
      setLoading(false);
    }
  };

  return (
    <div className="job-card">

      <div className="job-card-top">

        <div className="company-logo">
          {job.company?.charAt(0)?.toUpperCase()}
        </div>

        <div className="job-title-section">
          <h3>{job.title}</h3>

          <p className="company-name">
            {job.company}
          </p>
        </div>

      </div>

      <div className="job-details">

        <span>
          📍 {job.location}
        </span>

        <span>
          💼 {job.type}
        </span>

        <span>
          💰 {job.salary}
        </span>

        <span>
          🎓 {job.experience}
        </span>

      </div>

      <div className="job-card-footer">

        <span className="job-date">
          {job.createdAt
            ? `Posted ${new Date(
                job.createdAt
              ).toLocaleDateString()}`
            : ""}
        </span>

        <div className="job-card-actions">

          <Link
            to={`/jobs/${job.id}`}
            className="view-details-btn"
          >
            View Details
          </Link>

          <button
            className={
              alreadyApplied
                ? "apply-btn applied-btn"
                : "apply-btn"
            }
            type="button"
            onClick={handleApply}
            disabled={
              loading ||
              alreadyApplied ||
              user?.role === "recruiter"
            }
          >
            {loading
              ? "Applying..."
              : alreadyApplied
              ? "✓ Applied"
              : "Apply Now"}
          </button>

        </div>

      </div>

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

    </div>
  );
}

export default JobCard;
