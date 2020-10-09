const StoryblokClient = require('storyblok-js-client');

const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_TOKEN,
});

function transformImages(html, option) {
  return html.replace(/\/\/a.storyblok.com/g, `//img2.storyblok.com/${option}`);
}

function transformRichText(block) {
  return Storyblok.richTextResolver
    .render(block)
    .replace(/<h2/g, '<h2 class="lg:text-3xl mt-12 mb-4"')
    .replace(/<p/g, '<p class="mb-4"')
    .replace(/<ul/g, '<ul class="mb-4"')
    .replace(/<li *.?>/g, '$&<img aria-hidden="true" src="logo.png">');
}

async function getIndex() {
  const response = await Storyblok.get('cdn/stories/home');
  const components = response.data.story.content.body;

  const index = {};

  const introduction = components.find(
    (component) => component.component === 'introduction'
  );
  index.introduction = transformRichText(introduction.text);

  const richText = components
    .filter((component) => component.component === 'rich_text')
    .map((component) => transformRichText(component.text));

  // TODO Find a better way to deal with ordered blocks.
  if (richText.length >= 2) {
    index.beforeWorkshopBlock = richText[0].replace(
      '<h2 class="',
      '<h2 class="text-center '
    );
    index.afterWorkshopBlock = richText[1];
  }

  // TODO Delete old workshops from Storyblok as soon as the site has been updated in production.
  const workshops = components.filter(
    (component) => component.component === 'workshop2'
  );
  index.workshops = workshops.map((workshop) => ({
    title: workshop.title,
    picture: workshop.picture.filename,
    description: transformRichText(workshop.description),
  }));

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
