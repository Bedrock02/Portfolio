import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { Icon } from 'semantic-ui-react';
import Profile from '../Profile/index';
import Header from '../Header/index';
import { linkData } from '../Footer/data';
import favicon from '../../../public/static/favicon.png';
import 'semantic-ui-less/semantic.less';

function Layout({ children }) {
  return (
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
      render={(data) => (
        <>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'keywords', content: 'Steven Jimenez, portfolio, Bedrock02' },
              { name: 'viewport', content: 'width=device-width, initial-scale=1' },
              { name: 'description', content: 'Steven Jimenez is a web developer, community leader, and a public speaker' },
              { property: 'og:url', content: 'https://wepadev.com/' },
              { property: 'og:type', content: 'website' },
              { property: 'og:title', content: 'Steven Jimenez' },
              { property: 'og:description', content: 'Steven Jimenez is a web developer, community leader, and a public speaker' },
              { property: 'og:image', content: 'https://wepadev.com/static/profile2-3436f6fd1dbdc38c13e9ec70ef939e22.jpg' },
            ]}
            link={[
              { rel: 'shortcut icon', type: 'image/png', href: `${favicon}` },
            ]}
          />
          <div className="portfolio-app">
            <aside className="portfolio-sidebar">
              <div className="portfolio-sidebar-top">
                <Profile />
                <Header />
              </div>
              <div className="portfolio-sidebar-bottom">
                {linkData.map(({ href, iconName }) => (
                  <a key={iconName} href={href} target="_blank" rel="noopener noreferrer" className="portfolio-social-link">
                    <Icon name={iconName} size="large" />
                  </a>
                ))}
              </div>
            </aside>
            <main className="portfolio-main">
              {children}
            </main>
          </div>
        </>
      )}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
