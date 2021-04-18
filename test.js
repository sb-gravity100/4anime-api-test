const FourAnime = require('./dist/index.js');

const Anime = new FourAnime({
   catch: false,
})

describe('FourAnime#term(s: string)', () => {
   test(': result', async () => {
      const _res = await Anime.term('boku no hero');
      const link = new RegExp('\bhttps://4anime.to', 'i');
      expect.hasAssertions();
      expect(_res).toBe(
         expect.arrayContaining([
            expect.objectContaining({
               title: expect.any(String),
               link: expect.stringContaining(link),
               year: expect.stringContaining(/(20|19)[0-9]{2}/gi),
               status: expect.any(String),
            }),
         ])
      );
   });

   test(': error', async () => {
      await Anime.term("Somthing that doesn't exist");
      Anime.on('error', e => {
         if (e.code === 'ANINOTFOUND') {
            expect(e.code).toMatch(/ANINOTFOUND/);
         }
      });
   });
});

describe('FourAnime#episodes(a: SearchResult)', () => {
   test(': result', async () => {
      const search = await Anime.term('jujutsu kaisen');
      const episodes = await Anime.episodes(search[0]);
      expect.hasAssertions();
      expect(episodes).toBe(
         expect.arrayContaining([
            expect.objectContaining({
               title: expect.any(String),
               eps: expect.any(Number),
               type: expect.stringContaining(
                  /(Movie|TV Series|OVA|Special|ONA)/gi
               ),
               status: expect.stringContaining(
                  /(Completed|Currently Airing)/gi
               ),
               year: expect.any(String),
               data: expect.arrayContaining([
                  expect.objectContaining({
                     src: expect.any(String),
                     ep: expect.any(Number),
                     filename: expect.any(String),
                     id: expect.any(Number),
                  }),
               ]),
            }),
         ])
      );
   });
});
