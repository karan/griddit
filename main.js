var gridster;

$(function(){

  // array of objects with link to image, post title, link to reddit
  var posts = [];
  $.get("http://api.reddit.com/r/pics/hot.json", function(data) {
    var arr = data.data.children;
    arr.forEach(function(post) {
      if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(post.data.url)) {
        posts.push({
          'title': post.data.title,
          'img_src': post.data.url,
          'permalink': 'http://reddit.com/' + post.data.permalink
        });
      }
    });
    buildGrid();
  });

  var buildGrid = function() {
    var temp = "<div class='cell' style='width:{width}px; height: {height}px;'><img src='{img}'/></div>";
    var w = 1, html = '', limitItem = posts.length;
    for (var i = 0; i < limitItem; ++i) {
      var n = new Image();
      n.src = posts[i].img_src;
      w = n.width / 5;
      h = n.height / 5;
      html += temp.replace(/\{height\}/g, h).replace(/\{width\}/g, w).replace(/\{img\}/g, posts[i].img_src);
    }
    $("#freewall").html(html);
    
    var wall = new freewall("#freewall");
    wall.reset({
      selector: '.cell',
      animate: true,
      cellW: 20,
      cellH: 200,
      onResize: function() {
        wall.fitWidth();
      }
    });
    wall.fitWidth();
    // for scroll bar appear;
    $(window).trigger("resize");
  }

});
