$(document).ready(function ($) {
    $('.gallery-image img').each(function(index, el) {
        var container = $(this).closest('.gallery-image');
        var width = $(this)[0].naturalWidth;
        var height = $(this)[0].naturalHeight;
        var ratio = width / height;
        container.attr('style', 'flex: ' + ratio + ' 1 0%');
    });
});