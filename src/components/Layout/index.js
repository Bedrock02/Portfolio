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
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
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
