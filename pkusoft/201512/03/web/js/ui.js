;
var ui = {};

ui.maskLayer = {
    add: function ( isTopWindow ) {
        var maskLayerNode,
            parentNode;

        if ( this.maskLayerNode ) {
            return this;
        }
        parentNode = isTopWindow ? top.document.body : document.body;

        maskLayerNode = document.createElement( "div" );
        parentNode.appendChild( maskLayerNode );

        this.maskLayerNode = maskLayerNode;
        this.setStyle();

        return this;
    },
    get: function () {
        if ( !this.maskLayerNode ) {
            this.add();
        }
        return this.maskLayerNode;
    },
    remove: function () {
        if ( !this.maskLayerNode ) {
            return this;
        }
        this.maskLayerNode.parentNode.removeChild( this.maskLayerNode );
        return this;
    },
    hide: function () {
        this.maskLayerNode.style.display = "none";
        this.maskLayerNode.style.visibility = "hidden";
        return this;
    },
    show: function () {
        this.maskLayerNode.style.display = "block";
        this.maskLayerNode.style.visibility = "visible";
        return this;
    },
    setStyle: function ( cssText ) {
        cssText = cssText ||
            (
                "filter:progid:DXImageTransform.Microsoft.gradient(enabled='true',startColorstr='#7F000000', endColorstr='#7F000000');"
                + "background-color:rgba(0,0,0,0.5);"
                + "position: fixed; left: 0; top: 0; width: 100%; height: 100%;"
                + "display:none; visibility: hidden;"
            );
        this.maskLayerNode.style.cssText = cssText;
        return this;
    }
};

ui.slider = {

    container: "js--slideContainer"


};


