import mocha from 'mocha/mocha';
import css from 'mocha/mocha.css';

const { describe, it } = mocha.constructor;

const report = document.createElement('DIV');
report.id = 'mocha';
Object.assign(report.style, {
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

class HTML2 extends Mocha.reporters.html {
  constructor(runner, options) {
    super(runner, options);
    this.monkeyPatchCSS();
    this.monkeyPatchHTML();
  }

  monkeyPatchCSS() {
    const cssText = [...document.styleSheets]
    .flatMap(sheet => [...sheet.cssRules])
    .filter(({selectorText: sel}) => sel?.includes('#mocha-stats') && sel?.includes('.progress'))
    .at(0)
    .cssText
    .replace('.progress', '.mocha-progress');

    const style = document.createElement('STYLE');
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  monkeyPatchHTML() {
    const progress = document.querySelector('#mocha-stats .progress');
    progress.classList.remove('progress');
    progress.classList.add('mocha-progress');
  }
}

mocha.ui('bdd');
mocha.reporter(HTML2);
describe('foobar', () => {
  it('foobaz', () => {
    console.log('a test');
  });
});

mocha.run();