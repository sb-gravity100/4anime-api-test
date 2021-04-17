# 4anime-api-test

Fetch [](4anime.to) videos and data via **Node**.

# Documentation

## Table of Contents

-  [Class](#class)
-  [Search](#search)
   -  [Output](#output)
   -  [Usage](#usage)

## Class

`new FourAnimeInstance(options: AnimeOptions)` - starts a 4Anime instance.

```javascript
const FourAnimeInstance = require('node-4anime-scraper');

const Anime = new FourAnimeInstance({
   catch: false, // Default is `false`
})

// Do whatever you want
// Anime.term('jujutsu kaisen')...
```

### Errors

If the `catch` option is set to true then it will throw errors on the catch function. If not then it will emit an `error` event.

`catch` is false by default.

---

## Search

`Anime.term(s: string, cb?)` - search a keyword and returns an array of results.

### Output

-  `title` - the title of the anime.
-  `link` - link to it's site.
-  `year` - year aired.
-  `status` - either 'Completed' or 'Currently Airing'.

### Usage

```javascript
// with Promises

Anime.term('jujutsu kaisen')
   .then(function (results) {
      results.forEach(function (s) {
         console.log(s.link);
      });
   })
   .catch(function (e) {
      console.error(e);
   });

// with callbacks

// Set the `catch` option to false...
Anime.on('error', function (e) {
   console.error(e);
});

Anime.term('jujutsu kaisen', function (results) {
   results.forEach(function (s) {
      console.log(s.link);
   });
});

// with async/await

const results = await Anime.term('jujutsu kaisen');
results.forEach(function (s) {
   console.log(s.link);
})
```

---

## Episodes

`Anime.episodes(a: SearchResult, cb?)` - get all episodes of an anime.

### Output

-  `title` - the title of the anime.
-  `eps` - number of episodes
-  `type` - 'Movie', 'TV Series', etc.
-  `status` - either 'Completed' or 'Currently Airing'.
-  `year` - year aired.
-  `data` - episode data.
   -  `src` - link to the source video.
   -  `ep` - episode number.
   -  `filename` - episode filename.
   -  `id` - episode id.

### Usage

```javascript
// With Promises
Anime.term('jujutsu kaisen').then(function(results) {
   Anime.episodes(results[0]).then(function(anime) {
      console.log(anime)
   }).catch(console.error)
}).catch(console.error)

// With callbacks
Anime.on('error', console.error);

Anime.term('jujutsu kaisen', function(results) {
   Anime.episodes(results[0], function(anime) {
      console.log(anime)
   })
})

// With async/await
const results = await Anime.term('jujutsu kaisen')
const anime = await Anime.episodes(results[0])
console.log(anime)
```
---

__Thnx__
