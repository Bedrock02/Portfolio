import React from 'react';
import { Image, Grid, List } from 'semantic-ui-react';
import { work, experience, grow, toolContainer } from './work.module.css';
import { workExperienceData } from './data';


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