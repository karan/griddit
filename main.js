var gridster;

$(function() {

  // $('.cell').css("width", $(window).innerWidth / 3 + "px");
  // $(window).resize(function() {
  //   $('.cell').css("width", $(window).innerWidth / 3 + "px");
  // });

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
    var temp = "<div class='cell' style='width:{width}px;height:{height}px;background-image:url({img})'></div>";
    var w = 1, html = '';
    for (var i = 0; i < posts.length; ++i) {
      var n = new Image();
      n.src = posts[i].img_src;
      var ratio = n.width / ($(window).innerWidth() / 3);
      w = $(window).innerWidth() / 3;
      h = n.height / ratio;
      html += temp.replace("{height}", h).replace("{width}", w).replace("{img}", posts[i].img_src);
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
