#### ObjectObserve.js

````js
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
````

