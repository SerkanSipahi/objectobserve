//======= domObserve ==========

var ObjectObserve = (function(){

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
            attr           = 0,
            attrLength     = 0,
            lastArg        = args.slice(argsLength-1, argsLength)[0],
            props          = args.slice(1, argsLength-1),
            propLength     = 0,
            i              = 0,
            f              = 0;

            this.tmpStore  = [];
            this.callbacks = {};

        if(is('function', lastArg)){ callback = lastArg; }
        else { props = args.slice(1, argsLength); }

        /*
         * @props
         * > über alle registrierten Methoden/Attribute iretrieren!
         **/
        propLength = props.length;
        for(i=0; i<propLength;i++){

            var test_tmpFunction = this._createObjectByString(props[i]);
            console.log(test_tmpFunction);

            attr = props[i].split('.');
            attrLength = attr.length;

            if(attrLength === 1){

                // > hier übergebene attribute chain auflösen!
                var tmpFunction      = {},
                    context          = {};
                    context[attr[0]] = {};

                // > hier übergebene attribute chain auflösen!
                tmpFunction[attr[0]] = function(arg){

                    var attr = Object.keys(this)[0];

                    /*
                     * Wert in das echte Objekt schreiben bzw. aufrufen!
                     * */
                    object[attr] = arg;

                    /*
                     * @callback
                     * die CallbackFunktion die über den konstructor übergeben wird
                     * immer aufrufen wenn eine Methode/Attribute über konstructor
                     * registriert wurde!
                     */
                    if(is(callback) !== 'undefined'){
                        callback.call(object, arg);
                    }

                    /*
                     * @attr on[Methode] aufrufen
                     **/
                    self.callbacks['on'+capitalize(attr)].call(object, arg);


                }.bind(context);

                this.tmpStore.push(tmpFunction);

            }
        }

        for(var index in this.tmpStore){
            if(!this.tmpStore.hasOwnProperty(index)){ continue; }
            for(var func in this.tmpStore[index]){
                if(!this.tmpStore[index].hasOwnProperty(func)){ continue; }

                // > hier übergebene attribute chain auflösen!
                constructor.prototype[func] = this.tmpStore[index][func];

                // > hier übergebene attribute chain auflösen!
                var tmpContext = {};
                    tmpContext[func] = {};

                constructor.prototype['on'+capitalize(func)] = function(callback){
                    var attr = Object.keys(this)[0];
                    self.callbacks['on'+capitalize(attr)] = callback;
                }.bind(tmpContext);

            }
        }

    }

    Observe.prototype = {

        _createObjectByString : function(namespace){

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
        },

        _setValueByString : function(object, path, value){

            var i = 0,
                path = path.split('.');

            for (; i < path.length; i++){
                if (value !== void(0) && i + 1 === path.length){
                    object[path[i]] = value;
                }
                object = object[path[i]];
            }

            return object;
        }
    };

    return Observe;

}());

window.onload = function(){

    var $ = document.querySelectorAll.bind(document);

    var $proxyObj = new ObjectObserve($('.header')[0], 'innerHTML', 'id', function(arg){
        console.log('constructor', arg, this);
    });

    $proxyObj.onId(function(arg){
        console.log('onId_callback', arg);
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