import mocha from 'mocha/mocha';
import css from 'mocha/mocha.css';

const { describe, it } = mocha.constructor;

const report = document.createElement('DIV');
report.id = 'mocha';
Object.apply(report.style, {
  position: 'fixed',
  zIndex: 100000,
  backgroundColor: 'white',
  margin: '0px',
  inset: '0px 0px 0px 0px',
});
document.body.appendChild(report);

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