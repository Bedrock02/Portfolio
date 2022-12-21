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
            { name: 'viewport', content: 'width=device-width, initial-scale=1'},
            { name: 'description', content: 'Steven Jimenez is a web developer, community leader, and a public speaker'},
            { property: 'og:url', content: 'https://wepadev.com/'},
            { property: 'og:type', content: 'website'},
            { property: 'og:title', content: 'Steven Jimenez'},
            { property: 'og:description', content: 'Steven Jimenez is a web developer, community leader, and a public speaker'},
            { property: 'og:image', content: 'https://wepadev.com/static/profile2-3436f6fd1dbdc38c13e9ec70ef939e22.jpg'},

          ]}
          link={[
            { rel: 'shortcut icon', type: 'image/png', href: `${favicon}` }
          ]}
        />
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
