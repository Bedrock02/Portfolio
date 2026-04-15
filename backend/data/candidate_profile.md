## Steven Jimenez — Candidate Profile

A deeper look at Steven Jimenez beyond the resume: his motivations, working style, leadership philosophy, and what makes him a distinctive candidate.

## Career Strategy and Company Selection

Steven is deliberate about the companies he joins. His primary filter is product connection — he looks for companies whose products he already uses, believes in, or finds genuinely interesting from a problem-solving perspective. If he doesn't understand or connect with the mission, he knows he won't be motivated. This explains the arc of his career: SurveyMonkey (tools he used), TuneIn (music/audio passion), Nomad Health (healthcare access), Peloton and Lululemon (fitness lifestyle). Company selection is not opportunistic — it is intentional.

## How He Works Best

Steven thrives in high-engagement environments with smart, communicative coworkers. He dislikes meeting-heavy cultures and is energized by fast iteration and experimentation. The closer he is to the end user, the more purpose he brings to his daily work. He finds user feedback genuinely exciting — understanding how real people interact with a product shapes how he approaches technical decisions.

## Leadership Philosophy and Challenges

Steven has served as a tech lead at Dom & Tom and Nomad Health. He describes the hardest part of leadership as navigating different personalities and opinionated technical decisions — debates over architecture, design systems, and approach. Keeping a team aligned while honoring different viewpoints is something he has had to develop deliberately.

He also speaks openly about imposter syndrome. Feeling insecure about his own knowledge in leadership roles was real for him, and overcoming that is something he considers part of his growth. His willingness to name it is itself a sign of maturity.

## Signature Project: Nomad Health Application Form Rebuild

As Tech Lead for the data aggregation team at Nomad Health, Steven was asked to improve validation on an existing Jinja-template-powered travel nurse application form. Users were abandoning the form and submitting bad data.

Rather than patching the existing system, Steven proposed a full rebuild in React. He wrote a technical spec outlining the proposed changes, timeline, and benefits — and got buy-in. The project was executed in three phases:

- **Phase 1:** Migrated all Jinja template components into React. Consolidated them into a single long-form application.
- **Phase 2:** Broke the long form into sections with progress tracking, handling page state and completion status.
- **Phase 3:** Added the originally requested validation plus additional UX features showing applicants the status of their application.

Result: a 15% increase in application-ready nurses — meaning 15% more applicants whose data could be ingested by the job recommendations engine.

What Steven would do differently: he learned the hard way about state management complexity. Early on, API calls, form state, and update logic all lived under one hook. He would now separate these into independent hooks from day one, and use a more structured solution like Redux for top-level app state while keeping data fetches as simple hooks. He also would have prioritized performance earlier in the project.

This project was formative — it exposed gaps in his technical leadership and showed him exactly what to study next.

## On Being Laid Off Three Times

Steven was laid off in consecutive roles at Even Financial, Lululemon, and Peloton — all reductions in force, none performance-related.

- **Even Financial (MoneyLion):** Acquisition integration led to org restructuring and cuts across teams.
- **Lululemon:** The company discontinued Lululemon Studio Mirror and ended its digital app-only membership tier, resulting in team eliminations.
- **Peloton:** The company publicly announced outsourcing engineering work to Poland and back-office operations to India as part of a $100M cost reduction target.

Each layoff was a test. Each time, Steven responded by blogging about his interview experiences, exploring new tools, updating his resume and projects, picking up new skills, and preparing for the next opportunity. He describes the consecutive layoffs as difficult but also as forced periods of leveling up.

## Technical Identity

Steven considers himself a generalist and full-stack engineer. The last three years have been heavily frontend-focused, specifically within the React ecosystem. Going forward, he wants to continue growing as a full-stack engineer with a particular emphasis on AI integration — understanding how to work with LLMs and how to turn existing products into AI-powered products. The more he explores this space, the clearer his long-term direction becomes.

## Volunteering for Stretch Work

At Peloton, Steven volunteered for Holiday Readiness — load testing and reliability work outside his normal scope. Every team was expected to prepare for peak traffic, and he saw it as an opportunity to work cross-functionally and enter a space he had never worked in before. He built reusable k6 load-testing suites and Datadog dashboards that were adopted org-wide, scaling shop throughput from 60 to 120 orders per minute. What he took away: a practical understanding of API stress testing, performance analytics, and how to identify bottlenecks under load.

## Industry and Domain Interests

Steven does not have a fixed industry preference, but is consistently drawn to health tech, AI-driven products, and anything that intersects with his personal interests — fitness and music in particular.

## How He Stays Current

Steven stays current primarily by building things. He uses Claude Code in a guided learning mode — having it explain concepts and walk him through implementations as he builds, rather than just generating code for him. He supplements this with podcasts (Syntax.fm for web development, Everyday AI for the AI space) and curated newsletters to track what is happening across companies and emerging technologies.

## Ideal Team Structure

Steven's ideal setup is a small pod of three to four engineers working closely with product and design. Decisions are made through cross-team collaboration. He is comfortable filling product or design gaps when those roles aren't present, but prefers having them. He values continuous delivery, two-week spikes for exploration, and always building on top of existing work rather than starting from scratch.

## Community and Identity

Steven is a Colombian-American who has experienced the "not from here, not from there" complexity of belonging to two cultures. He has seen and experienced biases and microaggressions in the industry firsthand. That is what drove his involvement with Techqueria, Code2040, and Pursuit — giving back to communities that face the same barriers he has navigated. He raised $7,900 for Code2040 and has volunteered as a mock interviewer for Pursuit fellows. While less active now than in the past, the motivation comes from a real and personal place.

## What Makes Him a Distinctive Candidate

When asked directly why a hiring manager should choose him over another senior engineer with a similar resume, Steven's answer is honest and grounded:

He is flexible and adaptable. He will figure out how to get something done. He is constantly learning and genuinely excited by complex problems. As a Latino engineer, he brings a perspective and demographic background that is underrepresented in senior engineering roles. And he believes deeply in collaboration and communication across teams — not just within his own pod.
