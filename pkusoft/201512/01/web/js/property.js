
;
(function( window ){

    var property = {
        data: {
            template: {
                data: {},
                center: "",
                area: "",
                space: ""
            }
        },
        init: function () {
            this.data.template = $template;
            this.container = Sizzle(".js--container")[0];
            this.interpret()
                .render()
                .bind();
            return this;
        },
        render: function () {
            this.areaHeadings = Sizzle(".js--area-heading");
            this.spaces = Sizzle(".js--space");
            return this;
        },
        interpret: function() {
            var self = this,
                template = this.data.template,
                data = template.data,
                html = "",
                centerList,
                areaList,
                spaceList;


            // center
            centerList = data.centerList;
            forEach( centerList, function( index, center ) {
                var centerTemp = template.center,
                    centerInner = "";
                centerTemp = centerTemp.replace( new RegExp( "\\$\\{\\s*" + "center" + "\\s*\\}" ,"g"), center.center );

                // area
                areaList = center.areaList;
                forEach( areaList, function( index, area ) {
                    var areaTemp = template.area,
                        areaInner = "";
                    areaTemp = areaTemp.replace( new RegExp( "\\$\\{\\s*" + "area" + "\\s*\\}" ,"g"), area.area );

                    // space
                    spaceList = area.spaceList;
                    forEach( spaceList, function( index, space ) {
                        var spaceTemp = template.space,
                            percent = Math.round( space.quantity / space.capacity * 100 );
                        spaceTemp = spaceTemp.replace( new RegExp( "\\$\\{\\s*" + "space" + "\\s*\\}" ,"g"), space.space );                        
                        spaceTemp = spaceTemp.replace( new RegExp( "\\$\\{\\s*" + "quantity" + "\\s*\\}" ,"g"), space.quantity );                        
                        spaceTemp = spaceTemp.replace( new RegExp( "\\$\\{\\s*" + "capacity" + "\\s*\\}" ,"g"), space.capacity );                        
                        spaceTemp = spaceTemp.replace( new RegExp( "\\$\\{\\s*" + "percent" + "\\s*\\}" ,"g"), percent );                        

                        if ( percent == 0 ) {
                            spaceTemp = spaceTemp.replace('class="progress-inner"', 'class="progress-inner progress-empty"');
                        }

                        areaInner += spaceTemp;
                    });
                    areaTemp = areaTemp.replace( new RegExp( "\\$\\{\\s*" + "_data" + "\\s*\\}" ,"g"), areaInner );
                    centerInner += areaTemp;
                } );
                
                centerTemp = centerTemp.replace( new RegExp( "\\$\\{\\s*" + "_data" + "\\s*\\}" ,"g"), centerInner );
                html += centerTemp;

            } );           
            
            self.container.innerHTML = html;

            return this;
        },
        bind: function() {
            var areaHeadings = this.areaHeadings,
                spaces = this.spaces;

            // 点击标题进行折叠
            forEach( areaHeadings,function( index, elt ) {
                addEvent( elt, "click", function() {
                    classList ( this.parentNode ).toggle("active");
                } );            
            });       
            // 只能选择一个条目
            forEach( spaces,function( index, elt ) {
                addEvent( elt, "click", function() {
                    forEach( spaces, function() {
                        classList ( this ).remove("active");    
                    } );
                    classList ( this ).add("active");
                } );            
            });      

            return this;           
        }
    };

    window.$property = property;

/*----------- utilities ---------------

onLoad( f )    
    页面加载完后，执行函数f，已添加到window

addEvent( target, type, handler )
    注册事件监听

forEach( nodeList, f )
    针对数组和类数组，对每个元素执行函数f(index, elt)

classList( elt )    
    给元素elt添加 classList 的功能，使其能操作css class

loadAsync(url)
    异步载入并执行指定url的脚本

 -------------------------------------*/

    window.onLoad = onLoad; // 添加到全局变量中

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
    

    // 注册事件监听，IE中的handler内可以使用this引用target
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

    // 模拟HTML5中的classList
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

    // Asynchronously load and execute a script from a specified URL
    function loadAsync(url) {
        var head = document.getElementsByTagName("head")[0];
        var s = document.createElement("script");
        s.src = url;
        head.appendChild(s);
    }

})( window );