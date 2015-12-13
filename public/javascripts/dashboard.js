$(document).ready(() => {

  $('.carousel').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    adaptiveHeight: true
  });

  $('.playable').click(function(){
    var videoID = $(this).children().first().attr("data-videoid");
    $('#yt-player').attr('src', '//www.youtube.com/embed/'+ videoID + '?autoplay=1');
    if($('#embed-yt-player').css('display') === 'none') {
      slidePlayerDown();
      flipShowPlayerButton(true);
    }

  });

  $('#hide-player').click(function(){
    if($('#embed-yt-player').css('display') === 'none') {
      slidePlayerDown();
      flipShowPlayerButton(true);
    }
    else {
      slidePlayerUp();
      flipShowPlayerButton(false);
    }

  });

  slidePlayerDown = function(callback) {
    if ($('#embed-yt-player').hasClass('hidden')) {
      $('#embed-yt-player').removeClass('hidden');
    }
    $('#embed-yt-player').slideDown(callback);
  };

  slidePlayerUp = function() {
    $('#embed-yt-player').slideUp(function() {
      $('#embed-yt-player').addClass('hidden');
    });
  };

  // if player is showing, button should display option to hide it
  // if player is hidden, button should display option to show it.
  flipShowPlayerButton = function(isPlayerShown) {
    if (isPlayerShown) {
      $('#hide-player').html("<strong>Hide Player </strong>");
      $('#hide-player').append("<span class='glyphicon glyphicon-eye-close'></span>");
    } else {
      $('#hide-player').html("<strong>Show Player </strong>");
      $('#hide-player').append("<span class='glyphicon glyphicon-eye-open'></span>");
    }
  };


});
