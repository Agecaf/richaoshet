
// We're using Tone.js for the music!!

music = {}

music.beat = 0;
music.bass = ['B1', 'B2']
music.normalBass = [
  ['B1', 'B2', 'C#3', 'D3', 'F#3'],
  ['G1', 'G2', 'C#3', 'D3', 'A3'],
  ['A1', 'A2', 'C#3', 'E3', 'F#3'],
  ['E2', 'E3', 'B2', 'C#3', 'F#3'],
]

music.hitBass = ['F#1', 'A#1', 'D1', 'F#2', 'A#2', 'D3', 'F#3']
music.hitNotes = ['F#3', 'A#3', 'D4', 'F#4', 'A#4', 'D5', 'F#5']

music.normalNotes = ['A3', 'C#4', 'D4', 'F#4', 'A4', 'C#5', 'D5']

// Flags:
music.asteroidHit = 0;
music.playerHit = false;
music.playerControl = false;
music.playerShoot = false;
music.outOfControl = false;
music.gameOver = false;

music.shootNote = 0;


//
// Helper function
//

function random(A) {
  return A[Math.floor(Math.random() * A.length)];
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


music.nextLevel = (lvl) => {
  // Reset flags
  music.asteroidHit = 0;
  music.playerHit = false;
  music.playerControl = false;
  music.playerShoot = false;
  music.outOfControl = false
  music.shootNote = 0;
  music.gameOver = false;
}



//
// Main music Loop
//
music.main = (ev) => {

  // Check for gameOver
  if(music.gameOver) {
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

  if (!music.outOfControl) {
    // Normal music

    // Bass
    music.bassSynth.triggerAttackRelease(music.bass[music.beat % 2], '16n')

    // Asteroid hit
    if(music.asteroidHit >= 1) {
      music.asteroidHit = 0;
      music.astroSynth.triggerAttackRelease(random(music.normalNotes), '16n')
    }

    // Shoot!
    if(music.playerShoot) {
      music.playerSynth.triggerAttackRelease(
        music.bass[ 2+ music.shootNote ], '8n');
        music.playerShoot = false;
        music.shootNote = (music.shootNote +1) % 3;
      }

      // Change bass on beat
      music.beat++;
      if (music.beat >= 16) {
        music.beat = 0;
        music.bass = random(music.normalBass);
      }
  }
  else {
    // Player Hit music

    // Bass
    music.bassSynth.triggerAttackRelease(music.hitBass[music.beat % 7], '16n')
    music.beat++;

    // Asteroid hit
    if(music.asteroidHit >= 1) {
      music.asteroidHit = 0;
      music.astroSynth.triggerAttackRelease(random(music.hitNotes), '16n')
    }


  }
}


// Start the music as soon as we get a keyboard event!
window.addEventListener('keydown', setupMusic, false);



//.
