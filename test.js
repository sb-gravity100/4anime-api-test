const { FourAnime } = require('./index.js');

const Anime = new FourAnime()

Anime.on('loaded', console.log)
Anime.on('error', console.log)

Anime.term('jujutsu kaisen', res => {
   if (res) {
      console.log('Search is fine.')
   }
   Anime.episodes(res[0], r => {
      if (r) {
         console.log('Data fetching is fine.')
      }
   })
})
