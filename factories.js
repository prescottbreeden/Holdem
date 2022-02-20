const { card_faces, card_suits, card_values } = require('./data')

const Card = ({ face = 'A', suit = 'spade', value = 14 } = {}) => ({
  face,
  suit,
  value,
})

const _shuffleDeck = (deck = [Card]) => {
  const shuffled = []
  while (deck.length) {
    const index = Math.floor(Math.random() * deck.length)
    shuffled.push(deck[index])
    deck.splice(index, 1)
  }
  return shuffled
}

const _createDeck = () => [
  ...Array(52)
    .fill(0)
    .map((_, index) =>
      Card({
        face: card_faces[index % 13],
        suit: card_suits[index % 4],
        value: card_values[index % 13],
      })
    ),
]

const Deck = {
  create: _createDeck,
  shuffle: _shuffleDeck,
}

module.exports = {
  Card,
  Deck,
}
