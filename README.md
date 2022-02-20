# Texas Holdem
Kata Library made on a rainy Saturday.
 
<b>install:</b> `yarn` || `npm i`
<b>run</b>: `node main.js`

### A Note on Default Params

Default parameters have been supplied on most functions to enable IDEs to infer
data types. For example:
```js
const sortHandValues = (hand = [Card]) =>
  sort((a, b) => (a.value < b.value ? 1 : -1))(hand)
```
This will allow an IDE to see that `hand` is an object with 3 properties: `value`, `face`, and `suit`. However, if you were to rely on this default, it would intentionally explode as I made the choice to offer them for syntax purposes instead of functionality. This choice came at the cost of a lot of point-free syntax ... win some you lose some.