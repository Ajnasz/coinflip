/*jslint browser: true*/
(function() {
    "use strict";
    let coin;
    let animating;
    const soundSrc = "sounds/CoinFlip.ogg";

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

    function setText(text, selector, parent = document) {
        const element = (parent || document).querySelector(selector);
        if (element) {
            element.innerText = text;
        }
    }

    function setWidth(width, selector, parent = document) {
        const element = (parent || document).querySelector(selector);
        if (element) {
            element.style.width = width;
        }
    }

    function listen(elem, event, cb) {
        elem.addEventListener(event, cb);
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
        ].forEach(function(ev) {
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
        setTimeout(function() {
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
        var rand = Math.floor(Math.random() * 2);

        return Boolean(rand);
    }

    animating = false;

    let currentToss = null;

    function setProgress(percent, parent) {
        setWidth(percent + '%', ' .progress', parent);
        setText(percent + '%', ' .progress-num', parent);
    }

    function calculatePercent(heads, tails) {
        return Math.min(100, Math.round((heads / (heads + tails)) * 100) || 0);
    }

    function setStat(count, percent, parent) {
        setText(count, '.coin-count', parent);
        setProgress(percent, parent);
    }

    function updateStateUI(state, parent) {
        const head = parent.querySelector('.head');
        const tails = parent.querySelector('.tails');
        setStat(state.heads, calculatePercent(state.heads, state.tails), head);
        setStat(state.tails, calculatePercent(state.tails, state.heads), tails);
    }

    // when heads/tails are PIish numbers, show the magic effect easter egg
    function getMagicClass(state) {
        if (state.heads === 3 && state.tails === 1) {
            return ['magic', 'magic-color'];
        }

        if (state.heads === 1 && state.tails === 3) {
            return ['magic', 'magic-color2'];
        }

        return [];
    }

    function updateState() {
        updateStateUI(state, byId('CurrentStats'));
        updateStateUI(storedState, byId('HistoryStats'));

        if (currentToss !== null) {
            const text = currentToss ? 'Heads' : 'Tails';
            setText(text, '#CurrentToss');
            byId('CurrentToss').style.display = 'block';
        }

        byId('Surface').classList.remove('magic', 'magic-color', 'magic-color2');
        byId('Surface').classList.add(...getMagicClass(state));
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

    function toggleStats(e) {
        e.preventDefault();
        e.stopPropagation();
        const hasStats = byId('Surface').dataset.hasStats === 'true';

        byId('Surface').dataset.hasStats = hasStats ? 'false' : 'true';
    }

    function clearStats(e) {
        e.preventDefault();
        e.stopPropagation();
        localStorage.removeItem('coin-flip-heads');
        localStorage.removeItem('coin-flip-tails');
        storedState.heads = 0;
        storedState.tails = 0;
        updateState();
    }

    function clearCurrentStats(e) {
        e.preventDefault();
        e.stopPropagation();
        state.heads = 0;
        state.tails = 0;
        updateState();
    }


    listen(window, 'load', function() {
        coin = byId('Coin');
        onClick('ToggleStats', toggleStats);
        onTouchStart('ToggleStats', toggleStats);
        onClick('Surface', onSurfaceClick);
        onTouchStart('Surface', onSurfaceClick);
        onAnimationEnd('Coin', onAnimationEndCb);
        onClick('ClearStats', clearStats);
        onTouchStart('ClearStats', clearStats);
        onClick('ClearCurrentStats', clearCurrentStats);
        onTouchStart('ClearCurrentStats', clearCurrentStats);
        updateState();
    }, false);
}());
