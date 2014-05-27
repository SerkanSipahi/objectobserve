#### ObjectObserve.js ( ECMAscript 5 ) - observe whatever you want
    * Objects
    * domNode, native domMethods
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

var $observedObject = new ObjectObserve($('.header')[0],
    'innerHTML',
    'id',
    'style.backgroundColor',
    'style.width',
    'style.height',
    'setAttribute()',
    'classList.add()',
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
$observedObject.onClassListAdd(function(arg){
    console.log('onClassListAdd', arg, this);
});
$observedObject.onSetAttribute(function(arg){
    console.log('onSetAttribute', arg, this);
});

// > set or get to trigger the registered callbacks
$observedObject.style.backgroundColor('red');
$observedObject.style.height('100px');
$observedObject.style.width('300px');
$observedObject.id('setter:im-id');
$observedObject.innerHTML('setter:Hello innerHTML :)');

$observedObject.classList.add('added-class');
$observedObject.setAttribute('data-foo', 'nice');

console.log($observedObject);
````

#### instance

![instance](https://raw.githubusercontent.com/SerkanSipahi/objectobserve/master/instance.png)

