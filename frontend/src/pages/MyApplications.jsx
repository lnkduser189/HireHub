import { useEffect, useState } from "react";

function MyApplications() {
const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchApplications = async () => {
const token = localStorage.getItem("token");


  if (!token) {
    setError("Please login as a candidate to view your applications.");
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
      throw new Error(data.message || "Failed to fetch applications");
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

if (loading) {
return <p>Loading your applications...</p>;
}

if (error) {
return <p>{error}</p>;
}

return ( <div className="applications-page"> <h1>My Applications</h1>

```
  {applications.length === 0 ? (
    <p>You have not applied for any jobs yet.</p>
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
            <strong>Location:</strong>{" "}
            {application.job.location}
          </p>

          <p>
            <strong>Job Type:</strong>{" "}
            {application.job.type}
          </p>

          <p>
            <strong>Salary:</strong>{" "}
            {application.job.salary}
          </p>

          <p>
            <strong>Applied On:</strong>{" "}
            {new Date(
              application.appliedAt
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {application.status}
          </p>
        </div>
      ))}
    </div>
  )}
</div>


);
}

export default MyApplications;
