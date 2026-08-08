import { useState } from "react";

function JobCard({ job }) {
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const handleApply = async () => {
const token = localStorage.getItem("token");


if (!token) {
  setMessage("Please login as a candidate to apply.");
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
    setMessage(data.message || "Failed to apply for this job.");
    return;
  }

  setMessage(
    data.message || "Application submitted successfully!"
  );
} catch (error) {
  console.error("Apply job error:", error);
  setMessage("Unable to apply. Please try again.");
} finally {
  setLoading(false);
}


};

return ( <div className="job-card">


  <div className="job-card-header">

    <div className="company-logo">
      {job.company.charAt(0)}
    </div>

    <div>
      <h3>{job.title}</h3>
      <p className="company-name">{job.company}</p>
    </div>

  </div>

  <div className="job-details">

    <span>📍 {job.location}</span>

    <span>💼 {job.type}</span>

    <span>💰 {job.salary}</span>

    <span>🎓 {job.experience}</span>

  </div>

  <p className="job-description">
    {job.description}
  </p>

  <div className="job-card-bottom">

    <span className="job-date">
      {job.createdAt
        ? `Posted ${new Date(job.createdAt).toLocaleDateString()}`
        : ""}
    </span>

    <button
      className="apply-btn"
      type="button"
      onClick={handleApply}
      disabled={loading}
    >
      {loading ? "Applying..." : "Apply Now"}
    </button>

  </div>

  {message && (
    <p className="application-message">
      {message}
    </p>
  )}

</div>


);
}

export default JobCard;
