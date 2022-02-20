const assert = require('assert')
const {
  flush,
  bestHand,
  getProps,
  handRank,
  ofAKind,
  royals,
  straight,
  twoPair,
} = require('./utils')
const { Deck } = require('./factories')

/**
 *  Note: The tests to check for the winning hand are subject to fail if suits
 *  are not considered. This is because the hand sort does not sort suits and
 *  therefore it is possible for the logic to be correct but the mocked test to
 *  fail if the suits are out of order for certain hands. This generally applies
 *  to card order in general.
 */

const high_card_mock = [
  { face: '2', suit: 'heart', value: 2 },
  { face: '3', suit: 'heart', value: 3 },
  { face: '5', suit: 'spade', value: 5 },
  { face: '8', suit: 'club', value: 8 },
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'J', suit: 'club', value: 11 },
]
const one_pair_mock = [
  { face: '2', suit: 'heart', value: 2 },
  { face: '5', suit: 'spade', value: 5 },
  { face: '8', suit: 'club', value: 8 },
  { face: 'A', suit: 'heart', value: 14 },
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'J', suit: 'club', value: 11 },
]
const two_pair_mock = [
  { face: '2', suit: 'heart', value: 2 },
  { face: '8', suit: 'spade', value: 8 },
  { face: '8', suit: 'club', value: 8 },
  { face: 'A', suit: 'heart', value: 14 },
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'J', suit: 'club', value: 11 },
]
const three_of_a_kind = [
  { face: '2', suit: 'heart', value: 2 },
  { face: '2', suit: 'spade', value: 2 },
  { face: '2', suit: 'club', value: 2 },
  { face: '8', suit: 'club', value: 8 },
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'J', suit: 'club', value: 11 },
]
const straight_mock = [
  { face: 'J', suit: 'club', value: 11 },
  { face: '2', suit: 'heart', value: 2 },
  { face: '3', suit: 'heart', value: 3 },
  { face: '4', suit: 'spade', value: 4 },
  { face: '5', suit: 'spade', value: 5 },
  { face: '6', suit: 'spade', value: 6 },
]
const flush_mock = [
  { face: 'J', suit: 'club', value: 11 },
  { face: '2', suit: 'spade', value: 2 },
  { face: '3', suit: 'spade', value: 3 },
  { face: '9', suit: 'spade', value: 9 },
  { face: '5', suit: 'spade', value: 5 },
  { face: '6', suit: 'spade', value: 6 },
]
const full_house_mock = [
  { face: '2', suit: 'heart', value: 2 },
  { face: '2', suit: 'spade', value: 2 },
  { face: '2', suit: 'club', value: 2 },
  { face: 'A', suit: 'heart', value: 14 },
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'J', suit: 'club', value: 11 },
]
const four_of_a_kind_mock = [
  { face: '2', suit: 'heart', value: 2 },
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'A', suit: 'club', value: 14 },
  { face: 'A', suit: 'heart', value: 14 },
  { face: 'A', suit: 'diamond', value: 14 },
  { face: 'J', suit: 'club', value: 11 },
]
const straight_flush_mock = [
  { face: 'J', suit: 'club', value: 11 },
  { face: '2', suit: 'spade', value: 2 },
  { face: '3', suit: 'spade', value: 3 },
  { face: '4', suit: 'spade', value: 4 },
  { face: '5', suit: 'spade', value: 5 },
  { face: '6', suit: 'spade', value: 6 },
]
const royal_flush_mock = [
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'K', suit: 'spade', value: 13 },
  { face: 'Q', suit: 'spade', value: 12 },
  { face: 'J', suit: 'spade', value: 11 },
  { face: '10', suit: 'spade', value: 10 },
  { face: '5', suit: 'diamond', value: 5 },
]

// it('should create 4 cards of each value')
assert.deepEqual(getProps('value')(Deck.create()), {
  2: 4,
  3: 4,
  4: 4,
  5: 4,
  6: 4,
  7: 4,
  8: 4,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 4,
  14: 4,
})
// it('should create 13 cards of each suit')
assert.deepEqual(getProps('suit')(Deck.create()), {
  spade: 13,
  heart: 13,
  diamond: 13,
  club: 13,
})
// it('should create 4 cards of each face')
assert.deepEqual(getProps('face')(Deck.create()), {
  2: 4,
  3: 4,
  4: 4,
  5: 4,
  6: 4,
  7: 4,
  8: 4,
  9: 4,
  10: 4,
  A: 4,
  Q: 4,
  J: 4,
  K: 4,
})

