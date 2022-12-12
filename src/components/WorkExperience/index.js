import React from 'react';
import { Image, Grid } from 'semantic-ui-react';
import workStyles from './work.module.css'
import {
    nomad,
    smImage,
    tunein,
    dnt,
    even,
} from '../../assets/img'

const WorkItem = ({ image, date }) => (
    <Grid.Row className={workStyles.work} centered verticalAlign="middle">
        <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
            <Image centered src={image} size="medium" />
        </Grid.Column>
        <Grid.Column stackable="true" textAlign="center" width={8}>
            <h2>{date}</h2>
        </Grid.Column>
    </Grid.Row>
)

const WorkExperience = () =>(
    <Grid padded>
        <Grid.Row id="work" className="work-experience" centered verticalAlign="middle" style={{ padding: "100px 0" }}>
            <Grid.Column stackable="true" textAlign="center" width={16}>
                <h1>Work Experience</h1>
            </Grid.Column>
        </Grid.Row>
        <WorkItem image={even} date={'2021 - 2022'} />
        <WorkItem image={nomad} date={'2019 - 2021'} />
        <WorkItem image={dnt} date={'2018 - 2019'} />
        <WorkItem image={smImage} date={'2015 - 2018'} />
        <WorkItem image={tunein} date={'2014 - 2014'} /></Grid>
);
export default WorkExperience;