/*

Here's the main game loop!

*/

// Setup, get the canvas and so on.


// Main things, timing, etc.
let mainloop;
let last = null;
let t = 0;

// Player
let player = math.identity(3);
let playerVel = math.identity(3);
let zoom = 0.45;
let zoomMod = 1;
let drag = 0.975;

const playerTarget = 0.995;

let cooldown = 0;
let invincibility = 0;
let invincibilityMax = 1;
let control = 1;

let toShoot = false;

// Asteroids
let asteroids = [];
const minAsteroidSize = 0.07;

// Bullets
const bulletRadius = 0.01;
let bullets = [];
let badbullets = [];

// Stars
const starRadius = 0.008;
let stars = [];

// Particles
let particles = [];
let playerParticles = [];

// Get Context.
const canvas = document.getElementById('game');
const ctx = canvas.getContext("2d");

// Palette
let palette = {
  player : '#113',
  playerStroke : '#bbf',
  particlePlayer : '#224',
  bullet : '#eef',
  badbullet : '#fff',
  asteroid : '#b42',
  particle : '#421',
  cooldown : '#446',
  circle : '#001',
  background : '#112',
  stars : '#555',
}


// Progression
let level = 0;
let numberOfAsteroids = (lvl) => {
  if (lvl <= 5) {
    return 1 + lvl;
  } else {
    return 6 + Math.floor((lvl - 5) / 2);
  }
}
let levelDrag = (lvl) => {
  return [0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.955, 0.96, 0.965, 0.97,
  0.975, 0.9775, 0.98, 0.9825, 0.985, 0.9875, 0.99][lvl] || 0.99;
}
let asteroidSize = (lvl) => {
  // Minimum minAsteroidSize 0.7
  // 0.05 + 0.2 * Math.random()  <- This works more or less ok!
  if (lvl <= 3){
    return [0.1, 0.13, 0.17, 0.2][lvl]
  }
  if (lvl <= 6) {
    return 0.05 + 0.2 * Math.random();
  }
  return 0.1 + 0.25 * Math.random();
}
let victoryTimer = 0;
let victory = false;


// Game over
let gameOver = false;

// Score
let score = 0;
let highscore = 0;

let scoreP = document.getElementById('score');
let highscoreP = document.getElementById('high-score');

///
/// Startup
///

function setup() {
  // Progression
  level = 0;
  gameOver = false;
  score = 0;

  music.nextLevel(level);


  startLevel();
  window.requestAnimationFrame(mainloop);
}

function startLevel() {
  // Title
  document.getElementById('title').innerHTML = `Level ${level + 1}`


  // Progression
  victoryTimer = 2.5;
  victory = false;

  // Player
  player = math.identity(3);
  playerVel = identity;

  cooldown = 0;
  invincibility = 0;
  control = 1;

  drag = levelDrag(level);


  // Asteroids
  asteroids = []

  for (let i = 0; i < numberOfAsteroids(level); i++) {
    const pos =
      mt(rot(Math.random() * TAU),
        mt(sideways(Math.random() * TAU), forwards( Math.random() * TAU )));

    asteroids.push(new Asteroid(
      pos,
      conj(pos, forwards(0.004 * Math.random())),
      asteroidSize(level)
    ))
  }

  // Bullets
  bullets = [];
  badbullets = [];

  // Particles
  particles = [];
  playerParticles = [];

  // Stars
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push(new Star(
      mt(sideways(Math.random() * TAU), forwards( Math.random() * TAU ))))
  }

}



///
/// MAIN GAME LOOP
///

