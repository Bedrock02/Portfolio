import React from 'react';
import { Grid, Card } from 'semantic-ui-react';
import VideoLooper from 'react-video-looper';
import cyclingVideo from '../../assets/videos/cycling.mp4'
import timessquare from '../../assets/videos/timessquare.mp4'
import botanical from '../../assets/videos/botanical-garden.mp4'
import lucky from '../../assets/videos/lucky-winter.mp4'
import { blurb, videos } from './hobbies.module.css'

const cyclingDescription = 'I got into cycling at 22 years old when I joined my dad’s Saturday ride as a way to spend more time with him. Little did I know that cycling would become my way of life, and not just a Saturday hobby.'
const nature = `Nature brings me a sense of peace and tranquility that I can't find anywhere else. Its beauty and diversity are a constant source of inspiration and awe for me.`
const diversity = `Exploring the world allows me to experience new cultures, landscapes, and ways of life that broaden my perspective and understanding of the world. It is through these adventures and discoveries that I am able to learn and grow as a person.`
const dog = 'I just love my dog Lucky'

const HobbyDescription = ({ header, description }) => (
  <div className={blurb}>
    <h1>{header}</h1>
    <p>{description}</p>
  </div>
)

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
        <Grid.Column verticalAlign='middle' textAlign='center'>
          <HobbyDescription header={'Cycling'} description={cyclingDescription} />
        </Grid.Column>
        
        
        <Grid.Column>
            <VideoLooper source={botanical} start={0.00} end={10.00} autoplay height="50vh"/>
        </Grid.Column>
        <Grid.Column verticalAlign='middle' textAlign='center'>
          <HobbyDescription header={'Nature'} description={nature} />
        </Grid.Column>
        
        
        <Grid.Column>
            <VideoLooper source={timessquare} start={2.00} end={15.00} autoplay height="50vh"/>
        </Grid.Column>
        <Grid.Column verticalAlign='middle' textAlign='center'>
          <HobbyDescription header={'Diversity'} description={diversity} />
        </Grid.Column>


        <Grid.Column>
            <VideoLooper source={lucky} start={4.00} end={7.00} autoplay height="50vh"/>
        </Grid.Column>
        <Grid.Column verticalAlign='middle' textAlign='center'>
          <HobbyDescription header={'Lucky'} description={dog} />
        </Grid.Column>
      </Grid.Row>
    </>
)

export default Hobbies;