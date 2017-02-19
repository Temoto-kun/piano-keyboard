(function () {
    var pianoKeyboards = Array.prototype.slice.call(document.querySelectorAll('.piano')),
        output,
        channel = 1,
        maxVelocity = 127,
        keyNumberAdjust = 20; // There's a different key numbering in MIDI, when C4 is 40 in a standard piano, in MIDI it is 60 (and labeled as C5 instead).

    WebMidi.enable(function (err) {
        if (!!err) {
            return;
        }

        output = WebMidi.outputs[0];

        pianoKeyboards
            .forEach(function initializePianoKeyboard(pianoKeyboard) {
                new window.PianoKeyboard(pianoKeyboard);

                if (!output) {
                    return;
                }

                pianoKeyboard.addEventListener('noteon', function onNoteOn(e) {
                    output.playNote(e.key + keyNumberAdjust, channel, { velocity: e.velocity / maxVelocity });
                });

                pianoKeyboard.addEventListener('noteoff', function onNoteOff(e) {
                    output.stopNote(e.key + keyNumberAdjust, channel, { velocity: e.velocity / maxVelocity });
                });
            });
    });
})();
