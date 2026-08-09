import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecruiterApplications() {
const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchApplications = async () => {
const token = localStorage.getItem("token");
const user = JSON.parse(
localStorage.getItem("user") || "null"
);


if (!token || user?.role !== "recruiter") {
  setError("Please login as a recruiter.");
  setLoading(false);
  return;
}

try {
  const response = await fetch(
    "http://localhost:5000/api/recruiter/applications",
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
  console.error(
    "Recruiter applications error:",
    error
  );

  setError(error.message);
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchApplications();
}, []);

const updateStatus = async (
applicationId,
status
) => {
const token = localStorage.getItem("token");


try {
  const response = await fetch(
    `http://localhost:5000/api/recruiter/applications/${applicationId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update application status"
    );
  }

  setApplications(
    (currentApplications) =>
      currentApplications.map(
        (application) =>
          application.id === applicationId
            ? {
                ...application,
                status:
                  data.application?.status ||
                  status,
              }
            : application
      )
  );
} catch (error) {
  console.error(
    "Status update error:",
    error
  );

  alert(error.message);

  // Reload applications so the UI stays
  // synchronized with the database.
  fetchApplications();
}


};

const getStatusClass = (status) => {
switch (status) {
case "Applied":
return "status-applied";


  case "Shortlisted":
    return "status-shortlisted";

  case "Interview":
    return "status-interview";

  case "Selected":
    return "status-selected";

  case "Rejected":
    return "status-rejected";

  default:
    return "";
}

};

if (loading) {
return ( <div className="applications-page"> <div className="applications-loading">
Loading applications... </div> </div>
);
}

if (error) {
return ( <div className="applications-page"> <div className="applications-error"> <h2>Unable to load applications</h2>


      <p>{error}</p>

      <Link to="/recruiter/dashboard">
        Back to Dashboard
      </Link>
    </div>
  </div>
);


}

return ( <div className="applications-page">

  {/* Header */}

  <div className="applications-header">

    <div>
      <p className="dashboard-label">
        RECRUITER PORTAL
      </p>

      <h1>
        Received Applications
      </h1>

      <p>
        Review candidates who applied
        to your jobs.
      </p>
    </div>

    <Link to="/recruiter/dashboard">
      ← Back to Dashboard
    </Link>

  </div>

  {/* Application count */}

  <div className="applications-count">
    <strong>
      {applications.length}
    </strong>

    <span>
      {applications.length === 1
        ? "Application"
        : "Applications"}
    </span>
  </div>

  {/* Applications */}

  {applications.length === 0 ? (

    <div className="applications-empty">

      <div className="empty-icon">
        📄
      </div>

      <h2>
        No applications yet
      </h2>

      <p>
        Applications from candidates
        will appear here.
      </p>

      <Link to="/recruiter/dashboard">
        Back to Dashboard
      </Link>

    </div>

  ) : (

    <div className="applications-list">

      {applications.map(
        (application) => (

          <div
            className="application-card"
            key={application.id}
          >

            {/* Job */}

            <div className="application-job">

              <div>

                <p className="application-label">
                  JOB
                </p>

                <h2>
                  {application.job?.title ||
                    "Unknown Job"}
                </h2>

                <p className="application-company">
                  {application.job?.company ||
                    "Unknown Company"}
                </p>

              </div>

              <span
                className={`application-status ${getStatusClass(
                  application.status
                )}`}
              >
                {application.status}
              </span>

            </div>

            {/* Candidate */}

            <div className="candidate-info">

              <div className="candidate-avatar">
                {application.candidate?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "C"}
              </div>

              <div>

                <p className="application-label">
                  CANDIDATE
                </p>

                <h3>
                  {application.candidate
                    ?.name ||
                    "Unknown Candidate"}
                </h3>

                <p>
                  {application.candidate
                    ?.email ||
                    "No email available"}
                </p>

              </div>

            </div>

            {/* Application date */}

            <div className="application-meta">

              <span>
                Applied on{" "}
                {application.appliedAt
                  ? new Date(
                      application.appliedAt
                    ).toLocaleDateString()
                  : "Unknown date"}
              </span>

            </div>

            {/* Status update */}

            <div className="application-actions">

              <label
                htmlFor={`status-${application.id}`}
              >
                Update Application Status
              </label>

              <select
                id={`status-${application.id}`}
                value={application.status}
                onChange={(event) =>
                  updateStatus(
                    application.id,
                    event.target.value
                  )
                }
              >
                <option value="Applied">
                  Applied
                </option>

                <option value="Shortlisted">
                  Shortlisted
                </option>

                <option value="Interview">
                  Interview
                </option>

                <option value="Selected">
                  Selected
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>

            </div>

          </div>
        )
      )}

    </div>
  )}

</div>


);
}

export default RecruiterApplications;
