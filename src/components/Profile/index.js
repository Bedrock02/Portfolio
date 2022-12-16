import React from 'react';
import { fadeIn, fullName } from './profile.module.css';
import profilePicture from '../../assets/img/profile2.jpg';
import AnimatedButton from '../AnimatedButton';
import resume from '../../assets/files/Steven_Jimenez_Resume.pdf';
import { Image, Grid, Header } from 'semantic-ui-react';

const Profile = () => (
  <>
    <Grid.Row style={{marginTop: "150px"}} centered>
      <Grid.Column textAlign="center">
        <Image style={{marginTop: '20px'}} centered rounded src={profilePicture} size="medium" />
      </Grid.Column>
    </Grid.Row>

    <Grid.Row centered>
      <Grid.Column textAlign="center">
        <div className={fadeIn}>
          <Header as="h1">Hey, I'm <span className={fullName}>Steven Jimenez.</span></Header>
          <Header.Subheader as="h3">"Problems I gravitate towards are areas of pain points and weakness."</Header.Subheader>
          <AnimatedButton primary title='Resume' iconName='file pdf outline' onClick={() => {
            window.open(resume, '_blank')
          }} />
        </div>
      </Grid.Column>
    </Grid.Row>
  </>
);

export default Profile;
