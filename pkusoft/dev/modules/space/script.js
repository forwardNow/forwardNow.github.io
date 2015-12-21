define( [ "require", "Sizzle", "utils" ], function ( require, Sizzle, utils ) {

    var forEach = utils.each,
        classList = utils.classList;


    var property = {
        doc: document,
        imgDir: require.toUrl( "./space/images" ).replace( "script/", "" ).replace("?" + VERSION, ""),
        cssUrl: require.toUrl( "./space/style.css" ).replace( "script/", "" ).replace("?" + VERSION, ""),
        options: {
            gap: "10px",
            spaceNum: 5,
            hasIcon: true
        },
        data: {
            template: {
                data: {},
                text: ["已存 ", "最大存 "],
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
            this.container = Sizzle( ".js--container" )[ 0 ];
            this.areaHeadings = Sizzle( ".js--area-heading" );
            this.spaces = Sizzle( ".js--space" );
            this.spaceIcons = Sizzle( ".js--container .space-icon" );
            this.spaceBriefs = Sizzle( ".js--space .brief" );

            gap = parseInt( gap ) || 10;
            spaceNum = parseInt( spaceNum ) || 4;
            contentWidth = parseInt( this.container.offsetWidth ) - 60 || 640;
            spaceWidth = Math.floor( contentWidth / spaceNum - gap );
            iconWidth = spaceWidth * 0.25;

            if ( hasIcon === "false" ) {
                utils.each( this.spaceIcons, function ( index, elt ) {
                    elt.style.display = "none";
                } );
                iconWidth = 0;
            }

            utils.each( this.spaces, function ( index, elt ) {
                elt.style.width = spaceWidth + "px";
                elt.style.marginRight = (gap - 1) + "px";
            } );
            utils.each( this.spaceBriefs, function ( index, elt ) {
                elt.style.width = spaceWidth - iconWidth + "px";
            } );

            return this;
        },
        getOptions: function () {
            var optionString = this.container.getAttribute( "data-options" ) + "",
                pairs,
                prop,
                value,
                trim = utils.trim,
                self = this;

            pairs = optionString.split( ";" );

            utils.each( pairs, function ( index, pair ) {
                pair = utils.trim( pair );
                if ( pair === "" ) {
                    return;
                }
                pair = pair.split( ":" );
                if ( pair.length !== 2 ) {
                    return;
                }
                prop = trim( pair[ 0 ] );
                value = trim( pair[ 1 ] );
                self.options[ prop ] = value;
            } );

            return this;
        },
        interpret: function () {
            var self = this,
                template = this.data.template,
                data = template.data,
                html = "",
                centerList,
                areaList,
                spaceList,
                tempDiv;


            // center
            centerList = data.centerList;
            forEach( centerList, function ( index, center ) {
                var centerTemp = template.center,
                    centerInner = "";
                centerTemp = replace( centerTemp, "center", center.center );
                centerTemp = replace( centerTemp, "centerId", center.centerId );

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
                                "spaceId": space.spaceId,
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

            tempDiv = document.createElement( "div" );
            tempDiv.innerHTML = html;
            utils.each( tempDiv.childNodes, function ( index, node ) {
                if ( node.nodeType != 1 ) {
                    return;
                }
                self.container.appendChild( node );
            } );

            //self.container.innerHTML = html;
            tempDiv = null;

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
                    if ( !pairs.hasOwnProperty( placeholder ) ) continue;
                    target = replace( target, placeholder, pairs[ placeholder ] );
                }
                return target;
            }

            return this;
        },
        setSpaceClickCallback: function( callback ) {
            this.eventHandler.chooseSpaceClickHandler.callback = callback;
            return this;
        },
        eventHandler: {
            collapseClickHandler: function () {
                return classList( this.parentNode ).toggle( "active" );
            },
            chooseSpaceClickHandler: function () {
                forEach( property.spaces, function () {
                    classList( this ).remove( "active" );
                } );
                classList( this ).add( "active" );
                var callback = space.eventHandler.chooseSpaceClickHandler.callback;
                if ( callback ) {
                    callback.call(this, Sizzle(".name", this)[0 ].getAttribute("spaceId"));
                }
            }

        },
        handleEvent: function ( isBind ) {
            var __self = this
                ,handle = isBind ? utils.addEvent : utils.removeEvent
                ;
            forEach( this.areaHeadings, function ( index, elt ) {
                handle( elt, "click", __self.eventHandler.collapseClickHandler );
            } );
            // 只能选择一个条目
            forEach( this.spaces, function ( index, elt ) {
                handle( elt, "click", __self.eventHandler.chooseSpaceClickHandler );
            } );


            return this;
        },
        bind: function () {
            return this.handleEvent( true );
        },
        unbind: function () {
            return this.handleEvent( false );
        },
        loadCss: function ( url ) {
            if ( this.cssLoaded ) return this;
            utils.dynamicLoad.css( url || "style.css", this.doc );
            this.cssLoaded = true;
            return this;
        },
        clear: function () {
            while ( this.container && this.container.firstChild ) {
                this.container.removeChild( this.container.firstChild );
            }
            return this;
        },
        remove: function ( centerId ) {
            var center = document.getElementById( centerId );
            if ( !center ) throw "没有【centerId=" + centerId + "】的存放地点";
            center.parentNode.removeChild( center );
            return this;
        },
        setData: function ( data ) {
            this.data.template.data = data;
            return this;
        },
        appendData: function ( data ) {
            return this.setData( data ).init().unbind().bind();
        },
        getBriefText: function () {
            return this.data.template.text;
        },
        setBriefText: function ( text ) {
            text = text || [ "已存 ", "最大存 " ];
            this.data.template.text = text;
            this.data.template.space = this.getSpaceTemp();
            return this;
        }
    };

/*
    property.data.template.simple = '\
    <div class="property-center" id="${centerId}">\
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
    */
    property.data.template.center = '\
    <div class="property-center" id="${centerId}">\
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
    property.getSpaceTemp = function() { return '\
    <li class="space-item js--space">\
        <table>\
            <tr>\
                <td class="space-icon"><img src="' + property.imgDir + '/icon_${icon}.png" alt=""></td>\
                <td class="space-info">\
                    <h3 class="name" spaceId="${spaceId}">${space}</h3>\
                    <div class="progress">\
                        <div class="progress-inner" style="width: ${percent}%;">${percent}%</div>\
                    </div>\
                    <div class="brief">'+property.getBriefText()[0]+'${quantity}，'+property.getBriefText()[1]+'${capacity}</div>\
                </td>\
            </tr>\
        </table>\
    </li>\
    '; };
    property.data.template.space = property.getSpaceTemp();

    return property;
} );