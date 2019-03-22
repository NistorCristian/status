$(document).ready(function ($) {

  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  mobileMenu(w);
  mobileFooterMenu(w);

  $(window).on('resize', function(event) {
      w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      mobileMenu(w);
      mobileFooterMenu(w);
  });

  $('.about-mission .inner .inline-links a').on('click', function () {
      var id = $(this).attr('href');
      $('html, body').animate({
          scrollTop: $(id).offset().top + 5
      }, 500);
      return false;
  });

  function mobileMenu(w){
      if(w < 1199){
          $('header nav, header .btns').appendTo('.mobile-nav');
      }else{
          $('.mobile-nav nav, .mobile-nav .btns').insertBefore('.mobile-nav-trigger');
      }
  }

  function mobileFooterMenu(w){
      if(w < 768){
          $('footer .navigation h5 a').attr('aria-expanded', 'false').addClass('collapsed');
          $('footer .collapse').removeClass('show');
      }else{
          $('footer .navigation h5 a').attr('aria-expanded', 'true').removeClass('collapsed');
          $('footer .collapse').addClass('show');
      }
  }

  $('.mobile-nav-trigger-close, .mobile-nav-trigger').on('click', function (event) {
      event.preventDefault();
      $('body').toggleClass('nav-active');
  });

  try {
      highlight();
  } catch(err) {
      setTimeout(function() {
          highlight();
      }, 2500)
  }

  function highlight() {
      $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
      });
  }

  if($('.recently-updated').length){

    var html = '';
    
    if (typeof Cookies.get('recently-updated') !== "undefined") {
      $('.recently-updated').append(Cookies.get('recently-updated'));
    }else{
      fetch('https://api.github.com/users/status-im/repos?sort=updated&per_page=3',{
        headers: new Headers({
          'Authorization': 'token a9f21ba81a2f47e7af17b58bb9b61488372c4020'
        })
      })
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
    
          response.json().then(function(data) {
    
            data.forEach(function(element) {
              html += '<li><a href="'+ element.html_url +'">'+ element.full_name +'</a></li>';
            });
    
            Cookies.set('recently-updated', html, { expires: 1 });
            $('.recently-updated').append(html);
    
          });
    
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    }

  }

});