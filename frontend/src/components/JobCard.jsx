function JobCard({ job }) {
  return (
    <div className="job-card">
      <div className="job-card-top">
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
      </div>

      <div className="job-card-bottom">
        <span className="job-date">
          Posted {job.posted}
        </span>

        <button className="apply-btn">
          View Job
        </button>
      </div>
    </div>
  );
}

export default JobCard;