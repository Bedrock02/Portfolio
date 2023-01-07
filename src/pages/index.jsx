import React from 'react';
import Layout from '../components/Layout/index';
import Roles from '../components/Roles';
import WorkExperience from '../components/WorkExperience';
import Profile from '../components/Profile';
import Hobbies from '../components/Hobbies/index';

function IndexPage() {
  return (
    <Layout>
      <Profile />
      <Roles />
      <WorkExperience />
      <Hobbies />
    </Layout>
  );
}
export default IndexPage;
