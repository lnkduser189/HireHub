import JobCard from "../components/JobCard";

function Jobs() {
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechNova",
      location: "Pune, India",
      type: "Full Time",
      salary: "₹6 - ₹10 LPA",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "CodeCraft",
      location: "Bangalore, India",
      type: "Full Time",
      salary: "₹8 - ₹14 LPA",
      posted: "3 days ago",
    },
    {
      id: 3,
      title: "React Developer",
      company: "InnovateLabs",
      location: "Mumbai, India",
      type: "Full Time",
      salary: "₹7 - ₹12 LPA",
      posted: "5 days ago",
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "DataWorks",
      location: "Hyderabad, India",
      type: "Full Time",
      salary: "₹5 - ₹9 LPA",
      posted: "1 week ago",
    },
    {
      id: 5,
      title: "Java Developer",
      company: "EnterpriseSoft",
      location: "Chennai, India",
      type: "Full Time",
      salary: "₹7 - ₹11 LPA",
      posted: "1 week ago",
    },
    {
      id: 6,
      title: "Software Engineer",
      company: "CloudTech",
      location: "Remote",
      type: "Full Time",
      salary: "₹10 - ₹16 LPA",
      posted: "2 weeks ago",
    },
  ];

  return (
    <div className="jobs-page">

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

          <button>
            Search
          </button>
        </div>
      </section>

      <section className="jobs-container">

        <div className="jobs-sidebar">

          <h3>Filter Jobs</h3>

          <label>
            Job Type
          </label>

          <select>
            <option>All Types</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>

          <label>
            Experience
          </label>

          <select>
            <option>Any Experience</option>
            <option>Fresher</option>
            <option>1-3 Years</option>
            <option>3-5 Years</option>
            <option>5+ Years</option>
          </select>

          <label>
            Salary
          </label>

          <select>
            <option>Any Salary</option>
            <option>₹3-5 LPA</option>
            <option>₹5-10 LPA</option>
            <option>₹10+ LPA</option>
          </select>

        </div>

        <div className="jobs-list">

          <div className="jobs-list-header">
            <h2>Latest Jobs</h2>

            <span>
              {jobs.length} jobs found
            </span>
          </div>

          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}

        </div>

      </section>

    </div>
  );
}

export default Jobs;