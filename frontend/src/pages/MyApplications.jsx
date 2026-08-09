import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Please login as a candidate to view your applications."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/applications/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch applications"
          );
        }

        setApplications(data);
      } catch (error) {
        console.error("Applications error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Shortlisted":
        return "status-shortlisted";

      case "Interview":
        return "status-interview";

      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      default:
        return "status-applied";
    }
  };

  // Cancel application
  const handleCancelApplication = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    setCancellingId(applicationId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel application"
        );
      }

      // Remove cancelled application from the screen
      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.id !== applicationId
        )
      );
    } catch (error) {
      console.error("Cancel application error:", error);

      setError(
        error.message || "Unable to cancel application."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="my-applications-page">
        <p>Loading your applications...</p>
      </div>
    );
  }

  // Error
  if (error && applications.length === 0) {
    return (
      <div className="my-applications-page">
        <div className="application-error">
          <h2>Unable to load applications</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-page">

      {/* Header */}
      <div className="my-applications-header">
        <div>
          <p className="page-label">
            CANDIDATE PORTAL
          </p>

          <h1>My Applications</h1>

          <p>
            Track the jobs you have applied for and
            monitor your application status.
          </p>
        </div>

        <div className="application-count">
          <strong>
            {applications.length}
          </strong>

          <span>
            {applications.length === 1
              ? "Application"
              : "Applications"}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && applications.length > 0 && (
        <div className="application-error">
          ⚠️ {error}
        </div>
      )}

      {/* No Applications */}
      {applications.length === 0 ? (
        <div className="my-applications-empty">

          <div className="empty-icon">
            📄
          </div>

          <h2>
            No applications yet
          </h2>

          <p>
            You haven't applied for any jobs yet.
            Start exploring available opportunities.
          </p>

          <Link to="/jobs">
            Browse Jobs
          </Link>

        </div>
      ) : (

        <div className="my-applications-list">

          {applications.map((application) => (

            <div
              className="my-application-card"
              key={application.id}
            >

              {/* Card Header */}
              <div className="application-card-header">

                <div>

                  <p className="application-label">
                    JOB APPLICATION
                  </p>

                  <h2>
                    {application.job.title}
                  </h2>

                  <p className="application-company">
                    {application.job.company}
                  </p>

                </div>

                {/* Status */}
                <span
                  className={`application-status ${getStatusClass(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>

              </div>

              {/* Job Details */}
              <div className="application-details">

                <div className="application-detail">
                  <span>
                    Location
                  </span>

                  <strong>
                    📍 {application.job.location}
                  </strong>
                </div>

                <div className="application-detail">
                  <span>
                    Job Type
                  </span>

                  <strong>
                    💼 {application.job.type}
                  </strong>
                </div>

                <div className="application-detail">
                  <span>
                    Salary
                  </span>

                  <strong>
                    💰 {application.job.salary}
                  </strong>
                </div>

                <div className="application-detail">
                  <span>
                    Applied On
                  </span>

                  <strong>
                    {new Date(
                      application.appliedAt
                    ).toLocaleDateString()}
                  </strong>
                </div>

              </div>

              {/* Footer */}
              <div className="application-card-footer">

                <span>
                  Application ID: #{application.id}
                </span>

                <span className="status-indicator">
                  ● {application.status}
                </span>

              </div>

              {/* Actions */}
              <div className="application-actions">

                {/* View Job */}
                <Link
                  to={`/jobs/${application.job.id}`}
                  className="view-application-btn"
                >
                  View Job
                </Link>

                {/* Cancel Application */}
                {!["Selected", "Rejected"].includes(
                  application.status
                ) && (
                  <button
                    type="button"
                    className="cancel-application-btn"
                    onClick={() =>
                      handleCancelApplication(
                        application.id
                      )
                    }
                    disabled={
                      cancellingId === application.id
                    }
                  >
                    {cancellingId === application.id
                      ? "Cancelling..."
                      : "Cancel Application"}
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyApplications;