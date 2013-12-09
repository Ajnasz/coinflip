/*jslint browser: true*/
window.addEventListener('load', function () {
    "use strict";
    function byId(id) {
        return document.getElementById(id);
    }

    function listen(elem, event, cb) {
        elem.addEventListener(event, cb, false);
    }

    function onClick(elem, cb) {
        listen(byId(elem), 'click', cb);
    }

    function changeClasses(add) {
        var coin = byId('Coin');
        if (coin.classList.contains('head')) {
            coin.classList.add('start-head');
            coin.classList.remove('start-tail');
        } else {
            coin.classList.add('start-tail');
            coin.classList.remove('start-head');
        }

        coin.classList.remove('head');
        coin.classList.remove('tail');

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

    onClick('Surface', function () {
        var rand = Math.floor(Math.random() * 10) + 1;

        if (rand % 2) {
            tail();
        } else {
            head();
        }
    });

}, false);
