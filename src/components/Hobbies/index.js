import React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import VideoLooper from 'react-video-looper';
import cyclingVideo from '../../assets/videos/cycling.mp4'
import timessquare from '../../assets/videos/timessquare.mp4'
import botanical from '../../assets/videos/botanical-garden.mp4'
import lucky from '../../assets/videos/lucky-trail.mp4'

const Hobbies = () => (
  <>
      <Grid.Row centered verticalAlign='middle'>
        <Grid.Column textAlign="center" width={16} style={{ padding: "100px 0" }}>
          <h1>Life Outside Of Work</h1>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row columns={2}>
        <Grid.Column>
            <VideoLooper source={cyclingVideo} start={0.00} end={5.00} autoplay height="50vh"/>
        </Grid.Column>
        <Grid.Column>
            <VideoLooper source={botanical} start={0.00} end={10.00} autoplay height="50vh"/>
        </Grid.Column>
        <Grid.Column>
            <VideoLooper source={timessquare} start={2.00} end={15.00} autoplay height="50vh"/>
        </Grid.Column>
        <Grid.Column>
            <VideoLooper source={lucky} start={4.00} end={7.00} autoplay height="50vh"/>
        </Grid.Column>
      </Grid.Row>
    </>
)

export default Hobbies;