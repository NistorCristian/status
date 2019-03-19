'use strict';

var pathFn = require('path'),
    _ = require('lodash');

hexo.extend.helper.register('sidebar', function(type) {
    
    var self = this,
        path = this.page.path,
        sidebar = this.site.data.sidebar[type],
        result = '<ul class="sidebar-menu">';

    _.each(sidebar, function(menu, title) {
        result += '<li><a href="/docs/'+ title + '">' + self.__(title) + '</a>';
        if(typeof menu == 'object'){
            result += '<ul class="sidebar-submenu">';
            _.each(menu, function(submenu, subtitle) {
                result += '<li><a href="/docs/">' + subtitle + '</a></li>';
            });
            result += '</ul>';
        }
    });

    result += '</ul>';
    return result;
});