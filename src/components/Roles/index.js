import React from 'react';
import { Grid, Icon, List } from 'semantic-ui-react';
import rolesStyles from './roles.module.css';

const Roles = ({ isHorizontal }) => (
  <Grid.Row id="about" columns={3} className={rolesStyles.group}>
    <Grid.Column textAlign='center' className={rolesStyles.dev}>
      <Icon name='computer' size='huge'/>
      <h2>Web Developer</h2>
      <p>My passion is creating web applications with the latest and greatest tools.
        My design approach is simple, clean and crisp.</p>
      <h3>Tool Kit</h3>
      <List horizontal>
        <List.Item><Icon name='html5' size='big'/></List.Item>
        <List.Item><Icon name='sass' size='big' /></List.Item>
        <List.Item><Icon name='js' size='big' /></List.Item>
        <List.Item><Icon name='react' size='big' /></List.Item>
        <List.Item><Icon name='python' size='big' /></List.Item>
        <List.Item><Icon name='git' size='big' /></List.Item>
        <List.Item><Icon name='docker' size='big' /></List.Item>
        <List.Item><Icon name='aws' size='big' /></List.Item>
      </List>
    </Grid.Column>

    <Grid.Column textAlign='center' className={rolesStyles.speaking}>
      <Icon name='microphone' size='huge' style={{color: "white"}}/>
      <h2>Public Speaker</h2>
      <p>Our stories should be shared with the future generation. My story is unique and relatable to many.</p>
      <h3>Audiences</h3>
      <List>
        <List.Item>Non Profit Organizations</List.Item>
        <List.Item>High School/College</List.Item>
        <List.Item>Tech Communities</List.Item>
      </List>
    </Grid.Column>

    <Grid.Column textAlign='center' className={rolesStyles.leader}>
      <Icon name='handshake outline' size='huge' color="blue"/>
      <h2>Community Leader</h2>
      <p>In order to see the change we want to see, we as individuals need to invest in our communities.</p>
      <h3>Contributions</h3>
      <List>
        <List.Item>
          <a className={rolesStyles.link} target="_blank" rel="noopener noreferrer" href="https://www.surveymonkey.com/mp/diversity-and-inclusion/">
            Founded Blatinos: first Employee Resource Group at SurveyMonkey
          </a>
        </List.Item>
        <List.Item>
          <a className={rolesStyles.link} target="_blank" rel="noopener noreferrer" href="https://medium.com/@Bedrock02/fundraising-for-the-future-of-tech-2353768d813a">
            Fundraising For The Future Of Tech
          </a>
        </List.Item>
        <List.Item>
          <a className={rolesStyles.link} target="_blank" rel="noopener noreferrer" href="https://blog.thelonghairs.us/beyond-the-locks-alejandro-carillo/">
            Content Creation for The Longhairs
          </a>
        </List.Item>
      </List>
    </Grid.Column>
  </Grid.Row>
);

export default Roles;
