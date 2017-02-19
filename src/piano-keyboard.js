/**
 * Script description.
 * @author TheoryOfNekomata
 * @date 2017-02-10
 */

(function pianoKeyboard() {
    var keys = 12,
        whiteKeys = 7,
        grandPianoStartKey = 1,
        grandPianoEndKey = 88,
        keyboardVel = 100,
        maxVel = 127;

    window.PianoKeyboard = function PianoRoll(kbdEl) {
        var sharpSuffix = '#',
            kbdClass = 'piano-keyboard',
            kbdData = {},
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
            return Math.floor((i + keys - 4) / keys);
        }

        function getNormalizedPitchNumber(i) {
            while (i < 0) {
                i += keys;
            }
            return i % keys;
        }

        function getLeftPositionRatio(i) {
            var ratios = [
                (8 / keys) + 0.0075,
                (5 / whiteKeys),
                (10 / keys),
                (6 / whiteKeys),
                0,
                (1 / keys),
                (1 / whiteKeys),
                (3 / keys) + 0.015,
                (2 / whiteKeys),
                (3 / whiteKeys),
                (6 / keys) + 0.015,
                (4 / whiteKeys)
            ];

            return ratios[getNormalizedPitchNumber(i)];
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

            return pitchClasses[getNormalizedPitchNumber(i)];
        }

        function getWidthUnit() {
            var whiteKeyWidth = parseFloat(kbdData.whiteKeyWidth);

            if (isNaN(whiteKeyWidth)) {
                switch (kbdData.whiteKeyWidth) {
                    case 'auto':
                        return '%';
                    default:
                        break;
                }
            }

            return 'px';
        }

        function getBlackKeyWidth() {
            var blackKeyWidth = getWhiteKeyWidth() * whiteKeys / keys;

            if (kbdData.keyProportion === 'balanced') {
                return getWhiteKeyWidth();
            }

            return getWidthUnit() === 'px' ? Math.ceil(blackKeyWidth) : blackKeyWidth;
        }

        function getWhiteKeyWidth() {
            var whiteKeyWidth = parseFloat(kbdData.whiteKeyWidth),
                startKey = kbdData.startKey,
                endKey = kbdData.endKey;

            if (isNaN(whiteKeyWidth)) {
                switch (kbdData.whiteKeyWidth) {
                    case 'auto':
                        if (kbdData.keyProportion === 'balanced') {
                            return 100 / (kbdData.endKey - kbdData.startKey + 1);
                        }
                        return 100 / getWhiteKeysInRange(startKey, endKey);
                    default:
                        break;
                }
            }

            return whiteKeyWidth;
        }

        function getHorizontalOffset() {
            var whiteKeyWidth = getWhiteKeyWidth(),
                ratio = getLeftPositionRatio(kbdData.startKey),
                octave = getOctave(kbdData.startKey);

            if (kbdData.keyProportion === 'balanced') {
                return (kbdData.startKey - 1) * whiteKeyWidth;
            }

            return (whiteKeyWidth * whiteKeys * ratio) + (octave * whiteKeyWidth * whiteKeys);
        }

        function getWhiteKeysInRange(startKey, endKey) {
            var whiteKeys = 0,
                i;

            for (i = startKey; i <= endKey; i++) {
                (function (i) {
                    switch (getNormalizedPitchNumber(i)) {
                        case 0:
                        case 2:
                        case 5:
                        case 7:
                        case 10:
                            return;
                        default:
                            break;
                    }
                    ++whiteKeys;
                })(i);
            }

            return whiteKeys;
        }

        function getLeftOffset(i) {
            var whiteKeyWidth = getWhiteKeyWidth(),
                ratio = getLeftPositionRatio(i),
                octave = getOctave(i);

            if (kbdData.keyProportion === 'balanced') {
                // TODO fix for balanced
                switch (getNormalizedPitchNumber(i)) {
                    case 1:
                    case 3:
                    case 6:
                    case 8:
                    case 11:
                        return ((i - 1) * whiteKeyWidth - whiteKeyWidth / 2) - getHorizontalOffset();
                    default:
                        break;
                }
                return ((i - 1) * whiteKeyWidth) - getHorizontalOffset();
            }
            return (whiteKeyWidth * whiteKeys * ratio + (octave * whiteKeyWidth * whiteKeys)) - getHorizontalOffset();
        }

        function generateStyleForWhiteKeys() {
            var css = '',
                whiteKeyWidth = getWhiteKeyWidth(),
                widthUnit = getWidthUnit(),
                i;

            for (i = kbdData.startKey; i <= kbdData.endKey; i++) {
                (function (i) {
                    var left;

                    left = getLeftOffset(i);

                    css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.key[data-key="' + i + '"]{left:' + left + widthUnit + '}';
                })(i);
            }
            css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key{width:' + whiteKeyWidth + widthUnit + '}';

            if (widthUnit !== '%') {
                if (kbdData.keyProportion === 'balanced') {
                    css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]{width:' + ((kbdData.endKey - kbdData.startKey + 1) * whiteKeyWidth) + widthUnit + '}'
                } else {
                    css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]{width:' + (getWhiteKeysInRange(kbdData.startKey, kbdData.endKey) * whiteKeyWidth) + widthUnit + '}'
                }
            }

            if (kbdData.keyProportion === 'balanced') {
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="C"],.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="E"],.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="F"],.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="B"]{width:' + (whiteKeyWidth * 1.5) + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="D"],.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="G"],.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="A"]{width:' + (whiteKeyWidth * 2) + widthUnit + '}';

                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="C"]:last-child{width:' + whiteKeyWidth + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="D"]:last-child{width:' + (whiteKeyWidth * 1.5) + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="F"]:last-child{width:' + whiteKeyWidth + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="G"]:last-child{width:' + (whiteKeyWidth * 1.5) + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="A"]:last-child{width:' + (whiteKeyWidth * 1.5) + widthUnit + '}';

                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key:first-child{left:0}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="D"]:first-child{width:' + (whiteKeyWidth * 1.5) + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="E"]:first-child{width:' + whiteKeyWidth + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="G"]:first-child{width:' + (whiteKeyWidth * 1.5) + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="A"]:first-child{width:' + (whiteKeyWidth * 1.5) + widthUnit + '}';
                css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.white.key[data-pitch="B"]:first-child{width:' + whiteKeyWidth + widthUnit + '}';
            }
            return css;
        }

        function generateStyle() {
            var css = '',
                blackKeyWidth = getBlackKeyWidth(),
                widthUnit = getWidthUnit();

            css += generateStyleForWhiteKeys();
            css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.black.key{width:' + blackKeyWidth + widthUnit + '}';
            return css;
        }

        function generateKeys() {
            var i;

            for (i = kbdData.startKey; i <= kbdData.endKey; i++) {
                (function (i) {
                    var key = document.createElement('button'),
                        //label = document.createElement('span'),
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

        function paintNoteOn(keyEl) {
            keyEl.classList.add('-active');
        }

        function paintNoteOff(keyEl) {
            keyEl.classList.remove('-active');
        }

        function triggerKeyboardEvent(type, detail) {
            var event = new CustomEvent(type);

            event.eventName = type;

            switch (type) {
                case 'noteon':
                case 'noteoff':
                    event.key = parseInt(detail.key.dataset.key);
                    event.velocity = parseInt(detail.velocity);
                    event.octave = parseInt(detail.key.dataset.octave);
                    event.pitch = detail.key.dataset.pitch;
                    break;
                default:
                    break;
            }

            kbdEl.dispatchEvent(event);

            return event;
        }

        function bindEvents() {
            var mouseVel = 0;

            function onNoteOn(e) {
                var kbdEvent;

                e.preventDefault();
                if (e.buttons === 1 && !e.target.classList.contains('-active') && e.target.classList.contains('key')) {
                    if (kbdEl.tabIndex === 0) {
                        kbdEl.focus();
                    }
                    kbdEvent = triggerKeyboardEvent('noteon', { key: e.target, velocity: e.velocity });
                    if (kbdEvent.defaultPrevented) {
                        return;
                    }
                    paintNoteOn(e.target);
                }
            }

            function onNoteOff(e) {
                var kbdEvent;

                e.preventDefault();
                if (e.target.classList.contains('-active') && e.target.classList.contains('key')) {
                    kbdEvent = triggerKeyboardEvent('noteoff', { key: e.target, velocity: e.velocity });
                    if (kbdEvent.defaultPrevented) {
                        return;
                    }
                    paintNoteOff(e.target);
                }
            }

            function onKeyboardKeydown(e) {
                var bindingsMap,
                    key,
                    keyEl,
                    kbdEvent;

                if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
                    return;
                }

                bindingsMap = kbdData.bindingsMap.toLowerCase();

                if (typeof bindingsMap === 'undefined') {
                    return;
                }

                key = bindings[bindingsMap][e.which];

                if (typeof key === 'undefined') {
                    return;
                }

                keyEl = kbdEl.querySelector('[data-key="' + key + '"]');

                if (!keyEl || keyEl.classList.contains('-active')) {
                    return;
                }

                kbdEvent = triggerKeyboardEvent('noteon', { key: keyEl, velocity: kbdData.keyboardVelocity });
                if (kbdEvent.defaultPrevented) {
                    return;
                }

                e.preventDefault();

                paintNoteOn(keyEl);
            }

            function onKeyboardKeyup(e) {
                var bindingsMap,
                    key,
                    keyEl,
                    kbdEvent;

                if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
                    return;
                }

                bindingsMap = kbdData.bindingsMap.toLowerCase();

                if (typeof bindingsMap === 'undefined') {
                    return;
                }

                key = bindings[bindingsMap][e.which];

                if (typeof key === 'undefined') {
                    return;
                }

                keyEl = kbdEl.querySelector('[data-key="' + key + '"]');

                if (!keyEl || !keyEl.classList.contains('-active')) {
                    return;
                }

                kbdEvent = triggerKeyboardEvent('noteoff', { key: keyEl, velocity: kbdData.keyboardVelocity });
                if (kbdEvent.defaultPrevented) {
                    return;
                }

                e.preventDefault();

                paintNoteOff(keyEl);
            }

            function onMouseDown(e) {
                var maxY = parseFloat(window.getComputedStyle(e.target).height),
                    offsetY = e.offsetY + parseFloat(getComputedStyle(e.target).borderTopWidth);

                mouseVel = Math.floor(maxVel * (offsetY / maxY));
                e.velocity = mouseVel;
                onNoteOn(e);
            }

            function onMouseUp(e) {
                e.velocity = mouseVel;
                onNoteOff(e);
            }

            function onMouseEnter(e) {
                e.velocity = mouseVel;
                onNoteOn(e);
            }

            function onMouseLeave(e) {
                e.velocity = mouseVel;
                onNoteOff(e);
            }

            kbdEl.addEventListener('keydown', onKeyboardKeydown);
            kbdEl.addEventListener('keyup', onKeyboardKeyup);
            kbdEl.addEventListener('mousedown', onMouseDown, true);
            kbdEl.addEventListener('mouseenter', onMouseEnter, true);
            kbdEl.addEventListener('mouseup', onMouseUp, true);
            kbdEl.addEventListener('mouseleave', onMouseLeave, true);
        }

        function normalizeKeyboardData() {
            var temp;

            kbdData.id = (kbdEl.dataset.kbdId = kbdEl.dataset.kbdId || Date.now());
            kbdData.startKey = parseInt(kbdEl.dataset.startKey) || grandPianoStartKey;
            kbdData.endKey = parseInt(kbdEl.dataset.endKey) || grandPianoEndKey;
            kbdData.whiteKeyWidth = kbdEl.dataset.whiteKeyWidth || 'auto';
            kbdData.keyboardVelocity = parseInt(kbdEl.dataset.keyboardVelocity) || keyboardVel;
            kbdData.keyProportion = kbdEl.dataset.keyProportion;

            if (isNaN(kbdData.startKey)) {
                kbdData.startKey = grandPianoStartKey;
            }

            if (isNaN(kbdData.endKey)) {
                kbdData.endKey = grandPianoEndKey;
            }

            if (kbdData.startKey > kbdData.endKey) {
                temp = kbdData.startKey;
                kbdData.startKey = kbdData.endKey;
                kbdData.endKey = temp;
            }

            kbdData.bindingsMap = 'standard'; // TODO implement other bindings maps
        }

        function addKeyboardUiAttributes() {
            if (kbdEl.hasAttribute('tabindex')) {
                return;
            }
            kbdEl.setAttribute('tabindex', 0);
        }

        function initializeKeyboardStyle() {
            var styleEl = document.querySelector('style[data-kbd-id="' + kbdData.id + '"]'),
                styleParent = document.getElementsByTagName('head')[0] || document.body;

            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.dataset.kbdId = kbdData.id;
                styleParent.appendChild(styleEl);
            }

            styleEl.innerHTML = generateStyle(kbdData);

            if (kbdEl.classList.contains(kbdClass)) {
                return;
            }
            kbdEl.classList.add(kbdClass);
        }
        
        normalizeKeyboardData();
        initializeKeyboardStyle();
        generateKeys();
        bindEvents();
        addKeyboardUiAttributes();
    };
})();
