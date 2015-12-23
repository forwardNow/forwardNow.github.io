define( function () {
    var clone = (function() {
        'use strict';
        // 如果不支持ES5的方法
        if (!Object.getOwnPropertyDescriptor || !Object.getPrototypeOf || !Object.create) {
            return null;
        }

        /**
         * Clones (copies) an Object using deep copying.
         *
         * This function supports circular references by default, but if you are certain
         * there are no circular references in your object, you can save some CPU time
         * by calling clone(obj, false).
         *
         * Caution: if `circular` is false and `parent` contains circular references,
         * your program may enter an infinite loop and crash.
         *
         * @param `parent` - the object to be cloned
         * @param `circular` - set to true if the object to be cloned may contain
         *    circular references. (optional - true by default)
         * @param `depth` - set to a number if the object is only to be cloned to
         *    a particular depth. (optional - defaults to Infinity)
         * @param `prototype` - sets the prototype to be used when cloning an object.
         *    (optional - defaults to parent prototype).
         */
        function clone(parent, circular, depth, prototype) {
            var filter;
            if (typeof circular === 'object') {
                depth = circular.depth;
                prototype = circular.prototype;
                filter = circular.filter;
                circular = circular.circular;
            }
            // maintain two arrays for circular references, where corresponding parents
            // and children have the same index
            var allParents = [];
            var allChildren = [];

            var useBuffer = typeof Buffer != 'undefined';

            if (typeof circular == 'undefined')
                circular = true;

            if (typeof depth == 'undefined')
                depth = Infinity;

            // recurse this function so we don't reset allParents and allChildren
            function _clone(parent, depth) {
                // cloning null always returns null
                if (parent === null)
                    return null;

                if (depth === 0)
                    return parent;

                var child;
                var proto;
                if (typeof parent != 'object') {
                    return parent;
                }

                if (clone.__isArray(parent)) {
                    child = [];
                } else if (clone.__isRegExp(parent)) {
                    child = new RegExp(parent.source, __getRegExpFlags(parent));
                    if (parent.lastIndex) child.lastIndex = parent.lastIndex;
                } else if (clone.__isDate(parent)) {
                    child = new Date(parent.getTime());
                } else if (useBuffer && Buffer.isBuffer(parent)) {
                    child = new Buffer(parent.length);
                    parent.copy(child);
                    return child;
                } else {
                    if (typeof prototype == 'undefined') {
                        proto = Object.getPrototypeOf(parent);
                        child = Object.create(proto);
                    }
                    else {
                        child = Object.create(prototype);
                        proto = prototype;
                    }
                }

                if (circular) {
                    var index = allParents.indexOf(parent);

                    if (index != -1) {
                        return allChildren[index];
                    }
                    allParents.push(parent);
                    allChildren.push(child);
                }

                for (var i in parent) {
                    var attrs;
                    if (proto) {
                        attrs = Object.getOwnPropertyDescriptor(proto, i);
                    }

                    if (attrs && attrs.set == null) {
                        continue;
                    }
                    child[i] = _clone(parent[i], depth - 1);
                }

                return child;
            }

            return _clone(parent, depth);
        }

        /**
         * Simple flat clone using prototype, accepts only objects, usefull for property
         * override on FLAT configuration object (no nested props).
         *
         * USE WITH CAUTION! This may not behave as you wish if you do not know how this
         * works.
         */
        clone.clonePrototype = function clonePrototype(parent) {
            if (parent === null)
                return null;

            var c = function () {};
            c.prototype = parent;
            return new c();
        };

// private utility functions

        function __objToStr(o) {
            return Object.prototype.toString.call(o);
        }
        clone.__objToStr = __objToStr;

        function __isDate(o) {
            return typeof o === 'object' && __objToStr(o) === '[object Date]';
        }
        clone.__isDate = __isDate;

        function __isArray(o) {
            return typeof o === 'object' && __objToStr(o) === '[object Array]';
        }
        clone.__isArray = __isArray;

        function __isRegExp(o) {
            return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
        }
        clone.__isRegExp = __isRegExp;

        function __getRegExpFlags(re) {
            var flags = '';
            if (re.global) flags += 'g';
            if (re.ignoreCase) flags += 'i';
            if (re.multiline) flags += 'm';
            return flags;
        }
        clone.__getRegExpFlags = __getRegExpFlags;

        return clone;
    })();

    if ( clone ) return clone;


    /**
     * Deep copy an object (make copies of all its object properties, sub-properties, etc.)
     * An improved version of http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone
     * that doesn't break if the constructor has required parameters
     *
     * It also borrows some code from http://stackoverflow.com/a/11621004/560114
     */
    function deepCopy(src, /* INTERNAL */ _visited) {
        if(src == null || typeof(src) !== 'object'){
            return src;
        }

        // Initialize the visited objects array if needed
        // This is used to detect cyclic references
        if (_visited == undefined){
            _visited = [];
        }
        // Otherwise, ensure src has not already been visited
        else {
            var i, len = _visited.length;
            for (i = 0; i < len; i++) {
                // If src was already visited, don't try to copy it, just return the reference
                if (src === _visited[i]) {
                    return src;
                }
            }
        }

        // Add this object to the visited array
        _visited.push(src);

        //Honor native/custom clone methods
        if(typeof src.clone == 'function'){
            return src.clone(true);
        }

        //Special cases:
        //Array
        if (Object.prototype.toString.call(src) == '[object Array]') {
            //[].slice(0) would soft clone
            ret = src.slice();
            var i = ret.length;
            while (i--){
                ret[i] = deepCopy(ret[i], _visited);
            }
            return ret;
        }
        //Date
        if (src instanceof Date){
            return new Date(src.getTime());
        }
        //RegExp
        if(src instanceof RegExp){
            return new RegExp(src);
        }
        //DOM Elements
        if(src.nodeType && typeof src.cloneNode == 'function'){
            return src.cloneNode(true);
        }

        //If we've reached here, we have a regular object, array, or function

        //make sure the returned object has the same prototype as the original
        var proto = (Object.getPrototypeOf ? Object.getPrototypeOf(src): src.__proto__);
        if (!proto) {
            proto = src.constructor.prototype; //this line would probably only be reached by very old browsers
        }
        var ret = object_create(proto);

        for(var key in src){
            //Note: this does NOT preserve ES5 property attributes like 'writable', 'enumerable', etc.
            //For an example of how this could be modified to do so, see the singleMixin() function
            ret[key] = deepCopy(src[key], _visited);
        }
        return ret;
    }

    //If Object.create isn't already defined, we just do the simple shim,
    //without the second argument, since that's all we need here
    var object_create = Object.create;
    if (typeof object_create !== 'function') {
        object_create = function(o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    return deepCopy;

} );
