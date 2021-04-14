const test = require('ava');
const { FourAnime } = require('./dist/4anime');

const Anime = new FourAnime({
   catch: true,
});

test('term', async t => {
   try {
      await Anime.term('boku no');
      t.pass()
   } catch (e) {
      t.fail(e.message)
   }
});
