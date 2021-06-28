import React from 'react';
import Layout from '../components/Layout/index.js';
import { Image, Grid } from 'semantic-ui-react';
import Roles from '../components/Roles/index.js';
import indexStyles from './index.module.css';
import smImage from '../assets/img/sm_logo.png';
import tunein from '../assets/img/tunein.jpg';
import dnt from '../assets/img/dt_logo_robot.png';
import StaticForm from '../components/StaticForm/';
import nomad from '../assets/img/nomad_logo.png';
import profilePicture from '../assets/img/profile-picture.jpg';

const IndexPage = () => (
  <Layout>
    <Grid.Row style={{marginTop: "50px"}}centered padded="vertically">
      <Grid.Column textAlign="center">
        <Image style={{marginTop: '20px'}} centered rounded src={profilePicture} size="medium" />
        <h2 className={indexStyles.wepa}> My name is Steven, I am a Software Engineer who is looking to make your app feel "WEPA"!</h2>
      </Grid.Column>
    </Grid.Row>

    <Roles isHorizontal={false}/>

    <Grid.Row id="work" className="work-experience" centered verticalAlign="middle" style={{padding: "100px 0"}}>
      <Grid.Column stackable="true" textAlign="center" width={16}>
        <h1>Work Experience</h1>
      </Grid.Column>

      <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <Image centered src={nomad} size="medium" />
      </Grid.Column>
      <Grid.Column stackable="true" textAlign="center" width={8}>
        <h2>2019 - Present</h2>
      </Grid.Column>

      <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <Image centered src={dnt} size="medium" />
      </Grid.Column>
      <Grid.Column stackable="true" textAlign="center" width={8}>
        <h2>2018 - 2019</h2>
      </Grid.Column>

      <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <Image centered src={smImage} size="medium" />
      </Grid.Column>
      <Grid.Column stackable="true" textAlign="center" width={8}>
        <h2>2015-2018</h2>
      </Grid.Column>

      <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <Image centered src={tunein} size="medium" />
      </Grid.Column>
      <Grid.Column stackable="true" textAlign="center" width={8}>
        <h2>2014</h2>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <StaticForm />
      </Grid.Column>
    </Grid.Row>
  </Layout>
);
export default IndexPage;
