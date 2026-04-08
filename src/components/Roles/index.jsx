import React from 'react';
import { Icon, List } from 'semantic-ui-react';
import { toolNames, leaderExamples } from './data';

function Roles() {
  return (
    <section id="about" className="portfolio-section">
      <h2 className="portfolio-section-title">About</h2>

      <div className="about-bio">
        <p>
          {`I'm a software engineer passionate about building web applications with clean, modern tools.
          With over a decade of experience across startups and enterprises, I focus on performant,
          accessible interfaces and the teams that build them.`}
        </p>
        <p>
          {`Beyond engineering, I give back through public speaking and community leadership —
          mentoring aspiring developers and volunteering with organizations like `}
          <a href="https://www.pursuit.org/volunteer" target="_blank" rel="noopener noreferrer">
            Pursuit
          </a>
          {`.`}
        </p>
      </div>

      <div className="role-grid">
        <div className="role-card">
          <Icon name="computer" size="large" />
          <h3>Software Engineer</h3>
          <p>
            My passion is creating web applications with the latest tools.
            Clean, crisp, and always performant.
          </p>
          <div className="role-tools">
            {toolNames.map((name) => (
              <Icon key={name} name={name} size="large" className="role-tool-icon" />
            ))}
          </div>
        </div>

        <div className="role-card">
          <Icon name="microphone" size="large" />
          <h3>Public Speaker</h3>
          <p>
            Our stories should be shared with future generations.
            Mine is unique and relatable to many.
          </p>
          <List>
            <List.Item>Non-profit organizations</List.Item>
            <List.Item>High school &amp; college</List.Item>
            <List.Item>Tech communities</List.Item>
          </List>
        </div>

        <div className="role-card">
          <Icon name="handshake outline" size="large" />
          <h3>Community Leader</h3>
          <p>
            To see the change we want, we need to invest in our communities.
          </p>
          <List>
            {leaderExamples.map(({ title, href }) => (
              <List.Item key={href}>
                <a target="_blank" rel="noopener noreferrer" href={href}>
                  {title}
                </a>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    </section>
  );
}

export default Roles;
