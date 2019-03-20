'use strict';

var pathFn = require('path'),
    _ = require('lodash');

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
        result += '<li class="'+ checkIfActive(path, 'docs/'+category+'/') +'"><a href="/docs/'+ category + '/">' + title + '</a>';
        if(typeof menu == 'object'){
            result += '<ul class="sidebar-submenu">';
            _.each(menu, function(title, link) {
                if(menu[category] != title){
                    title = generateSidebarTitle(title);
                    result += '<li class="'+ checkIfActive(path, 'docs/'+category+'/'+link+'/') +'"><a href="/docs/'+ category +'/'+ link +'/">' + title + '</a></li>';
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
        s = string.replace(/-/g, " ");
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
    path = path.substring(0, path.lastIndexOf("/") + 1)
    if(path.indexOf(link)){
        return '';
    }else{
        return 'active';
    }
}