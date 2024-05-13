# Backend

## How to use

**Port default:** 4000 _(can be changed by adding `.env` file with `PORT` variable inside)_

### Install dependencies

```bash
$ npm i
```

### Start the server

```bash
$ npm start # use for production
$ npm run dev # use for development
```

## Data example

```json
{
  "n": 6,
  "k": 3,
  "imposIds": [1, 2, 4]
}
```

The above JSON object represents the following data:

- `n`: the number of players
- `k`: the number of imposters
- `imposIds`: the list of imposters' indices

### Query

#### Send

```javascript
socket.emit('query', { query });
```

#### Receive

```javascript
socket.on('query', (data) => {
  // data
});
```

#### Give question

**Format**:

```json
{
  "query": "? a b c"
}
```

`a,b,c` are distinct integers in range `[1,n]`.

**Response**:

```json
{
  "answer": "LESS|MORE|INVALID"
}
```

If `answer` is `INVALID`, then there is a key `messsage` which contains the error message.

**Example**:

```json
// Request
{
  "query": "? 1 2 3"
}
// Response
{
  "answer": "MORE"
}
```

```json
// Request
{
  "query": "? 3 4 5"
}
// Response
{
  "answer": "LESS"
}
```

```json
// Request
{
  "query": "? 1 2"
}
// Response
{
  "answer": "INVALID",
  "message": "Expected 3 numbers, but got 2"
}
```

#### Give final conclusion

**Format**:

```json
{
  "query": "! a1 a2 ... ak"
}
```

**Response**:

```json
{
  "answer": "PARTIAL|OK",
  "posMatch": [2, 3],
  "accuracy": 0.333333
}
```

- `posMatch` is the list of positions that are correct.
- `accuracy` is the percentage of correct positions.

**Example**:

```json
// Request
{
  "query": "! 1 2 3"
}
// Response
{
  "answer": "PARTIAL",
  "posMatch": [1, 2],
  "accuracy": 0.666667
}
```

```json
// Request
{
  "query": "! 1 2 4"
}
// Response
{
  "answer": "OK",
  "posMatch": [2, 4],
  "accuracy": 1.000000
}
```

#### Get the solution

**Format**:

```json
{
  "query": "="
}
```

**Response**:

```json
{
  "answer": "OK",
  "solution": {
    "numImposters": 6,
    "imposterPositions": [1, 2, 4]
  }
}
```
