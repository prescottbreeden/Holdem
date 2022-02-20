const card_faces = [
  'A',
  'K',
  'Q',
  'J',
  '10',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
]
const card_suits = ['spade', 'heart', 'diamond', 'club']
const card_values = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]

const handRankNames = {
  1: 'Royal Flush',
  2: 'Straight Flush',
  3: '4 of a Kind',
  4: 'Full House',
  5: 'Flush',
  6: 'Straight',
  7: '3 of a Kind',
  8: 'Two Pair',
  9: 'Pair',
  10: 'High Card',
}

module.exports = {
  card_faces,
  card_suits,
  card_values,
  handRankNames,
}
