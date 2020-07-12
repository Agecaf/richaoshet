

/*
Class that is all about the bullets.
*/

class Bullet {
  constructor(pos, vel) {
    this.pos = pos;
    this.vel = vel;
    this.rpos = pos;
    this.t = 0
  }

  set camera(cam) {
    this.rpos = mt(this.pos, cam).toArray();

    // Get the x, y, z positions.
    this.x = this.rpos[0][0] > 0 ? this.rpos[0][2] : -this.rpos[0][2];
    this.y = this.rpos[0][0] > 0 ? this.rpos[0][1] : -this.rpos[0][1];
    this.r = math.atan2(this.y, this.x);
    this.z = math.abs(this.rpos[0][0]);
  }
}

class Particle {
  constructor(pos, size) {
    this.pos = pos;
    this.vel = mt(
      forwards(0.01 - 0.02 * Math.random()),
      sideways(0.01 - 0.02 * Math.random()) );
    this.rpos = pos;
    this.size = size || 0.05;
    this.t = 0;
  }

  set camera(cam) {
    this.rpos = mt(this.pos, cam).toArray();

    // Get the x, y, z positions.
    this.x = this.rpos[0][0] > 0 ? this.rpos[0][2] : -this.rpos[0][2];
    this.y = this.rpos[0][0] > 0 ? this.rpos[0][1] : -this.rpos[0][1];
    this.r = math.atan2(this.y, this.x);
    this.z = math.abs(this.rpos[0][0]);
  }
}

class TailParticle {
  constructor(pos) {
    this.pos = pos;
    this.rpos = pos;
    this.size = 0.01;
    this.t = 0;
  }

  set camera(cam) {
    this.rpos = mt(this.pos, cam).toArray();

    // Get the x, y, z positions.
    this.x = this.rpos[0][0] > 0 ? this.rpos[0][2] : -this.rpos[0][2];
    this.y = this.rpos[0][0] > 0 ? this.rpos[0][1] : -this.rpos[0][1];
    this.r = math.atan2(this.y, this.x);
    this.z = math.abs(this.rpos[0][0]);
  }
}


class Asteroid {
  constructor(pos, vel, size) {
    this.pos = pos;
    this.vel = vel;
    this.rpos = pos;
    this.size = size;
    this.t = 0;
    this.col = palette.asteroid();
  }

  set camera(cam) {
    this.rpos = mt(this.pos, cam).toArray();

    // Get the x, y, z positions.
    this.x = this.rpos[0][0] > 0 ? this.rpos[0][2] : -this.rpos[0][2];
    this.y = this.rpos[0][0] > 0 ? this.rpos[0][1] : -this.rpos[0][1];
    this.r = math.atan2(this.y, this.x);
    this.z = math.abs(this.rpos[0][0]);
  }
}





class Star{
  constructor(pos) {
    this.pos = pos;
    this.rpos = pos;
  }

  set camera(cam) {
    this.rpos = mt(this.pos, cam).toArray();

    // Get the x, y, z positions
    this.x = this.rpos[0][0] > 0 ? this.rpos[0][2] : -this.rpos[0][2];
    this.y = this.rpos[0][0] > 0 ? this.rpos[0][1] : -this.rpos[0][1];
    this.z = math.abs(this.rpos[0][0]);
  }
}







//.
