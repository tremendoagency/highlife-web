(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 56
  });

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

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 150) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  //swiper

  var artists = new Swiper('#guide .swiper-container', {
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

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
