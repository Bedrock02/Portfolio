import React from 'react';
import { Image, Grid } from 'semantic-ui-react';
import { work, experience, grow } from './work.module.css'
import {
    nomad,
    smImage,
    tunein,
    dnt,
    even,
} from '../../assets/img'

const workExperienceData = [
    {
        image: even,
        href: 'https://evenfinancial.com/',
        date: '2021 - 2022',
        title: 'Software Engineer',
    },
    {
        image: nomad,
        href: 'https://nomadhealth.com/',
        date: '2019 - 2021',
        title: 'Technical Lead'
    },
    {
        image: dnt,
        href: 'https://domandtom.com/',
        date: '2018 - 2019',
        title: 'Technical Lead'
    },
    {
        image: smImage,
        href: 'https://www.surveymonkey.com/',
        date: '2015 - 2018',
        title: 'Software Engineer'
    },
    {
        image: tunein,
        href: 'https://tunein.com/',
        date: '2014 - 2014',
        title: 'Software Engineer'
    },
]

const WorkItem = ({ image, href, date, title }) => (
    <Grid.Row className={work} centered verticalAlign="middle">
        <Grid.Column className='work-logos' stackable="true" textAlign="center" width={8}>
        <div className={grow}>
            <a href={href} target='_blank'>
                <Image centered src={image} size="medium" />
            </a>
        </div>
        </Grid.Column>
        <Grid.Column stackable="true" textAlign="center" width={8}>
            <h2>{date}</h2>
            <h2>{title}</h2>
        </Grid.Column>
    </Grid.Row>
)

const WorkExperience = () =>(
    <Grid padded>
        <Grid.Row id="work" className={experience} centered verticalAlign="middle" style={{ padding: "100px 0" }}>
            <Grid.Column stackable="true" textAlign="center" width={16}>
                <h1>Work Experience</h1>
            </Grid.Column>
        </Grid.Row>
        {workExperienceData.map( ({image, href, date, title}) => (
            <WorkItem image={image} href={href} date={date} title={title} />
        ))}
    </Grid>
);
export default WorkExperience;