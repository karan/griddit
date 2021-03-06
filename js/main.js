$(function() {

  // the name of the last added post
  var last_added = '';
  
  // to control the flow of loading during scroll
  var scrollLoad = true;

  var q = 'cats';

  function getAllHtml(posts, callback) {
    var html = '';
    var w = $(window).innerWidth() / 3;
    for (var i = 0; i < posts.length; i++) {
      html += getOneHtml(posts[i], w);
    }
    callback(html);
  }

  function getOneHtml(post, w) {
    var outerDiv = $("<div>", {class: "brick"});
    outerDiv.width(w);

    var img = $("<img />");
    img.attr("src", post.img_src);
    img.css({"width": w+"px"});

    outerDiv.append("<a href='" + post.permalink + "' target='_blank'>" + img[0].outerHTML + "</a>");
    return outerDiv[0].outerHTML;
  }


  function requestData(subreddit, callback) {
    ga('send', 'event', 'input', 'redditApiCall');
    // array of objects with link to image, post title, link to reddit
    posts = [];

    $.ajax({
      type: 'get',
      url: "http://api.reddit.com/r/" + subreddit + "/hot.json?limit=20&after="+last_added,
      beforeSend: function() {
        $("#searchterm").addClass("loadinggif");
      },
      complete: function() {
        $("#searchterm").removeClass("loadinggif");
      },
      success: function(data) {
        var arr = data.data.children;

        arr.forEach(function(res_post) {
          if (!res_post.data.is_self && (/\.(gif|jpg|jpeg|tiff|png)$/i).test(res_post.data.url)) {          
            var post = {
              'title': res_post.data.title,
              'img_src': "http://i.embed.ly/1/image/resize?url=" + res_post.data.url + "&key=92b31102528511e1a2ec4040d3dc5c07&width=" + ($(window).innerWidth() / 4),
              'name': res_post.data.name,
              'permalink': 'http://reddit.com' + res_post.data.permalink
            };

            posts.push(post);
            last_added = res_post.data.name;
          }
        });

        scrollLoad = true;
        callback(posts);
      }
    });
  }

  function makeWall(allhtml) {
    $("#grid").append(allhtml);

    var wall = new freewall("#grid");
    wall.reset({
      selector: '.brick',
      animate: true,
      cellW: 160,
      cellH: 'auto',
      onResize: function() {
        wall.fitWidth();
      }
    });
    wall.container.find('.brick img').load(function() {
      wall.fitWidth();
    });

    // for scroll bar appear;
    $(window).trigger("resize");
  }

  function newSearch(q) {
    ga('send', 'event', 'input', 'newSearch-call');

    window.location.hash = q;

    requestData(q, function(posts) {
      getAllHtml(posts, function(allhtml) {
        makeWall(allhtml);
      });
    });
  }

  // infinite scroll
  $(window).scroll(function () { 
    if (scrollLoad && $(window).scrollTop() >= $(document).height() - $(window).height() - 50) {
      ga('send', 'event', 'input', 'scroll');
      scrollLoad = false;
      newSearch(q);
    }
  });

  var hash = window.location.hash;
  if (!hash) {
    newSearch(q);
  } else {
    newSearch(hash.substr(1));
  }

  $('#searchterm').keypress(function(event) {
    if (event.which == 13) {
      ga('send', 'event', 'input', 'search');
      $("#grid").empty();
      last_added = '';
      event.preventDefault();
      q = $("#searchterm").val();
      newSearch(q);
    }

  });

  $("#help").click(function() {
    ga('send', 'event', 'input', 'modal');
    $("#openModal").modal({
      fadeDuration: 250
    });
    return false;
  });

});
