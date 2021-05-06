# node-4anime-scraper

Fetch [](4anime.to) videos and data via **Node**.

# Documentation

Learn more [here](https://sb-gravity100.github.io/node-4anime-scraper/)

## Major Changes

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

`new FourAnime(options: AnimeOptions)` - starts a 4Anime instance.

```javascript
const FourAnime = require('node-4anime-scraper');
// Or with imports
// import FourAnime from 'node-4anime-scraper'

const Anime = new FourAnime({
   catch: false, // Default is `false`
});
// Since `catch` is false then all errors will be thrown here...
Anime.on('error', err => {
   console.log(err);
});
Anime.term('shingeki no kyojin').then(search => {
   // `search` is an array of `SearchResult` instances...
   const first = search[0].toJSON();
   const last = search.pop().toJSON();
   // or
   const readable = search.map(s => s.toJSON());
})
```

### Errors

If the `catch` option is set to true then it will throw errors on the catch function. If not then it will emit an `error` event.

`catch` is false by default.

---

## Search

`Anime.term(s: string)`

-  search a string.
-  Returns an array of `SearchResult` instances.

### Output

-  A `SearchResult` instance.

See [Docs...](https://sb-gravity100.github.io/node-4anime-scraper/)

### Usage

```javascript
// with Promises

Anime.term('jujutsu kaisen')
   .then(results => {
      results.forEach(e => console.log(e.toJSON()));
   })
   .catch(function (e) {
      console.error(e);
   });

// with async/await

const results = await Anime.term('jujutsu kaisen');
results.forEach(s => console.log(s.toJSON()))
```

### Where is `Instance.episodes()`???

On v2, `Instance.episodes()` is no longer available.

Instead use `SearchResult.getAnime()` to fetch anime data and episode links. The function returns a promise.
```javascript
// Promises
Anime.term('shingeki').then(results => {
   const first = results[0];
   first.getAnime().then(anime => {
      // Logs an array of episodes
      console.log(anime.getEpisodes());
   });
})

// or with async/await

const results = await Anime.term('shingeki')
const first = results[0]
const anime = await first.getAnime()
// and so on...
```

### Episode filtering

This might have bugs or might not work... If there are issues don't forget to create one.
On `getAnime()`, you can pass an `episodes` option to filter the episodes.

```javascript
const results = await Anime.term('shingeki')
const first = results[0]
// Get the episodes we want
const filtered_episodes = await first.getAnime({ episodes: "11, 12, 13" })
// Remove the episodes we already watched add a `-` at the beginning.
const removed_episodes = await first.getAnime({ episodes: "- 1, 2, 3" })
// You can use spaces instead of commas.
const removed_episodes = await first.getAnime({
   // It will ignore the whitespaces
   episodes: "-1 2 3      5"
})
```

What is does is it replaces commas with whitespaces and replaces multiple whitespaces with a single one...

> ```"1, 2, 4, ..whitespaces.... 6 ... 10"``` to...  
> ```"1  2  4 ..whitespaces.... 6    10"``` to...  
> ```"1 2 4 6 10``` to...  
> ```[1,2,4,6,10]```

## Error Handling

By default, the instance will emit an 'error' event on errors. If you wanna use the catch block then set the `catch` option to true.

```javascript
// `catch` is false by default.
const Anime = new FourAnime();

Anime.on('error', console.error);

// This will throw an error event...
Anime.term("Something that doesn't exist").then(res => {
   // `res` is null...
});

// If `catch` is set to true
const Anime = new FourAnime({
   catch: true,
});
Anime.term("Something that doesn't exist")
   .then(res => {
      // `res` is null
   })
   .catch(e => {
      // Do something about the error...
   })
```

---

## Readable

`Instance.term()` and `SearchResult.getAnime()` returns an instance.
To make it much readable, use `toJSON()`

```javascript
Anime.term('shingeki').then(results => {
   const first = results[0];
   first.getAnime().then(anime => {
      console.log(anime.toJSON())
   })
})
```

**Thnx**
