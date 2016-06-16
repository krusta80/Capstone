module.exports = function(pageId) {
  return {
    title: 'my test project',
    jobs: [{
      title: 'Product watcher',
      description: 'watches the fluctuations of price for a certain product over a period of time',
      pages: [pageId]
    }]
  };
};
