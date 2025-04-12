const { describe, it } = require('node:test');
const chai = require("chai");
const assert = chai.assert;
const findOutMrWrong = require("./find-liar");

describe("Sample Tests", () => {
  describe("Basic deduction", () => {
    it('Conversation 1', () => {
      const conversation = [
        "John:I'm in 1st position.",
        "Peter:I'm in 2nd position.",
        "Tom:I'm in 1st position.",
        "Peter:The man behind me is Tom."
      ];
      assert.strictEqual(findOutMrWrong(conversation) , "Tom");
    });

    it('Conversation 2', () => {
      const conversation = [
        "John:I'm in 1st position.",
        "Peter:I'm in 2nd position.",
        "Tom:I'm in 1st position.",
        "Peter:The man in front of me is Tom."
      ];
      assert.strictEqual(findOutMrWrong(conversation) , "John");
    });

    it('Conversation 3', () => {
      const conversation = [
        "John:I'm in 1st position.",
        "Peter:There is 1 people in front of me.",
        "Tom:There are 2 people behind me.",
        "Peter:The man behind me is Tom."
      ];
      assert.strictEqual(findOutMrWrong(conversation) , "Tom");
    });
  });
  describe("Unknowable", () => {

    it('Conversation 4', () => {
      const conversation=[
        "John:The man behind me is Peter.",
        "Peter:There is 1 people in front of me.",
        "Tom:There are 2 people behind me.",
        "Peter:The man behind me is Tom."
      ];
      assert.strictEqual(findOutMrWrong(conversation) , null);
    });

    it('Conversation 5', () => {
      const conversation=[
        "Dowfls:There is 0 people behind me.",
        "Dowfls:I'm in 4th position.",
        "Ljiyxbmr:I'm in 2nd position.",
        "Ljiyxbmr:There is 1 people in front of me.",
        "Cvvugb:There are 2 people in front of me.",
        "Cvvugb:There is 1 people behind me.",
        "Tzjlvruhk:The man behind me is Dowfls.",
        "Tzjlvruhk:There are 2 people in front of me."
      ]
      assert.strictEqual(findOutMrWrong(conversation) , null);
    });
  });
  describe("No alibi", () => {

    it.only('Conversation 6', () => {
      const conversation = [
        "Tom:The man behind me is Bob.",
        "Bob:The man in front of me is Tom.",
        "Bob:The man behind me is Gary.",
        "Gary:The man in front of me is Bob.",
        "Fred:I'm in 1st position."
      ];
      assert.strictEqual(findOutMrWrong(conversation) , "Fred");
    });
  });
  describe("Only one choice", () => {

    it('Conversation 7', () => {
      const conversation = [
        "Wrong:The man behind me is Wrong.",
      ];
      assert.strictEqual(findOutMrWrong(conversation) , "Wrong");
    });
  });

  describe("Mr. Wrong contradicts himself", () => {

    it('Conversation 8', () => {
      const conversation = [
        "Charles:The man behind me is Gavin.",
        "Gavin:I'm in 1st position.",
        "Ken:The man in front of me is Gavin.",
        "Charles:The man in front of me is Gavin."
      ];
      assert.strictEqual(findOutMrWrong(conversation) , "Charles");
    });

    it('Conversation 9', () => {
      const conversation = [
        "Greg:I'm in 1st position.",
        "Daniel:There are 2 people in front of me.",
        "Ramone:I'm in 3rd position.",
        "Daniel:There are 2 people behind me."
      ];
      assert.strictEqual(findOutMrWrong(conversation) , "Daniel");
    });

    it('Conversation 10', () => {
      const conversation = [
        "Frodo:I'm in 3rd position.",
        "Gollum:I'm in 3rd position.",
        "Sam:The man behind me is Frodo.",
        "Gollum:The man behind me is Frodo."
      ];
      assert.strictEqual(findOutMrWrong(conversation) , "Gollum");
    });
  });
});
