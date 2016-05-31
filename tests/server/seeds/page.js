var scraperElement1 ={
  name: 'element1',
  domSelector: "HTML>BODY>DIV>MAIN>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>ARTICLE>DIV>DIV>H2>DIV",
  selectorIndex: 0,
  fields: JSON.stringify({
    link: {
      index: 0,
      attr: 'href',
      type: 'a'
    },
    content: {
      index: 1,
      attr: 'text',
      type: 'a'
    }
  })
};
var scraperElement2 ={
  name: 'element2',
  domSelector: "HTML>BODY>DIV>MAIN>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>ARTICLE>DIV>H2>DIV",
  selectorIndex: 0,
  fields: JSON.stringify({
    link: {
      index: 0,
      attr: 'href'
    },
    content: {
      index: 1,
      attr: 'text'
    }
  })
};


var page = {
  title: 'test page',
  url: 'http://msnbc.com',
  targetElements: [scraperElement1, scraperElement2]

};
module.exports = page;
