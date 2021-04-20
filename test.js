const { FourAnime } = require('./index.js');

const Anime = new FourAnime();
Anime.on('error', e => console.log(e));

(async () => {
   const search = await Anime.term('boku no hero')
   const res = await Anime.episodes(search.shift())
   console.log(res)
})()
