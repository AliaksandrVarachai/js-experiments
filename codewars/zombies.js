class Shooter {}

class NShooter extends Shooter {
  constructor(speed) {
    super();
    this.speed = speed;
  }
}

class SShooter extends Shooter {}

class Zombie {
  constructor(health) {
    this.health = health;
  }
  decreaseHealth(damage) { this.health -= damage; }
  isKilled() { return this.health < 1; }
}

function plantsAndZombies(origLawn, origZombies) {
  const lawn = [];
  const lawnWidth = origLawn[0].length;
  const lawnHeight = origLawn.length

  const nShooters = [];  // {i, j, shooter}
  const sShooters = [];  // {i, j, shooter}
  for (let i = 0; i < lawnHeight; ++i) {
    lawn.push([]);
    for (let j = 0; j < lawnWidth; ++j) {
      const c = origLawn[i][j];
      if (c) {
        let shooter, len;
        if (c === 'S') {
          shooter = new SShooter();
          len = sShooters.push({ shooter, i, j});
        } else if (c !== ' ') {
          shooter = new NShooter(Number.parseInt(c, 10));
          len = nShooters.push({ shooter, i, j });
        }
        lawn[i][j] = { shooter, inx: len - 1 };
      } else {
        lawn[i][j] = null;
      }
    }
  }
  sShooters.sort((s1, s2) => s1.j !== s2.j ? s2.j - s1.j : s2.i - s1.i);

  const zombies = [];
  const futureZombies = origZombies.slice();

  function generateZombies(moveNumber) {
    let i = 0;
    while (i < futureZombies.length) {
      const [generateMoveNumber, row, health] = futureZombies[i];
      if (generateMoveNumber === moveNumber) {
        const zombie = new Zombie(health);
        const len = zombies.push({ zombie, i: row, j: lawnWidth - 1 });
        lawn[row][lawnWidth - 1] = { zombie, inx: len - 1 };
        futureZombies.splice(i, i + 1);
      } else {
        ++i;
      }
    }
  }
  origZombies.forEach(([i, j, health]) => {
    const zombie = new Zombie(health);
    const len = zombies.push({ zombie, i, j });
    lawn[i][j] = { zombie, inx: len - 1 };
  });

  function printLawn() {
    lawn.forEach(row)
  }

  for (let moveNumber = 0; true; ++moveNumber) {
    moveZombies();
    generateZombies(moveNumber);
    if (areZombiesWon()) return moveNumber + 1;
    volley();
    console.log(zombies)
    if (zombies.length < 1) return null;
  }


  function shoot(shooter, shooterI, shooterJ) {
    for (let j = shooterJ + 1; j < lawnWidth; ++j) {
      const zombie = lawn[shooterI][j] && lawn[shooterI][j].zombie;
      if (zombie) {
        zombie.decreaseHealth(shooter instanceof NShooter ? shooter.speed : 1);
        break;
      }
    }
    if (shooter instanceof SShooter) {
      for (let i = shooterI + 1, j = shooterJ + 1; i < lawnHeight && j < lawnWidth; ++i, ++j) {
        const zombie = lawn[i][j] && lawn[i][j].zombie;
        if (zombie) {
          zombie.decreaseHealth(1);
          break;
        }
      }
      for (let i = shooterI - 1, j = shooterJ + 1; i >= 0 && j < lawnWidth; --i, ++j) {
        const zombie = lawn[i][j] && lawn[i][j].zombie;
        if (zombie) {
          zombie.decreaseHealth(1);
          break;
        }
      }
    }
  }

  function volley() {
    nShooters.forEach(({ shooter, i, j }) => {
      // TODO: clear killed zombies after every shoot
      shoot(shooter, i, j);
    });
    clearKilledZombies();
    sShooters.forEach(({ shooter, i, j }) => {
      shoot(shooter, i, j);
      clearKilledZombies();
    });
  }

  function moveZombies() {
    zombies.forEach(indexedZombie => {
      const { zombie, i, j } = indexedZombie;
      const nextLawn = lawn[i][j - 1];
      if (nextLawn && nextLawn.shooter) {
        const { shooter, inx: shooterInx } = nextLawn;
        if (shooter instanceof NShooter) {
          nShooters.splice(shooterInx, shooterInx + 1);
        } else {
          sShooters.splice(shooterInx, shooterInx + 1);
        }
      }
      lawn[i][j - 1] = lawn[i][j];
      lawn[i][j] = null;
      --indexedZombie.j;
    })
  }

  function clearKilledZombies() {
    for (let zombieInx = 0; zombieInx < zombies.length; ++zombieInx) {
      const { zombie, i, j } = zombies[zombieInx];
      if (zombie.isKilled()) {
        console.log(zombie)
        lawn[i][j] = null;
        zombies.splice(zombieInx, zombieInx + 1);
      }
    }
  }

  function areZombiesWon() {
    for (let zombieInx = zombies.length - 1; zombieInx >= 0; --zombieInx) {
      if (zombies[zombieInx].j === 0) return true;
    }
    return false;
  }
}
