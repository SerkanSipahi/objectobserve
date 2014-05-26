#### ObjectObserve.js ( ECMAscript 5 )

##### Works well with:
    * Chrome
    * Firefox
    * Safari
    * Opera
    * Internet-Explorer +9

````js
var $ = document.querySelectorAll.bind(document);

var $observedObject = new ObjectObserve(
    // > observed object
    $('.header')[0],
    // > observed attributes/methods
    'innerHTML',
    'id',
    'style.backgroundColor',
    'style.width',
    'style.height',
    'setAttribute()',
    // > global callback
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

console.log($proxyObj);
````

