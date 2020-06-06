const path = require('path');
const postcss = require('postcss');
const fs = require('fs');

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('src/styles/index.css');

  eleventyConfig.addNunjucksAsyncShortcode('styles', async () => {
    const filePath = path.join(__dirname, 'src/index.css');
    const file = fs.readFileSync(filePath, 'utf-8');

    const result = await postcss([
      require('tailwindcss'),
      require('autoprefixer'),
    ]).process(file, { from: filePath });

    return result.css;
  });

  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'public',
    },
  };
};
