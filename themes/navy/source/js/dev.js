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
      $('.editor-content pre code').each(function(i, block) {
          hljs.highlightBlock(block);
      });
  }

  if($('.recently-updated').length){

    var html = '';
    
    if (typeof Cookies.get('recently-updated') !== "undefined") {
      $('.recently-updated').append(Cookies.get('recently-updated'));
    }else{
      fetch('https://api.github.com/users/status-im/repos?sort=updated&per_page=3')
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

  if($('#advocacy-programs').length){
    function retrieveAdvocacyPrograms() {
      $.ajax({
        type: 'get',
        url: 'https://statusphere.status.im/api/v1/boards/public/?is_featured=true&org=375',
        success: function (response) {
          $.each(response, function (index, program) {
            var description = program.description.substr(0, 200) + '...';
            $('#advocacy-programs').prepend(`<div class="inner">
                <a href="https://statusphere.status.im/b/${program.uuid}/view" class="card-inner">
                  ${program.title}
                </a>
                <p class="details">${description}</p>
              </div>`);
          });
        }
      });
    }
  
    retrieveAdvocacyPrograms();
  
  }

  $(".sidebar").stick_in_parent({
    offset_top: 30
  });

  if($('input[name="userSearch"]').length){
    window.addEventListener('click', function(e){   
      if (document.getElementById('search-form').contains(e.target)){
          $('#search-form').removeClass('inactive');
      } else{
          $('#search-form').addClass('inactive');
      }
    });
    $('input[name="userSearch"]').on('keyup', function () {
      var val = $(this).val();
      $('#search-results').empty();
      $.ajax({
        url: "https://search.status.im/status.im/_search?size=10&_source=title,url&&q=" + val,
      })
      .done(function(results) {
        $.each(results.hits.hits, function (index, value) { 
          $('<a href="'+ value._source.url +'">'+ value._source.title +'</a>').appendTo('#search-results');
        });
      });
    });
  }

  $('.features-intro ul li a').on('click', function (event) {
    event.preventDefault();
    var id = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(id).offset().top
    }, 300);
  });

  if($('.home-intro .announcement').length){
    $.ajax({
      url: "https://our-status.hauntedthemes.com/ghost/api/v2/content/posts/?key=c6717eab3d9a3e6be361980f66&limit=1&fields=title,url"
    })
    .done(function(results) {
      $('.home-intro .announcement b').text(results.posts[0].title);
      $('.home-intro .announcement').attr('href', results.posts[0].url).removeClass('inactive');
    });
  }

  $('.sidebar-mobile-trigger, .mobile-sidebar-trigger-close').on('click', function (event) {
    event.preventDefault();
    $('body').toggleClass('sidebar-active');
  });

});