module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Load books data directly so collections are available during build
  const booksData = require("./src/_data/books.json");

  // Books collection (sorted newest first)
  eleventyConfig.addCollection("books", function(collectionApi) {
    return (booksData.books || []).slice().sort(function(a,b){
      return new Date(b.publish_date) - new Date(a.publish_date);
    });
  });

  // Categories collection derived from books.json
  eleventyConfig.addCollection("categories", function(collectionApi) {
    const map = new Map();
    (booksData.books || []).forEach(book => {
      (book.categories || []).forEach(cat => {
        const key = String(cat).trim();
        if(!map.has(key)) map.set(key, []);
        map.get(key).push(book);
      });
    });
    return Array.from(map.entries()).map(([name, items]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      items
    }));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    },
    passthroughFileCopy: true
  };
};
