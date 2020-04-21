const StoryblokClient = require('storyblok-js-client');

const Storyblok = new StoryblokClient({
    accessToken: process.env.STORYBLOK_TOKEN,
});

function transformImages(html, option) {
    return html.replace(/\/\/a.storyblok.com/g, `//img2.storyblok.com/${option}`);
}

async function getIndex() {
    const response = await Storyblok.get('cdn/stories/home');
    let richText = response.data.story.content.body;
    richText = Storyblok.richTextResolver.render(richText);
    const content = transformImages(richText, '960x0');
    return { content };
}

module.exports = getIndex;
