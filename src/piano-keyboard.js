/**
 * Script description.
 * @author TheoryOfNekomata
 * @date 2017-02-10
 */

(function pianoKeyboard() {
    var sharpSuffix = '#',
        bindings = {
            'standard': {
                81: 40,
                50: 41,
                87: 42,
                51: 43,
                69: 44,
                82: 45,
                53: 46,
                84: 47,
                54: 48,
                89: 49,
                55: 50,
                85: 51,
                73: 52,
                57: 53,
                79: 54,
                48: 55,
                80: 56,
                219: 57,
                187: 58,
                221: 59,

                90: 28,
                83: 29,
                88: 30,
                68: 31,
                67: 32,
                86: 33,
                71: 34,
                66: 35,
                72: 36,
                78: 37,
                74: 38,
                77: 39,
                188: 40,
                76: 41,
                190: 42,
                186: 43,
                191: 44
            },
            'janko': {

            }
        };

    function getOctave(i) {
        return Math.floor((i + 8) / 12);
    }

    function getLeftPositionRatio(i) {
        var ratios = [
                (8 / 12),
                (5 / 7),
                (10 / 12),
                (6 / 7),
                (0),
                (1 / 12),
                (1 / 7),
                (3 / 12),
                (2 / 7),
                (3 / 7),
                (6 / 12),
                (4 / 7),
            ];

        while (i < 0) {
            i += 12;
        }
        return ratios[i % 12];
    }

    function getPitchClass(i) {
        var pitchClasses = [
                'G' + sharpSuffix,
                'A',
                'A' + sharpSuffix,
                'B',
                'C',
                'C' + sharpSuffix,
                'D',
                'D' + sharpSuffix,
                'E',
                'F',
                'F' + sharpSuffix,
                'G'
            ];

        while (i < 0) {
            i += 12;
        }
        return pitchClasses[i % 12];
    }

    function getHorizontalOffset(kbdData) {
        var startKey = parseInt(kbdData.startKey),
            whiteKeyWidth = parseFloat(kbdData.whiteKeyWidth),
            ratio = getLeftPositionRatio(startKey),
            octave = getOctave(startKey);

        return whiteKeyWidth * 7 * ratio + (octave * whiteKeyWidth * 7);
    }

    function generateStyle(kbdData) {
        var css = '',
            startKey = parseInt(kbdData.startKey),
            endKey = parseInt(kbdData.endKey),
            whiteKeyWidth = parseFloat(kbdData.whiteKeyWidth),
            i;

        for (i = startKey; i <= endKey; i++) {
            (function (i) {
                var left,
                    ratio = getLeftPositionRatio(i),
                    octave = getOctave(i);

                left = whiteKeyWidth * 7 * ratio + (octave * whiteKeyWidth * 7) - getHorizontalOffset(kbdData);

                css += '.piano-keyboard[data-kbd-id="' + kbdData.kbdId + '"]>.key[data-key="' + i + '"]{left:' + left + 'px}\n';
            })(i);
        }

        css += '.piano-keyboard[data-kbd-id="' + kbdData.kbdId + '"]>.white.key{width:' + kbdData.whiteKeyWidth + 'px;}\n';
        css += '.piano-keyboard[data-kbd-id="' + kbdData.kbdId + '"]>.black.key{width:' + Math.ceil(kbdData.whiteKeyWidth * 7 / 12) + 'px;}\n';
        return css;
    }

    function generateKeys(kbdEl) {
        var i,
            startKey = parseInt(kbdEl.dataset.startKey),
            endKey = parseInt(kbdEl.dataset.endKey);

        for (i = startKey; i <= endKey; i++) {
            (function (i) {
                var key = document.createElement('button'),
                    pitchClass = getPitchClass(i),
                    octave = getOctave(i);

                key.dataset.key = i;
                key.dataset.octave = octave;
                key.classList.add(pitchClass.indexOf(sharpSuffix) > -1 ? 'black' : 'white');
                key.dataset.pitch = pitchClass;
                key.classList.add('key');
                key.setAttribute('tabindex', -1);

                kbdEl.appendChild(key);
            })(i);
        }
    }

    function doNoteOn(keyEl) {
        keyEl.classList.add('-active');
    }

    function doNoteOff(keyEl) {
        keyEl.classList.remove('-active');
    }

    function triggerKeyboardEvent(kbdEl, type, detail) {
        var event = new CustomEvent(type);

        event.eventName = type;

        switch (type) {
            case 'noteon':
            case 'noteoff':
                event.key = parseInt(detail.key.dataset.key);
                event.octave = parseInt(detail.key.dataset.octave);
                event.pitch = detail.key.dataset.pitch;
                break;
            default:
                break;
        }

        kbdEl.dispatchEvent(event);
        return event;
    }

    function onNoteOn(e) {
        var kbdEvent;

        e.preventDefault();
        if (e.buttons === 1 && !e.target.classList.contains('-active')) {
            this.focus();
            kbdEvent = triggerKeyboardEvent(this, 'noteon', { key: e.target });
            if (kbdEvent.defaultPrevented) {
                return;
            }
            doNoteOn(e.target);
        }
    }

    function onNoteOff(e) {
        var kbdEvent;

        e.preventDefault();
        if (e.target.classList.contains('-active')) {
            kbdEvent = triggerKeyboardEvent(this, 'noteoff', { key: e.target });
            if (kbdEvent.defaultPrevented) {
                return;
            }
            doNoteOff(e.target);
        }
    }

    function onKeyboardKeydown(e) {
        var kbdEl = this,
            bindingsMap = kbdEl.dataset.bindingsMap.toLowerCase(),
            key,
            keyEl,
            kbdEvent;

        e.preventDefault();

        if (typeof bindingsMap === 'undefined') {
            return;
        }

        key = bindings[bindingsMap][e.which];

        if (typeof key === 'undefined') {
            return;
        }

        keyEl = kbdEl.querySelector('[data-key="' + key + '"]');

        if (keyEl.classList.contains('-active')) {
            return;
        }

        kbdEvent = triggerKeyboardEvent(this, 'noteon', { key: keyEl });
        if (kbdEvent.defaultPrevented) {
            return;
        }
        doNoteOn(keyEl);
    }

    function onKeyboardKeyup(e) {
        var kbdEl = this,
            bindingsMap = kbdEl.dataset.bindingsMap.toLowerCase(),
            key,
            keyEl,
            kbdEvent;

        e.preventDefault();

        if (typeof bindingsMap === 'undefined') {
            return;
        }

        key = bindings[bindingsMap][e.which];

        if (typeof key === 'undefined') {
            return;
        }

        keyEl = kbdEl.querySelector('[data-key="' + key + '"]');

        if (!keyEl.classList.contains('-active')) {
            return;
        }

        kbdEvent = triggerKeyboardEvent(this, 'noteoff', { key: keyEl });
        if (kbdEvent.defaultPrevented) {
            return;
        }
        doNoteOff(keyEl);
    }

    function bindEvents(kbdEl) {
        kbdEl.addEventListener('mousedown', onNoteOn, true);
        kbdEl.addEventListener('mouseenter', onNoteOn, true);
        kbdEl.addEventListener('mouseup', onNoteOff, true);
        kbdEl.addEventListener('mouseleave', onNoteOff, true);
        kbdEl.addEventListener('keydown', onKeyboardKeydown);
        kbdEl.addEventListener('keyup', onKeyboardKeyup);
    }

    function initializeKeyboard(kbdEl) {
        var styleEl,
            styleParent = document.getElementsByTagName('head')[0] || document.body;

        kbdEl.keys = kbdEl.keys || [];
        kbdEl.dataset.kbdId = kbdEl.dataset.kbdId || Date.now();
        kbdEl.dataset.startKey = kbdEl.dataset.startKey || 1;
        kbdEl.dataset.endKey = kbdEl.dataset.endKey || 88;
        kbdEl.dataset.bindingsMap = 'standard';
        kbdEl.setAttribute('tabindex', 0);
        styleEl = document.querySelector('style[data-kbd-id="' + kbdEl.dataset.kbdId + '"]');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.dataset.kbdId = kbdEl.dataset.kbdId;
            styleParent.appendChild(styleEl);
        }
        styleEl.innerHTML = generateStyle(kbdEl.dataset);

        generateKeys(kbdEl);
        bindEvents(kbdEl);
    }

    Array.prototype.slice.call(document.querySelectorAll('.piano-keyboard'))
        .forEach(initializeKeyboard);
})();
