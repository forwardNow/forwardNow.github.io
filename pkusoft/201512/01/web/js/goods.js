
;
(function(){

    onLoad( function() {
        var headings = Sizzle(".goods-category .category-heading");
        var spaceItems = Sizzle(".goods-category .space-item");
        // 点击标题进行折叠
        forEach( headings,function( index, elt ) {
            addEvent( elt, "click", function() {
                classList ( this.parentNode ).toggle("active");
            } );            
        });
        // 只能选择一个条目
        forEach( spaceItems,function( index, elt ) {
            addEvent( elt, "click", function() {
                forEach( spaceItems, function() {
                    classList ( this ).remove("active");    
                } );
                classList ( this ).add("active");
            } );            
        });
        
    } );

    // onload 事件
    function onLoad(f) {
        if (onLoad.loaded)  
            window.setTimeout(f, 0);
        else if (window.addEventListener)
            window.addEventListener("load", f, false);
        else if (window.attachEvent)
            window.attachEvent("onload", f);
    }
    onLoad.loaded = false;
    onLoad(function() { onLoad.loaded = true; });

    // 注册事件监听
    function addEvent(target, type, handler) {
        if (target.addEventListener)
            target.addEventListener(type, handler, false);
        else
            target.attachEvent("on" + type, 
                function(event) {
                    return handler.call(target, event);
                });
    }

    // forEach, f(index, elt)
    function forEach( nodeList, f ) {
        for ( var i = 0; i < nodeList.length; i++ ) {
            f.call( nodeList[ i ], i, nodeList[ i ] );
        }
    }

    //--------- 模拟classList
    function classList ( e ) {
        if ( e.classList ) {
            return e.classList;
        }
        return new CSSClassList( e );
    }

    function CSSClassList ( e ) {
        this.e = e;
    }

    CSSClassList.prototype.contains = function ( className ) {
        // 检查 className 的合法性
        if ( className.length === 0 || className.indexOf(" ") != -1 ) {
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
    }

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
            throw new Error( "Invalid class name: '" + className + "'");
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
        return this.e.className.match(/\b\w+\b/) || [];
    };

})();