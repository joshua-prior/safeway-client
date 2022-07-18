import foobar from "intern/browser/intern";

intern.configure({
  suites: ['src/index.test.js'],
  reporters: 'html'
});

intern.run();
