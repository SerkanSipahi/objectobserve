//======= domObserve ==========

var ObjectObserve = (function(){

    'use strict';

    // > Helper Functions
    var toString = Object.prototype.toString,
        is = function(type, obj){
            return ( toString.call(obj).toLowerCase() === '[object '+type+']' );
        },
        capitalize = function(s){
            return s[0].toUpperCase() + s.slice(1);
        },
        addObjectByString = function(object, path, value){

            var i = 0,
                path = path.split('.');

            for (; i < path.length; i++){
                if (value !== void(0) && i + 1 === path.length){
                    object[path[i]] = value;
                }
                object = object[path[i]];
            }

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
            callback       = void(0),
            object         = args.slice(0,1)[0],
            lastArg        = args.slice(argsLength-1, argsLength)[0],
            props          = args.slice(1, argsLength-1),
            propLength     = 0,
            i              = 0,
            f              = 0,
            callbacks      = {};

        is('function', lastArg) ? callback = lastArg : props = args.slice(1, argsLength);

        // > Öffentliche Props ( dient nur zur Information )
        this.props = props;
        this.observeObject = object;
        this.constructorCallback = [ callback ];

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

                var constructorPrototype = constructor.prototype;
                for(var attr in propsAsArray){
                    if(!propsAsArray.hasOwnProperty(attr)){ continue; }
                    if(constructor.prototype[propsAsArray[attr]]===void(0)){
                        constructor.prototype[propsAsArray[attr]] = {};
                    }
                    constructor.prototype = constructor.prototype[propsAsArray[attr]];
                }

                constructor.prototype = constructorPrototype;
            }

            // > todo: dokumentieren
            addObjectByString(constructor.prototype, props[i], function(arg){

                /*
                 * Wert in das echte Objekt schreiben bzw. aufrufen!
                 * */
                addObjectByString(object, this.notation, arg);

                /*
                 * @callback
                 * die CallbackFunktion die über den konstructor übergeben wird
                 * immer aufrufen wenn eine Methode/Attribute über konstructor
                 * registriert wurde!
                 */
                if(!is('undefined', callback)){
                    callback.call(object, arg);
                }

                /*
                 * @attr on[Methode] aufrufen
                 **/
                if(callbacks['on'+arrayToCamelCase(this.notation.split('.'))]!==void(0)){
                    callbacks['on'+arrayToCamelCase(this.notation.split('.'))].call(object, arg);
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

}());

window.onload = function(){

    var $ = document.querySelectorAll.bind(document);

    var $proxyObj = new ObjectObserve($('.header')[0], 'innerHTML', 'id', 'style.backgroundColor', 'style.width', function(arg){
        console.log('constructor', arg, this);
    });

    $proxyObj.onId(function(arg){
        console.log('onId_callback', arg, this);
    });
    $proxyObj.onInnerHTML(function(arg){
        console.log('onInnerHTML_callback', arg, this);
    });
    $proxyObj.onStyleWidth(function(arg){
        console.log('onStyleWidth_callback', arg, this);
    });
    $proxyObj.onStyleBackgroundColor(function(arg){
        console.log('onStyleBackgroundColor', arg, this);
    });

    $proxyObj.style.backgroundColor('red');
    $proxyObj.style.width('300px');
    $proxyObj.id('setter:im-id');
    $proxyObj.innerHTML('setter:Hello innerHTML :)');

    console.log($proxyObj);


};

/*
 $proxydomNode.style.width();
 $proxydomNode.style.height();
 $proxydomNode.setAttribute('data-foo', true);

 $proxydomNode.onStyleWidth(function(changes){

 });

 $proxydomNode.onSetAttribute(function(changes){

 });

 $proxydomNode.onSetAttribute({
     before : function(e){

     },
     after : function(e){

     }
 });
 */