let gameloop = (timestamp) => {

  // Define start.
  last = last || timestamp;

  // Calculate change of time (milliseconds).
  const dt = (timestamp - last) / 1000;
  if (dt > 1.0) return;

  t += dt;

  // Update Player

  if(!gameOver) {
    if(controls.up()) {
      playerVel = mt(playerVel, forwards(0.001));
    }
    if(controls.down()) {
      playerVel = mt(playerVel, forwards(-0.001));
    }
    if(controls.left()){
      playerVel = mt(playerVel, sideways(-0.001));
    }
    if(controls.right()){
      playerVel = mt(playerVel, sideways(0.001));
    }
    if(controls.clockwise()){
      playerVel = mt(playerVel, rot(0.001));
    }
    if(controls.anticlockwise()) {
      playerVel = mt(playerVel, rot(-0.001));
    }


    // DRAG!!! AMAZING!!
    if(cooldown <= 0) {
      playerVel = normalize(iplt(drag, playerVel, identity))
    }

    // Move player
    player = mt(player, playerVel);


    // Shoot bullets!
    if(controls.checkOnce(" ")) {
      toShoot = true;
      music.playerShoot = true;
    }


    // Regain Control, lose invincibility
    if (cooldown > 0) {
      cooldown -= dt;
      if (cooldown <= 0) {
        music.playerControl = true;
      }
    }

    if (invincibility > 0) {
      invincibility -= dt;
      for (let i = 0; i < 2; i++) {
        playerParticles.push(new Particle(inv(player), 0.02));
      }
    }

    // Make sure the speed is not too much!
    let speed = (3 - math.trace(playerVel)) * 100;
    zoomMod = 1 +  speed * 0.5;
    if(speed > 1) {
      gameOver = true;
      invincibility = 5;
      music.gameOver = true;

      highscore = highscore > score ? highscore: score;
      highscoreP.innerHTML = highscore;
    }
  }

  if (gameOver) {
    // Keep moving player
    playerVel = normalize(iplt(0.99, playerVel, identity));
    player = mt(player, playerVel);

    if (invincibility > 0) {
      invincibility -= dt;
      for (let i = 0; i < 5; i++) {
        playerParticles.push(new Particle(inv(player)));
      }
    }

    // Zoom
    let speed = (3 - math.trace(playerVel)) * 100;
    zoomMod = 1 +  speed * 0.5;

  }
  //console.log(math.trace(playerVel) > 2.99)


  // Asteroids
  asteroids.forEach((at) => {
    at.pos = mt(at.pos, at.vel);
    at.t += dt;
  });


  // Bullets
  bullets.forEach((bt, idx) => {
    bt.pos = mt(bt.pos, bt.vel);
    bt.t += dt;

    // Remove old bullets
    if(bt.t > 20) {
      bullets.splice(idx, 1);
    }
  });

  // Badbullets
  badbullets.forEach((bt, idx) => {
    bt.pos = mt(bt.pos, bt.vel);
    bt.t += dt;

    // Remove old bullets
    if(bt.t > 20) {
      badbullets.splice(idx, 1);
    }
  });

  // Particles
  particles.forEach((bt, idx) => {
    bt.pos = mt(bt.pos, bt.vel);
    bt.t += dt;
    bt.size *= 0.95;

    // Remove old bullets
    if(bt.t > 1) {
      particles.splice(idx, 1);
    }
  });

  // Particles
  playerParticles.forEach((bt, idx) => {
    bt.pos = mt(bt.pos, bt.vel);
    bt.t += dt;
    bt.size *= 0.95;

    // Remove old bullets
    if(bt.t > 1) {
      playerParticles.splice(idx, 1);
    }
  });



  // Check collisions
  if (!gameOver) {
    checkCollisions();
  }

  // Draw things
  draw()


  // Progression
  if (victory) { victoryTimer -= dt; }
  if (victoryTimer <= 0) {
    level++;
    startLevel();
    music.nextLevel(level);
  }
  if (asteroids.length == 0) { victory = true; }
  if (controls.checkOnce('o')) {
    setup();
    return;
  }


  // Prepare for next loop
  last = timestamp;
  window.requestAnimationFrame(mainloop);
}



function checkCollisions() {

  // Shoot
  if (toShoot){
    bullets.push(new Bullet(inv(player),
    conj(player, forwards(-0.02)  )))
    toShoot = false;
  }

  // Check collisions
  asteroids.forEach((at, idxA) => {
    if (at.t > 1) {
      const target = 1 - at.size * at.size * 0.55;

      // Collisions with first gen bullets
      bullets.forEach((bt, idxB) => {
        if (bt.t > 0.1){
          if(math.abs(dot(pt(at.pos), pt(bt.pos))) > target) {
            // Collision!
            asteroids.splice(idxA, 1);
            bullets.splice(idxB, 1);
            score += 10 * level;
            scoreP.innerHTML = score;


            // New asteroids
            splitAsteroid(at);
            splitBullet(bt);
          }
        }
      });

      // Collisions with second gen bullets.
      badbullets.forEach((bt, idxB) => {
        if (bt.t > 2){
          if(math.abs(dot(pt(at.pos), pt(bt.pos))) > target) {

            // Collision!
            asteroids.splice(idxA, 1);
            badbullets.splice(idxB, 1);
            score += 30 * level;
            scoreP.innerHTML = score;


            // New asteroids
            splitAsteroid(at);


          }
        }
      })

      // Collisions with player
      if(invincibility <= 0 &&
        math.abs(dot(pt(at.pos), pt(inv(player)))) > target) {
        // Collision!
        playerHit();

        // Asteroid dies
        asteroids.splice(idxA, 1);


        // New asteroids.
        splitAsteroid(at);
      }

    } // End of if at.t > 1
  }); // End of asteroids for each

  // Check collision of player with bullets
  if (invincibility <= 0) {
    // Collisions with first gen bullets
    bullets.forEach((bt, idxB) => {
      if (bt.t > 1){
        if(math.abs(dot(pt(inv(player)), pt(bt.pos))) > playerTarget) {
          // Collision!
          playerHit();
          bullets.splice(idxB, 1);

          // New bullets
          splitBullet(bt);
        }
      }
    });

    // Collisions with second gen bullets.
    badbullets.forEach((bt, idxB) => {
      if (bt.t > 2){
        if(math.abs(dot(pt(inv(player)), pt(bt.pos))) > playerTarget) {

          // Collision!
          playerHit()
          badbullets.splice(idxB, 1);
        }
      }
    })
  }

}



