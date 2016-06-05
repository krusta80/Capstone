var scraperElement1 = {
  name: 'multipage scraperElement',
  domSelector: 'div.s-item-container',
  selectorIndex: 0,
  fields: JSON.stringify({
    link: {
      index: 0,
      attr: 'href',
      type: 'a'
    },
    image: {
      index: 0,
      attr: 'src',
      type: 'img'
    },
    content: {
      index: 0,
      attr: 'text',
      type: 'h2'
    },
    price: {
      index: 5,
      attr: 'text',
      type: 'span'
    }
  })
};

var page = {
  title: 'amazon with pre-actions',
  url: 'https://www.amazon.com',
  targetElements: [scraperElement1],
  actions: JSON.stringify([
    {fn: 'type', params: ["input[name='field-keywords']", 'echo']},
    {fn: 'click', params: ["input[class='nav-input']"]}
  ]),
  paginate: true,
  paginateSelector: '#pagnNextLink',
  maxPages: 3
};

module.exports = page;
