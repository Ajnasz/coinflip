/*jslint browser: true*/
(function () {
    "use strict";
    var coin, animating;
    const soundSrc =  "sounds/CoinFlip.ogg";

    const state = { heads: 0, tails: 0};

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
        var rand = Math.floor(Math.random() * 10);

        return Boolean(rand % 2);
    }

    animating = false;

    function updateState() {
        byId('HeadCount').querySelector('.coin-count').innerText = state.heads;
        byId('TailCount').querySelector('.coin-count').innerText = state.tails;
    }

    function enableFlip() {
        animating = false;
    }

    function onAnimationEndCb() {
      enableFlip();
      updateState();
    }

    function disableFlip() {
        animating = true;
    }

    function isFlipDisabled() {
        return animating;
    }

  function playSound() {
        const sound = byId('CoinFlipSound');
        sound.currentTime = 0;
        sound.pause();
        sound.src = soundSrc;
        sound.play();
  }

    function onSurfaceClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (isFlipDisabled()) {
            return;
        }


        const res = isHead();

        playSound();
        if (res) {
            state.heads += 1;
            head();
        } else {
            state.tails += 1;
            tail();
        }

        disableFlip();
    }

    listen(window, 'load', function () {
        coin = byId('Coin');
        onClick('Surface', onSurfaceClick);
        onTouchStart('Surface', onSurfaceClick);
        onAnimationEnd('Coin', onAnimationEndCb);
    }, false);

}());
