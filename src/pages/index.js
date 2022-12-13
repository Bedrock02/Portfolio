import React from 'react';
import Layout from '../components/Layout/index.js';
import { Image, Grid, Header } from 'semantic-ui-react';
import Roles from '../components/Roles';
import WorkExperience from '../components/WorkExperience'
import indexStyles from './index.module.css';
import profilePicture from '../assets/img/profile2.jpg';
import AnimatedButton from '../components/AnimatedButton';
import resume from '../assets/files/Steven_Jimenez_Resume.pdf'



const IndexPage = () => (
  <Layout>
    <Grid.Row style={{marginTop: "150px"}} centered>
      <Grid.Column textAlign="center">
        <Image style={{marginTop: '20px'}} centered rounded src={profilePicture} size="medium" />
      </Grid.Column>
    </Grid.Row>

    <Grid.Row centered>
      <Grid.Column textAlign="center">
        <div className={indexStyles.fadeIn}>
          <Header as="h1">Hey, I'm <span className={indexStyles.fullName}>Steven Jimenez.</span></Header>
          <Header.Subheader>"Problems I gravitate towards are areas of pain points and weakness."</Header.Subheader>
          <AnimatedButton primary title='Resume' iconName='file pdf outline' onClick={() => {
            window.open(resume, '_blank')
          }} />
        </div>
      </Grid.Column>
    </Grid.Row>

    <Roles isHorizontal={false}/>
    <WorkExperience />
  </Layout>
);
export default IndexPage;
