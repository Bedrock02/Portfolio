import React from 'react';

const skillGroups = [
  {
    category: 'Frontend',
    // TypeScript + React daily at Peloton/lululemon; JS foundational; HTML/CSS throughout; RN at D&T
    skills: ['TypeScript', 'React', 'JavaScript', 'HTML / CSS', 'React Native'],
  },
  {
    category: 'Frameworks',
    // Next.js at Peloton, lululemon, Nomad; Gatsby this site; Flask at Nomad/SurveyMonkey
    skills: ['Next.js', 'Gatsby', 'Flask'],
  },
  {
    category: 'Backend',
    // Go shipped at Peloton (History Summary); Python at Nomad + SurveyMonkey; REST throughout
    skills: ['Go', 'Python', 'REST APIs', 'Node.js'],
  },
  {
    category: 'AI Tools',
    // Active daily use — listed first within group by recency of adoption
    skills: ['Claude', 'Cursor', 'GitHub Copilot', 'ChatGPT', 'OpenAI API'],
  },
  {
    category: 'Experimentation & Observability',
    // Optimizely owned at Peloton; Split.io at Even; Datadog + k6 at Peloton; Sentry/Rollbar throughout
    skills: ['Optimizely', 'Datadog', 'k6', 'Split.io', 'Sentry', 'Rollbar'],
  },
  {
    category: 'Cloud & Infrastructure',
    // Lambda + SQS + S3 + DynamoDB all used at Peloton; CI tools at lululemon + Even
    skills: ['AWS Lambda', 'SQS', 'S3', 'DynamoDB', 'CircleCI', 'GitLab CI'],
  },
  {
    category: 'CMS & Commerce',
    // Contentful + CommerceTools at Peloton; Shopify at lululemon
    skills: ['Contentful', 'CommerceTools', 'Shopify'],
  },
  {
    category: 'Testing',
    // Jest most recent; Cucumber at Even; Pytest at Nomad; Selenium + Appium at D&T
    skills: ['Jest', 'Cucumber', 'Pytest', 'Selenium', 'Appium'],
  },
  {
    category: 'Product & Collaboration',
    skills: ['Figma', 'Jira', 'Confluence', 'Git'],
  },
];

function Skills() {
  return (
    <section id="skills" className="portfolio-section">
      <h2 className="portfolio-section-title">Skills</h2>
      <div className="skills-grid">
        {skillGroups.map(({ category, skills }) => (
          <div key={category} className="skills-group">
            <h3 className="skills-category">{category}</h3>
            <ul className="skills-list">
              {skills.map((skill) => (
                <li key={skill} className="skill-pill">{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
