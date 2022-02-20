const {
  add,
  always,
  both,
  concat,
  cond,
  converge,
  curry,
  equals: eq,
  includes,
  length,
  map,
  pipe,
  prop,
  sort,
  take,
  values,
} = require('ramda')
const { Card } = require('./factories')

// specialized reducer -- ramda does not support indexing
const reduce = curry((fn, init, xs) => xs.reduce(fn, init))

// --[ Aggregates & Filters ]--------------------------------------------------
const getProps = (prop = 'value') => (cards = [Card]) => {
  // returns an object with the count of specified property
  return cards.reduce((acc, curr) => {
    return acc[curr[prop]]
      ? { ...acc, [curr[prop]]: acc[curr[prop]] + 1 }
      : { ...acc, [curr[prop]]: 1 }
  }, {})
}

const countSequents = (
  sequents = 0,
  current = 0,
  index = 0,
  array = [Card]
) =>
  index === array.length
    ? sequents
    : current - array[index + 1] === 1
    ? sequents + 1
    : sequents === 4
    ? 4
    : 0

const sortHandValues = (hand = [Card]) =>
  sort((a, b) => (a.value < b.value ? 1 : -1))(hand)

const highestValues = (num = 1) => (hand = [Card]) =>
  pipe(
    sortHandValues,
    take(num)
  )(hand)

const filterOfAKind = (ofKind = 1) => (hand = [Card]) => {
  const frequencies = getProps('face')(hand)
  return hand.filter(({ face }) => frequencies[face] === ofKind)
}

const filterFlush = (hand = [Card]) => {
  const frequencies = getProps('suit')(hand)
  const best = hand.filter(({ suit }) => frequencies[suit] === 5)
  return sortHandValues(best)
}

const bestTwoPairHand = (hand = [Card]) => 
  pipe(
    sortHandValues,
    converge(concat, [
      filterOfAKind(2),
      pipe(filterOfAKind(1), take(1))]
    )
  )(hand)

const bestFullHouseHand = (hand = [Card]) =>
  converge(concat, [
    filterOfAKind(3),
    filterOfAKind(2)
  ])(hand)

const bestOfAKindHand = (ofKind = 1) => (hand = [Card]) =>
  converge(concat, [
    filterOfAKind(ofKind),
    pipe(filterOfAKind(1), sortHandValues, take(5 - ofKind)),
  ])(hand)

// --[ Predicates ]------------------------------------------------------------
const royals = (hand = [Card]) =>
  pipe(
    sortHandValues,
    map(prop('value')),
    take(5),
    reduce(add, 0),
    eq(14 + 13 + 12 + 11 + 10)
  )(hand)

const flush = (hand = [Card]) =>
  pipe(
    getProps('suit'),
    values,
    includes(5)
  )(hand)

const straight = (hand = [Card]) =>
  pipe(
    sortHandValues,
    map(prop('value')),
    reduce(countSequents, 0),
    eq(4)
  )(hand)

const ofAKind = (quant = 1) => (hand = [Card]) =>
  pipe(
    getProps('face'),
    values,
    includes(quant)
  )(hand)

const royalFlush = both(flush, royals)
const straightFlush = both(straight, flush)
const fullHouse = both(ofAKind(3), ofAKind(2))
const twoPair = pipe(filterOfAKind(2), length, eq(4))

// --[ Hand Evaluation ]-------------------------------------------------------
/**
 *  Evaluate a hand and return its rank from 1-10
 *   - Royal Flush    -> 1
 *   - Straight Flush -> 2
 *   - 4 of a kind    -> 3
 *   - Full House     -> 4
 *   - Flush          -> 5
 *   - Straight       -> 6
 *   - 3 of a kind    -> 7
 *   - Two Pair       -> 8
 *   - Pair           -> 9
 *   - High Card      -> 10
 */
const handRank = (hand = [Card]) =>
  cond([
    [royalFlush, always(1)],
    [straightFlush, always(2)],
    [ofAKind(4), always(3)],
    [fullHouse, always(4)],
    [flush, always(5)],
    [straight, always(6)],
    [ofAKind(3), always(7)],
    [twoPair, always(8)],
    [ofAKind(2), always(9)],
    [() => true, always(10)],
  ])(hand)

/**
 *  Evaluate a hand and return its best cards
 *   - Royal Flush    -> takes highest 5 values
 *   - Straight Flush -> takes highest 5 values
 *   - 4 of a kind    -> takes highest 1 value not in 4 of a kind
 *   - Full House     -> takes highest 1 value not in full house
 *   - Flush          -> takes highest 1 value not in flush
 *   - Straight       -> takes highest 5 values * TODO: this is wrong *
 *   - 3 of a kind    -> takes highest 3 values not in 3 of a kind
 *   - Two Pair       -> takes highest 1 value not in two pair
 *   - Pair           -> takes highest 3 values not in two pair
 *   - High Card      -> takes highest values
 */
const bestHand = (hand = [Card]) =>
  cond([
    [royalFlush, highestValues(5)],
    [straightFlush, highestValues(5)],
    [ofAKind(4), bestOfAKindHand(4)],
    [fullHouse, bestFullHouseHand],
    [flush, filterFlush],
    [straight, highestValues(5)],
    [ofAKind(3), bestOfAKindHand(3)],
    [twoPair, bestTwoPairHand],
    [ofAKind(2), bestOfAKindHand(2)],
    [() => true, highestValues(5)],
  ])(hand)

module.exports = {
  flush,
  bestHand,
  getProps,
  handRank,
  ofAKind,
  royals,
  straight,
  twoPair,
}
