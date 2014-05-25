//======= domObserve ==========

var ObjectObserve = (function(){

    'use strict';

    var toString = Object.prototype.toString,
        is = function(type, obj){
            return ( toString.call(obj).toLowerCase() === '[object '+type+']' );
        },
        capitalize = function(s){
            return s[0].toUpperCase() + s.slice(1);
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
            f              = 0;

            this.callbacks = {};

        if(is('function', lastArg)){ callback = lastArg; }
        else { props = args.slice(1, argsLength); }

        /*
         * @props
         * > über alle registrierten Methoden/Attribute iretrieren!
         **/
        propLength = props.length;
        for(i=0; i<propLength;i++){

            var context = {};
                context.notation = props[i];

            this._addObjectByString(constructor.prototype, props[i], function(arg){

                /*
                 * Wert in das echte Objekt schreiben bzw. aufrufen!
                 * */
                self._addObjectByString(object, this.notation, arg);

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
                self.callbacks['on'+self._arrayToCamelCase(this.notation.split('.'))].call(object, arg);


            }.bind(context));

            var onMethod = 'on'+self._arrayToCamelCase(context.notation.split('.'));
            this._addObjectByString(constructor.prototype, onMethod, function(callback){

                self.callbacks['on'+self._arrayToCamelCase(this.notation.split('.'))] = callback;

            }.bind(context));

        }

    }

    Observe.prototype._createObjectByString = function(namespace){

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

    Observe.prototype._addObjectByString = function(object, path, value){

        var i = 0,
            path = path.split('.');

        for (; i < path.length; i++){
            if (value !== void(0) && i + 1 === path.length){
                object[path[i]] = value;
            }
            object = object[path[i]];
        }

        return object;
    };

    Observe.prototype._arrayToCamelCase = function(array){
        var tmpString = '';
        for(var i=0;i<array.length;i++){
            tmpString += capitalize(array[i]);
        }
        return tmpString;
    };

    return Observe;

}());

window.onload = function(){

    var $ = document.querySelectorAll.bind(document);

    var $proxyObj = new ObjectObserve($('.header')[0], 'innerHTML', 'id', function(arg){
        console.log('constructor', arg, this);
    });

    $proxyObj.onId(function(arg){
        console.log('onId_callback', arg, this);
    });
    $proxyObj.onInnerHTML(function(arg){
        console.log('onInnerHTML_callback', arg, this);
    });

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