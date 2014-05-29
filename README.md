#### ObjectObserve.js / Alpha R1 / ECMAscript 5 / Observe whatever you want
    * Objects --works
    * domNodes, native domMethods --works
    * Third Party Librariess e.g jQuery, Zepto, etc --not testet
    * Methods --works
    * Attributes --works
    * whatever you want :)

##### Works well with:
    * Chrome
    * Firefox
    * Safari
    * Opera
    * Internet-Explorer +9

````js
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

var $observedFoo  = new ObjectObserve($('.foo')[0], function(changes){

}); // constructor callback is optional

// > observe domNode
var $observedBoo  = new ObjectObserve($('.boo')[0]);

// > observe native object
var $nativeObject = new ObjectObserve(nativeObject);

// > register callbacks
$observedFoo.on({
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

$observedBoo.on({
    'style.backgroundColor' : function(changes){
        console.log('onStyleBackgroundColor', changes, this);
    },
    'style.color' : function(changes){
        console.log('onStyleColor', changes, this);
    },
    'style.fontWeight' : function(changes){
        console.log('onStyleFontWeight', changes, this);
    }
});

$nativeObject.on({
   'a.b' : function(changes){
       console.log('on.a.b', changes, this);
   },
   'd' : function(changes){
       console.log('on.d', changes, this);
   }
});

// > Setter
$observedFoo.io({'setAttribute' : ['data-foo', 1234]});
$observedFoo.io({'appendChild' : document.createElement('span')});
$observedFoo.io({'classList.add' : 'im-added-class'});
$observedFoo.io({'classList.contains' : 'im-added-class'});
$observedFoo.io({'innerHTML' : 'im innerHTML'});

$observedBoo.io({'style.backgroundColor' : 'red'});
$observedBoo.io({'style.color' : 'green'});
$observedBoo.io({'style.fontWeight' : 'bold'});

$nativeObject.io({'a.b' : '"a.b" will write in "a.b.c"'});
$nativeObject.io({'d' : 'Hello World in "d"'});

console.log($observedFoo);
console.log($observedBoo);
console.log($nativeObject);
````

