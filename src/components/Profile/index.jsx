import React from 'react';

function Profile() {
  return (
    <div className="profile-hero">
      <h1 className="profile-name">Steven Jimenez</h1>
      <h2 className="profile-title">Senior Software Engineer</h2>
      <div className="open-to-work" aria-label="Currently open to new opportunities">
        <span className="open-dot" aria-hidden="true" />
        <span>Open to new opportunities</span>
      </div>
      <p className="profile-tagline">
        I build product experiences that scale.
        <br /><br />
        Senior full-stack engineer with 10+ years of experience shipping frontend-heavy systems,
        experimentation platforms, and performance-critical user journeys.
      </p>
      <a
        className="profile-resume-link"
        href="https://bedrock02.github.io/resume/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View full résumé (opens in new tab)"
      >
        View Full Résumé <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

export default Profile;
