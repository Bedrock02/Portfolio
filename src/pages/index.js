import React from 'react';
import Layout from '../components/Layout/index.js';
import Roles from '../components/Roles';
import WorkExperience from '../components/WorkExperience'
import Profile from '../components/Profile'
import Hobbies from '../components/Hobbies/index.js';

const IndexPage = () => (
  <Layout>
    <Profile />
    <Roles />
    <WorkExperience />
    <Hobbies />
  </Layout>
);
export default IndexPage;
