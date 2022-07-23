import mocha from 'mocha/mocha';
import css from 'mocha/mocha.css';

const { describe, it } = mocha.constructor;

console.log('Mocha -----------');
console.log(Mocha);
console.log('describe', describe);
console.log('it', it);
console.log('Mocha -----------');
debugger;

mocha.ui('bdd');
describe('foobar', () => {
  it('foobaz', () => {
    console.log('a test');
  });
});

mocha.run();