// When the asteroid collides with bullets, or the player.
function splitAsteroid(at) {
  if(at.size > minAsteroidSize) {
    asteroids.push(
      new Asteroid(
        at.pos,
        conj(mt(rot(1), inv(at.pos)), forwards(0.002 + 0.007 * Math.random())),
        at.size * 0.75
      ),
      new Asteroid(
        at.pos,
        conj(mt(rot(-1), inv(at.pos)), forwards(0.002 + 0.007 * Math.random())),
        at.size * 0.75
      )
    )
  }

  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(at.pos));
  }

  music.asteroidHit++;

}

// When a first gen bullet hits something.
function splitBullet(bt) {
  badbullets.push(
    new Bullet(
      bt.pos,
      conj(mt(rot(1), inv(bt.pos)), forwards(-0.01))
    ),
    new Bullet(
      bt.pos,
      conj(mt(rot(-1), inv(bt.pos)), forwards(-0.01))
    )
  )
}

function playerHit(){
  // Lose control, gain invincibility
  cooldown = control > 5 ? 5 : control;
  invincibility = invincibilityMax;
  control += 0.5;

  playerVel = mt(playerVel, forwards( 2 * control * (0.005 - 0.01* Math.random())));
  playerVel = mt(playerVel, sideways( 2 * control * (0.005 - 0.01* Math.random())));
  playerVel = mt(playerVel, rot(2 * control * (0.005 - 0.01* Math.random())));

  music.playerHit = true;
}





///
/// DRAW
///

function draw() {

  // Clear the screen...
  ctx.resetTransform();
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(canvas.height * zoom * zoomMod, - canvas.height * zoom * zoomMod);



  // Central Circle
  ctx.fillStyle = palette.circle;
  ctx.beginPath();
  ctx.ellipse( 0, 0, 1, 1, 0, 0, TAU);
  ctx.fill();

  // Control timer
  if (cooldown > 0) {
    ctx.fillStyle = palette.cooldown;
    ctx.beginPath();
    ctx.ellipse( 0, 0, 1, 1, 0, 0, TAU * cooldown / control);
    ctx.stroke();
  }


  const camera = inv(player);

  // Stars
  stars.forEach((st) => {
    st.camera = player;

    ctx.fillStyle = palette.stars;
    ctx.fillRect(st.x, st.y, starRadius * st.z, starRadius * st.z);
  });


  // particles
  particles.forEach((at) => {

    // Get the relative position
    at.camera = player;

    ctx.fillStyle = palette.particle;
    ctx.beginPath();
    ctx.ellipse( at.x, at.y, at.size,
    at.size * at.z, at.r + TAU/4 , 0, TAU);
    ctx.fill();

  })

  playerParticles.forEach((at) => {

    // Get the relative position
    at.camera = player;

    ctx.fillStyle = palette.particlePlayer;
    ctx.beginPath();
    ctx.ellipse( at.x, at.y, at.size,
    at.size * at.z, at.r + TAU/4 , 0, TAU);
    ctx.fill();

  })

  // Asteroids
  asteroids.forEach((at) => {

    // Get the relative position
    at.camera = player;

    ctx.fillStyle = palette.asteroid;
    ctx.beginPath();
    ctx.ellipse( at.x, at.y, at.size,
    at.size * at.z, at.r + TAU/4 , 0, TAU);
    ctx.fill();

  })


  // Bullets
  bullets.forEach((bt) => {

    // Get the relative position
    bt.camera = player;

    ctx.fillStyle = palette.bullet;
    ctx.beginPath();
    ctx.ellipse( bt.x, bt.y, bulletRadius,
    bulletRadius * bt.z, bt.r + TAU/4 , 0, TAU);
    ctx.fill();

  })

  badbullets.forEach((bt) => {

    // Get the relative position
    bt.camera = player;

    ctx.fillStyle = palette.badbullet;
    ctx.beginPath();
    ctx.ellipse( bt.x, bt.y, bulletRadius,
    bulletRadius * bt.z, bt.r + TAU/4 , 0, TAU);
    ctx.fill();

  })

  // Player
  if(!gameOver){
    ctx.fillStyle = palette.player;
    ctx.strokeStyle = palette.playerStroke;
    ctx.lineWidth = 0.008;


    ctx.beginPath();
    ctx.moveTo(0, 0.04);
    ctx.lineTo(-0.02, -0.02);
    ctx.lineTo(0.02, -0.02);
    ctx.lineTo(0, 0.04);
    ctx.fill();
    ctx.stroke();
  }





}


///
/// Begin the game
///

mainloop = gameloop;
setup();
