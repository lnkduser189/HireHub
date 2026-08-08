import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecruiterDashboard() {
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

useEffect(() => {
const fetchJobs = async () => {
try {
const response = await fetch(
"http://localhost:5000/api/jobs"
);


    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const data = await response.json();

    // Show only jobs posted by the logged-in recruiter
    const myJobs = data.filter(
      (job) => job.recruiterId === user?.id
    );

    setJobs(myJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    setError("Unable to load your jobs.");
  } finally {
    setLoading(false);
  }
};

if (token && user?.role === "recruiter") {
  fetchJobs();
} else {
  setError("Please login as a recruiter.");
  setLoading(false);
}


}, [token, user?.id, user?.role]);

const handleDelete = async (jobId) => {
const confirmed = window.confirm(
"Are you sure you want to delete this job?"
);


if (!confirmed) {
  return;
}

try {
  const response = await fetch(
    `http://localhost:5000/api/jobs/${jobId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    alert(data.message || "Failed to delete job");
    return;
  }

  setJobs((currentJobs) =>
    currentJobs.filter((job) => job.id !== jobId)
  );

  alert("Job deleted successfully");
} catch (error) {
  console.error("Delete job error:", error);
  alert("Unable to delete job.");
}


};

if (loading) {
return <p>Loading your jobs...</p>;
}

return ( <div className="recruiter-dashboard"> <div className="dashboard-header"> <div> <h1>Recruiter Dashboard</h1> <p>
Welcome, {user?.name || "Recruiter"} </p> </div>

```
    <Link to="/recruiter/jobs/new">
      <button className="register-btn">
        + Post New Job
      </button>
    </Link>
  </div>

  {error && <p>{error}</p>}

  {!error && (
    <>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{jobs.length}</h3>
          <p>Jobs Posted</p>
        </div>
      </div>

      <div className="my-jobs-section">
        <div className="section-header">
          <h2>My Jobs</h2>

          <Link to="/recruiter/applications">
            View Applications
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>You haven't posted any jobs yet.</p>

            <Link to="/recruiter/jobs/new">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="recruiter-jobs-list">
            {jobs.map((job) => (
              <div
                className="recruiter-job-card"
                key={job.id}
              >
                <div>
                  <h3>{job.title}</h3>

                  <p>{job.company}</p>

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
                </div>

                <div className="job-actions">
                  <Link
                    to={`/recruiter/jobs/edit/${job.id}`}
                  >
                    <button className="login-btn">
                      Edit
                    </button>
                  </Link>

                  <button
                    className="logout-btn"
                    onClick={() =>
                      handleDelete(job.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )}
</div>


);
}

export default RecruiterDashboard;
