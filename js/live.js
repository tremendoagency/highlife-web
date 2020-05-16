(function($) {
    "use strict"; // Start of use strict
  
    $('#liveNav li a').on( "click", function(event){
      event.preventDefault();
      live.slideTo($(this).attr('data-slide'));
    });
  
    $('.lightmode').on( "click", function(event){
      nightShift();
    });

    $('.navbar-toggler').click(function() {
      $('.mobile-navbar').toggleClass('show');
      $('.navbar-toggler i').toggleClass('fa-times');
    });
  
    //swiper
  
    var live = new Swiper('#live .swiper-container', {
      speed: 1000,
      grabCursor: true,
      parallax: true,
      centeredSlides: true,
      slidesPerView: '1',
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
      innerSlides();
    });
    function innerSlides(){
      var navSlide = $('.nav-slide.swiper-slide-active').eq(0);
      if (navSlide.hasClass('has-inner')){
        var innerSlide = navSlide.attr('data-inner');
        console.log(innerSlide);
        setTimeout(innerSlide.swiper.slideNext(), 2000);
      }
    }
  
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
      $('.loader-wrapper').animate({left: '-100%'}, 2000, function() {
        $('#loader').animate({left: '-100%'}, 2000);
      });
    });
    function changeHandler(e) {
      if ($('body').hasClass('night')) {
        $('.lightmode').click();
      }
    }
    function nightShift(){
      var $el = $('body').toggleClass('night');
      if ($el.hasClass('night')) {
        $('.chat iframe').attr('src', 'https://www.twitch.tv/embed/highlifebsas/chat?darkpopout');
      }
      else{
        $('.chat iframe').attr('src', 'https://www.twitch.tv/embed/highlifebsas/chat');
      }
    }
   
    document.addEventListener("fullscreenchange", changeHandler, false);
    document.addEventListener("webkitfullscreenchange", changeHandler, false);
    document.addEventListener("mozfullscreenchange", changeHandler, false);
    
  })(jQuery); // End of use strict
  