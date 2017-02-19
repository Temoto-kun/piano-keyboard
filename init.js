/**
 * Script description.
 * @author TheoryOfNekomata
 * @date 2017-02-19
 */

(function init() {
    var pianoKeyboards = Array.prototype.slice.call(document.querySelectorAll('.piano'));

    pianoKeyboards
        .forEach(function initializePianoKeyboard(pianoKeyboard) {
            new window.PianoKeyboard(pianoKeyboard);
        });
})();
