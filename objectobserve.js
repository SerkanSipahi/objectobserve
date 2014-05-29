//======= domObserve ==========

var _ObjectObserve = (function(undefined, window){

    'use strict';

    // > Helper Functions
    var toString = Object.prototype.toString,
        is = function(type, obj){
            return ( toString.call(obj).toLowerCase() === '[object '+type+']' );
        },
        capitalize = function(s){
            return s[0].toUpperCase() + s.slice(1);
        },
        addObjectByString = function(object, path, key){

            var i = 0, objectReferenceState = object,
                path = path.split('.');

            for (; i < path.length; i++){
                if (key !== undefined && i + 1 === path.length){
                    object[path[i]] = key;
                }
                object = object[path[i]];
            }
            //object = objectReferenceState;

            return object;
        },
        arrayToCamelCase = function(array){

            var tmpString = '';
            for(var i=0;i<array.length;i++){
                tmpString += capitalize(array[i]);
            }
            return tmpString;
        },
        createObjectByString = function(namespace){

            var tmpObj = {},
                ns = window,
                parts = null,
                first = namespace.split('.')[0];

            if (namespace != '') {
                parts = namespace.split('.');
                for (var i = 0, j = parts.length; i < j; i++) {
                    if (!ns[parts[i]]) {
                        ns[parts[i]] = {};
                    }
                    ns = ns[parts[i]];
                }
            }

            tmpObj[first] = window[first];
            delete window[first];

            return tmpObj;
        };

    function Observe(){

        var self           = this,
            constructor    = Observe.prototype.constructor,
            args           = Array.prototype.slice.call(arguments, 0),
            argsLength     = args.length,
            callback       = undefined,
            object         = args.slice(0,1)[0],
            lastArg        = args.slice(argsLength-1, argsLength)[0],
            props          = args.slice(1, argsLength-1),
            propLength     = 0,
            i              = 0,
            f              = 0,
            callbacks      = {};

        is('function', lastArg) ? callback = lastArg : props = args.slice(1, argsLength);

        // > Öffentliche Props ( dient nur zur Information )
        this.observed_properties = props;
        this.observed_object = object;
        this.global_callback = [ callback ];

        /*
         * @props
         * > über alle registrierten Methoden/Attribute iretrieren!
         **/
        propLength = props.length;
        for(i=0; i<propLength;i++){

            var context = {},
                propsAsArray = props[i].split('.'),
                lastProp = null;
                context.hasMethod = /\((.*?)\)/.exec(props[i]) ? true : false;
                context.notation = props[i];
                context.object = object;

            if(context.hasMethod){
                props[i] = context.notation.replace(/\((.*?)\)/g, '');
                propsAsArray = props[i].split('.');
                context.notation = props[i];
            }

            if(propsAsArray.length > 1){

                var constructorPrototypeReferenceState = constructor.prototype;
                for(var attr in propsAsArray){
                    if(!propsAsArray.hasOwnProperty(attr)){ continue; }
                    if(constructor.prototype[propsAsArray[attr]]===undefined){
                        constructor.prototype[propsAsArray[attr]] = {};
                    }
                    constructor.prototype = constructor.prototype[propsAsArray[attr]];
                }
                constructor.prototype = constructorPrototypeReferenceState;
            }

            // > todo: dokumentieren
            addObjectByString(constructor.prototype, props[i], function(){

                /*
                 * Wert in das echte Objekt schreiben bzw. aufrufen!
                 * */
                 var objectReferenceState = this.object,
                     tmpObjectReference = this.object,
                     baseClassName = null,
                     baseClassInstance = null;

                 if(!this.hasMethod){
                     addObjectByString(this.object, this.notation, arguments[0]);
                 } else if(this.hasMethod){

                     var lastIndexOf = this.notation.lastIndexOf("."),
                         firstpart=null, secondpart=null;

                     if(lastIndexOf!==-1){
                         firstpart = this.notation.slice(0, lastIndexOf);
                         secondpart = this.notation.slice(lastIndexOf+1);

                         baseClassName = addObjectByString(tmpObjectReference, firstpart).constructor.name;
                         baseClassInstance = addObjectByString(tmpObjectReference, firstpart);
                         if(baseClassName !== 'Function'){

                             window[baseClassName].prototype['@__'+secondpart] = function() {
                                 this[secondpart].apply(this, arguments[0]);
                             };
                             baseClassInstance['@__'+secondpart](arguments);

                         }

                     } else {
                         firstpart = this.notation;
                         addObjectByString(this.object, firstpart).apply(objectReferenceState, arguments);
                     }

                 }

                /*
                 * @callback
                 * die CallbackFunktion die über den konstructor übergeben wird
                 * immer aufrufen wenn eine Methode/Attribute über konstructor
                 * registriert wurde!
                 */
                if(!is('undefined', callback)){
                    callback.apply(objectReferenceState, arguments);
                }

                /*
                 * @attr on[Methode] aufrufen
                 **/
                if(callbacks['on'+arrayToCamelCase(this.notation.split('.'))]!==undefined){
                    callbacks['on'+arrayToCamelCase(this.notation.split('.'))].apply(objectReferenceState, arguments);
                }

            }.bind(context));

            // > todo: dokumentieren
            var onMethod = 'on'+arrayToCamelCase(context.notation.split('.'));
            addObjectByString(constructor.prototype, onMethod, function(callback){

                callbacks['on'+arrayToCamelCase(this.notation.split('.'))] = callback;

            }.bind(context));
        }
    }
    Observe.prototype.getObject = function(){
        return this.observed_object;
    };


    return Observe;

}(void(0), this));

////////////////////////////

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
        io : function(notation){

            var hasMethod = this._hasMethod(notation);


        },
        _hasMethod : function(notation){

        }
    };

    return Observe;

}(void(0), this));

///////////////////////////

window.onload = function(){

    var $ = document.querySelectorAll.bind(document);

    var $observedFoo = new ObjectObserve($('.foo')[0], function(changes){

    });
    var $observedBoo = new ObjectObserve($('.boo')[0], function(changes){

    });

    $observedFoo.on({
        'setAttribute' : function(changes){

        },
        'appendChild' : function(changes){

        },
        'classList.remove' : function(changes){

        },
        'classList.add' : function(changes){

        },
        'classList.contain' : function(changes){

        }
    });

    $observedBoo.on({
        'style.backgroundColor' : function(changes){

        },
        'style.color' : function(changes){

        },
        'style.fontWeight' : function(changes){

        }
    });

    $observedFoo.io({'setAttribute' : ['data-foo', 1234]});
    $observedFoo.io({'appendChild' : document.createElement('span')});
    $observedFoo.io({'classList.remove' : 'foo-class'});
    $observedFoo.io({'classList.add' : 'foo-class'});
    $observedFoo.io({'classList.contain' : 'foo-class'});

    $observedBoo.io({'style.backgroundColor' : 'red'});
    $observedBoo.io({'style.color' : 'green'});
    $observedBoo.io({'style.fontWeight' : 'bold'});

    console.log($observedFoo);
    console.log($observedBoo);

    $observedFoo.io('style.backgroundColor');
    $observedFoo.io('innerHTML');

};
