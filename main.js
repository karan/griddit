var gridster;

$(function() {

  // the name of the last added post
  var last_added = '';

  // array of names of things on page
  // var onPagePosts = [];

  // array of objects with link to image, post title, link to reddit
  var posts = [];

  // to control the flow of loading during scroll
  var scrollLoad = true;

  var requestData = function() {
    posts = [];
    $.get("http://api.reddit.com/r/pics/top.json?t=week&after="+last_added, function(data) {
      var arr = data.data.children;
      arr.forEach(function(post) {
        if (!post.data.is_self && (/\.(gif|jpg|jpeg|tiff|png)$/i).test(post.data.url)) {
          posts.push({
            'title': post.data.title,
            'img_src': post.data.url,
            'name': post.data.name,
            'permalink': 'http://reddit.com/' + post.data.permalink
          });
          // onPagePosts.push(post.data.name);
        }
        last_added = post.data.name;
      });
      scrollLoad = true;
      buildGrid();
    });
  }

  var buildGrid = function() {
    var temp = "<div class='cell' style='width:{width}px;height:{height}px;background-image:url({img})'></div>";
    var w = 1, html = '';
    for (var i = 0; i < posts.length; i++) {
      var n = new Image();
      n.src = posts[i].img_src;
      var ratio = n.width / ($(window).innerWidth() / 3);
      w = $(window).innerWidth() / 3;
      h = n.height / ratio;
      html += temp.replace("{height}", h).replace("{width}", w).replace("{img}", posts[i].img_src);
    }
    $("#freewall").append(html);
    
    var wall = new freewall("#freewall");
    wall.reset({
      selector: '.cell',
      animate: true,
      cellW: 160,
      cellH: 160,
      onResize: function() {
        wall.fitWidth();
      }
    });
    wall.fitWidth();

    // for scroll bar appear;
    $(window).trigger("resize");
  }

  // infinite scroll
  $(window).scroll(function () { 
    if (scrollLoad && $(window).scrollTop() >= $(document).height() - $(window).height() - 50) {
      scrollLoad = false;
      requestData();
    }
  });

  requestData();

});
