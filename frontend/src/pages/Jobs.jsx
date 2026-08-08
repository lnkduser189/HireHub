import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        return response.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setError("Unable to load jobs. Please try again.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="jobs-header">
        <h1>Find Your Next Job</h1>

        <p>
          Explore opportunities from companies hiring now.
        </p>

        <div className="jobs-search">
          <input
            type="text"
            placeholder="Search job title or keyword"
          />

          <input
            type="text"
            placeholder="Location"
          />

          <button type="button">
            Search
          </button>
        </div>
      </section>

      <section className="jobs-container">
        <div className="jobs-sidebar">
          <h3>Filter Jobs</h3>

          <label htmlFor="job-type">
            Job Type
          </label>

          <select id="job-type">
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>

          <label htmlFor="experience">
            Experience
          </label>

          <select id="experience">
            <option value="all">Any Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
            <option value="5+">5+ Years</option>
          </select>

          <label htmlFor="salary">
            Salary
          </label>

          <select id="salary">
            <option value="all">Any Salary</option>
            <option value="3-5">₹3-5 LPA</option>
            <option value="5-10">₹5-10 LPA</option>
            <option value="10+">₹10+ LPA</option>
          </select>
        </div>

        <div className="jobs-list">
          <div className="jobs-list-header">
            <h2>Latest Jobs</h2>

            <span>{jobs.length} jobs found</span>
          </div>

          {loading && (
            <p>Loading jobs...</p>
          )}

          {!loading && error && (
            <p>{error}</p>
          )}

          {!loading && !error && jobs.length === 0 && (
            <p>No jobs available.</p>
          )}

          {!loading &&
            !error &&
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
        </div>
      </section>
    </>
  );
}

export default Jobs;