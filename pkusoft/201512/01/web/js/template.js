
var $template = {};

$template.data = data;

$template.simple = '\
    <div class="property-center">\
        <h1 class="center-heading">${center}</h1>\
        <div class="center-body">\
            <div class="property-area active js--area-heading">\
                <h2 class="area-heading js--area-heading">${area}<span class="badge">${spaceAmount}</span></h2>\
                <ul class="space-list">\
                    <li class="space-item active js--space">\
                        <table>\
                            <tr>\
                                <td class="space-icon"><img src="images/icon_wardrobe.png" alt=""></td>\
                                <td class="space-info">\
                                    <h3 class="name">${name}</h3>\
                                    <div class="progress">\
                                        <div class="progress-inner" style="width: ${percent}%;">${percent}%</div>\
                                    </div>\
                                    <div class="brief">存放数 ${quantity}，最大存放数 ${capacity}</div>\
                                </td>\
                            </tr>\
                        </table>\
                    </li>\
                </ul>\
            </div>\
        </div>\
    </div>\
';
$template.center = '\
    <div class="property-center">\
        <h1 class="center-heading">${center}</h1>\
        <div class="center-body">${_data}</div>\
    </div>\
';
$template.area = '\
    <div class="property-area">\
        <h2 class="area-heading js--area-heading">${area}<span class="badge">${spaceAmount}</span></h2>\
        <ul class="space-list">${_data}</ul>\
    </div>\
';
$template.space = '\
    <li class="space-item js--space">\
        <table>\
            <tr>\
                <td class="space-icon"><img src="images/icon_${icon}.png" alt=""></td>\
                <td class="space-info">\
                    <h3 class="name">${space}</h3>\
                    <div class="progress">\
                        <div class="progress-inner" style="width: ${percent}%;">${percent}%</div>\
                    </div>\
                    <div class="brief">存放数 ${quantity}，最大存放数 ${capacity}</div>\
                </td>\
            </tr>\
        </table>\
    </li>\
';