import React from 'react';
import { Icon, Grid } from 'semantic-ui-react';

const Footer = () => (
  <Grid>
    <Grid.Row className="footer" textAlign="center" style={{padding: "50px 0"}}>
      <Grid.Column textAlign="center" width={3}>
        <a href="https://github.com/Bedrock02/" target="_blank" rel="noopener noreferrer">
          <Icon link name='github' size='huge'/>
        </a>
      </Grid.Column>
      <Grid.Column textAlign="center" width={3}>
        <a href="https://www.linkedin.com/in/steven-jimenez-7a435251/" target="_blank" rel="noopener noreferrer">
          <Icon link name='linkedin' size='huge' />
        </a>
      </Grid.Column>
      <Grid.Column textAlign="center" width={3}>
        <a href="https://medium.com/@Bedrock02" target="_blank" rel="noopener noreferrer">
          <Icon link name='medium' size='huge' />
        </a>
      </Grid.Column>
      <Grid.Column textAlign="center" width={3}>
        <a href="https://www.instagram.com/viens_voir02/" target="_blank" rel="noopener noreferrer">
          <Icon link name='instagram' size='huge' />
        </a>
      </Grid.Column>
      <Grid.Column textAlign="center" width={3}>
        <a href="https://www.strava.com/athletes/6644207" target="_blank" rel="noopener noreferrer">
          <Icon link name='strava' size='huge' />
        </a>
      </Grid.Column>
    </Grid.Row>
  </Grid>
)
export default Footer
