import React from 'react';
import { Icon, Grid } from 'semantic-ui-react';

const linkData = [
  {
    href: 'https://github.com/Bedrock02/',
    iconName: 'github',
  },
  {
    href: 'https://www.linkedin.com/in/steven-jimenez-7a435251/',
    iconName: 'linkedin',
  },
  {
    href: 'https://medium.com/@Bedrock02',
    iconName: 'medium',
  },
  {
    href: 'https://www.strava.com/athletes/6644207',
    iconName: 'strava',
  },
  {
    href: 'mailto:jimsteve91@gmail.com',
    iconName: 'mail',
  }
]

const Footer = () => (
  <Grid>
    <Grid.Row className="footer" textAlign="center" columns={5}>
      {linkData.map( ({ href, iconName }) => (
        <Grid.Column textAlign="center">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <Icon link name={iconName} size='big' />
          </a>
        </Grid.Column>
      ))}
    </Grid.Row>
  </Grid>
)
export default Footer
