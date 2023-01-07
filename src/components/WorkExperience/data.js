import {
  nomad,
  smImage,
  tunein,
  dnt,
  even,
} from '../../assets/img';

export const workExperienceData = [
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
    ],
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
      'MaterialUI',
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
      'Bootstrap',
    ],
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
      'CSS',
    ],
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
    ],
  },
];

export default {
  workExperienceData,
};
