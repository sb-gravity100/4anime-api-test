const { FourAnime } = require('./dist/4anime');

const Anime = new FourAnime({
   catch: false,
});

Anime.on('error', console.log);
Anime.on('loaded', (q, t) => {
   process.stdout.clearLine(0);
   process.stdout.write(`${q} - ${t} Done`);
});

Anime.term('boku no hero', res =>
   Anime.episodes(res[0].link, _res => {
      // console.log(_res);
   })
);

// describe('FourAnime#term(s: string)', () => {
//    test(': result', async () => {
//       try {
//          const _res = await Anime.term('boku no hero');
//          const link = new RegExp('\bhttps://4anime.to', 'i');
//          expect(_res).toBe(
//             expect.arrayContaining([
//                expect.objectContaining({
//                   title: expect.any(String),
//                   link: expect.stringContaining(link),
//                   year: expect.stringContaining(/(20|19)[0-9]{2}/gi),
//                   status: expect.any(String),
//                }),
//             ])
//          );
//       } catch (e) {
//          return;
//       }
//    });
//
//    test(': error', () => {
//       Anime.on('error', e => {
//          if (e.code === 'ANINOTFOUND') {
//             expect(e.code).toMatch(/ANINOTFOUND/)
//          }
//       })
//
//       Anime.term('Somthing that doesn\'t exist')
//    })
// });
