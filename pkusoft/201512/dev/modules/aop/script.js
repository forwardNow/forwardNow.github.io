define( function () {

    var Aspects = {
        addBefore: function ( object, methodName, advice ) {
            var originMethod = object[ methodName ];
            object[ methodName ] = doBefore( originMethod, advice );
        },
        addAfter: function ( object, methodName, advice ) {
            var originMethod = object[ methodName ];
            object[ methodName ] = doAfter( originMethod, advice );
        }
    };

    function doBefore( targetFn, beforeFn ) {
        return function () {
            beforeFn.apply( this, arguments );
            return targetFn.apply( this, arguments );
        };
    }

    function doAfter( targetFn, afterFn ) {
        return function () {
            var result = targetFn.apply( this, arguments );
            afterFn.apply( this, arguments );
            return result;
        };
    }

    return Aspects;
} );