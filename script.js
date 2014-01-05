/*jslint browser: true*/
(function () {
    "use strict";
    var coin, animating;
    function byId(id) {
        return document.getElementById(id);
    }

    function listen(elem, event, cb) {
        elem.addEventListener(event, cb, false);
    }

    function onClick(elem, cb) {
        listen(byId(elem), 'click', cb);
    }

    function onTouchStart(elem, cb) {
        listen(byId(elem), 'touchend', cb);
    }

    function onTransitionEnd(elem, cb) {
        [
            'transitionend',
            'moztransitionend',
            'webkitTransitionEnd',
            'MSTransitionEnd',
            'oTransitionEnd',
            'otransitionend'
        ].forEach(function (ev) {
            listen(byId(elem), ev, cb);
        });
    }

    function onAnimationEnd(elem, cb) {
        [
            'animationend',
            'mozanimationend',
            'webkitAnimationEnd',
            'MSAnimationEnd',
            'oAnimationEnd',
            'oanimationend'
        ].forEach(function (ev) {
            listen(byId(elem), ev, cb);
        });
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

    animating = false;

    function onSurfaceClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (animating) {
            return;
        }

        byId('CoinFlipSound').play();
        if (isHead()) {
            head();
        } else {
            tail();
        }
        animating = true;
    }

    function onSurfaceTransitionEnd(e) {
        animating = false;
    }

    listen(window, 'load', function () {
        coin = byId('Coin');
        onClick('Surface', onSurfaceClick);
        onTouchStart('Surface', onSurfaceClick);
        onTransitionEnd('Surface', onSurfaceTransitionEnd);
        onAnimationEnd('Coin', onSurfaceTransitionEnd);
    }, false);

}());
