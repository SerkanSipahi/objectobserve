#### ObjectObserve.js / Beta / ECMAscript 5 / Observe whatever you want
    * Objects --works
    * domNodes, native domMethods --works
    * Third Party --works
    * Methods --works
    * Attributes --works
    * our lib can much more than Object.observe (es6), it can observe domNodes,
      third party libraries, e.g jQuery, Zepto
    * whatever you want, on read or write operation :)

##### Works well with:
    * Chrome
    * Firefox
    * Safari
    * Opera
    * Internet-Explorer +9

##### High Performance
    * ~ 0.85 ms per object execution
    * the performance is very close to Object.observe - ES6

#### Usage
##### init Observer
````js
var observedObjectInstance = new ObjectObserve(@observedObject, [, @function globalcallback]);
````

````js
jQuery.noConflict();

var $ = document.querySelectorAll.bind(document),
    nativeObject = {
        a : {
            b : function(arg){
                this.a.c = arg;
            },
            c : null
        },
        d : null
    };

var $observedDomNode  = new ObjectObserve($('.domNode-class')[0], function(changes){
    // > constructor callback is optional
});
var $observedDomNode_2  = new ObjectObserve($('.domNode_2-class')[0]); // domNode object
var $observedjQueryObj  = new ObjectObserve(jQuery('.jquery-class'));  // jQuery object
var $nativeObject       = new ObjectObserve(nativeObject);             // custom object

// > register callbacks domNode
$observedDomNode.on({
    'setAttribute' : function(changes){
        console.log('onSetAttribute', changes, this);
    },
    'appendChild' : function(changes){
        console.log('onAppendChild', changes, this);
    },
    'classList.remove' : function(changes){
        console.log('onClassListRemove', changes, this);
    },
    'classList.add' : function(changes){
        console.log('onClassListAdd', changes, this);
    },
    'classList.contain' : function(changes){
        console.log('onClassListContain', changes, this);
    }
});

// > register callbacks domNode_2 ( separated is possible )
$observedDomNode_2.on({
    'style.backgroundColor' : function(changes){
        console.log('onStyleBackgroundColor', changes, this);
    }
});
$observedDomNode_2.on({
    'style.color' : function(changes){
        console.log('onStyleColor', changes, this);
    }
});
$observedDomNode_2.on({
    'style.fontWeight' : function(changes){
        console.log('onStyleFontWeight', changes, this);
    }
});

// > register callbacks jquery
$observedjQueryObj.on({
    'css' : function(changes){
        console.log('onCss', changes, this);
    },
    'html' : function(changes){
        console.log('onHtml', changes, this);
    },
    'append' : function(changes){
        console.log('onAppend', changes, this);
    }
});

// > register callbacks native object
$nativeObject.on({
   'a.b' : function(changes){
       console.log('on.a.b', changes, this);
   },
   'd' : function(changes){
       console.log('on.d', changes, this);
   }
});

// > write or read in observed object ! Each io operation triggered a registered callback :)

$observedDomNode.io({'setAttribute' : ['data-foo', 1234]});
$observedDomNode.io({'innerHTML' : 'im innerHTML'});
$observedDomNode.io({'appendChild' : document.createElement('span')});
$observedDomNode.io({'classList.add' : 'im-added-class'});
$observedDomNode.io({'classList.contains' : 'im-added-class'});

$observedDomNode_2.io({'style.backgroundColor' : 'red'});
$observedDomNode_2.io({'style.color' : 'green'});
$observedDomNode_2.io({'style.fontWeight' : 'bold'});

$observedjQueryObj.io({'css' : ['font-weight', 'bold']});
$observedjQueryObj.io({'html' : 'html over <strong>jQuery</strong>'});
$observedjQueryObj.io({'append' : '<span>append over jQuery</span>'});

$nativeObject.io({'a.b' : '"a.b" will write in "a.b.c"'});
$nativeObject.io({'d' : 'Hello World in "d"'});

console.log($observedDomNode);
console.log($observedDomNode_2);
console.log($observedjQueryObj);
console.log($nativeObject);

// > Getter not working -- in progress :)
//var foo = $observedFoo.io('style.backgroundColor');
//var boo = $observedFoo.io('innerHTML');


````

