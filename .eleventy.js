module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets and downloads
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/downloads");

  // Load site data, books data, authors
  const siteData = require("./src/_data/site.json");
  const booksData = require("./src/_data/books.json");
  let authorsData = [];
  try { authorsData = require("./src/_data/authors.json"); } catch(e) { authorsData = []; }

  // Helper: addAffiliate filter will append a site-wide affiliate tag if configured
  eleventyConfig.addFilter("addAffiliate", function(url) {
    try {
      if(!url) return url;
      const tag = (siteData && siteData.affiliate_tag) ? siteData.affiliate_tag.trim() : "";
      if(!tag) return url;
      const sep = url.indexOf('?') === -1 ? '?' : '&';
      if(url.indexOf(tag) !== -1) return url;
      return url + sep + tag;
    } catch(e) {
      return url;
    }
  });

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

  // Authors collection derived from authors.json and books.json
  eleventyConfig.addCollection("authors", function(collectionApi) {
    return (authorsData || []).map(author => {
      // find books by this author (match by name)
      const books = (booksData.books || []).filter(b => (b.authors || []).indexOf(author.name) !== -1);
      return Object.assign({}, author, { books });
    });
  });

  // Posts collection (from src/blog frontmatter files)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.njk").sort(function(a,b){
      return new Date(b.data.date) - new Date(a.data.date);
    });
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
