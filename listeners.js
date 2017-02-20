(function () {
    var pianoKeyboards = Array.prototype.slice.call(document.querySelectorAll('.piano')),
        clearBtns = Array.prototype.slice.call(document.querySelectorAll('[data-action="clear"]'));

    pianoKeyboards
        .forEach(function initializePianoKeyboard(pianoKeyboard) {
            var log;

            if (pianoKeyboard.dataset.action !== 'log') {
                return;
            }

            log = document.getElementById(pianoKeyboard.dataset.log);

            pianoKeyboard.addEventListener('noteon', function onNoteOn(e) {
                log.value += e.pitch + e.octave + ' ';
            });
        });

    clearBtns.forEach(function initializeClearBtn(clearBtn) {
        var log = document.getElementById(clearBtn.dataset.log);

        clearBtn.addEventListener('click', function clearLog() {
            log.value = '';
        });
    });
})();
