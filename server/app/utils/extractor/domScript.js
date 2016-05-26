module.exports =
  function() {
        $(".elem-highlight").on("click", function(e) {
          e.preventDefault();
          var selector = $(this)
            .parents()
            .map(function() { return this.tagName; })
            .get()
            .reverse()
            .concat([this.nodeName])
            .join(">");

          var id = $(this).attr("id");
          if (id) {
            selector += "#"+ id;
          }

          var classNames = $(this).attr("class");
          if (classNames) {
            selector += "." + $.trim(classNames).replace(/\s/gi, ".");
          }
          var data = [];
          var subelems = $(this).find('a, span, h2, p, img');
          subelems.each(function(elem){
            var tag = $(this).prop('tagName');
            if (tag==='A')
              data.push({type: 'link', data: $(this).attr('href')});
            else if (tag === 'IMG')
              data.push({type: 'image', data: $(this).attr('src')});
            if ($(this).text())
              data.push({type: 'content', data: $(this).text()});

          });
          // var data = $(this).text();
          // var link;
          // var firstChild = $($(this).children()[0]);
          // if (firstChild.prop('tagName')==='IMG')
          //   data = firstChild.attr('src');
          // if (firstChild.prop('tagName')==='A')
          //   link = firstChild.attr('href');
          var rtn = {selector: selector, data: data};
          window.parent.messenger.set(rtn);
          //alert(selector);
      });
    };
