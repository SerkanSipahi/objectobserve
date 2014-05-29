//======= domObserve ==========

var ObjectObserve = (function(undefined, window){

    'use strict';

    var slice = Array.prototype.slice,
        toString = Object.prototype.toString,
        is = function(type, obj){
            return ( toString.call(obj).toLowerCase() === '[object '+type+']' );
        },
        each = function(obj, callback){

            if (obj === void 0 || obj === null) { throw new TypeError(); }
            var t = Object(obj),
                len = t.length >>> 0;

            if (typeof callback !== 'function') { throw new TypeError(); }

            for (var item in t){
                if(!t.hasOwnProperty(item)){ continue; }
                callback.call(t[item], item, t[item]);
            }

        },
        ioObjectByString = function(object, path, value){

            var i = 0,
                path = path.split('.');

            for (; i < path.length; i++){
                if (value !== undefined && i + 1 === path.length){
                    object[path[i]] = value;
                }
                object = object[path[i]];
            }
            return object;
        },
        splitByLastIndexOf = function(path, splitter){

            var lastIndexOf = path.lastIndexOf(splitter),
                firstpart   = lastIndexOf===-1 ? path.slice(0) : path.slice(0, lastIndexOf),
                secondpart  = lastIndexOf+1 > 0 ? path.slice(lastIndexOf+1) : false,
                container   = [];

            container.push(firstpart);
            container.push(!secondpart ? undefined : secondpart);

            return container;
        };

    function Observe(object){

        this.object  = object;
        this.call    = {};
        this.call.on = {};
    }

    Observe.prototype = {
        on : function(object){
            each(object, function(k, v){
                this.call.on[k] = v;
            }.bind(this));
        },
        io : function(object){

            var path         = Object.keys(object)[0],
                args         = object[path],
                callParts    = splitByLastIndexOf(path, '.'),
                hasMethodCall = this._hasMethodCall(
                    this.object, callParts
                ),
                baseClass    = this._getBaseClass(this.object, callParts[0]);

            this._trigger(
                this.object,
                hasMethodCall,
                baseClass,
                callParts,
                args
            );

        },
        _hasMethodCall : function(object, callparts){

            var boolean = false,
                res = ioObjectByString(
                    object,
                    callparts[1]!==undefined ? callparts.join('.') : callparts[0]
                );

            if(is('function', res)){ boolean = true; }

            return boolean;
        },
        _getBaseClass : function(object, path){

            var type = 'Function',
                res  = ioObjectByString(object, path).constructor.name;

            // > nur für setter methoden
            if(!/String|Number/.exec(res)){
                type = res;
            }
            return type;
        },
        _trigger : function(object, hasMethodCall, baseClass, callParts, args){

            var notation   = callParts[1]===undefined ? callParts[0] : callParts.join('.'),
                onFunction = this.call.on[notation];

            if(baseClass==='Function' && hasMethodCall){
                ioObjectByString(object, notation
                ).apply(object, !is('array', args) ? [ args ] : args);
            } else if(baseClass==='Function' && !hasMethodCall ){
                ioObjectByString(object, notation, args);
            } else if(hasMethodCall) {
                window[baseClass].prototype['a__'+callParts[1]] = function() {
                    this[callParts[1]].apply(this, !is('array', args) ? [ args ] : args);
                };
                ioObjectByString(object, callParts[0])['a__'+callParts[1]](args);
            } else if(!hasMethodCall){
                ioObjectByString(object, notation, args);
            }

            if(onFunction!==undefined){
                onFunction.call(object, args);
            }

        }
    };

    return Observe;

}(void(0), this));