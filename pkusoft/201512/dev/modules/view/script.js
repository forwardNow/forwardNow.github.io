define( ["require", 'utils', "maskLayer"], function ( require, utils, maskLayer ) {

    var view = {
        doc: top.document,
        cssUrl: require.toUrl( "./view/style.css" ).replace("script/", ""),
        container: null,
        img: null,
        closeBtn: null,
        init: function ( options ) {
            utils.extend( this, options );
            maskLayer && maskLayer.add("top");
            this.loadCss( this.cssUrl ).generateHtml().appendToDoc().hide().set2TopLayer().render().bind();
            return this;
        },
        render: function () {
            this.closeBtn = this.container.getElementsByTagName("a")[0];
            this.img = this.container.getElementsByTagName("img")[0];
            return this;
        },
        bind: function () {
            var self = this;
            utils.bind( this.closeBtn, "click", function(){
                self.hide();
            });
        },
        show: function() {
            maskLayer && maskLayer.show();
            this.container.style.display = "block";
            this.container.style.visibility = "visible";
            return this;
        },
        hide: function() {
            maskLayer && maskLayer.hide();
            this.container.style.display = "none";
            this.container.style.visibility = "hidden";
            return this;
        },
        generateHtml: function () {
            var tempDiv;

            if ( this.container ) {
                return this;
            }

            tempDiv = document.createElement("div");
            tempDiv.innerHTML = this.template.simple;
            while( tempDiv.firstChild ) {
                if ( tempDiv.firstChild.nodeType != 1 ) {
                    tempDiv.removeChild( tempDiv.firstChild );
                    continue;
                }
                this.container = tempDiv.firstChild;
                break;
            }
            return this;
        },
        appendToDoc: function ( doc ) {
            this.doc = doc || this.doc || document;
            this.doc.body.appendChild( this.container );
            return this;
        },
        setImgUrl: function( imgUrl ) {
            this.img.src = imgUrl;
            return this;
        },
        loadCss: function ( url ) {
            utils.dynamicLoad.css( url || "style.css", this.doc );
            return this;
        },
        set2TopLayer: function () {
            this.container.style.zIndex = utils.getMaxZindex(top);
            return this;
        }
    };

    view.template = {};
    view.template.simple = '\
<div id="viewContainer" class="viewContainer">\
    <img src="" alt="" class="view-img" id="view-img"/>\
    <i class="hook"></i>\
    <a href="javascript:void(0)" class="btn-view-close" id="btn-view-close"><!--关闭--></a>\
</div>\
    ';

    return view;
} );