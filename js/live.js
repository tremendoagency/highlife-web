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

    $('.navbar-toggler').click(function() {
      $('.mobile-navbar').toggleClass('show');
      $('.navbar-toggler i').toggleClass('fa-times');
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
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false
      }
    });
    live.on('slideChangeTransitionStart', function () {
      $('#liveNav li').removeClass('active');
      $('#liveNav li').eq(live.realIndex).addClass('active');
    });
    live.on('slideChangeTransitionEnd', function () {
      var acs = document.querySelectorAll('.swiper-slide-active')[0];
    });
  
    $.instagramFeed({
      //'username': 'highlifebsas',
      'tag': 'highlifevirtual',
      'container': "#instafeed",
      'display_profile': false,
      'display_gallery': true,
      'items': 4,
      'items_per_row': 4,
      'margin': 0,
    });
    $(window).on('load', function () {
      $('.loader-wrapper').animate({top: '-100%'}, 2000, function() {
        $('#loader').animate({top: '-100%'}, 2000);
      });
    });
  
  })(jQuery); // End of use strict
  