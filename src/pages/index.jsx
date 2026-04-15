import React from 'react';
import Layout from '../components/Layout/index';
import Roles from '../components/Roles';
import Skills from '../components/Skills';
import WorkExperience from '../components/WorkExperience';
import Chat from '../components/Chat';

function IndexPage() {
  return (
    <Layout>
      <Chat />
      <Roles />
      <Skills />
      <WorkExperience />
    </Layout>
  );
}
export default IndexPage;
