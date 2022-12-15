import React from 'react';
import Layout from '../components/Layout/index.js';
import Roles from '../components/Roles';
import WorkExperience from '../components/WorkExperience'
import Profile from '../components/Profile'

const IndexPage = () => (
  <Layout>
    <Profile />
    <Roles isHorizontal={false}/>
    <WorkExperience />
  </Layout>
);
export default IndexPage;
