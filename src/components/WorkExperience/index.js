import React from 'react';
import { Image, Grid } from 'semantic-ui-react';
import nomad from '../../assets/img/nomad_logo.png';
import smImage from '../../assets/img/sm_logo.png';
import tunein from '../../assets/img/tunein.jpg';
import dnt from '../../assets/img/dt_logo_robot.png';


const WorkExperience = () =>(
    <Grid.Row id="work" className="work-experience" centered verticalAlign="middle" style={{padding: "100px 0"}}>
        <Grid.Column stackable="true" textAlign="center" width={16}>
        <h1>Work Experience</h1>
        </Grid.Column>

        <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <Image centered src={nomad} size="medium" />
        </Grid.Column>
        <Grid.Column stackable="true" textAlign="center" width={8}>
        <h2>2019 - Present</h2>
        </Grid.Column>

        <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <Image centered src={dnt} size="medium" />
        </Grid.Column>
        <Grid.Column stackable="true" textAlign="center" width={8}>
        <h2>2018 - 2019</h2>
        </Grid.Column>

        <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <Image centered src={smImage} size="medium" />
        </Grid.Column>
        <Grid.Column stackable="true" textAlign="center" width={8}>
        <h2>2015-2018</h2>
        </Grid.Column>

        <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <Image centered src={tunein} size="medium" />
        </Grid.Column>
        <Grid.Column stackable="true" textAlign="center" width={8}>
        <h2>2014</h2>
        </Grid.Column>
    </Grid.Row>   
);
export default WorkExperience;