import React from 'react';
import PropTypes from 'prop-types';
import VideoLooper from 'react-video-looper';
import { hobbyData } from './data';

function HobbyDescription({ header, description }) {
  return (
    <div className="hobby-blurb">
      <h3>{header}</h3>
      <p>{description}</p>
    </div>
  );
}

HobbyDescription.propTypes = {
  header: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
};

function Hobbies() {
  return (
    <section id="life" className="portfolio-section">
      <h2 className="portfolio-section-title">Life Outside Of Work</h2>
      <div className="hobbies-grid">
        {hobbyData.map(({ video, header, description }) => {
          const { source, start, end } = video;
          return (
            <React.Fragment key={header}>
              <div className="hobby-video-wrapper">
                <VideoLooper source={source} start={start} end={end} autoplay height="300px" />
              </div>
              <HobbyDescription header={header} description={description} />
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

export default Hobbies;
