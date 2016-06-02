var scraperElement1 ={
  name: 'element1',
  domSelector: "HTML>BODY>DIV>MAIN>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>ARTICLE>DIV>DIV>H2",
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
  domSelector: 'HTML>BODY>DIV>MAIN>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>ASIDE>DIV>DIV>UL>LI',
  selectorIndex: 2,
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




var page = {
  title: 'msnbc',
  url: 'http://www.msnbc.com',
  targetElements: [scraperElement1, scraperElement2]

};

var scraperElement3 ={
  name: 'element1',
  domSelector: 'HTML>BODY>DIV>DIV>DIV>DIV>UL>LI',
  selectorIndex: 1,
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

var scraperElement4 ={
  name: 'element1',
  domSelector: 'HTML>BODY>DIV>DIV>DIV>DIV>UL>LI',
  selectorIndex: 2,
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


var page2 = {
  title: 'amazon',
  url: "https://www.amazon.com/b/ref=br_pdt_mgUpt?_encoding=UTF8&node=2858778011",
  targetElements: [scraperElement3, scraperElement4]

};
module.exports = [page, page2];
