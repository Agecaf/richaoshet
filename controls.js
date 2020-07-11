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

  const allKeys = ["w", "a", "s", "d", "q", "e", " "];

  controls.up = () => controls.includes("w");
  controls.down = () => controls.includes("s");
  controls.left = () => controls.includes("a");
  controls.right = () => controls.includes("d");
  controls.clockwise = () => controls.includes("e");
  controls.anticlockwise = () => controls.includes("q");
  controls.space = () => controls.includes(" ");

  // arrowleft, arrowdown, arrowup, arrowright

  window.addEventListener('keydown', (event) => {
    const keyName = event.key.toLowerCase();
    if (controls.indexOf(keyName) == -1) {
      controls.push(keyName);
    }

    if (allKeys.indexOf(keyName) != -1) {
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
