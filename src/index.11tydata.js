const StoryblokClient = require('storyblok-js-client');

const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_TOKEN,
});

function transformImages(html, option) {
  return html.replace(/\/\/a.storyblok.com/g, `//img2.storyblok.com/${option}`);
}

async function getIndex() {
  const response = await Storyblok.get('cdn/stories/home');
  const components = response.data.story.content.body;

  const index = {};

  const introduction = components.find(
    (component) => component.component === 'introduction'
  );
  index.introduction = Storyblok.richTextResolver.render(introduction.text);

  const workshops = components.filter(
    (component) => component.component === 'workshop'
  );
  index.workshops = workshops.map((workshop) =>
    Storyblok.richTextResolver.render(workshop.text)
  );

  const team = components.filter(
    (component) => component.component === 'team_member'
  );
  index.team = team.map((member) => ({
    name: member.name,
    picture: member.picture.filename,
    biography: Storyblok.richTextResolver.render(member.biography),
  }));

  return index;
}

module.exports = getIndex;
