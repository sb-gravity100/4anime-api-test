const FourAnime = require('../index');

const Anime = new FourAnime({
   catch: true,
});

Anime.on('loaded', console.log);

(async () => {
   try {
      const fs = require('fs');
      const search = await Anime.term('shingeki no kyojin');
      console.log('Search done')
      const anime = await search[0].getAnime()
      console.log(anime)
      fs.writeFileSync('./snk1', JSON.stringify(anime))
   } catch (e) {
      console.log(e);
   }
})();
