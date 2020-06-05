(function($) {
  "use strict"; // Start of use strict

  // Responsive Nav

  $('#navbar-toggler').click(function() {
    $(this).toggleClass('open');
    $('.mobile-navbar').toggleClass('show');
  });

  $('nav li a, .mobile-navbar a').on( "click", function(event){
    event.preventDefault();
    navigation.slideTo($(this).attr('data-slide'));
    $('.mobile-navbar').removeClass('show');
    $('#navbar-toggler').removeClass('open');
  });

  var navigation = new Swiper('.swiper-container', {
    speed: 1000,
    spaceBetween: 0,
    freeMode: true,
    slidesPerView: 'auto',
    grabCursor: true,
    navigation: {
      nextEl: '.move-right',
      prevEl: '.move-left',
    }
  });

  // $('.swiper-wrapper').mousemove(function(event){
  //   if (event.pageX <= $(window).width()/3){
  //     navigation.translateTo(navigation.width, 5000);
  //   }
  //   else if (event.pageX >= ($(window).width()/3)*2){
  //     navigation.translateTo(-navigation.width, 5000);
  //   }
  //   else{
  //     navigation.translateTo(navigation.getTranslate(), 0);
  //   }
  // });


})(jQuery); // End of use strict
