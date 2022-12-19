import React from 'react';
import { Image, Grid, List } from 'semantic-ui-react';
import { work, experience, grow, toolContainer } from './work.module.css'
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
        tools: [
            'Nx.js',
            'Typescript',
            'RJSF',
            'React',
            'Cucumber',
            'Docker',
            'Unleash',
        ]
    },
    {
        image: nomad,
        href: 'https://nomadhealth.com/',
        date: '2019 - 2021',
        title: 'Technical Lead',
        tools: [
            'Next.js',
            'React',
            'MongoDB',
            'Python',
            'Flask',
            'Celery',
            'Jinja',
            'MaterialUI'
        ],
    },
    {
        image: dnt,
        href: 'https://domandtom.com/',
        date: '2018 - 2019',
        title: 'Technical Lead',
        tools: [
            'React',
            'GraphQL',
            'Selenium',
            'React Native',
            'Ruby on Rails',
            'Contentful',
            'Bootstrap'
        ]
    },
    {
        image: smImage,
        href: 'https://www.surveymonkey.com/',
        date: '2015 - 2018',
        title: 'Software Engineer',
        tools: [
            'Backbone.js',
            'JQuery',
            'Python',
            'Pyramid',
            'Flask',
            'SQL',
            'Docker',
            'AWS',
            'CSS'
        ]
    },
    {
        image: tunein,
        href: 'https://tunein.com/',
        date: '2014 - 2014',
        title: 'Software Engineer',
        tools: [
            '.Net',
            'Javascript',
            'JQuery',
        ]
    },
]

const WorkItem = ({ image, href, date, title, tools }) => (
    <Grid.Row className={work} centered verticalAlign="middle">
        <Grid.Column className='work-logos' textAlign="center" width={8}>
            <div className={grow}>
                <a href={href} target='_blank'>
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
                    <List divided relaxed  horizontal>
                        {tools.map( tool => (
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
)

const WorkExperience = () =>(
    <Grid padded stackable>
        <Grid.Row id="work" className={experience} centered verticalAlign="middle" style={{ padding: "100px 0" }}>
            <Grid.Column textAlign="center" width={16}>
                <h1>Work Experience</h1>
            </Grid.Column>
        </Grid.Row>
        {workExperienceData.map( (item) => (
            <WorkItem {...item} />
        ))}
    </Grid>
);
export default WorkExperience;