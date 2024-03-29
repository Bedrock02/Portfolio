import React from 'react';
import { Grid, Icon, List } from 'semantic-ui-react';
import {
  group, dev, speaking, leader, link,
} from './roles.module.css';

import { toolNames, leaderExamples } from './data';

function Roles() {
  return (
    <Grid.Row id="about" columns={3} className={group}>
      <Grid.Column textAlign="center" className={dev}>
        <Icon name="computer" size="huge" />
        <h2>Software Engineer</h2>
        <p>
          My passion is creating web applications with the latest and greatest tools.
          My design approach is simple, clean and crisp.
        </p>
        <h3>Tool Kit</h3>
        <List horizontal>
          {toolNames.map((name) => (
            <List.Item><Icon name={name} size="big" /></List.Item>
          ))}
        </List>
      </Grid.Column>

      <Grid.Column textAlign="center" className={speaking}>
        <Icon name="microphone" size="huge" style={{ color: 'white' }} />
        <h2>Public Speaker</h2>
        <p>
          Our stories should be shared with the future generation.
          My story is unique and relatable to many.
        </p>
        <h3>Audiences</h3>
        <List>
          <List.Item>Non Profit Organizations</List.Item>
          <List.Item>High School/College</List.Item>
          <List.Item>Tech Communities</List.Item>
        </List>
      </Grid.Column>

      <Grid.Column textAlign="center" className={leader}>
        <Icon name="handshake outline" size="huge" color="blue" />
        <h2>Community Leader</h2>
        <p>
          In order to see the change we want to see,
          we as individuals need to invest in our communities.
        </p>
        <h3>Contributions</h3>
        <List>
          {leaderExamples.map(({ title, href }) => (
            <List.Item>
              <a className={link} target="_blank" rel="noopener noreferrer" href={href}>
                {title}
              </a>
            </List.Item>
          ))}
        </List>
      </Grid.Column>
    </Grid.Row>
  );
}

export default Roles;
