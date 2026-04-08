import React, { useEffect } from 'react';
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
  useEffect(() => {
    const sections = document.querySelectorAll('.portfolio-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
              { name: 'description', content: 'Steven Jimenez is a full-stack software engineer specializing in e-commerce, experimentation, and performance-critical user journeys.' },
              { property: 'og:url', content: 'https://wepadev.com/' },
              { property: 'og:type', content: 'website' },
              { property: 'og:title', content: 'Steven Jimenez' },
              { property: 'og:description', content: 'Senior full-stack engineer with 10+ years shipping frontend-heavy systems, experimentation platforms, and performance-critical user journeys.' },
              { property: 'og:image', content: 'https://wepadev.com/static/profile2-3436f6fd1dbdc38c13e9ec70ef939e22.jpg' },
            ]}
            link={[
              { rel: 'shortcut icon', type: 'image/png', href: `${favicon}` },
            ]}
          />
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <div className="portfolio-app">
            <aside className="portfolio-sidebar" aria-label="Site navigation and profile">
              <div className="portfolio-sidebar-top">
                <Profile />
                <Header />
              </div>
              <div className="portfolio-sidebar-bottom" role="list" aria-label="Social links">
                {linkData.map(({ href, iconName, ariaLabel }) => (
                  <a
                    key={iconName}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-social-link"
                    aria-label={`${ariaLabel} (opens in new tab)`}
                    role="listitem"
                  >
                    <Icon name={iconName} size="large" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </aside>
            <main id="main-content" className="portfolio-main">
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
