/*jslint browser: true*/
(function () {
    "use strict";
    var coin;
    function byId(id) {
        return document.getElementById(id);
    }

    function listen(elem, event, cb) {
        elem.addEventListener(event, cb, false);
    }

    function onClick(elem, cb) {
        listen(byId(elem), 'click', cb);
    }

    function setStartState() {

        if (coin.classList.contains('head')) {
            coin.classList.add('start-head');
            coin.classList.remove('start-tail');
        } else {
            coin.classList.add('start-tail');
            coin.classList.remove('start-head');
        }
    }

    function resetCoin() {
        coin.classList.remove('head');
        coin.classList.remove('tail');
    }

    function changeClasses(add) {
        setStartState();
        resetCoin();
        setTimeout(function () {
            coin.classList.add(add);
        }, 100);
    }

    function tail() {
        changeClasses('tail');
    }

    function head() {
        changeClasses('head');
    }

    function isHead() {
        var rand = String(Math.floor(Math.random() * 10));

        return Boolean(rand % 2);
    }

    function onSurfaceClick() {
        if (isHead()) {
            head();
        } else {
            tail();
        }
    }

    window.addEventListener('load', function () {
        coin = byId('Coin');
        onClick('Surface', onSurfaceClick);
    }, false);

}());
