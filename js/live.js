(function($) {
    "use strict"; // Start of use strict
  
    $('#liveNav li a, .mobile-navbar a').on( "click", function(event){
      event.preventDefault();
      live.slideTo($(this).attr('data-slide'));
      $('.mobile-navbar').removeClass('show');
      $('.navbar-toggler i').removeClass('fa-times');
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
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows : true,
      },
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
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
    
    // Video

    
    const domain = 'meet.jit.si';
    const parentElement = document.querySelector("#video");
    const meetingName = 'TremendoLiveExample';
    var options = {
      roomName: meetingName,
      width: "100%",
      height: "100%",
      parentNode: parentElement,
      //configOverwrite: {
      //  prejoinPageEnabled: true,
      //  requireDisplayName: true,
      //},
      interfaceConfigOverwrite: {
        filmStripOnly: true
        //DEFAULT_BACKGROUND: '#FFFFFF',
        //VIDEO_QUALITY_LABEL_DISABLED: true,
        //LANG_DETECTION: true,
        //TOOLBAR_BUTTONS: ['tileview'],
        //SHOW_JITSI_WATERMARK: false,
        //JITSI_WATERMARK_LINK: 'https://jitsi.org',
        //SHOW_WATERMARK_FOR_GUESTS: false,
        //SHOW_BRAND_WATERMARK: false,
        //BRAND_WATERMARK_LINK: '',
        //SHOW_CHROME_EXTENSION_BANNER: false,
      }
    }
    const api = new JitsiMeetExternalAPI(domain, options);

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
  