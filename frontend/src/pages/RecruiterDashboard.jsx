import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecruiterDashboard() {
const [jobs, setJobs] = useState([]);
const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const token = localStorage.getItem("token");

const user = JSON.parse(
localStorage.getItem("user") || "null"
);

useEffect(() => {
const fetchDashboardData = async () => {
try {
if (!token || user?.role !== "recruiter") {
setError("Please login as a recruiter.");
setLoading(false);
return;
}


    // Fetch jobs
    const jobsResponse = await fetch(
      "http://localhost:5000/api/jobs"
    );

    if (!jobsResponse.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const jobsData = await jobsResponse.json();

    // Show only jobs posted by logged-in recruiter
    const myJobs = jobsData.filter(
      (job) => job.recruiterId === user.id
    );

    setJobs(myJobs);

    // Fetch recruiter applications
    const applicationsResponse = await fetch(
      "http://localhost:5000/api/recruiter/applications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!applicationsResponse.ok) {
      throw new Error("Failed to fetch applications");
    }

    const applicationsData =
      await applicationsResponse.json();

    setApplications(applicationsData);
  } catch (error) {
    console.error("Dashboard error:", error);
    setError("Unable to load recruiter dashboard.");
  } finally {
    setLoading(false);
  }
};

fetchDashboardData();


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

  setApplications((currentApplications) =>
    currentApplications.filter(
      (application) => application.jobId !== jobId
    )
  );

  alert("Job deleted successfully");
} catch (error) {
  console.error("Delete job error:", error);
  alert("Unable to delete job.");
}


};

const appliedCount = applications.filter(
(application) => application.status === "Applied"
).length;

const shortlistedCount = applications.filter(
(application) => application.status === "Shortlisted"
).length;

const interviewCount = applications.filter(
(application) => application.status === "Interview"
).length;

const selectedCount = applications.filter(
(application) => application.status === "Selected"
).length;

const rejectedCount = applications.filter(
(application) => application.status === "Rejected"
).length;

if (loading) {
return ( <div className="dashboard-loading">
Loading recruiter dashboard... </div>
);
}

return ( <div className="recruiter-dashboard">


  {/* Dashboard Header */}

  <div className="dashboard-header">

    <div>
      <p className="dashboard-label">
        RECRUITER PORTAL
      </p>

      <h1>
        Recruiter Dashboard
      </h1>

      <p className="dashboard-welcome">
        Welcome back,{" "}
        <strong>
          {user?.name || "Recruiter"}
        </strong>
      </p>
    </div>

    <Link to="/recruiter/jobs/new">
      <button className="register-btn">
        + Post New Job
      </button>
    </Link>

  </div>

  {/* Error */}

  {error && (
    <div className="dashboard-error">
      {error}
    </div>
  )}

  {!error && (
    <>

      {/* Statistics */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-icon">
            💼
          </div>

          <div>
            <h3>{jobs.length}</h3>
            <p>Jobs Posted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            📄
          </div>

          <div>
            <h3>{applications.length}</h3>
            <p>Total Applications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            ⭐
          </div>

          <div>
            <h3>{shortlistedCount}</h3>
            <p>Shortlisted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🎯
          </div>

          <div>
            <h3>{selectedCount}</h3>
            <p>Selected</p>
          </div>
        </div>

      </div>

      {/* Application Summary */}

      <div className="dashboard-summary">

        <div>
          <span>Applied</span>
          <strong>{appliedCount}</strong>
        </div>

        <div>
          <span>Interview</span>
          <strong>{interviewCount}</strong>
        </div>

        <div>
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
        </div>

        <Link to="/recruiter/applications">
          Manage Applications →
        </Link>

      </div>

      {/* My Jobs */}

      <div className="my-jobs-section">

        <div className="section-header">

          <div>
            <h2>My Jobs</h2>

            <p>
              Manage the jobs you have posted.
            </p>
          </div>

          <Link to="/recruiter/applications">
            View Applications
          </Link>

        </div>

        {jobs.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              💼
            </div>

            <h3>
              No jobs posted yet
            </h3>

            <p>
              Create your first job posting
              to start receiving applications.
            </p>

            <Link to="/recruiter/jobs/new">
              Post Your First Job
            </Link>

          </div>

        ) : (

          <div className="recruiter-jobs-list">

            {jobs.map((job) => (

              <div
                className="recruiter-job-card"
                key={job.id}
              >

                <div className="recruiter-job-info">

                  <div className="job-title-row">

                    <h3>
                      {job.title}
                    </h3>

                    <span className="job-type-badge">
                      {job.type}
                    </span>

                  </div>

                  <p className="recruiter-company">
                    {job.company}
                  </p>

                  <div className="job-details">

                    <span>
                      📍 {job.location}
                    </span>

                    <span>
                      💰 {job.salary}
                    </span>

                    <span>
                      🎓 {job.experience}
                    </span>

                  </div>

                </div>

                {/* Actions */}

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
