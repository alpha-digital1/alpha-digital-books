module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets and downloads
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/downloads");

  // Load site data and books data
  const siteData = require("./src/_data/site.json");
  const booksData = require("./src/_data/books.json");

  // Helper: addAffiliate filter will append a site-wide affiliate tag if configured
  eleventyConfig.addFilter("addAffiliate", function(url) {
    try {
      if(!url) return url;
      const tag = (siteData && siteData.affiliate_tag) ? siteData.affiliate_tag.trim() : "";
      if(!tag) return url;
      // If url already has query params, append with &, otherwise ?
      const sep = url.indexOf('?') === -1 ? '?' : '&';
      // Avoid double-adding if tag already present
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
