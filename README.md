#### ObjectObserve.js

````js
    var $ = document.querySelectorAll.bind(document);

    // > init observer
    var $proxyObj = new ObjectObserve($('.header')[0],
        'innerHTML',
        'id',
        'style.backgroundColor',
        'style.width',
        'style.height',
        'setAttribute()',
        function(arg){
            console.log('constructor', arg, this);
    });

    // > register callbacks
    $proxyObj.onId(function(arg){
        console.log('onId_callback', arg, this);
    });
    $proxyObj.onInnerHTML(function(arg){
        console.log('onInnerHTML_callback', arg, this);
    });
    $proxyObj.onStyleWidth(function(arg){
        console.log('onStyleWidth_callback', arg, this);
    });
    $proxyObj.onStyleHeight(function(arg){
        console.log('onStyleHeight_callback', arg, this);
    });
    $proxyObj.onStyleBackgroundColor(function(arg){
        console.log('onStyleBackgroundColor', arg, this);
    });
    $proxyObj.onSetAttribute(function(arg){
        console.log('onSetAttribute', arg, this);
    });

    // > set or get to trigger the registered callbacks
    $proxyObj.style.backgroundColor('red');
    $proxyObj.style.height('100px');
    $proxyObj.style.width('300px');
    $proxyObj.id('setter:im-id');
    $proxyObj.innerHTML('setter:Hello innerHTML :)');
    $proxyObj.setAttribute('data-foo', 'nice');

    console.log($proxyObj);
````

