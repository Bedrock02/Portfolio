import React from 'react';
import { Image, Grid, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  work, experience, grow, toolContainer,
} from './work.module.css';
import { workExperienceData } from './data';

function WorkItem(item) {
  const {
    image, href, date, title, tools,
  } = item;
  return (
    <Grid.Row className={work} centered verticalAlign="middle">
      <Grid.Column className="work-logos" textAlign="center" width={8}>
        <div className={grow}>
          <a href={href} target="_blank" rel="noreferrer">
            <Image centered src={image} size="medium" />
          </a>
        </div>
      </Grid.Column>
      <Grid.Column textAlign="center" width={8}>
        <div>
          <h2>{date}</h2>
          <h2>{title}</h2>
        </div>
        <div className={toolContainer}>
          <List divided relaxed horizontal>
            {tools.map((tool) => (
              <List.Item>
                <List.Content>
                  {tool}
                </List.Content>
              </List.Item>
            ))}
          </List>
        </div>
      </Grid.Column>
    </Grid.Row>
  );
}

WorkItem.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tools: PropTypes.string.isRequired,
  }).isRequired,
};

function WorkExperience() {
  return (
    <Grid padded stackable>
      <Grid.Row id="work" className={experience} centered verticalAlign="middle" style={{ padding: '100px 0' }}>
        <Grid.Column textAlign="center" width={16}>
          <h1>Work Experience</h1>
        </Grid.Column>
      </Grid.Row>
      {workExperienceData.map((item) => (
        <WorkItem item={item} />
      ))}
    </Grid>
  );
}
export default WorkExperience;
