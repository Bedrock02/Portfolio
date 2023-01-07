import React from 'react';
import { Icon, Grid } from 'semantic-ui-react';
import { linkData } from './data';

function Footer() {
  return (
    <Grid>
      <Grid.Row className="footer" textAlign="center" columns={5}>
        {linkData.map(({ href, iconName }) => (
          <Grid.Column textAlign="center">
            <a href={href} target="_blank" rel="noopener noreferrer">
              <Icon link name={iconName} size="big" />
            </a>
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  );
}
export default Footer;
