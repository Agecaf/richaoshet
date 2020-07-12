
// We're using Tone.js for the music!!

music = {}

music.hitChord = (n) => {return -5 -36 + n * 4}

music.normalNotes = ['A3', 'C#4', 'D4', 'F#4', 'A4', 'C#5', 'D5']

// Flags:
music.asteroidHit = 0;
music.playerHit = false;
music.playerControl = false;
music.playerShoot = false;
music.outOfControl = false;
music.gameOver = false;

music.shootNote = 0;

// Basic For composition
music.beat = 0;
music.measure = 0;
music.part = 0;
music.bassLine = [0, 1, 2, 3, 4, 5, 4, 3];
music.chord = chord(0, 7, [3,7,10,14]);
music.level = 0;

music.gameOverNotes = [
  -36-5, -36-1, -36+3, -36-1, -36+3, -24-5, -36+3, -24-5, -24-1, -24-5,
  -24-1, -24+3,-24-1, -24+3,  -12-5,-24+3,  -12-5, -12-1, -12-5,
  -12-1, -12+3, -12-1, -12+3, -5, -12+3, -5, -1, -5, -1, 0, -1, -5,
  -12+4, -12, -12-1, -12-5, -24+4, -24, -24-1, -24-5
]
music.gameOverBeat = 0;

//
// Helper function
//

function random(A) {
  return A[Math.floor(Math.random() * A.length)];
}

function walkIn(n, A) {
  return A[math.mod(n, A.length)];
}

// I'm tuning around B.
function note(n) {
  return 493.88	* math.pow(2, n/12);
}

// Builds quick access to chords.
function chord(base, fifth, extensions){
  return (
    [base-36, base+fifth-36, base-24]
      .concat(extensions.map((x) => base + x - 24))
      .concat(extensions.map((x) => base + x - 12))
      .concat(extensions.map((x) => base + x))
      .concat(extensions.map((x) => base + x + 12))
  )
}

//
// Setup
//
function setupMusic(event) {

  // Synths
  music.bassSynth = new Tone.Synth().toMaster();

  music.astroSynth = new Tone.Synth({
    oscillator : {
      type : "sine"
    },
    volume : -6
  }).toMaster();

  music.playerSynth = new Tone.Synth( {
    oscillator : {
      type : "triangle"
    },
    volume : 1
  }).toMaster();

  music.hitSynth = new Tone.MembraneSynth().toMaster();


  var loop = new Tone.Loop(music.main, "16n").start(0);

  Tone.Transport.toggle();
  Tone.Transport.tempo = 120;


  window.removeEventListener('keydown', setupMusic, false);
}

//
// Progression, reset.
//
music.nextLevel = (lvl) => {
  // Reset flags
  music.asteroidHit = 0;
  music.playerHit = false;
  music.playerControl = false;
  music.playerShoot = false;
  music.outOfControl = false
  music.shootNote = 0;
  music.gameOver = false;

  // Composition
  music.beat = 0;
  music.measure = 0;
  music.part = 0;
  music.gameOverBeat = 0;


  music.level = lvl;

  music.nextChord();

  //
  music.bassLine = music.levelBassLine(lvl);
}



//
// Main music Loop
//
music.main = (ev) => {

  // Check for gameOver
  if(music.gameOver) {
    if (music.gameOverBeat < music.gameOverNotes.length){
      music.bassSynth.triggerAttackRelease(
        note(music.gameOverNotes[music.gameOverBeat]),
        '16n')
    }
    if (music.gameOverBeat == music.gameOverNotes.length) {
      music.bassSynth.triggerAttackRelease(
        note(-36),
        '4n')
    }
    music.gameOverBeat++;
    return;
  }

  // Check player control!
  if(music.playerControl){
    music.outOfControl = false;
    music.playerControl = false;
  }

  if(music.playerHit) {
    music.playerHit = false;
    music.outOfControl = true;
    music.hitSynth.triggerAttackRelease('B2', '16n')

  }

  // If we're in control, normal music
  if (!music.outOfControl) { music.normalMusic(); }

  // Otherwise, HIT music.
  else { music.hitMusic(); }

}


// Music that plays normally.
music.normalMusic = () => {
  // Bass
  if(walkIn(music.beat, music.bassLine) >= 0 ){
    music.bassSynth.triggerAttackRelease(
      note(music.chord[walkIn(music.beat, music.bassLine)]),
      '16n')
  }

  // Asteroid hit
  if(music.asteroidHit >= 1) {
    music.asteroidHit = 0;
    music.astroSynth.triggerAttackRelease(
      note(music.chord[random([11,12,13,14,15])]), '16n')
  }

  // Shoot!
  if(music.playerShoot) {
    music.playerSynth.triggerAttackRelease(
      note(music.chord[ 7 + music.shootNote ]), '16n');
      music.shootNote = (music.shootNote +1) % 3;
      music.playerShoot = false;
  }

  // Change bass on beat
  music.beat++;
  if (math.mod(music.beat, 16) == 0) {
    music.measure++;
    if (math.mod(music.measure, 8) == 0) {
      music.part = (music.part + 1) % 2;
    }
    music.nextChord();
  }
}




