/* global hexo */

'use strict';

var pathFn = require('path');
var _ = require('lodash');
var cheerio = require('cheerio');
var lunr = require('lunr');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var localizedPath = ['docs', 'api'];

function startsWith(str, start) {
  return str.substring(0, start.length) === start;
}

/* helper for pointing status channel link at relevant channel based on path */
hexo.extend.helper.register('join_status_chat', function() {
  var channel = 'status';
  /* not pretty but does the job */
  if (this.path.includes('keycard')) { 
    channel = 'status-keycard';
  }
  if (this.path.includes('nimbus')) { 
    channel = 'status-nimbus';
  }
  var url = `https://get.status.im/chat/public/${channel}`;
  return `<a href="${url}" class="button">Join Status Chat</a>`;
});

hexo.extend.helper.register('sidebar', function(type) {
    
  var self = this,
      path = this.page.path,
      sidebar = this.site.data.sidebar[type],
      result = '<ul class="sidebar-menu">';

  _.each(sidebar, function(menu, category) {
      var title = generateSidebarTitle(category);
      if(typeof menu[category] === 'undefined'){
        title = self.__(title);
      }else{
        title = generateSidebarTitle(menu[category]);
      }
      result += '<li class="'+ checkIfActive(path, category+'/') +'"><a href="/'+ category + '/">' + title + '</a>';
      if(typeof menu == 'object'){
          result += '<ul class="sidebar-submenu">';
          _.each(menu, function(title, link) {
              if(menu[category] != title){
                  title = generateSidebarTitle(title);
                  result += '<li class="'+ checkIfActive(path, category+'/'+link+'.html') +'"><a href="/'+ category +'/'+ link +'.html">' + title + '</a></li>';
              }
          });
          result += '</ul>';
      }
  });

  result += '</ul>';
  return result;
});

function generateSidebarTitle(string){
  var s = string.substring(
      string.lastIndexOf("(") + 1, 
      string.lastIndexOf(")")
  );
  if(s == ''){
    s = string.replace(/_/g, " ");
    s = s.replace(/.html/g, "");
    s = toTitleCase(s);
  }
  return s;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function checkIfActive(path, link){
  if(path.indexOf(link)){
      return '';
  }else{
      return 'active';
  }
}

hexo.extend.helper.register('header_menu', function(className) {
  var menu = this.site.data.menu;
  var result = '';
  var self = this;
  var lang = this.page.lang;
  var isEnglish = lang === 'en';

  _.each(menu, function(path, title) {
    if (!isEnglish && ~localizedPath.indexOf(title)) path = lang + path;

    result += '<a href="' + self.url_for(path) + '" class="' + className + '-link">' + self.__('menu.' + title) + '</a>';
  });

  return result;
});

hexo.extend.helper.register('canonical_url', function(lang) {
  var path = this.page.canonical_path;
  if (lang && lang !== 'en') path = lang + '/' + path;

  return this.config.url + '/' + path;
});

hexo.extend.helper.register('page_nav', function(lang) {
  return;
});

hexo.extend.helper.register('url_for_lang', function(path) {
  var lang = this.page.lang;
  var url = this.url_for(path);

  if (lang !== 'en' && url[0] === '/') url = '/' + lang + url;

  return url;
});

hexo.extend.helper.register('raw_link', function(path) {
  return 'https://github.com/status-im/docs.status.im/edit/develop/source/' + path;
});

hexo.extend.helper.register('page_anchor', function(str) {
  var $ = cheerio.load(str, {decodeEntities: false});
  var headings = $('h1, h2, h3, h4, h5, h6');

  if (!headings.length) return str;

  headings.each(function() {
    var id = $(this).attr('id');

    $(this)
      .addClass('article-heading')
      .append('<a class="article-anchor" href="#' + id + '" aria-hidden="true"></a>');
  });

  return $.html();
});

hexo.extend.helper.register('lunr_index', function(data) {
  var index = lunr(function() {
    this.field('name', {boost: 10});
    this.field('tags', {boost: 50});
    this.field('description');
    this.ref('id');

    _.sortBy(data, 'name').forEach((item, i) => {
      this.add(_.assign({ id: i }, item));
    });
  });

  return JSON.stringify(index);
});

hexo.extend.helper.register('canonical_path_for_nav', function() {
  var path = this.page.canonical_path;

  if (startsWith(path, 'docs/') || startsWith(path, 'api/')) {
    return path;
  }
  return '';

});

hexo.extend.helper.register('lang_name', function(lang) {
  var data = this.site.data.languages[lang];
  return data.name || data;
});

hexo.extend.helper.register('disqus_lang', function() {
  var lang = this.page.lang;
  var data = this.site.data.languages[lang];

  return data.disqus_lang || lang;
});

hexo.extend.helper.register('hexo_version', function() {
  return this.env.version;
});

function generateMenu(){
  return fetch('https://raw.githubusercontent.com/status-im/status-global-elements/master/dist/html/header.html')
  .then(function(response) {
      return response.text();
    })
  .then(function(response) {
      console.log('t2')
      return 'abc';
  })
  .catch(error => console.error(`Fetch Error =\n`, error));
}

hexo.extend.helper.register('global_header', function() {
  generateMenu().then(function(response){
    console.log(response);
    return response;
  });
  return 'asd';
});

hexo.extend.helper.register('recetly_updated_repos', function() {

  var html = '';
  
  // async function f() {
  //   await fetch('https://api.github.com/users/status-im/repos?sort=updated&per_page=3',{
  //     headers: new Headers({
  //       'Authorization': 'token a9f21ba81a2f47e7af17b58bb9b61488372c4020'
  //     })
  //   })
  //   .then(
  //     function(response) {
  //       if (response.status !== 200) {
  //         console.log('Looks like there was a problem. Status Code: ' +
  //           response.status);
  //         return;
  //       }

  //       response.json().then(function(data) {

  //         data.forEach(function(element) {
  //           html += '<li><a href="'+ element.html_url +'">'+ element.full_name +'</a></li>';
  //         });

  //         console.log(html);
  //         return html;

  //       });

  //     }
  //   )
  //   .catch(function(err) {
  //     console.log('Fetch Error :-S', err);
  //   });
  // }

  // f();

});