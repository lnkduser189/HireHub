import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditJob() {
const { id } = useParams();
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

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [message, setMessage] = useState("");

useEffect(() => {
const fetchJob = async () => {
try {
const response = await fetch(
`http://localhost:5000/api/jobs/${id}`
);


    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Job not found.");
      return;
    }

    setFormData({
      title: data.title || "",
      company: data.company || "",
      location: data.location || "",
      type: data.type || "Full-time",
      salary: data.salary || "",
      experience: data.experience || "Fresher",
      description: data.description || "",
    });
  } catch (error) {
    console.error("Fetch job error:", error);
    setMessage("Unable to load job.");
  } finally {
    setLoading(false);
  }
};

fetchJob();

}, [id]);

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
setSaving(true);

const token = localStorage.getItem("token");

if (!token) {
  setMessage("Please login as a recruiter.");
  setSaving(false);
  return;
}

try {
  const response = await fetch(
    `http://localhost:5000/api/jobs/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setMessage(data.message || "Failed to update job.");
    return;
  }

  setMessage("Job updated successfully!");

  setTimeout(() => {
    navigate("/recruiter/dashboard");
  }, 800);
} catch (error) {
  console.error("Update job error:", error);
  setMessage("Unable to connect to server.");
} finally {
  setSaving(false);
}


};

if (loading) {
return ( <div className="create-job-page"> <div className="create-job-card"> <p>Loading job...</p> </div> </div>
);
}

return ( <div className="create-job-page"> <div className="create-job-card"> <h1>Edit Job</h1>


    <p className="create-job-subtitle">
      Update the details of your job posting.
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
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  </div>
</div>


);
}

export default EditJob;
