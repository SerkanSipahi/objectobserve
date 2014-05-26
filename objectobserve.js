//======= domObserve ==========

var ObjectObserve = (function(undefined, window){

    'use strict';

    // > Helper Functions
    var toString = Object.prototype.toString,
        is = function(type, obj){
            return ( toString.call(obj).toLowerCase() === '[object '+type+']' );
        },
        capitalize = function(s){
            return s[0].toUpperCase() + s.slice(1);
        },
        addObjectByString = function(object, path, key, value){

            var i = 0, objectReferenceState = object,
                path = path.split('.');

            for (; i < path.length; i++){
                if (key !== undefined && i + 1 === path.length){
                    object[path[i]] = key;
                }
                object = object[path[i]];
            }
            object = objectReferenceState;

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
            constructor    = self.constructor,
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
                context.notation = props[i];

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
            addObjectByString(constructor.prototype, props[i], function(arg){

                /*
                 * Wert in das echte Objekt schreiben bzw. aufrufen!
                 * */
                 // > setter
                 if(arg!==undefined){
                     addObjectByString(object, this.notation, arg);
                 }

                /*
                 * @callback
                 * die CallbackFunktion die über den konstructor übergeben wird
                 * immer aufrufen wenn eine Methode/Attribute über konstructor
                 * registriert wurde!
                 */
                if(!is('undefined', callback)){
                    callback.apply(object, arguments);
                }

                /*
                 * @attr on[Methode] aufrufen
                 **/
                if(callbacks['on'+arrayToCamelCase(this.notation.split('.'))]!==undefined){
                    callbacks['on'+arrayToCamelCase(this.notation.split('.'))].apply(object, arguments);
                }

            }.bind(context));

            // > todo: dokumentieren
            var onMethod = 'on'+arrayToCamelCase(context.notation.split('.'));
            addObjectByString(constructor.prototype, onMethod, function(callback){

                callbacks['on'+arrayToCamelCase(this.notation.split('.'))] = callback;

            }.bind(context));
        }
    }

    return Observe;

}(void(0), this));

window.onload = function(){

    var $ = document.querySelectorAll.bind(document);

    // > init observer
    var $observedObject = new ObjectObserve($('.header')[0],
        'innerHTML',
        'id',
        'style.backgroundColor',
        'style.width',
        'style.height',
        'setAttribute()',
        function(arg){
            console.log('constructor', arg, this);
    });

    // > register callbacks
    $observedObject.onId(function(arg){
        console.log('onId_callback', arg, this);
    });
    $observedObject.onInnerHTML(function(arg){
        console.log('onInnerHTML_callback', arg, this);
    });
    $observedObject.onStyleWidth(function(arg){
        console.log('onStyleWidth_callback', arg, this);
    });
    $observedObject.onStyleHeight(function(arg){
        console.log('onStyleHeight_callback', arg, this);
    });
    $observedObject.onStyleBackgroundColor(function(arg){
        console.log('onStyleBackgroundColor', arg, this);
    });
    /*
    $observedObject.onSetAttribute(function(arg){
        console.log('onSetAttribute', arg, this);
    });
    */

    // > set or get to trigger the registered callbacks
    $observedObject.style.backgroundColor('red');
    $observedObject.style.height('100px');
    $observedObject.style.width('300px');
    $observedObject.id('setter:im-id');
    $observedObject.innerHTML('setter:Hello innerHTML :)');
    //$observedObject.setAttribute('data-foo', 'nice');

    console.log($observedObject);

};
/*
 $observedObject.onSetAttribute({
    before : function(e){

    },
    after : function(e){

    }
});
*/