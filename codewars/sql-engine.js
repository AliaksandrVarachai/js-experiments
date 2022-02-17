function SQLEngine(db) {
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

    return {
      name: 'select',
      columns: columnLexemes.filter(lexeme => lexeme !== ','), // Array<[tableId, columnId]>
      from: fromLexemes.filter(lexeme => lexeme !== ','),      // Array<string>
      joinedColumnIdPairs: joinPoses.map(joinPos => {
        const columnId1 = lexemes[joinPos + 3]; // before ON
        const columnId2 = lexemes[joinPos + 5]; // after ON
        return([columnId1, columnId2]);
      }),                                                      // Array<{columnId1, columnId2}>
      whereArray: this.parseWhere(whereLexemes),               // Array<{leftArg, rightArg, operator, nextConnective}>
    };
  };

  this.parseWhere = function(whereLexemes) {
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

  this.reduceRowByWhere = function(row, whereArray) {
    const parseArg = (arg) => {
      if (arg.startsWith("'") && arg.endsWith("'")) {
        return { type: 'string', value: arg.slice(1, -1) };
      }
      if (!isNaN(arg)) {
        return { type: 'number', value: +arg };
      }
      if (/\w+\.\w+/.test(arg)) {
        return { type: 'column', value: arg };
      }
      throw Error(`Argument "${arg}" cannot be parsed`);
    }

    const checkCondition = (leftOperand, operator, rightOperand) => {
      switch(operator) {
        case '=': return leftOperand === rightOperand;
        case '<': return leftOperand < rightOperand;
        case '>': return leftOperand > rightOperand;
        case '<=': return leftOperand <= rightOperand;
        case '>=': return leftOperand >= rightOperand;
        case '<>': return leftOperand !== rightOperand;
        default: throw Error(`Operator "${operator}" is not supported`);
      }
    }

    const areConditionsMet = (row, whereArray) => {
      for (let i = 0, len = whereArray.length; i < len; ++i) {
        let isConditionMet;
        const { leftArg, operator, rightArg, nextConnective } = whereArray[i];
        const la = parseArg(leftArg);
        const ra = parseArg(rightArg);
        if (la.type === 'column') {
          if (ra.type === 'column') {
            isConditionMet = checkCondition(row[la.value], operator, row[ra.value]);
          } else {
            isConditionMet = checkCondition(row[la.value], operator, ra.value);
          }
        } else if (ra.type === 'column') {
          isConditionMet = checkCondition(la.value, operator, row[ra.value]);
        } else {
          isConditionMet = checkCondition(la.value, operator, ra.value);
        }
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

   // accepts columnIdPairs: Array<[columnId1: string, columnId2: string]>
  this.getMultipleJoins = function(columnIdPairs) {
    let joinedTableIndexes = [];

    const indexByTableNames = {};
    const tableNameByIndexes = [];
    const tableByIndexes = [];
    for (let k = 0; k < columnIdPairs.length; ++k) {
      let [tableName1, columnName1] = columnIdPairs[k][0].split('.');
      let [tableName2, columnName2] = columnIdPairs[k][1].split('.');
      let isTable1Indexed = indexByTableNames.hasOwnProperty(tableName1);
      let isTable2Indexed = indexByTableNames.hasOwnProperty(tableName2);

      if (!isTable1Indexed && isTable2Indexed) {
        [tableName1, tableName2] = [tableName2, tableName1];
        [columnName1, columnName2] = [columnName2, columnName1];
        [isTable1Indexed, isTable2Indexed] = [isTable2Indexed, isTable1Indexed];
      }

      if (!isTable1Indexed) {
        tableNameByIndexes.push(tableName1);
        indexByTableNames[tableName1] = tableByIndexes.push(db[tableName1]) - 1;
      }
      if (!isTable2Indexed) {
        tableNameByIndexes.push(tableName2);
        indexByTableNames[tableName2] = tableByIndexes.push(db[tableName2]) - 1;
      }
      if (!isTable1Indexed && !isTable2Indexed) {
        const table1 = db[tableName1];
        const table2 = db[tableName2];
        table1.forEach((row1, index1) => {
          const value1 = row1[columnName1];
          table2.forEach((row2, index2) => {
            const value2 = row2[columnName2];
            if (value1 === value2) joinedTableIndexes.push([index1, index2]);
          });
        });
      } else if (isTable1Indexed && !isTable2Indexed) {
        const newJoinedTableIndexes = [];
        const table1IndexInIndexedTables = indexByTableNames[tableName1];
        const table1 = tableByIndexes[table1IndexInIndexedTables];
        const table2 = db[tableName2];
        joinedTableIndexes.forEach(joinedTableRow => {
          const table1RowIndex = joinedTableRow[table1IndexInIndexedTables];
          const value1 = table1[table1RowIndex][columnName1];
          table2.forEach((row2, index2) => {
            const value2 = row2[columnName2];
            if (value1 === value2) newJoinedTableIndexes.push([...joinedTableRow, index2]);
          });
        });
        joinedTableIndexes = newJoinedTableIndexes;
      }
    }

    return joinedTableIndexes.map(joinedTableRow => {
      const joinedValues = {};
      joinedTableRow.forEach((rowIndex, tableIndex) => {
        const tableName = tableNameByIndexes[tableIndex];
        const table = tableByIndexes[tableIndex];
         Object.entries(table[rowIndex]).forEach(([columnName, value]) => {
           joinedValues[`${tableName}.${columnName}`] = value;
         });
      });
      return joinedValues;
    });
  };

  this.execute = function(query){
    let isOpeningQuotationMark = false
    const lexemes = [];
    let lexeme = '';
    for (let i = 0, len = query.length; i < len; ++i) {
      const c = query[i];
      if (/\s/.test(c)) {
        if (isOpeningQuotationMark) lexeme += c;
        else if (lexeme) {
          lexemes.push(lexeme);
          lexeme = '';
        }
      } else if (c === "'") {
        if (query[i - 1] !== "'") lexeme += c;
        isOpeningQuotationMark = !isOpeningQuotationMark;
      } else if (c === ',') {
        lexemes.push(lexeme, c);
        lexeme = '';
      } else {
        lexeme += c;
      }
    }
    if (lexeme) lexemes.push(lexeme);

    const { columns, from, joinedColumnIdPairs, whereArray } = this.parseQuery(lexemes);

    let outputData = [];
    if (joinedColumnIdPairs.length > 0) {
      const joinedData = this.getMultipleJoins(joinedColumnIdPairs);
      outputData = whereArray.length ? joinedData.filter(row => this.reduceRowByWhere(row, whereArray)) : joinedData;
    } else {
      const tableName = from[0];
      const table = db[tableName];
      const extendedTable = table.map(row => {
        const rowWithTableName = {};
        Object.entries(row).forEach(([columnName, value]) => {
          rowWithTableName[`${tableName}.${columnName}`] = value;
        });
        return rowWithTableName;
      });
      outputData = whereArray.length
        ? extendedTable.filter(row => this.reduceRowByWhere(row, whereArray))
        : extendedTable;
    }
    outputData = outputData.map(row => this.getRowWithRequiredColumns(row, columns));

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