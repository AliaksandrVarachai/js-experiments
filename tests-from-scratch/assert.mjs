import assert from 'assert';
import process from 'process';

// this is a custom message for only for comparison assert.strictEqual(1, 2)
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual'
});

try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
}

// AssertTracker (feature to calculate function calls
const tracker = new assert.CallTracker();
function func() {}

const callsfunc = tracker.calls(func, 2); // wraps the calls of a 'func' to calculate it before tracker.verify()

const callsFuncCallArray = tracker.report(); // report about 'func' calls as an array
console.log(callsFuncCallArray);

callsfunc(); callsfunc(); // wrapper is called 2 times (the 2nd param of tracker.calls)

process.on('exit', () => {
  tracker.verify(); // checks number of calls
});

assert.fail(); // throws a standard ASSERTION_ERROR error

// equivalent expressions:
assert.ok('some-truthy-value');
assert.strictEqual(!!'some-truthy-value', true);



