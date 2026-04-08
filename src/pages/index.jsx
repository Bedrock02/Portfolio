import React from 'react';
import Layout from '../components/Layout/index';
import Roles from '../components/Roles';
import Skills from '../components/Skills';
import WorkExperience from '../components/WorkExperience';
function IndexPage() {
  return (
    <Layout>
      <Roles />
      <Skills />
      <WorkExperience />
    </Layout>
  );
}
export default IndexPage;
