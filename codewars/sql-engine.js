function SQLEngine(db) {
  // @returns [tableId: string, columnId: string]
  this.parseColumnId = function(columnLexeme) {
    return columnLexeme.split('.');
  };

  this.parseQuery = function(lexemes) {
    if (!(/select/i).test(lexemes[0])) throw Error('Query must start with "select"');
    const len = lexemes.length;
    let fromPos = 0, joinPos = 0, wherePos = 0;
    for (let i = 1; i < len; ++i) {
      const lexeme = lexemes[i].toLowerCase();
      switch(lexeme) {
        case 'from': fromPos = i; break;
        case 'join': joinPos = i; break;
        case 'where': wherePos = i; break;
      }
    }
    const columnLexemes = lexemes.slice(1, fromPos);
    const fromLexemes = lexemes.slice(fromPos + 1, joinPos || wherePos || len);
    const joinLexemes = joinPos > 0 ? lexemes.slice(joinPos + 1, wherePos || len) : [];
    const whereLexemes = wherePos > 0 ? lexemes.slice(wherePos + 1) : [];
    return {
      name: 'select',
      columns: this.parseColumns(columnLexemes), // Array<[tableId, columnId]>
      from: this.parseTables(fromLexemes), // Array<string>
      join: joinLexemes.length ? this.parseJoin(joinLexemes) : null,
      where: whereLexemes.length ? this.parseWhere(whereLexemes) : null,
    };
  };

  this.parseTables = function(tableLexemes) {
    return tableLexemes.filter(lexeme => lexeme !== ',');
  };

  // returns tableName.columnName
  this.parseColumns = function(columnLexemes) {
    return columnLexemes.filter(lexeme => lexeme !== ',');
  };

  this.parseCondition = function([leftArg, operator, rightArg]) {
    return { leftArg, operator, rightArg };
  };

  this.parseJoin = function(joinLexems) {
    const [leftTable, _on, ...conditionLexems] = joinLexems;
    const { leftArg, rightArg, operator } = this.parseCondition(conditionLexems);
    return {
      name: 'join',
//       condition: this.parsecondition(conditionLexems),
      leftTable: this.parseColumnId(leftArg),
      rightTable: this.parseColumnId(rightArg),
      operator,
    };
  };


  this.parseWhere = function(whereLexemes) {
    return this.parseCondition(whereLexemes);
  };

  // @returns row | null
  this.getRowByIndexes = function(tableNames, outputRowIndexes, where) {
    const outputRow = {};
    outputRowIndexes.forEach((rowIndex, tableIndex) => {
      const tableName = tableNames[tableIndex];
      const table = db[tableName];
      const columnNames = Object.keys(table[0]);
      columnNames.map(columnName => {
        outputRow[`${tableName}.${columnName}`] = table[rowIndex][columnName];
      });
    });
    return where ? this.reduceRowByWhere(outputRow, where) : outputRow;
  };

  this.reduceRowByWhere = function(row, where) {
    const parseArg = (arg) => {
      if (arg.startsWith("'") && arg.endsWith("'")) {
        return { type: 'string', value: arg.slice(1, -1) };
      }
      if (!isNaN(arg)) {
        return { type: 'number', value: +arg };
      }
      if (this.parseColumnId(arg).length === 2) {
        return { type: 'column', value: arg };
      }
      throw Error(`Argument "${arg}" cannot be parsed`);
    }

    // accepts values;
    const checkCondition = (leftOperand, operator, rightOperand) => {
      switch(operator) {
        case '=': return leftOperand === rightOperand;
        case '<': return leftOperand < rightOperand;
        case '>': return leftOperand > rightOperand;
        case '<=': return leftOperand <= rightOperand;
        case '>=': return leftOperand >= rightOperand;
        default: throw Error(`Operator "${operator}" is not supported`);
      }
    }

    // accepts NOT parsed args
    const checkRowWithCondition = (row, { leftArg, operator, rightArg }) => {
      const la = parseArg(leftArg);
      const ra = parseArg(rightArg);
      if (la.type === 'column') {
        if (ra.type === 'column') {
          return checkCondition(row[la.value], operator, row[ra.value]);
        }
        return checkCondition(row[la.value], operator, ra.value);
      }
      if (ra.type === 'column') {
        const [rTable, rColumn] = ra.value;
        return checkCondition(la.value, operator, row[rTable][rColumn]);
      }
      return checkCondition(la.value, operator, ra.value);
    }

    return checkRowWithCondition(row, where) ? row : null;
  };

  this.getRowWithRequiredColumns = function(row, requiredColumnIds) {
    const outputRow = {};
    Object.keys(row).forEach(columnId => {
      if (requiredColumnIds.includes(columnId)) outputRow[columnId] = row[columnId];
    });
    return outputRow;
  }

  this.execute = function(query){
    const lexemes = query.split(/\s+|(?=,)/);
    const { columns, from, join, where } = this.parseQuery(lexemes);

    const outputData = [];
    const tableSizes = from.map(tableName => db[tableName].length);
    const rowIndexes = [];
    for (let i = tableSizes.length - 1; i >= 0; --i) rowIndexes.push(0);
    let tableIndex = tableSizes.length - 1;
    let isEnd = false;
    while (!isEnd) {
      const rowWithAllColumns = this.getRowByIndexes(from, rowIndexes, where);
      if (rowWithAllColumns) {
        outputData.push(this.getRowWithRequiredColumns(rowWithAllColumns, columns));
      }

      if (rowIndexes[tableIndex] < tableSizes[tableIndex] - 1) {
        ++rowIndexes[tableIndex];
        continue;
      }
      while (rowIndexes[tableIndex] === tableSizes[tableIndex] - 1) {
        --tableIndex;
        if (tableIndex < 0) {
          isEnd = true;
          break;
        }
      }
      for (let i = tableIndex + 1; i < tableSizes.length; ++i) rowIndexes[i] = 0;
    }

    const areRowsEqual = (row1, row2) => {
      const row1Keys = Object.keys(row1);
      for (let i = row1Keys.length - 1; i >= 0; --i) {
        const key = row1Keys[i];
        if (row1[key] !== row2[key]) return false;
      }
      return true;
    }

    // keeps only unique rows
    for (let i = 0; i < outputData.length; ++i) {
      const row = outputData[i];
      let j = i + 1;
      while (j < outputData.length) {
        if (areRowsEqual(row, outputData[j])) outputData.splice(j, 1);
        else ++j;
      }
    }

    return outputData;
  }
}

module.exports = SQLEngine;