(function($) {
    "use strict"; // Start of use strict
  
    $('#liveNav li a').on( "click", function(event){
      event.preventDefault();
      live.slideTo($(this).attr('data-slide'));
    });
  
    $('.lightmode').on( "click", function(event){
      var $el = $('body').toggleClass('night');
      if ($el.hasClass('night')) {
        $('.chat iframe').attr('src', 'https://www.twitch.tv/embed/highlifebsas/chat?darkpopout');
      }
      else{
        $('.chat iframe').attr('src', 'https://www.twitch.tv/embed/highlifebsas/chat');
      }
    });
  
    //swiper
  
    var live = new Swiper('#live .swiper-container', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 70,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows : true,
      },
      pagination: {
        el: '.swiper-pagination',
      }
    });
    live.on('slideChangeTransitionStart', function () {
      $('#liveNav li').removeClass('active');
      $('#liveNav li').eq(live.realIndex).addClass('active');
    });
  
    $.instagramFeed({
      'username': 'highlifebsas',
      'tag': 'highlifevirtual',
      'container': "#instafeed",
      'display_profile': false,
      'display_gallery': true,
      'items': 3,
      'items_per_row': 3,
      'margin': 0
    });
    $(window).on('load', function () {
      $('.loader-wrapper').animate({top: '-100%'}, 10, function() {
        $('#loader').animate({top: '-100%'}, 300);
      });
    });
  
  })(jQuery); // End of use strict
  