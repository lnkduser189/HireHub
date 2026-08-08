import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-tag">🚀 Find your dream career</p>

            <h1>
              Find the right job.
              <br />
              Build your <span>future.</span>
            </h1>

            <p className="hero-description">
              Discover thousands of opportunities from top companies
              and take the next step in your career.
            </p>

            <div className="search-box">
              <input
                type="text"
                placeholder="Job title, skills or keywords"
              />

              <input
                type="text"
                placeholder="Location"
              />

              <button>Search Jobs</button>
            </div>

            <p className="popular">
              Popular: React Developer · Java Developer · Data Analyst
            </p>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <h3>🔎 Find Jobs</h3>
            <p>
              Search and filter thousands of job opportunities.
            </p>
          </div>

          <div className="feature">
            <h3>🏢 Top Companies</h3>
            <p>
              Discover opportunities from leading companies.
            </p>
          </div>

          <div className="feature">
            <h3>📄 Easy Applications</h3>
            <p>
              Apply for jobs and track your applications easily.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;