type Pemain = {
  id: number;
  dice: number[];
  points: number;
};

const rollDice = (): number => Math.floor(Math.random() * 6) + 1;

const initializePlayers = (
  playerCount: number,
  diceCount: number
): Pemain[] => {
  return Array.from({ length: playerCount }, (_, idx) => ({
    id: idx + 1,
    dice: Array.from({ length: diceCount }, () => rollDice()),
    points: 0,
  }));
};

const areGameStillContinue = (players: Pemain[]): boolean => {
  const activePlayers = players.filter((player) => player.dice.length > 0);
  // console.log(activePlayers);
  return activePlayers.length <= 1;
};

const printGameState = (players: Pemain[], turn: number): void => {
  console.log(`\nGiliran ${turn + 1} lempar dadu:`);
  players.forEach((player) => {
    if (player.dice.length > 0) {
      console.log(
        `Pemain #${player.id} (${player.points}): ${player.dice.join(",")}`
      );
    } else {
      console.log(`Pemain #${player.id} (${player.points}): _`);
    }
  });
};

const rollDiceForPlayers = (players: Pemain[]): Pemain[] => {
  return players.map((player) => ({
    ...player,
    dice: player.dice.map(() => rollDice()),
  }));
};

const evaluateDice = (players: Pemain[]): Pemain[] => {
  const diceTransfers: number[][] = players.map(() => []); // make this [ [], [], [] ] to add dice 1 to nextplayer
  const updatedPlayers = players.map((player, idx) => {
    let newDice: number[] = [];
    let points = player.points;

    player.dice.forEach((die) => {
      if (die === 6) {
        points++;
      } else if (die === 1) {
        const nextPlayerIndex = (idx + 1) % players.length;
        diceTransfers[nextPlayerIndex].push(1);
      } else {
        newDice.push(die);
      }
    });

    return { ...player, dice: newDice, points };
  });

  return updatedPlayers.map((player, idx) => ({
    ...player,
    dice: player.dice.concat(diceTransfers[idx]), // concat dice
  }));
};

const playTurn = (players: Pemain[], turn: number): Pemain[] => {
  printGameState(players, turn);
  let updatedPlayers = rollDiceForPlayers(players);

  updatedPlayers = evaluateDice(updatedPlayers);
  console.log("\nSetelah evaluasi:");
  updatedPlayers.forEach((player) => {
    if (player.dice.length > 0) {
      console.log(
        `Pemain #${player.id} (${player.points}): ${player.dice.join(",")}`
      );
    } else {
      console.log(`Pemain #${player.id} (${player.points}): _`);
    }
  });
  return updatedPlayers;
};

const getWinner = (players: Pemain[]) => {
  return players.reduce((winner, player) =>
    player.points > (winner?.points ?? 0) ? player : winner
  );
};

const diceGame = (playerCount: number, diceCount: number): void => {
  let players = initializePlayers(playerCount, diceCount);
  let addMatchGame = 0;
  console.log(players);
  while (!areGameStillContinue(players)) {
    players = playTurn(players, addMatchGame);
    addMatchGame++;
  }

  const winner = getWinner(players);
  if (winner) {
    console.log(
      `\nGame dimenangkan oleh pemain #${winner.id} dengan ${winner.points} poin.`
    );
  } else {
    console.log("\nTidak ada pemenang.");
  }
};

// Contoh penggunaan
diceGame(3, 4);
