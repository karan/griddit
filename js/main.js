$(function() {

  // the name of the last added post
  var last_added = '';
  
  // to control the flow of loading during scroll
  var scrollLoad = true;

  var q = 'cats';

  function getOneHtml(post, w) {
    var outerDiv = $("<div>", {class: "brick"});
    outerDiv.width(w);

    var img = $("<img />");
    img.attr("src", post.img_src);

    img.on('load', function() {
      var ratio = this.width / w;
      h = this.height / ratio;
      $(this).css({'height': h});

      outerDiv.append("<a href='" + post.permalink + "' target='_blank'>" + this.outerHTML + "</a>");

      // return outerDiv[0].outerHTML;
      $("#grid").append(outerDiv[0].outerHTML);
    });
  }


  function requestData(subreddit, callback) {
    // array of objects with link to image, post title, link to reddit
    posts = [];

    var w = $(window).innerWidth() / 3, 
        html = '';

    $.ajax({
      type: 'get',
      url: "http://api.reddit.com/r/" + subreddit + "/hot.json?&after="+last_added,
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
              'img_src': res_post.data.url,
              'name': res_post.data.name,
              'permalink': 'http://reddit.com' + res_post.data.permalink
            };

            getOneHtml(post, w);
            
          }
          last_added = res_post.data.name;
        });

        scrollLoad = true;
        callback();
      }
    });
  }

  function makeWall() {
    var wall = new freewall("#grid");
    wall.reset({
      selector: '.brick',
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
      requestData(q, makeWall);
    }
  });

  requestData(q, makeWall);

  $('#searchterm').keypress(function(event) {
    if (event.which == 13) {
      $("#grid").empty();
      last_added = '';

      // ga('send', 'event', 'input', 'search');
      event.preventDefault();
      q = $("#searchterm").val();
      console.log(q);
      requestData(q, makeWall);
    }

  });

  $("#help").click(function() {
    $("#openModal").modal({
      fadeDuration: 250
    });
    return false;
  });

});