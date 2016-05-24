var cheerio = require('cheerio');

var STYLE =
`<style type="text/css">
  .elem-highlight:hover{
    border: solid red !important;
  }
</style>`;

function inject(html){
  var $ = cheerio.load(html);
  //Grab text and image elements
  var elements = $('span, img, a, h3, img');
  elements.each(function(elem){
    $(this).addClass('elem-highlight');
  });
  //inject css
  $('head').append(STYLE);
  return $.html();
}

module.exports = inject;
