(function () {
    var pianoKeyboard = document.getElementById('piano-keyboard'),
        channel = 1,
        maxVelocity = 127,
        keyNumberAdjust = 20; // There's a different key numbering in MIDI, when C4 is 40 in a standard piano, in MIDI it is 60 (and labeled as C5 instead).

    new window.PianoKeyboard(pianoKeyboard);

    WebMidi.enable(function (err) {
        var output;

        if (!!err) {
            return;
        }

        output = WebMidi.outputs[0];

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
})();
