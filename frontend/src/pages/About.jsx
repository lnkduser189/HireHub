function About() {
  return (
    <div className="about-page">

      <section className="about-hero">
        <p className="about-tag">ABOUT HIREHUB</p>

        <h1>
          Connecting talent with
          <span> opportunity.</span>
        </h1>

        <p className="about-intro">
          HireHub is a modern recruitment platform designed to
          connect talented candidates with companies looking for
          their next great hire.
        </p>
      </section>

      <section className="about-content">

        <div className="about-card">
          <h2>🎯 Our Mission</h2>

          <p>
            Our mission is to make the job search and recruitment
            process simpler, faster, and more transparent for
            candidates and recruiters.
          </p>
        </div>

        <div className="about-card">
          <h2>💼 For Candidates</h2>

          <p>
            Discover relevant opportunities, create your profile,
            apply for jobs, upload your resume, and track your
            applications from one place.
          </p>
        </div>

        <div className="about-card">
          <h2>🏢 For Recruiters</h2>

          <p>
            Companies can publish job openings, discover talented
            candidates, manage applications, and streamline their
            recruitment process.
          </p>
        </div>

      </section>

      <section className="about-stats">

        <div>
          <h2>10K+</h2>
          <p>Job Opportunities</p>
        </div>

        <div>
          <h2>500+</h2>
          <p>Companies</p>
        </div>

        <div>
          <h2>25K+</h2>
          <p>Job Seekers</p>
        </div>

        <div>
          <h2>5K+</h2>
          <p>Successful Hires</p>
        </div>

      </section>

    </div>
  );
}

export default About;