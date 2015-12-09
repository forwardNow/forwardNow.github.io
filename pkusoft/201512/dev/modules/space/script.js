define( [ "require", "Sizzle", "utils" ], function ( require, Sizzle, utils ) {

    var forEach = utils.each,
        addEvent = utils.addEvent,
        classList = utils.classList;


    var property = {
        doc: document,
        imgDir: require.toUrl( "./space/images" ).replace("script/", ""),
        cssUrl: require.toUrl( "./space/style.css" ).replace("script/", ""),
        options: {
            gap: "10px",
            spaceNum: 5,
            hasIcon: true
        },
        data: {
            template: {
                data: {},
                center: "",
                area: "",
                space: ""
            }
        },
        init: function () {
            this.container = Sizzle( ".js--container" )[ 0 ];
            this.loadCss( this.cssUrl )
                .getOptions()
                .interpret()
                .render()
                .bind();
            return this;
        },
        render: function () {

            var gap = this.options.gap,
                spaceNum = this.options.spaceNum,
                hasIcon = this.options.hasIcon,
                contentWidth,
                spaceWidth,
                iconWidth
                ;
            this.container = Sizzle(".js--container")[0];
            this.areaHeadings = Sizzle( ".js--area-heading" );
            this.spaces = Sizzle( ".js--space" );
            this.spaceIcons = Sizzle(".js--container .space-icon");
            this.spaceBriefs = Sizzle(".js--space .brief");

            gap = parseInt(gap) || 10;
            spaceNum = parseInt(spaceNum) || 4;
            contentWidth = parseInt(this.container.style.width) - 60 || 640;
            spaceWidth = Math.floor( contentWidth / spaceNum - gap );
            iconWidth = spaceWidth *  0.25;

            if ( hasIcon === "false" ) {
                utils.each(this.spaceIcons,function(index,elt){
                    elt.style.display = "none";
                });
                iconWidth = 0;
            }

            utils.each( this.spaces, function(index, elt) {
                elt.style.width = spaceWidth + "px";
                elt.style.marginRight = (gap - 1) + "px";
            } );
            utils.each( this.spaceBriefs, function(index, elt) {
                elt.style.width = spaceWidth - iconWidth + "px";
            } );

            return this;
        },
        getOptions: function() {
            var optionString = this.container.getAttribute("data-options") + "",
                pairs,
                prop,
                value,
                trim = utils.trim,
                self = this;

            pairs = optionString.split(";");

            utils.each(pairs, function(index, pair) {
                pair = utils.trim(pair);
                if ( pair === "" ) {
                    return;
                }
                pair = pair.split(":");
                if ( pair.length !== 2) {
                    return;
                }
                prop = trim( pair[0] );
                value = trim( pair[1] );
                self.options[prop] = value;
            });

            return this;
        },
        interpret: function () {
            var self = this,
                template = this.data.template,
                data = template.data,
                html = "",
                centerList,
                areaList,
                spaceList;


            // center
            centerList = data.centerList;
            forEach( centerList, function ( index, center ) {
                var centerTemp = template.center,
                    centerInner = "";
                centerTemp = replace( centerTemp, "center", center.center );

                // area
                areaList = center.areaList;
                forEach( areaList, function ( index, area ) {
                    var areaTemp = template.area,
                        areaInner = "";
                    areaTemp = replace( areaTemp, "area", area.area );
                    areaTemp = replace( areaTemp, "spaceAmount", area.spaceAmount );

                    // space
                    spaceList = area.spaceList;
                    forEach( spaceList, function ( index, space ) {
                        var spaceTemp = template.space,
                            percent = Math.round( space.quantity / space.capacity * 100 );
                        spaceTemp = replaceExt( {
                            "target": spaceTemp,
                            "pairs": {
                                "space": space.space,
                                "quantity": space.quantity,
                                "capacity": space.capacity,
                                "percent": percent,
                                "icon": space.icon || "default"
                            }
                        } );

                        if ( percent == 0 ) {
                            spaceTemp = spaceTemp.replace( 'class="progress-inner"', 'class="progress-inner progress-empty"' );
                        }

                        areaInner += spaceTemp;
                    } );
                    areaTemp = replace( areaTemp, "_data", areaInner );
                    centerInner += areaTemp;
                } );

                centerTemp = replace( centerTemp, "_data", centerInner );
                html += centerTemp;

            } );

            self.container.innerHTML = html;


            function replace( target, placeholder, value ) {
                return target.replace( new RegExp( "\\$\\{\\s*" + placeholder + "\\s*\\}", "g" ), value );
            }

            /* options = {
                 target: "",
                 pairs: {
                     placeholder1: val1,
                     placeholder2: val2
                 }
             }
             */
            function replaceExt( options ) {
                var target = options.target,
                    pairs = options.pairs;
                for ( var placeholder in pairs ) {
                    if ( ! pairs.hasOwnProperty(placeholder) ) continue;
                    target = replace( target, placeholder, pairs[ placeholder ] );
                }
                return target;
            }

            return this;
        },
        bind: function () {
            var areaHeadings = this.areaHeadings,
                spaces = this.spaces;

            // 点击标题进行折叠
            forEach( areaHeadings, function ( index, elt ) {
                addEvent( elt, "click", function () {
                    classList( this.parentNode ).toggle( "active" );
                } );
            } );
            // 只能选择一个条目
            forEach( spaces, function ( index, elt ) {
                addEvent( elt, "click", function () {
                    forEach( spaces, function () {
                        classList( this ).remove( "active" );
                    } );
                    classList( this ).add( "active" );
                } );
            } );

            return this;
        },
        loadCss: function ( url ) {
            utils.dynamicLoad.css( url || "style.css", this.doc );
            return this;
        }
    };


    property.data.template.simple = '\
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
    property.data.template.center = '\
    <div class="property-center">\
        <h1 class="center-heading">${center}</h1>\
        <div class="center-body">${_data}</div>\
    </div>\
    ';
    property.data.template.area = '\
    <div class="property-area ">\
        <h2 class="area-heading js--area-heading">${area}<span class="badge">${spaceAmount}</span></h2>\
        <ul class="space-list">${_data}</ul>\
    </div>\
    ';
    property.data.template.space = '\
    <li class="space-item js--space">\
        <table>\
            <tr>\
                <td class="space-icon"><img src="'+property.imgDir+'/icon_${icon}.png" alt=""></td>\
                <td class="space-info">\
                    <h3 class="name">${space}</h3>\
                    <div class="progress">\
                        <div class="progress-inner" style="width: ${percent}%;">${percent}%</div>\
                    </div>\
                    <div class="brief">已存 ${quantity}，最大存 ${capacity}</div>\
                </td>\
            </tr>\
        </table>\
    </li>\
    ';

    return property;
} );