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

});