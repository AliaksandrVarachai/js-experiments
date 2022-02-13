function SQLEngine(db) {
  // @returns [tableId: string, columnId: string]
  // TODO: remove
  this.parseColumnId = function(columnLexeme) {
    return columnLexeme.split('.');
  };

  this.parseQuery = function(lexemes) {
    if (!(/select/i).test(lexemes[0])) throw Error('Query must start with "select"');
    const len = lexemes.length;
    let fromPos = 0, joinPoses = [], wherePos = 0;
    for (let i = 1; i < len; ++i) {
      const lexeme = lexemes[i].toLowerCase();
      switch(lexeme) {
        case 'from': fromPos = i; break;
        case 'join': joinPoses.push(i); break;
        case 'where': wherePos = i; break;
      }
    }
    const columnLexemes = lexemes.slice(1, fromPos);
    const fromLexemes = lexemes.slice(fromPos + 1, joinPoses[0] || wherePos || len);
    const whereLexemes = wherePos > 0 ? lexemes.slice(wherePos + 1) : [];
    joinPoses.forEach(joinPos => {
      // JOINs are transformed to WHERE
      const tableNamePos = joinPos + 1;
      const onConditionPos = joinPos + 3;
      fromLexemes.push(',', lexemes[tableNamePos]);
      if (whereLexemes.length > 0) whereLexemes.push('and');
      whereLexemes.push(lexemes[onConditionPos], lexemes[onConditionPos + 1], lexemes[onConditionPos + 2]);
    });
    return {
      name: 'select',
      columns: this.parseColumns(columnLexemes), // Array<[tableId, columnId]>
      from: this.parseTables(fromLexemes), // Array<string>
      whereArray: whereLexemes.length ? this.parseWhere(whereLexemes) : null,
    };
  };

  this.parseTables = function(tableLexemes) {
    return tableLexemes.filter(lexeme => lexeme !== ',');
  };

  // returns tableName.columnName
  this.parseColumns = function(columnLexemes) {
    return columnLexemes.filter(lexeme => lexeme !== ',');
  };

   // @returns Array<{leftArg, rightArg, operator, nextConnective}>
  this.parseWhere = function(whereLexemes) {
    // TODO: implement 'and' & 'or' operators
    const groupedConditions = [];
    for (let i = 0, len = whereLexemes.length; i < len; i += 4) {
      groupedConditions.push({
        leftArg: whereLexemes[i],
        operator: whereLexemes[i + 1],
        rightArg: whereLexemes[i + 2],
        nextConnective: whereLexemes[i + 3] ? whereLexemes[i + 3].toLowerCase() : 'end',  // 'end' for the last condition
      });
    }
    return groupedConditions;
  };

  // @returns row | null
  this.getRowByIndexes = function(tableNames, outputRowIndexes, whereArray) {
    const outputRow = {};
    outputRowIndexes.forEach((rowIndex, tableIndex) => {
      const tableName = tableNames[tableIndex];
      const table = db[tableName];
      const columnNames = Object.keys(table[0]);
      columnNames.map(columnName => {
        outputRow[`${tableName}.${columnName}`] = table[rowIndex][columnName];
      });
    });
    return whereArray && whereArray.length > 0 ? this.reduceRowByWhere(outputRow, whereArray) : outputRow;
  };

  this.reduceRowByWhere = function(row, whereArray) {
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
    const areConditionsMet = (row, whereArray) => {
      for (let i = 0, len = whereArray.length; i < len; ++i) {
        const { leftArg, operator, rightArg, nextConnective } = whereArray[i];
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
        const isConditionMet = checkCondition(la.value, operator, ra.value);
        switch (nextConnective) {
          case 'and':
            if (!isConditionMet) return false;
            break;
          case 'or':
            if (isConditionMet) return true;
            break;
          case 'end':
            return isConditionMet;
          default:
            throw Error(`Conditional connective "${nextConnective}" is not recognized`);
        }
      }
    }

    return areConditionsMet(row, whereArray) ? row : null;
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
    const { columns, from, whereArray } = this.parseQuery(lexemes);

    const outputData = [];
    const tableSizes = from.map(tableName => db[tableName].length);
    const rowIndexes = [];
    for (let i = tableSizes.length - 1; i >= 0; --i) rowIndexes.push(0);
    let tableIndex = tableSizes.length - 1;
    let isEnd = false;
    while (!isEnd) {
      const rowWithAllColumns = this.getRowByIndexes(from, rowIndexes, whereArray);
      if (rowWithAllColumns) {
        outputData.push(this.getRowWithRequiredColumns(rowWithAllColumns, columns));
      }

      if (rowIndexes[tableIndex] < tableSizes[tableIndex] - 1) {
        ++rowIndexes[tableIndex];
        continue;
      }
      while (!isEnd && rowIndexes[tableIndex] === tableSizes[tableIndex] - 1) {
        --tableIndex;
        if (tableIndex < 0) isEnd = true;
      }
      if (isEnd) break;
      ++rowIndexes[tableIndex];
      for (let i = tableIndex + 1; i < tableSizes.length; ++i) rowIndexes[i] = 0;
      tableIndex = tableSizes.length - 1;
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