const FourAnime = require('../dist');

(async () => {
   try {
      const fs = require('fs');
      const search = await FourAnime.term('shingeki no kyojin');
      console.log('Search done');
      const anime = await search[0].getAnime();
      console.log(anime.get());
   } catch (e) {
      if (e.isAxiosError) {
         e = e.toJSON();
      }
      console.log(e);
   }
})();
