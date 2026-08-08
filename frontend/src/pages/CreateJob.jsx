import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateJob() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
title: "",
company: "",
location: "",
type: "Full-time",
salary: "",
experience: "Fresher",
description: "",
});

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

const handleChange = (event) => {
const { name, value } = event.target;

setFormData((current) => ({
  ...current,
  [name]: value,
}));


};

const handleSubmit = async (event) => {
event.preventDefault();


setMessage("");
setLoading(true);

const token = localStorage.getItem("token");

if (!token) {
  setMessage("Please login as a recruiter.");
  setLoading(false);
  return;
}

try {
  const response = await fetch(
    "http://localhost:5000/api/jobs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setMessage(data.message || "Failed to create job.");
    return;
  }

  setMessage("Job posted successfully!");

  setTimeout(() => {
    navigate("/recruiter/dashboard");
  }, 800);
} catch (error) {
  console.error("Create job error:", error);
  setMessage("Unable to connect to server.");
} finally {
  setLoading(false);
}


};

return ( <div className="create-job-page"> <div className="create-job-card"> <h1>Post a New Job</h1>


    <p className="create-job-subtitle">
      Add a new opportunity for candidates on HireHub.
    </p>

    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">
            Job Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Frontend Developer"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">
            Company
          </label>

          <input
            id="company"
            name="company"
            type="text"
            placeholder="e.g. TechNova"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location">
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Pune"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">
            Job Type
          </label>

          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Full-time">
              Full-time
            </option>

            <option value="Part-time">
              Part-time
            </option>

            <option value="Internship">
              Internship
            </option>

            <option value="Remote">
              Remote
            </option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salary">
            Salary
          </label>

          <input
            id="salary"
            name="salary"
            type="text"
            placeholder="e.g. ₹6-8 LPA"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">
            Experience
          </label>

          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          >
            <option value="Fresher">
              Fresher
            </option>

            <option value="1-3">
              1-3 Years
            </option>

            <option value="3-5">
              3-5 Years
            </option>

            <option value="5+">
              5+ Years
            </option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Job Description
        </label>

        <textarea
          id="description"
          name="description"
          rows="6"
          placeholder="Describe the job responsibilities, skills and requirements..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}

      <div className="create-job-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={() =>
            navigate("/recruiter/dashboard")
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          className="register-btn"
          disabled={loading}
        >
          {loading
            ? "Posting..."
            : "Post Job"}
        </button>
      </div>
    </form>
  </div>
</div>


);
}

export default CreateJob;
