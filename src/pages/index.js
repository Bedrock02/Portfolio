import React from 'react';
import Layout from '../components/Layout/index.js';
import { Image, Grid } from 'semantic-ui-react';
import Roles from '../components/Roles';
import WorkExperience from '../components/WorkExperience'
import indexStyles from './index.module.css';
import StaticForm from '../components/StaticForm/';
import profilePicture from '../assets/img/profile2.jpg';

const IndexPage = () => (
  <Layout>
    <Grid.Row style={{marginTop: "50px"}}centered padded="vertically">
      <Grid.Column textAlign="center">
        <Image style={{marginTop: '20px'}} centered rounded src={profilePicture} size="medium" />
        <h2 className={indexStyles.wepa}> My name is Steven, I am a Software Engineer who is looking to make your app feel "WEPA"!</h2>
      </Grid.Column>
    </Grid.Row>

    <Roles isHorizontal={false}/>
    <WorkExperience />

    
    <Grid.Row>
      <Grid.Column>
        <StaticForm />
      </Grid.Column>
    </Grid.Row>
  </Layout>
);
export default IndexPage;
