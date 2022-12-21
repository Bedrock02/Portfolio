import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { Container, Grid } from 'semantic-ui-react';
import image from '../../assets/img/topography.png';
import Footer from '../Footer/index.js';
import Header from '../Header/index.js';
import 'semantic-ui-less/semantic.less';
import favicon from '../../../public/static/favicon.png';

const Layout = ({ children, data }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
        
    render={data => (
      
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'keywords', content: 'Steven Jimenez, portfolio, Bedrock02' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1'}
          ]}
          link={[
            { rel: 'shortcut icon', type: 'image/png', href: `${favicon}` }
          ]}
        >
          <title>Steven Jimenez</title>
          <meta name="description" content="Steven Jimenez is a web developer, community leader, and a public speaker" />

          {/* Facebook Meta Tags */}
          <meta property="og:url" content="https://wepadev.com/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Steven Jimenez" />
          <meta property="og:description" content="Steven Jimenez is a web developer, community leader, and a public speaker" />
          <meta property="og:image" content="https://wepadev.com/static/profile2-3436f6fd1dbdc38c13e9ec70ef939e22.jpg" />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="wepadev.com" />
          <meta property="twitter:url" content="https://wepadev.com/" />
          <meta name="twitter:title" content="Steven Jimenez" />
          <meta name="twitter:description" content="Steven Jimenez is a web developer, community leader, and a public speaker" />
          <meta name="twitter:image" content="https://wepadev.com/static/profile2-3436f6fd1dbdc38c13e9ec70ef939e22.jpg" />
        </Helmet>
        <div style={{
          background: `url("${image}")`,
        }}>
          <Header siteTitle={data.site.siteMetadata.title} />
          <Container fluid>
            <Grid id="home" relaxed stackable style={{minHeight: "100vh"}}>
              {children}
            </Grid>
          </Container>
          <Footer />
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
