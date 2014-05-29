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
var $ = document.querySelectorAll.bind(document);

var $observedFoo = new ObjectObserve($('.foo')[0], function(changes){

});
var $observedBoo = new ObjectObserve($('.boo')[0], function(changes){

});

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

// > Setter
$observedFoo.io({'setAttribute' : ['data-foo', 1234]});
$observedFoo.io({'appendChild' : document.createElement('span')});
$observedFoo.io({'classList.add' : 'im-added-class'});
$observedFoo.io({'innerHTML' : 'im innerHTML'});

$observedBoo.io({'style.backgroundColor' : 'red'});
$observedBoo.io({'style.color' : 'green'});
$observedBoo.io({'style.fontWeight' : 'bold'});

console.log($observedFoo);
console.log($observedBoo);

// > Getter
//$observedFoo.io('style.backgroundColor');
//$observedFoo.io('innerHTML');

};
````

