/**
 * Script description.
 * @author TheoryOfNekomata
 * @date 2017-02-10
 */

(function (root, name, dependencies, factory) {
    var Component = function Oatmeal(deps) {
        return (root[name] = factory.apply(null, deps));
    };

    if (typeof define === 'function' && define.amd) {
        define(dependencies, function () {
            return new Component(
                Array.prototype.slice.call(arguments)
            );
        });
        return;
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = new Component(
            dependencies.map(function (depName) {
                return require(depName);
            })
        );
        return;
    }

    return new Component(
        dependencies.map(function (depName) {
            return root[depName];
        })
    );
})(this, 'PianoKeyboard', [], function pianoKeyboard() {
    //noinspection MagicNumberJS
    var
        // enum for pitch classes
        PitchClass = {
            GSharp: 0,
            A: 1,
            ASharp: 2,
            B: 3,
            C: 4,
            CSharp: 5,
            D: 6,
            DSharp: 7,
            E: 8,
            F: 9,
            FSharp: 10,
            G: 11
        },

        // all the pitch classes in a single octave
        pitchClassCount = Object.keys(PitchClass).length,

        // only the white keys' count in a single octave
        whiteKeyPitchClassCount = Object.keys(PitchClass).filter(function (key) { return key.indexOf('Sharp') < 0; }).length,

        // default start key
        grandPianoStartKey = 1,

        // default end key
        grandPianoEndKey = 88,

        // default velocity on playing in the keyboard
        keyboardVelocity = 100,

        // maximum velocity
        maxVelocity = 127,

        // adjustment for black key positioning
        blackKeyRatioAdjustment = 0.015,

        // key bindings
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

    return function PianoKeyboard(kbdEl) {
        var
            // sharp suffix
            sharpSuffix = '#',

            // keyboard class
            kbdClass = 'piano-keyboard',

            // normalized keyboard data
            kbdData = {};

        /**
         * Gets the octave of a key.
         * @param keyNumber The key's number, starting with 0 = G#0.
         * @returns {number} The octave
         */
        function getOctave(keyNumber) {
            return Math.floor((keyNumber + pitchClassCount - 4) / pitchClassCount);
        }

        /**
         * Gets the pitch class of a key.
         * @param keyNumber The key's number, starting with 0 = G#0.
         * @returns {number} The pitch class (0 = G#, 11 = G).
         */
        function getPitchClass(keyNumber) {
            while (keyNumber < 0) {
                keyNumber += pitchClassCount;
            }
            return keyNumber % pitchClassCount;
        }

        /**
         * Gets the left position ratio of a key.
         * @param keyNumber The key's number, starting with 0 = G#0.
         * @returns {number} The left position ratio, with 1 = spanning a full octave.
         */
        function getLeftPositionRatio(keyNumber) {
            var ratios = [
                (8 / pitchClassCount) + blackKeyRatioAdjustment / 2,
                (5 / whiteKeyPitchClassCount),
                (10 / pitchClassCount),
                (6 / whiteKeyPitchClassCount),
                0,
                (1 / pitchClassCount),
                (1 / whiteKeyPitchClassCount),
                (3 / pitchClassCount) + blackKeyRatioAdjustment,
                (2 / whiteKeyPitchClassCount),
                (3 / whiteKeyPitchClassCount),
                (6 / pitchClassCount) + blackKeyRatioAdjustment,
                (4 / whiteKeyPitchClassCount)
            ];

            return ratios[getPitchClass(keyNumber)];
        }

        /**
         * Gets the name of the key's pitch class.
         * @param keyNumber The key's number, starting with 0 = G#0.
         * @returns {string} The name of the pitch class.
         */
        function getPitchClassName(keyNumber) {
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

            return pitchClasses[getPitchClass(keyNumber)];
        }

        /**
         * Gets the width unit of the keyboard.
         * @returns {string} The width unit.
         */
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

        /**
         * Gets the unit-less black key width of the keyboard.
         * @returns {number} The unit-less width of the black keys.
         */
        function getBlackKeyWidth() {
            var blackKeyWidth = getWhiteKeyWidth() * whiteKeyPitchClassCount / pitchClassCount;

            if (kbdData.keyProportion === 'balanced') {
                return getWhiteKeyWidth();
            }

            return getWidthUnit() === 'px' ? Math.ceil(blackKeyWidth) : blackKeyWidth;
        }

        /**
         * Gets the unit-less white key width of the keyboard.
         * @returns {number} The unit-less width of the white keys.
         */
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

        /**
         * Gets the unit-less horizontal offset of the keyboard.
         * @returns {number} The horizontal offset of the keyboard.
         */
        function getHorizontalOffset() {
            var whiteKeyWidth = getWhiteKeyWidth(),
                ratio = getLeftPositionRatio(kbdData.startKey),
                octave = getOctave(kbdData.startKey);

            if (kbdData.keyProportion === 'balanced') {
                return (kbdData.startKey - 1) * whiteKeyWidth;
            }

            return (whiteKeyWidth * whiteKeyPitchClassCount * ratio) + (octave * whiteKeyWidth * whiteKeyPitchClassCount);
        }

        /**
         * Gets the white keys within a range of keys.
         * @param startKey The start key number of the range.
         * @param endKey The end key number of the range.
         * @returns {number} The number of white keys within the range.
         */
        function getWhiteKeysInRange(startKey, endKey) {
            var whiteKeys = 0,
                i;

            for (i = startKey; i <= endKey; i++) {
                (function (i) {
                    switch (getPitchClass(i)) {
                        case PitchClass.GSharp:
                        case PitchClass.ASharp:
                        case PitchClass.CSharp:
                        case PitchClass.DSharp:
                        case PitchClass.FSharp:
                            return;
                        default:
                            break;
                    }
                    ++whiteKeys;
                })(i);
            }

            return whiteKeys;
        }

        /**
         * Gets the left offset of the key.
         * @param keyNumber
         * @returns {number} The left offset of the key.
         */
        function getLeftOffset(keyNumber) {
            var whiteKeyWidth = getWhiteKeyWidth(),
                ratio = getLeftPositionRatio(keyNumber),
                octave = getOctave(keyNumber);

            if (kbdData.keyProportion === 'balanced') {
                switch (getPitchClass(keyNumber)) {
                    case PitchClass.A:
                    case PitchClass.B:
                    case PitchClass.D:
                    case PitchClass.E:
                    case PitchClass.G:
                        return ((keyNumber - 1) * whiteKeyWidth - whiteKeyWidth / 2) - getHorizontalOffset();
                    default:
                        break;
                }
                return ((keyNumber - 1) * whiteKeyWidth) - getHorizontalOffset();
            }
            return (whiteKeyWidth * whiteKeyPitchClassCount * ratio + (octave * whiteKeyWidth * whiteKeyPitchClassCount)) - getHorizontalOffset();
        }

        /**
         * Generates styles for white keys.
         * @returns {string} The CSS string for styling white keys.
         */
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

        /**
         * Generates styles for black keys.
         * @returns {string} CSS string for styling black keys.
         */
        function generateStyleForBlackKeys() {
            var css = '',
                blackKeyWidth = getBlackKeyWidth(),
                widthUnit = getWidthUnit();

            css += '.piano-keyboard[data-kbd-id="' + kbdData.id + '"]>.black.key{width:' + blackKeyWidth + widthUnit + '}';

            return css;
        }

        /**
         * Generates styles for the keyboard.
         * @returns {string} CSS string for styling the keyboard.
         */
        function generateStyle() {
            var css = '';

            css += generateStyleForWhiteKeys();
            css += generateStyleForBlackKeys();

            return css;
        }

        /**
         * Generates the keys of the keyboard.
         */
        function generateKeys() {
            var i;

            for (i = kbdData.startKey; i <= kbdData.endKey; i++) {
                (function (i) {
                    var key = document.createElement('button'),
                        pitchClass = getPitchClassName(i),
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

        /**
         * Paints the key being pressed.
         * @param {Element} keyEl The key element.
         */
        function paintNoteOn(keyEl) {
            keyEl.classList.add('-active');
        }

        /**
         * Paints the key being released.
         * @param {Element} keyEl The key element.
         */
        function paintNoteOff(keyEl) {
            keyEl.classList.remove('-active');
        }

        /**
         * Triggers a keyboard event.
         * @param {string} type The event type.
         * @param {string} detail Additional data of the event.
         * @returns {CustomEvent} The event.
         */
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

        /**
         * Binds the events of the keyboard.
         */
        function bindEvents() {
            var mouseVel = 0;

            /**
             *
             * @param e
             */
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

            /**
             *
             * @param e
             */
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

            /**
             *
             * @param e
             */
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

            /**
             *
             * @param e
             */
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

            /**
             *
             * @param e
             */
            function onMouseDown(e) {
                var maxY = parseFloat(window.getComputedStyle(e.target).height),
                    offsetY = e.offsetY + parseFloat(getComputedStyle(e.target).borderTopWidth);

                mouseVel = Math.floor(maxVelocity * (offsetY / maxY));
                e.velocity = mouseVel;
                onNoteOn(e);
            }

            /**
             *
             * @param e
             */
            function onMouseUp(e) {
                e.velocity = mouseVel;
                onNoteOff(e);
            }

            /**
             *
             * @param e
             */
            function onMouseEnter(e) {
                e.velocity = mouseVel;
                onNoteOn(e);
            }

            /**
             *
             * @param e
             */
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

        /**
         * Normalizes the keyboard data.
         */
        function normalizeKeyboardData() {
            var temp;

            kbdData.id = (kbdEl.dataset.kbdId = kbdEl.dataset.kbdId || Date.now());
            kbdData.startKey = parseInt(kbdEl.dataset.startKey) || grandPianoStartKey;
            kbdData.endKey = parseInt(kbdEl.dataset.endKey) || grandPianoEndKey;
            kbdData.whiteKeyWidth = kbdEl.dataset.whiteKeyWidth || 'auto';
            kbdData.keyboardVelocity = parseInt(kbdEl.dataset.keyboardVelocity) || keyboardVelocity;
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

        /**
         *
         */
        function addKeyboardUiAttributes() {
            if (kbdEl.hasAttribute('tabindex')) {
                return;
            }
            kbdEl.setAttribute('tabindex', 0);
        }

        /**
         *
         */
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

        /**
         *
         */
        function addMethods() {
            kbdEl.playNote = function playNote(noteInfo) {
                var keyEl = kbdEl.querySelector('[data-key="' + noteInfo.key + '"]'),
                    detail;

                if (!keyEl || keyEl.classList.contains('-active')) {
                    return kbdEl;
                }

                detail = { key: keyEl };
                detail.velocity = noteInfo.velocity;
                detail.pan = noteInfo.pan;

                triggerKeyboardEvent('noteon', detail);
                paintNoteOn(keyEl);

                return kbdEl;
            };

            kbdEl.stopNote = function stopNote(noteInfo) {
                var keyEl = kbdEl.querySelector('[data-key="' + noteInfo.key + '"]'),
                    detail;

                if (!keyEl || keyEl.classList.contains('-active')) {
                    return kbdEl;
                }

                detail = { key: keyEl };
                detail.velocity = noteInfo.velocity;
                detail.pan = noteInfo.pan;

                triggerKeyboardEvent('noteoff', detail);
                paintNoteOn(keyEl);

                return kbdEl;
            };
        }

        normalizeKeyboardData();
        initializeKeyboardStyle();
        generateKeys();
        bindEvents();
        addKeyboardUiAttributes();
        addMethods();
    };
});

