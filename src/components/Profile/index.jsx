import React from 'react';

function Profile() {
  return (
    <div className="profile-hero">
      <h1 className="profile-name">Steven Jimenez</h1>
      <h2 className="profile-title">Senior Software Engineer</h2>
      <p className="profile-tagline">
        {`I turn cafecito ☕ into code and problems into solutions.`}
      </p>
      <a
        className="profile-resume-link"
        href="https://bedrock02.github.io/resume/"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Full Résumé ↗
      </a>
    </div>
  );
}

export default Profile;
