((root) => {
  const mock = {};
  mock.fn = (fn = () => {}) => {
    function wrapper(...args) {
      const call = { args: [...args], isAsync: false, threw: false };
      wrapper.calls.push(call);

      try {
        let result = fn(...args);
        if (result.then) {
          result = handlePromise(call, result);
        } else {
          call.result = result;
        }
      } catch(error) {
        handleError(call, error);
        throw error;
      }
      
      return result;
    }

    async function handlePromise(call, promise) {
      call.isAsync = true;
      try {
        return call.result = await promise;
      } catch(error) {
        handleError(call, error);
      }
    }

    function handleError(call, error) {
      call.threw = true;
      call.error = error;
    }
    
    wrapper.calls = [];
    
    return wrapper;
  }

  const STYLES = {
    INDENT: 'font-size: 18px',
    ERROR: 'font-size: 14px; color: red',
    DESCRIBE: 'font-size: 20px; text-decoration: underline',
    PASS: 'font-size: 18px; color: green',
    SKIP: 'font-size: 18px; color: gray',
    FAIL: 'font-size: 18px; color: red',
  }

  const MARKS = {
    PASS: '\u2713',
    SKIP: '-',
    FAIL: '\u2717',
  }

  class Describe {
    constructor(description) {
      this.description = description;
      this.specs = [];
    }
  }

  class UseCase {
    constructor(description, fn) {
      this.description = description;
      this.fn = fn;
    }
  }

  class TestRunner {
    rootDescribe = new Describe('Specs');
    describeStack = [this.rootDescribe];

    constructor(options) {
      this.log = options.log || console.log;
    }

    get currentDescribe() {
      return this.describeStack.at(-1);
    }

    describe(description, fn) {
      const describe = new Describe(description);
      this.currentDescribe.specs.push(describe);
      this.describeStack.push(describe);
      try {
        fn();
      } catch (ex) {
        this.log(`%cError while defining ${description} : ${ex.message}`, STYLE.ERROR);
      }
      this.describeStack.pop();
    }

    it(description, fn) {
      this.currentDescribe.specs.push(new UseCase(description, fn));
    }

    run() {
      return this.runSpecs(this.rootDescribe.specs, '');
    }

    async runDescribe(describe, indent) {
      this.log(`%c${indent}%c${describe.description}`, STYLES.INDENT, STYLES.DESCRIBE);
      await this.runSpecs(describe.specs, indent);
    }

    async runSpecs(specs, indent) {
      for (let spec of specs) {
        if (spec instanceof Describe) {
          await this.runDescribe(spec, indent + '  ');
        } else if (spec instanceof UseCase) {
          await this.runUseCase(spec, indent);
        }
      }
    }

    async runUseCase(useCase, indent) {
      try {
        if (useCase.fn) {
          await useCase.fn();
          this.log(`%c${indent}%c${MARKS.PASS} ${useCase.description}`, STYLES.INDENT, STYLES.PASS);
        } else {
          this.log(`%c${indent}%c${MARKS.SKIP} ${useCase.description}`, STYLES.INDENT, STYLES.SKIP);
        }
      } catch {
        this.log(`%c${indent}%c${MARKS.FAIL} ${useCase.description}`, STYLES.INDENT, STYLES.FAIL);
      }
    }
  }

  root.testRunner = function testRunner(options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }

    const runner = new TestRunner(options);
    const describe = (...args) => runner.describe(...args);
    const it = (...args) => runner.it(...args);

    fn({describe, it, mock});
    return runner.run();
  }
})(globalThis || window || global);

testRunner(({describe, it, mock}) => {
  describe('mock.fn', () => {
    it('should create a mock function if no arguments are passed.');
    it('should spy on call arguments.');
    it('should spy on call return values.');
    it('should spy on call errors.');
    it('should spy on call arguments for async functions.');
    it('should spy on call return values for async functions.');
    it('should spy on call errors for async functions');
    it('should forward the call if a function is passed.');
    it('should return the value from the forwarded call if a function is passed.');
    it('should spy on calls that are forwarded.');
    it('should spy on calls that are forwarded to async functions.');
  });

  describe('testRunner', () => {
    it('should run the tests once the runner factory function returns.');
    it('should be able to have free floating unit tests at the start.');
    it('should be able to have free floating unit tests at the end.');
    it('should render passed tests with a formatted message.');
    it('should render skipped tests with a formatted message.');
    it('should render failed tests with a formatted message.');
    it('should render the error message for failed tests.');
    it('should wait for async tests.');
    it('should render the error message for async failed tests.');
  });
});