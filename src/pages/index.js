import React from 'react';
import Layout from '../components/Layout/index.js';
import { Image, Grid } from 'semantic-ui-react';
import Roles from '../components/Roles';
import WorkExperience from '../components/WorkExperience'
import indexStyles from './index.module.css';
import profilePicture from '../assets/img/profile2.jpg';
import { AnimatedButton } from '../components/ResumeButton/ResumeButton.jsx';
import resume from '../assets/files/Steven_Jimenez_Resume.pdf'


const IndexPage = () => (
  <Layout>
    <Grid.Row style={{marginTop: "150px"}}centered padded="vertically">
      <Grid.Column textAlign="center">
        <Image style={{marginTop: '20px'}} centered rounded src={profilePicture} size="medium" />
        <div>
          <h1 className={indexStyles.wepa}>Hey, I'm Steven Jimenez.</h1>
        </div>
        <div className={indexStyles.fadeIn}>
          <h2 className={indexStyles.wepa}> "Problems I gravitate towards are areas of pain points and weakness."</h2>
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
