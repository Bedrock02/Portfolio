import React from 'react';
import PropTypes from 'prop-types';
import { workExperienceData } from './data';

function WorkItem({ item }) {
  const {
    image, href, company, date, title, description, tools,
  } = item;
  return (
    <div className="work-card">
      <div className="work-date">{date}</div>
      <div className="work-details">
        <div className="work-logo-wrapper">
          <img src={image} alt={`${company} logo`} className="work-logo" />
        </div>
        <h3 className="work-title">
          <a href={href} target="_blank" rel="noreferrer" className="work-title-link" aria-label={`${title} at ${company} (opens in new tab)`}>
            {title}
            <span className="work-arrow" aria-hidden="true"> ↗</span>
          </a>
        </h3>
        <p className="work-description">{description}</p>
        <ul className="work-tools" aria-label="Technologies used">
          {tools.map((tool) => (
            <li key={tool} className="work-pill">{tool}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

WorkItem.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tools: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
};

function WorkExperience() {
  return (
    <section id="work" className="portfolio-section">
      <h2 className="portfolio-section-title">Experience</h2>
      <div className="work-list">
        {workExperienceData.map((item) => (
          <WorkItem key={item.href} item={item} />
        ))}
      </div>
    </section>
  );
}

export default WorkExperience;
