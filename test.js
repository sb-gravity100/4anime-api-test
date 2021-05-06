const FourAnime = require('./index');
const _ = require('lodash');

// const anime = new FourAnime({
//    catch: true,
// });
//
// anime
//    .term('shingeki no kyojin')
//    .then(async res => {
//       const anime = await res[0].getAnime({ episodes: '1,2,3,4,5,6,7,8,9,10'})
//       console.log(anime.toJSON())
//    })
//    .catch(e => {
//       if (e.isAxiosError) {
//          console.log(e.toJSON());
//          return;
//       }
//       console.log(e);
//    });
