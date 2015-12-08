(function ( window ) {
    var utils = {};

    /**
     * 动态载入 css/js 文件
     */
    utils.dynamicLoad = {
        css: function ( path, document ) {
            if ( !path || path.length === 0 ) {
                throw new Error( 'argument "path" is required !' );
            }
            document = document || window.document;
            var head = document.getElementsByTagName( 'head' )[ 0 ];
            var link = document.createElement( 'link' );
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild( link );
            return this;
        },
        js: function ( path, document ) {
            if ( !path || path.length === 0 ) {
                throw new Error( 'argument "path" is required !' );
            }
            document = document || window.document;
            var head = document.getElementsByTagName( 'head' )[ 0 ];
            var script = document.createElement( 'script' );
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild( script );
            return this;
        }
    };

    /**
     * 针对数组和类数组，对每个元素执行函数f(index, elt)
     * @param nodeList
     * @param f
     */
    utils.each = function ( nodeList, f ) {
        for ( var i = 0; i < nodeList.length; i++ ) {
            f.call( nodeList[ i ], i, nodeList[ i ] );
        }
    };

    /**
     * 注册事件监听，IE中的handler内可以使用this引用target
     */
    utils.addEvent = function ( target, type, handler ) {
        if ( target.addEventListener )
            target.addEventListener( type, handler, false );
        else
            target.attachEvent( "on" + type,
                function ( event ) {
                    return handler.call( target, event );
                } );
    };
    /**
     * 注册事件监听
     */
    utils.bind = function ( el, type, fn ) {
        el.addEventListener ?
            el.addEventListener( type, fn, false )
            :
            el.attachEvent ?
                el.attachEvent( "on" + type, fn )
                :
                el[ 'on' + type ] = fn
        ;
    };

    /**
     * 方便地对元素的类名进行增删改查（针对IE10及以下版本不支持classList属性）
     */
    utils.classList = function ( e ) {
        if ( e.classList ) {
            return e.classList;
        }
        return new CSSClassList( e );
    };

    function CSSClassList( e ) {
        this.e = e;
    }

    CSSClassList.prototype.contains = function ( className ) {
        // 检查 className 的合法性
        if ( className.length === 0 || className.indexOf( " " ) != -1 ) {
            throw new Error( "Invalid class name: '" + className + "'" );
        }

        var classes = this.e.className;

        if ( !classes ) { // 不含类名
            return false;
        }

        if ( classes === className ) { // e仅有一个类，且匹配
            return true;
        }

        // 使用正则搜索 className
        return classes.search( "\\b" + className + "\\b" ) != -1;
    };

    CSSClassList.prototype.add = function ( className ) {
        if ( this.contains( className ) ) return this;
        var classes = this.e.className;
        if ( classes && classes[ classes.length - 1 ] != " " ) {
            className = " " + className;
        }
        this.e.className += className;
        return this;
    };

    CSSClassList.prototype.remove = function ( className ) {

        if ( className.length === 0 || className.indexOf( " " ) != -1 ) {
            throw new Error( "Invalid class name: '" + className + "'" );
        }

        var pattern = new RegExp( "\\b" + className + "\\b\\s*", "g" );
        this.e.className = this.e.className.replace( pattern, "" );

        return this;
    };

    CSSClassList.prototype.toggle = function ( className ) {
        if ( this.contains( className ) ) {
            this.remove( className );
            return this;
        }
        this.add( className );
        return this;
    };

    CSSClassList.prototype.toString = function () {
        return this.e.className;
    };

    CSSClassList.prototype.toArray = function () {
        return this.e.className.match( /\b\w+\b/ ) || [];
    };

    // 参考：http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
    utils.getElementsByClassName = function ( searchClass, node, tag ) {
        if ( document.getElementsByClassName ) {
            //return document.getElementsByClassName( searchClass );
        }
        node = node || document;
        tag = tag || '*';
        var returnElements = []
        var els = (tag === "*" && node.all) ? node.all : node.getElementsByTagName( tag );
        var i = els.length;
        searchClass = searchClass.replace( /\-/g, "\\-" );
        var pattern = new RegExp( "(^|\\s)" + searchClass + "(\\s|$)" );
        while ( --i >= 0 ) {
            if ( pattern.test( els[ i ].className ) ) {
                returnElements.push( els[ i ] );
            }
        }
        return returnElements;
    };

    utils.outerHTML = function ( elt, html ) {
        var container = document.createElement( "div" );
        container.innerHTML = html;
        while ( container.firstChild ) {
            var firstChild = container.firstChild;
            if ( container.firstChild.nodeType == 1 ) {
                firstChild.style.cssText = elt.style.cssText;
            }
            elt.parentNode.insertBefore( container.firstChild, elt );
        }
        elt.parentNode.removeChild( elt );
    };


    /*
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is overwritten.
     * This function does not handle getters and setters or copy attributes.
     */
    function extend( o, p ) {
        for ( var prop in p ) { // For all props in p.
            o[ prop ] = p[ prop ]; // Add the property to o.
        }
        return o;
    }

    utils.extend = extend;

    /*
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is left alone.
     * This function does not handle getters and setters or copy attributes.
     */
    function merge( o, p ) {
        for ( var prop in p ) { // For all props in p.
            if ( o.hasOwnProperty[ prop ] ) continue; // Except those already in o.
            o[ prop ] = p[ prop ]; // Add the property to o.
        }
        return o;
    }

    utils.merge = merge;


    function getComputedStyle( elt, cssProp, win ) {
        win = win || window;
        if ( win.getComputedStyle ) {
            return win.getComputedStyle( elt, null )[ cssProp ];
        }
        if ( elt.currentStyle ) {
            return elt.currentStyle[ cssProp ];
        }
        return "";
    }
    utils.getComputedStyle = getComputedStyle;

    function getMaxZindex( win ) {
        win = win || window;
        var eltList = win.document.body.children,
            maxZindex = 0;
        utils.each( eltList, function( index, elt ) {
            var zIndex = parseInt( getComputedStyle( elt, "z-index", win ) ) || 0;
            maxZindex = maxZindex < zIndex ? zIndex : maxZindex;
        } );
        return maxZindex;
    }
    utils.getMaxZindex = getMaxZindex;

// EXPOSE ---------------------------------------------------
    if ( typeof define === "function" && define.amd ) {
        define( function () {
            return utils;
        } );
// Sizzle requires that there be a global window in Common-JS like environments
    } else if ( typeof module !== "undefined" && module.exports ) {
        module.exports = utils;
    } else {
        window.utils = utils;
    }
// EXPOSE

})
( window );