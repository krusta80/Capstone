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
          function makeSubElems(elem){
          var data = [];
          var subelems = elem.find('a, span, h2, p, img');
          subelems.each(function(){
            var tag = $(this).prop('tagName');
            if (tag==='A')
              data.push({type: 'link', data: $(this).attr('href')});
            else if (tag === 'IMG')
              data.push({type: 'image', data: $(this).attr('src')});
            if ($(this).text())
              data.push({type: 'content', data: $(this).text()});
            });
            return data;
          }
          var rtn;
          if (!window.parent.messenger.isMultiple()){
            var idx = $(selector).index(this);
            rtn = {selector: selector, data: makeSubElems($(this)), index: idx, multiple: false};
          }
          else{
            var siblings = $(selector);
            var data = [];
            siblings.each(function(){
              data.push(makeSubElems($(this)));
            });
            rtn = {selector: selector, data: data, multiple: true};
          }
          window.parent.messenger.set(rtn);
          //alert(selector);
      });
    };
