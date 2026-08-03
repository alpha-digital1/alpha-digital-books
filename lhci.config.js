module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/books/',
        'http://localhost:8080/blog/',
        'http://localhost:8080/categories/'
      ],
      numberOfRuns: 3,
      startServerCommand: 'npm run dev'
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
