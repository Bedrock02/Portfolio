import React from 'react';
import Layout from '../components/Layout/index';

function NotFoundPage() {
  return (
    <Layout>
      <h2>
        <span role="img" aria-label="Forbidden sign">🚫</span>
        {' '}
        Not found
      </h2>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  );
}

export default NotFoundPage;
