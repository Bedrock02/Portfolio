import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import VideoLooper from 'react-video-looper';
import { blurb } from './hobbies.module.css';
import { hobbyData } from './data';

function HobbyDescription({ header, description }) {
  return (
    <div className={blurb}>
      <h1>{header}</h1>
      <p>{description}</p>
    </div>
  );
}

HobbyDescription.propTypes = {
  header: PropTypes.string,
  description: PropTypes.string,
};

HobbyDescription.defaultProps = {
  header: 'Header',
  description: 'Description',
};

function Hobbies() {
  return (
    <>
      <Grid.Row id="life" centered verticalAlign="middle">
        <Grid.Column textAlign="center" width={16} style={{ padding: '100px 0' }}>
          <h1>Life Outside Of Work</h1>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row columns={2}>
        {hobbyData.map(({ video, header, description }) => {
          const { source, start, end } = video;
          return (
            <>
              <Grid.Column>
                <VideoLooper source={source} start={start} end={end} autoplay height="50vh" />
              </Grid.Column>
              <Grid.Column verticalAlign="middle" textAlign="center">
                <HobbyDescription header={header} description={description} />
              </Grid.Column>
            </>
          );
        })}
      </Grid.Row>
    </>
  );
}

export default Hobbies;
