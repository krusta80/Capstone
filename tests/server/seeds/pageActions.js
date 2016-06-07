// var scraperElement1 = {
//   name: 'multipage scraperElement',
//   domSelector: 'div.s-item-container',
//   selectorIndex: 0,
//   fields: JSON.stringify({
//     link: {
//       index: 0,
//       attr: 'href'
//     },
//     image: {
//       index: 0,
//       attr: 'src'
//     },
//     content: {
//       index: 0,
//       attr: 'text',
//       type: 'h2'
//     },
//     price: {
//       index: 5,
//       attr: 'text',
//       type: 'span'
//     }
//   })
// };
var scraperElement1 = {
  name: 'multipage scraperElement',
  domSelector: '#result_0 > div > div > div > div.a-fixed-left-grid-col.a-col-right > div:nth-child(3) > div.a-column.a-span7 > div.a-row.a-spacing-none > a > span',
  selectorIndex: 0,
  fields: JSON.stringify({
    field0: {
      index: 0,
      attr: 'class'
    },
    field1:{
      index: -1,
      attr: 'content'
    }

  })
};

var scraperElement2 = {
  name: 'scraper element 2',
  domSelector: '#result_0 > div > div > div > div.a-fixed-left-grid-col.a-col-right > div:nth-child(3) > div.a-column.a-span7',
  selectorIndex: 0,
  fields: JSON.stringify({
    field0: {
      index: 0,
      attr: 'class'
    },
    field1: {
      index: 1,
      attr: 'text'
    },
    field2: {
      index: 2,
      attr: 'text'
    },
    field3: {
      index: -1,
      attr: 'content'
    }
  })
};

var page = {
  title: 'amazon with pre-actions',
  url: 'https://www.amazon.com',
  targetElements: [scraperElement2],
  actions: JSON.stringify([
    {fn: 'type', params: ["input[name='field-keywords']", 'echo']},
    {fn: 'click', params: ["input[class='nav-input']"]}
  ]),
  paginate: false,
  paginateSelector: '#pagnNextLink',
  maxPages: 1
};

module.exports = page;
