/*
This code is taken from the "engine" Studious Happiness, for bullethells.
Just standard controls.

See:
https://github.com/Agecaf/studious-happiness/blob/master/main/controls.js

Edited to add a couple of extra controls.
*/


((global) => {
  "use strict";

  const controls = [];
  const checked = [];

  // Player controls
  controls.allKeys = [
    "w", // 0 Move up
    "a", // 1 Move left
    "s", // 2 Move down
    "d", // 3 Move right
    "q", // 4 Turn anticlockwise
    "e", // 5 Turn clockwise
    " ", // 6 Shoot
    "o", // 7 Restart the Game
    "p"  // 8 Pause the Game
  ];

  controls.up = () => controls.includes(controls.allKeys[0]);
  controls.down = () => controls.includes(controls.allKeys[2]);
  controls.left = () => controls.includes(controls.allKeys[1]);
  controls.right = () => controls.includes(controls.allKeys[3]);
  controls.clockwise = () => controls.includes(controls.allKeys[5]);
  controls.anticlockwise = () => controls.includes(controls.allKeys[4]);
  controls.space = () => controls.includes(controls.allKeys[6]);

  // arrowleft, arrowdown, arrowup, arrowright

  window.addEventListener('keydown', (event) => {
    const keyName = event.key.toLowerCase();
    if (controls.indexOf(keyName) == -1) {
      controls.push(keyName);
    }

    if (controls.allKeys.indexOf(keyName) != -1) {
      event.preventDefault();
    }

  });

  window.addEventListener('keyup', (event) => {
    const keyName = event.key.toLowerCase();
    const idx = controls.indexOf(keyName);
    const idx2 = checked.indexOf(keyName);

    if (idx >= 0) {
      controls.splice(idx, 1);
    }
    if (idx2 >= 0) {
      checked.splice(idx2, 1);
    }
  });

  controls.checkOnce = (keyName) => {
    const idx = controls.indexOf(keyName);
    const idx2 = checked.indexOf(keyName);

    if (idx >= 0 && idx2 == -1) {
      checked.push(keyName)
      return true;
    }
    else {
      return false;
    }
  };

  global.controls = controls;

})(this);
