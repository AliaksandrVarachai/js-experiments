function assemblerInterpreter(program) {
  const vars = {};
  //const funcList = {};
  const labels = {};
  const operations = []; //name, agrs

  function parseLine(lines, i) {
    const lexems = lines[i].split(/,?\s+/);
    return {
      operator: lexems[0],
      args: lexems.slice(1)
    };
  }

  const lines = program.split('\n');
  lines.forEach(line => {line = line.trim()});

  for (let i = 0; i < lines.length; i++) {
    const lexems = lines[i].match(/'[^']*'|[^\,\s]+/g).map(lexem => lexem.match(/[^']*/g));
    //const lexems = lines[i].split(/,?\s+/);
    if (lexems[0] === undefined || lexems[0] === ';')
      continue; // ignore empty lines and comments
    const op = {
      operation: lexems[0],
      args: lexems.slice(1)
    };
    let commentInx = op.args.findIndex(';');
    if (commentInx > -1) {
      op.args.splice(commentInx - 1); // ignore of a line tail comment
    }
    if (operation[operation.length - 1] === ':') {
      labels[operation.substr(0, -1)] = i; // just add to the list of functions
      continue;
    }
    operations.push(op);
  }

  function Func(label, k) {
    this.label = label;
    this.ret = k;
  }

  function CallStack() {
    this.top = null;
  }

  CallStack.prototype.isEmpty = function() {
    return this.top === null;
  };

  CallStack.prototype.push = function(func) {
    const top = this.top;
    this.top = func;
    this.top.prev = top;
  };

  CallStack.prototype.pop = function() {
    if (!this.top)
      return null;
    const top = this.top;
    this.top = top.prev;
    return top;
  };

  let callStack = new CallStack();

  function Cmp([a, b]) { // just 1 level
    this.a = a;
    this.b = b;
  }

  Cmp.prototype.jle = function() { return this.a <= this.b; };
  Cmp.prototype.jge = function() { return this.a >= this.b; };
  Cmp.prototype.jl =  function() { return this.a < this.b; };
  Cmp.prototype.lg =  function() { return this.a > this.b; };
  Cmp.prototype.je =  function() { return this.a === this.b; };
  Cmp.prototype.lne = function() { return this.a !== this.b; };

  let cmp = null;

  function nextOperationNumber(k) {
    const operation = operations[k].operation;
    const args = operations[k].args;
    switch (operation) {
      case 'jmp':
        return labels[args[0]];
      case 'call':
        callStack.push(new Func(args[0], k));
        return labels[args[0]];
      case 'ret':
        return callStack.pop().ret + 1;
      case 'cmp':
        cmp = new Cmp(args);
        return k + 1;
      case 'jle':
      case 'jge':
      case 'jl':
      case 'jg':
      case 'je':
      case 'jne':
        return cmp[operation]() ? (cmp = null, +args[0]) : k + 1;
      default:
        return k + 1;
    }
  }



  let operationNumber = 0;
  let operation = operations[0].operation;
  let args = operations[0].args;
  let a, b;
  while (operation !== 'end') {
    switch (operation) {
      case 'mov':
        b = +args[1];
        vars[args[0]] = isNaN(b) ? vars[args[1]] : b;
        break;
      case 'inc':
        vars[args[0]]++;
        break;
      case 'dec':
        vars[args[0]]--;
        break;
      case 'add':
        b = +args[1];
        vars[args[0]] += isNaN(b) ? vars[args[1]] : b;
        break;
      case 'sub':
        b = +args[1];
        vars[args[0]] -= isNaN(b) ? vars[args[1]] : b;
        break;
      case 'mul':
        b = +args[1];
        vars[args[0]] *= isNaN(b) ? vars[args[1]] : b;
        break;
      case 'div':
        b = +args[1];
        vars[args[0]] /= isNaN(b) ? vars[args[1]] : b;
        break;
      case 'msg':
        console.log(args.reduce((acc, arg) => {
          let a = +arg;
          if (isNaN(a)) {
            return acc += vars[arg];
          } else {
            return acc + arg;
          }
        }, ''));
        break;
      default:
        throw Error(`Unknows operation: "${operation}: args=[${args.join(', ')}]"`);
    }

    operationNumber = nextOperationNumber(operationNumber);
    operation = operations[operationNumber].operation;
  }
}


var program = `; My first program
mov  a, 5
inc  a
call function
msg  '(5+1)/2 = ', a    ; output message
end

function:
    div  a, 2
    ret`
assemblerInterpreter(program); //'(5+1)/2 = 3'

