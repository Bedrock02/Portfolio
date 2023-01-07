import cyclingVideo from '../../assets/videos/cycling.mp4';
import timesSquare from '../../assets/videos/timessquare.mp4';
import botanical from '../../assets/videos/botanical-garden.mp4';
import lucky from '../../assets/videos/lucky-winter.mp4';

const cyclingDescription = 'I got into cycling at 22 years old when I joined my dad’s Saturday ride as a way to spend more time with him. Little did I know that cycling would become my way of life, and not just a Saturday hobby.';
const nature = 'Nature brings me a sense of peace and tranquility that I can\'t find anywhere else. Its beauty and diversity are a constant source of inspiration and awe for me.';
const diversity = 'Exploring the world allows me to experience new cultures, landscapes, and ways of life that broaden my perspective and understanding of the world. It is through these adventures and discoveries that I am able to learn and grow as a person.';
const dog = 'I just love my dog Lucky';

export const hobbyData = [
  {
    video: {
      source: cyclingVideo,
      start: 0.00,
      end: 5.00,
    },
    header: 'Cycling',
    description: cyclingDescription,

  },
  {
    video: {
      source: botanical,
      start: 0.00,
      end: 10.00,
    },
    header: 'Nature',
    description: nature,
  },
  {
    video: {
      source: timesSquare,
      start: 2.00,
      end: 15.00,
    },
    header: 'Diversity',
    description: diversity,
  },
  {
    video: {
      source: lucky,
      start: 4.00,
      end: 7.00,
    },
    header: 'Lucky',
    description: dog,
  },
];

export default {
  hobbyData,
};
