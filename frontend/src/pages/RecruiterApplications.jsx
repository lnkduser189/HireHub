import { useEffect, useState } from "react";

function RecruiterApplications() {
const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchApplications = async () => {
const token = localStorage.getItem("token");


if (!token) {
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
  console.error("Recruiter applications error:", error);
  setError(error.message);
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchApplications();
}, []);

const updateStatus = async (applicationId, status) => {
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
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update status"
    );
  }

  setApplications((currentApplications) =>
    currentApplications.map((application) =>
      application.id === applicationId
        ? {
            ...application,
            status: data.application.status,
          }
        : application
    )
  );
} catch (error) {
  console.error("Status update error:", error);
  alert(error.message);
}


};

if (loading) {
return <p>Loading applications...</p>;
}

if (error) {
return <p>{error}</p>;
}

return ( <div className="recruiter-applications-page"> <h1>Received Applications</h1>

```
  {applications.length === 0 ? (
    <p>No applications received yet.</p>
  ) : (
    <div className="applications-list">
      {applications.map((application) => (
        <div
          className="application-card"
          key={application.id}
        >
          <h2>{application.job.title}</h2>

          <p>
            <strong>Company:</strong>{" "}
            {application.job.company}
          </p>

          <p>
            <strong>Candidate:</strong>{" "}
            {application.candidate.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {application.candidate.email}
          </p>

          <p>
            <strong>Current Status:</strong>{" "}
            {application.status}
          </p>

          <label htmlFor={`status-${application.id}`}>
            Update Status
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
            <option value="Applied">Applied</option>
            <option value="Shortlisted">
              Shortlisted
            </option>
            <option value="Interview">
              Interview
            </option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      ))}
    </div>
  )}
</div>


);
}

export default RecruiterApplications;