// Music that plays when the player is hit.
music.hitMusic = () => {
  // Bass
  music.bassSynth.triggerAttackRelease(
    note(music.hitChord(music.beat % 7)), '16n')
  music.beat++;

  // Asteroid hit
  if(music.asteroidHit >= 1) {
    music.asteroidHit = 0;
    music.astroSynth.triggerAttackRelease(
      note(music.hitChord(random([11,12,13,14,15]))), '16n')
  }

  // Shoot!
  if(music.playerShoot) {
    music.playerSynth.triggerAttackRelease(
      note(music.hitChord( 7 + music.shootNote )), '16n');
      music.shootNote = (music.shootNote +1) % 3;
      music.playerShoot = false;
  }

} // End of Hit Muisc




///
/// Composition
///

const Bminor = chord( 0, 7, [3, 7, 10, 14]);
const Eminor = chord(-7, 7, [3, 7, 10, 14]);
const FSminor = chord(-5, 7, [3, 7, 10, 14]);
const Dmajor = chord( 3, 7, [4, 7, 11, 14]);
const Amajor = chord(-2, 7, [4, 7, 11, 14]);
const Gmajor = chord(-4, 7, [4, 7, 11, 14]);
const FSminorA = chord(-2, 9, [4, 7, 9, 12]);

function minorChord(b) { return chord(b, 7, [3, 7, 10, 14] ); }
function majorChord(b) { return chord(b, 7, [4, 7, 11, 14] ); }

music.nextChord = () => {
  // Inputs are measure, part, and level.
  // Output is music.chord

  // Part A
  if (music.part == 0 % 6) {

    switch (music.level) {
      case 0:
        music.chord = walkIn(music.measure, [Bminor, Dmajor, Gmajor, Gmajor]);
        break;
      case 1:
        music.chord = walkIn(music.measure, [Bminor, Amajor, Gmajor, FSminor]);
        break;
      case 2:
        music.chord = walkIn(music.measure, [Bminor, FSminor, Gmajor, Amajor]);
        break;
      case 3:
        music.chord = walkIn(music.measure, [Bminor, Dmajor, Gmajor, Amajor]);
        break;
      case 4:
        music.chord = walkIn(music.measure, [
          Bminor, minorChord(3), minorChord(-1), minorChord(2),
          minorChord(3), minorChord(6), minorChord(2), minorChord(5)]);
        break;
      case 5:
        music.chord = walkIn(music.measure, [
          Bminor, chord(-1, 8, [3, 6, 8, 13]), FSminorA, minorChord(-3),
          Gmajor, FSminor, Eminor, FSminor]);
        break;
      default:
        music.chord = walkIn(music.measure, [Bminor, Dmajor, Gmajor, Amajor]);
        break;
    }
  }

  // Part B
  else {
    switch (music.measure % 4) {
      case 0:
        music.chord = music.level % 2 == 0 ? Gmajor : Eminor; break; //
      case 1:
        music.chord = music.level % 2 == 0 ? Eminor : Gmajor; break; //
      case 2:
        music.chord = Bminor; break; // B minor
      case 3:
        music.chord = (music.level % 3 == 0) ? Dmajor : (
          (music.level % 3 == 1) ? Amajor : FSminor ); break; //
    }
  }

  // Always dominant 5th on 7th measure
  if (music.measure % 16 == 15) {
    music.chord = chord(-5, 7, [4, 7, 10, 14]);
  }
}


music.levelBassLine = (lvl) => {

  if (lvl >= 10) {lvl = 5 + Math.floor(Math.random() * 5);}

  switch (lvl) {
    case 0:
      return [0, -1, -1, -1, 2, -1, -1, -1];
    case 1:
      return [0, -1, -1, 2, -1, -1, 0, -1];
    case 2:
      return [0, -1, 2, -1, 1, -1, 2, -1];
    case 3:
      return [0, -1, 1, 2, 0, -1, 1, 3];
    case 4:
      return [0, -1, 1, 0, 2, 0, 3, 0];
    case 5:
      return [0, -1, 2, 0, 1, 0, 2, 0,  3, 0,  2,0, 1, 0, 2, -1];
    case 6:
      return [0,1,2,0,1,2,0,1];
    case 7:
      return [0,1,0,1,0,1,2,3];
    case 8:
      return [0,1,2,1,2,3,2,1];
    case 9:
      return [0,2,1,2,3,2,1,2];
  }

  return [0,2,1,2,3,2,1,2];
}





// Start the music as soon as we get a keyboard event!
window.addEventListener('keydown', setupMusic, false);


//.
