import React from 'react';
import PropTypes from 'prop-types';
import { workExperienceData } from './data';

function WorkItem({ item }) {
  const {
    image, href, date, title, tools,
  } = item;
  return (
    <div className="work-card">
      <div className="work-date">{date}</div>
      <div className="work-details">
        <h3 className="work-title">
          <a href={href} target="_blank" rel="noreferrer" className="work-title-link">
            {title}
            <span className="work-arrow"> ↗</span>
          </a>
        </h3>
        <div className="work-logo-wrapper">
          <img src={image} alt={title} className="work-logo" />
        </div>
        <ul className="work-tools">
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
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
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
      <a
        href="https://bedrock02.github.io/resume/"
        target="_blank"
        rel="noopener noreferrer"
        className="work-full-resume"
      >
        View Full Résumé ↗
      </a>
    </section>
  );
}

export default WorkExperience;
