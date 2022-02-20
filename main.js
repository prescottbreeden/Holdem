require('./test') // run tests before game runs
const { pipe } = require('ramda')
const { bestHand, handRank } = require('./utils')
const { Deck } = require('./factories')
const { handRankNames } = require('./data')

const makeGame = () => {
  const gameDeck = pipe(Deck.create, Deck.shuffle)()
  const player1 = gameDeck.slice(0, 2)
  const player2 = gameDeck.slice(2, 4)
  const table = gameDeck.slice(4, 8)
  const p1Hand = [...player1, ...table]
  const p2Hand = [...player2, ...table]
  return {
    player1,
    player2,
    table,
    winner:
      // TODO: if equal, check kickers
      handRank(p1Hand) > handRank(p2Hand)
        ? [
            `player1`,
            `${handRankNames[handRank([...player1, ...table])]}`,
            bestHand(p1Hand),
          ]
        : [
            `player2`,
            `${handRankNames[handRank([...player2, ...table])]}`,
            bestHand(p2Hand),
          ],
  }
}

const getRunTime = (fn = () => undefined) => {
  const start = Date.now()
  fn()
  const end = Date.now()
  return end - start
}

const bestTo5 = () => {
  console.log('running')
  const history = []
  let score = { player1: 0, player2: 0 }
  let games = 0
  while (score.player1 < 5 && score.player2 < 5) {
    const {
      winner: [player, handType, hand],
    } = makeGame()
    history.push({ player, handType, hand })
    score[player]++
    games++
  }
  console.log(`completed ${games} games`)
  console.log('Score: ', score)
  console.log('History: ', history)
  return [score, history]
}
console.log(`Finished in ${getRunTime(bestTo5) / 1000} seconds`)
