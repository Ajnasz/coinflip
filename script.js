/*jslint browser: true*/
(function () {
    "use strict";
    let coin;
    let animating;
    const soundSrc =  "sounds/CoinFlip.ogg";

    const storeHeads = Number.parseInt(localStorage.getItem('coin-flip-heads'), 10);
    const storeTails = Number.parseInt(localStorage.getItem('coin-flip-tails'), 10);

    const storedState = {
      heads: Number.isNaN(storeHeads) ? 0 : storeHeads,
      tails: Number.isNaN(storeTails) ? 0 : storeTails,
    };

    const state = {
      heads: 0,
      tails: 0,
    };

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

    let currentToss = null;

    function updateState() {
      const head = byId('HeadCount');
      const tail = byId('TailCount');
      head.querySelector('.coin-count').innerText = state.heads;
      tail.querySelector('.coin-count').innerText = state.tails;
      head.querySelector('.coin-count-history').innerText = storedState.heads;
      tail.querySelector('.coin-count-history').innerText = storedState.tails;
      const sum = storedState.heads + storedState.tails;
      const headsPercent = (storedState.heads / sum) * 100;
      const tailsPercent = (storedState.tails / sum) * 100;
      if (isNaN(headsPercent) || isNaN(tailsPercent)) {
        return
    }
      head.querySelector('.progress-num').innerText = Math.round(headsPercent) + '%';
      tail.querySelector('.progress-num').innerText = Math.round(tailsPercent) + '%';
      head.querySelector('.progress').style.width = headsPercent + '%';
      tail.querySelector('.progress').style.width = tailsPercent + '%';
      // if (currentToss !== null) {
      //   byId('CurrentToss').querySelector('.coin-side').classList.remove('coin-head', 'coin-tail', 'coin-head-200ft', 'coin-tail-200ft');
      //   const coinClass = currentToss ? 'coin-head' : 'coin-tail';
      //   byId('CurrentToss').querySelector('.coin-side').classList.add(coinClass, coinClass + '-200ft');
      // }
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

        currentToss = res;

        playSound();
        if (res) {
            state.heads += 1;
            storedState.heads += 1;
            localStorage.setItem('coin-flip-heads', storedState.heads);
            head();
        } else {
            state.tails += 1;
            storedState.tails += 1;
            localStorage.setItem('coin-flip-tails', storedState.tails);
            tail();
        }


        disableFlip();
    }

    listen(window, 'load', function () {
        coin = byId('Coin');
        onClick('Surface', onSurfaceClick);
        onTouchStart('Surface', onSurfaceClick);
        onAnimationEnd('Coin', onAnimationEndCb);
        updateState();
    }, false);
}());
