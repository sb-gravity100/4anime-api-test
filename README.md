# node-4anime-scraper

Fetch [4Anime](4anime.to) videos and data via **Node**.

# Documentation

Learn more [here](https://sb-gravity100.github.io/node-4anime-scraper/)

## Major Changes

-  v3

   -  Remove FourAnime class. You can now search via `term()`.

-  v2
   -  Removed `Instance.episodes()` [Read here...](#where-is-instanceepisodes)
   -  Removed callback functions.
   -  Added episode filtering.
   -  Results are returned as an Instance, use [`result.toJSON()`](#readable)

## Table of Contents

-  [Basics](#basics)
-  [Term](#search)
   -  [Output](#output)
   -  [Usage](#usage)

## Basics

```javascript
const FourAnime = require('node-4anime-scraper');
// Or with imports
// import FourAnime from 'node-4anime-scraper'
// on typescript
// import * as FourAnime from 'node-4anime-scraper'

FourAnime.term('shingeki no kyojin').then(search => {
   // `search` is an array of `SearchResult` instances...
   const first = search[0].toJSON();
   const last = search.pop().toJSON();
   // or
   const readable = search.map(s => s.toJSON());
});
```

---

## Search

`FourAnime.term(s: string)`

-  search a string.
-  Returns an array of `SearchResult` instances.

### Output

-  A `SearchResult` instance.

See [Docs...](https://sb-gravity100.github.io/node-4anime-scraper/) for more.

### Usage

```javascript
// with Promises

FourAnime.term('jujutsu kaisen')
   .then(results => {
      results.forEach(e => console.log(e.toJSON()));
   })
   .catch(function (e) {
      console.error(e);
   });

// with async/await

const results = await FourAnime.term('jujutsu kaisen');
results.forEach(s => console.log(s.toJSON()));
```

### Where is `Instance.episodes()`???

On v2, `Instance.episodes()` is no longer available.

Instead use `SearchResult.getAnime()` to fetch anime data and episode links. The function returns a promise.

```javascript
// Promises
FourAnime.term('shingeki').then(results => {
   const first = results[0];
   first.getAnime().then(anime => {
      // Logs an array of episodes
      console.log(anime.getEpisodes());
   });
});

// or with async/await

const results = await FourAnime.term('shingeki');
const first = results[0];
const anime = await first.getAnime();
// and so on...
```

### Episode filtering

This might have bugs or might not work... If there are issues don't forget to create one.
On `getAnime()`, you can pass an `episodes` option to filter the episodes.

```javascript
const results = await FourAnime.term('shingeki');
const first = results[0];
// Get the episodes we want
const filtered_episodes = await first.getAnime({ episodes: '11, 12, 13' });
// Remove the episodes we already watched add a `-` at the beginning. MAKE SURE TO ADD SPACE AFTER THE HYPHEN
const removed_episodes = await first.getAnime({ episodes: '- 1, 2, 3' });
// You can use spaces instead of commas.
const removed_episodes = await first.getAnime({
   // It will ignore the whitespaces
   episodes: '- 1 2 3      5',
});
```

---

## Readable

`FourAnime.term()` and `SearchResult.getAnime()` returns an instance.
To make it much readable, use `toJSON()` or `get()`

```javascript
FourAnime.term('shingeki').then(results => {
   const first = results[0];
   first.getAnime().then(anime => {
      console.log(anime.toJSON());
   });
});
```

**Thnx**
