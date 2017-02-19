# piano-keyboard
A piano keyboard in JavaScript.

## Why?
- Because most JavaScript keyboards aren't simple and customizable enough.
- I'm creating a [piano roll control](https://github.com/Temoto-kun/piano-roll), so it needs a piano keyboard to work.
- This is ideal for music software that utilizes keyboards.

## Installation
NPM:

    $ npm install --save @theoryofnekomata/piano-keyboard
    
Bower:

    $ bower install --save piano-keyboard
    
## Usage

In your HTML:

```html
<!-- ... -->

<div id="piano-element" data-white-key-width="auto"></div>

<!-- ... -->
```

In your JavaScript:
```javascript
// ...
var pianoElement = document.getElementById('piano-element');

new PianoKeyboard(pianoElement);

pianoElement.addEventListener('noteon', function onNoteOn(e) {
    // ...    
});

pianoElement.addEventListener('noteoff', function onNoteOff(e) {
    // ...    
});

// ...
```

## License

MIT. See [LICENSE file](https://raw.githubusercontent.com/Temoto-kun/piano-keyboard/master/LICENSE) for details.
