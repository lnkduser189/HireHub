function Home() {
  return (
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
  );
}

export default Home;