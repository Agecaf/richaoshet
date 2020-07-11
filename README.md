
# Richaoshet

A game where you destroy asteroids with a couple of extra features;
- The geometry of the space is that of real projective space.
- Bullets ricochet from the asteroids.
- Your own bullets hurt you!
- You don't have lives, instead you have to keep your control of the
  spaceship when you get hit.

This is an entry for the GameMaker's Toolkit 2020 Jam.

# Warning

Shouldn't be too bad in terms of epilepsy, but be careful.


# How to play
You control the spaceship with Q, W, E, A, S, D; WASD are used as usual, Q and E
are used to turn clockwise and anticlockwise.

You shoot bullets with Space.

There is a nice drag effect which lessens as levels progress, but when you
get hit, there is no drag, making it harder to regain control.

Your spaceship is destroyed if it goes too fast, or turns too fast, otherwise
it can take potentially as many hits as you want, though every hit makes
it harder to regain control (this is reset each level).

# How does the theme come into play?

I kind of wanted to try a game with this geometry for a while, and it's
interesting how it is feasible to make, but it's... not as clean as I would've
liked.

The idea was that as ricochets happen, everything becomes very chaotic...
for performance reasons we had to reduce how long bullets lived for (only
two generations). There's still slowdowns on later levels in my pc.

The drag formula is... quite amazing, I wasn't expecting to find something
like it, but it turns out to be very useful. This drag, or lack thereof,
is where the "out of control" comes most into play.

It's interesting how we usually put a cap on the player's speed, or use
drag and so on to give the player control. Here we don't do that for the
players; they have to control it themselves or have a game over. In a way,
the fail state is not a "lack of lives", but being "out of control" and
then "too out of control".

When debugging without the gameover... There were some really cool patterns
going on when going at insane speeds, but most definitely not epilepsy safe.
