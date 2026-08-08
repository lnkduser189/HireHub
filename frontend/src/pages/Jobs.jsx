import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";

function Jobs() {
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [keyword, setKeyword] = useState("");
const [location, setLocation] = useState("");
const [jobType, setJobType] = useState("all");

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

/*
Filter jobs based on:
1. Keyword
2. Location
3. Job Type
*/


const filteredJobs = jobs.filter((job) => {
const searchText = keyword.trim().toLowerCase();
const locationText = location.trim().toLowerCase();
const selectedType = jobType.trim().toLowerCase();


const jobTitle = (job.title || "").trim().toLowerCase();
const company = (job.company || "").trim().toLowerCase();
const description = (job.description || "").trim().toLowerCase();
const jobLocation = (job.location || "").trim().toLowerCase();
const type = (job.type || "").trim().toLowerCase();

const matchesKeyword =
  searchText === "" ||
  jobTitle.includes(searchText) ||
  company.includes(searchText) ||
  description.includes(searchText);

const matchesLocation =
  locationText === "" ||
  jobLocation.includes(locationText);

const matchesType =
  selectedType === "all" ||
  type === selectedType;

return matchesKeyword && matchesLocation && matchesType;


});

return (
<>
{/* Jobs Header */} <section className="jobs-header"> <h1>Find Your Next Job</h1>


    <p>
      Explore opportunities from companies hiring now.
    </p>

    <div className="jobs-search">
      <input
        type="text"
        placeholder="Search job title or keyword"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />

      <button type="button">
        Search
      </button>
    </div>
  </section>

  {/* Jobs Content */}
  <section className="jobs-container">

    {/* Sidebar */}
    <div className="jobs-sidebar">
      <h3>Filter Jobs</h3>

      {/* Job Type */}
      <label htmlFor="job-type">
        Job Type
      </label>

      <select
        id="job-type"
        value={jobType}
        onChange={(event) => setJobType(event.target.value)}
      >
        <option value="all">All Types</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
        <option value="Remote">Remote</option>
      </select>

      {/* Experience */}
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

      {/* Salary */}
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

    {/* Jobs List */}
    <div className="jobs-list">

      <div className="jobs-list-header">
        <h2>Latest Jobs</h2>

        <span>
          {filteredJobs.length} jobs found
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <p>Loading jobs...</p>
      )}

      {/* Error */}
      {!loading && error && (
        <p>{error}</p>
      )}

      {/* No Jobs */}
      {!loading &&
        !error &&
        filteredJobs.length === 0 && (
          <p>
            No jobs found matching your search.
          </p>
        )}

      {/* Job Cards */}
      {!loading &&
        !error &&
        filteredJobs.map((job) => (
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
