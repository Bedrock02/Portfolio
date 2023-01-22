import React from 'react';
import { Image, Grid, Header } from 'semantic-ui-react';
import { fadeIn, fullName } from './profile.module.css';
import profilePicture from '../../assets/img/profile2.jpg';
import AnimatedButton from '../AnimatedButton';

function Profile() {
  return (
    <>
      <Grid.Row style={{ marginTop: '150px' }} centered>
        <Grid.Column textAlign="center">
          <Image style={{ marginTop: '20px' }} centered rounded src={profilePicture} size="medium" />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row centered>
        <Grid.Column textAlign="center">
          <div className={fadeIn}>
            <Header as="h1">
              {'Hey, I\'m'}
              <span className={fullName}> Steven Jimenez.</span>
            </Header>
            <Header.Subheader as="h3">{`"I turn cafecito ☕ into <code> and problems into solutions 🎉"`}</Header.Subheader>
            <AnimatedButton
              title="Resume"
              iconName="file pdf outline"
              onClick={() => {
                window.open('https://bedrock02.github.io/resume/', '_blank');
              }}
            />
          </div>
        </Grid.Column>
      </Grid.Row>
    </>
  );
}

export default Profile;