// --[ hand predicate tests ]--------------------------------------------------
// it returns true when a list of cards contains exactly 2 of the same face cards
assert.strictEqual(ofAKind(2)(one_pair_mock), true)

// it returns false when a list of cards does not contain exactly 2 of the same face cards
assert.strictEqual(ofAKind(2)(high_card_mock), false)
assert.strictEqual(ofAKind(2)(four_of_a_kind_mock), false)

// it returns true when a list of cards contains exactly 3 of the same face cards
assert.strictEqual(ofAKind(3)(full_house_mock), true)

// it returns false when a list of cards does not contain exactly 3 of the same face cards
assert.strictEqual(ofAKind(3)(four_of_a_kind_mock), false)

// it returns true when a list of cards contains exactly 4 of the same face cards
assert.strictEqual(ofAKind(4)(four_of_a_kind_mock), true)

// it returns false when a list of cards does not contain exactly 4 of the same face cards
assert.strictEqual(ofAKind(4)(full_house_mock), false)

// it returns true when given list of cards with a 5 sequential values
assert.strictEqual(straight(straight_mock), true)

// it returns true when given a list of cards that contain 5 of the same suit
assert.strictEqual(flush(flush_mock), true)

// it returns true when given a list of cards that contain a roayls
assert.strictEqual(royals(royal_flush_mock), true)

// it returns true when given a list of cards that contain two pairs
assert.strictEqual(twoPair(two_pair_mock), true)

// --[ hand rank tests ]-------------------------------------------------------
// it returns 10 when given a high card hand
assert.strictEqual(handRank(high_card_mock), 10)

// it returns 9 when given a hand with a pair
assert.strictEqual(handRank(one_pair_mock), 9)

// it returns 8 when given a hand with two pairs
assert.strictEqual(handRank(two_pair_mock), 8)

// it returns 7 when given a three of a kind
assert.strictEqual(handRank(three_of_a_kind), 7)

// it returns 6 when given a straight
assert.strictEqual(handRank(straight_mock), 6)

// it returns 5 when given a flush
assert.strictEqual(handRank(flush_mock), 5)

// it returns 4 when given a full house
assert.strictEqual(handRank(full_house_mock), 4)

// it returns 3 when given four of a kind
assert.strictEqual(handRank(four_of_a_kind_mock), 3)

// it returns 2 when given a straight flush
assert.strictEqual(handRank(straight_flush_mock), 2)

// it returns 1 when given a royal flush
assert.strictEqual(handRank(royal_flush_mock), 1)

// it returns the top 5 cards when given a high_card_mock
assert.deepEqual(bestHand(two_pair_mock), [
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'A', suit: 'heart', value: 14 },
  { face: '8', suit: 'club', value: 8 },
  { face: '8', suit: 'spade', value: 8 },
  { face: 'J', suit: 'club', value: 11 },
])
// it returns the top 5 cards when given a high_card_mock
assert.deepEqual(bestHand(high_card_mock), [
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'J', suit: 'club', value: 11 },
  { face: '8', suit: 'club', value: 8 },
  { face: '5', suit: 'spade', value: 5 },
  { face: '3', suit: 'heart', value: 3 },
])
// it returns the top 5 cards when given a royalFlush_mock
assert.deepEqual(bestHand(royal_flush_mock), [
  { face: 'A', suit: 'spade', value: 14 },
  { face: 'K', suit: 'spade', value: 13 },
  { face: 'Q', suit: 'spade', value: 12 },
  { face: 'J', suit: 'spade', value: 11 },
  { face: '10', suit: 'spade', value: 10 },
])
// it returns the full house when given a fullhouse
assert.deepEqual(bestHand(full_house_mock), [
  { face: '2', suit: 'heart', value: 2 },
  { face: '2', suit: 'spade', value: 2 },
  { face: '2', suit: 'club', value: 2 },
  { face: 'A', suit: 'heart', value: 14 },
  { face: 'A', suit: 'spade', value: 14 },
])
// it returns the flush when given a flush
assert.deepEqual(bestHand(flush_mock), [
  { face: '9', suit: 'spade', value: 9 },
  { face: '6', suit: 'spade', value: 6 },
  { face: '5', suit: 'spade', value: 5 },
  { face: '3', suit: 'spade', value: 3 },
  { face: '2', suit: 'spade', value: 2 },
])

console.log('===================')
console.log('Tests passed')
