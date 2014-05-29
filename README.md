#### ObjectObserve.js / Beta Release / ECMAscript 5 / Observe whatever you want
    * Objects
    * domNodes, native domMethods
    * Third Party Librariess e.g jQuery, Zepto, etc
    * Methods
    * Attributes
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
````

