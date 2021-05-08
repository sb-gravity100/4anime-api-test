const anime = require('./test_search.json');
const _ = require('lodash');

let filth = '- 1-4 6 7 8-13';
const testReg = /(-\s*)?(\d+,*\s*)+/g;
const rangeReg = /\d+-\d+/g;
if (filth.match(testReg)) {
   const ranges = _.chain(
      filth.match(rangeReg).map(v => {
         let [a, b] = v.split('-').map(Number);
         let range;
         if (_.gt(a, b)) {
            if (a > anime.hrefs.length) {
               a = anime.hrefs.length;
            }
            range = _.range(b, a + 1);
         } else {
            if (b > anime.hrefs.length) {
               b = anime.hrefs.length;
            }
            range = _.range(a, b + 1);
         }
         return range;
      })
   )
      .flatten()
      .uniq()
      .value();
   filth = filth
      .replace(/,+/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(v => {
         if (Math.abs(v)) {
            return Math.abs(v);
         }
         return v;
      })
      .filter((v, k) => {
         if (k === 0) {
            if (v === '-' || _.isNumber(v)) {
               return true;
            }
            return false;
         }
         if (_.isNumber(v)) {
            return true;
         }
         return false;
      });
   filth = _.sortBy(_.concat(filth, ranges).filter(Boolean));
   console.log(filth)
   if (filth[0] === '-') {
      _.remove(anime.hrefs, val => filth.includes(val.ep));
   } else {
      _.remove(anime.hrefs, val => !filth.includes(val.ep));
   }
   console.log(anime.hrefs.map(d => d.ep))
}
