(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$(document).ready(function ($) {

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    mobileMenu(w);
    mobileFooterMenu(w);

    $(window).on('resize', function (event) {
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

    function mobileMenu(w) {
        if (w < 1199) {
            $('header nav, header .btns').appendTo('.mobile-nav');
        } else {
            $('.mobile-nav nav, .mobile-nav .btns').insertBefore('.mobile-nav-trigger');
        }
    }

    function mobileFooterMenu(w) {
        if (w < 768) {
            $('footer .navigation h5 a').attr('aria-expanded', 'false').addClass('collapsed');
            $('footer .collapse').removeClass('show');
        } else {
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
    } catch (err) {
        setTimeout(function () {
            highlight();
        }, 2500);
    }

    function highlight() {
        $('.editor-content pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    }

    if ($('.recently-updated').length) {

        var html = '';

        if (typeof Cookies.get('recently-updated') !== "undefined") {
            $('.recently-updated').append(Cookies.get('recently-updated'));
        } else {
            fetch('https://api.github.com/users/status-im/repos?sort=updated&per_page=3').then(function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                response.json().then(function (data) {

                    data.forEach(function (element) {
                        html += '<li><a href="' + element.html_url + '">' + element.full_name + '</a></li>';
                    });

                    Cookies.set('recently-updated', html, { expires: 1 });
                    $('.recently-updated').append(html);
                });
            }).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        }
    }

    if ($('#advocacy-programs').length) {
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
});

},{}]},{},[1])
//# sourceMappingURL=main.js.map
