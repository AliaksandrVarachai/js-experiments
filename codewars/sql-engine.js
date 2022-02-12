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

  // @returns Array<[tableId:string, columnId: string]>
  this.parseColumns = function(columnLexemes) {
    return columnLexemes.filter(lexeme => lexeme !== ',').map(this.parseColumnId);
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

  this.getUnion = function(columns) {
    const groupedColumnNamesByTableName = {};
    columns.forEach(([tableId, columnId]) => {
      if (groupedColumnNamesByTableName[tableId]) {
        groupedColumnNamesByTableName[tableId].push(columnId);
      } else {
        groupedColumnNamesByTableName[tableId] = [columnId];
      }
    });

    let union = [];
    Object.entries(groupedColumnNamesByTableName).forEach(([tableId, columnIds], groupedColumnIndex) => {
      const dbTable = db[tableId];

      const extractedDbColumns = [];
      columnIds.forEach(columnId => {
        dbTable.forEach((dbRow, dbRowIndex) => {
          extractedDbColumns[dbRowIndex] = { [`${tableId}.${columnId}`]: dbRow[columnId] };
        });
      });

      if (groupedColumnIndex === 0) {
        union = extractedDbColumns;
        return;
      }

      const unionWithExtractedDbColumns = [];
      union.forEach(queryResultRow => {
        extractedDbColumns.forEach(intermediateQueryRow => {
          unionWithExtractedDbColumns.push({ ...queryResultRow, ...intermediateQueryRow });
        });
      });
      union = unionWithExtractedDbColumns;
    });
    return union;
  };

  this.reduceByWhere = function(union, where) {
    const parseArg = (arg) => {
      if (arg.startsWith("'") && arg.endsWith("'")) {
        return { type: 'string', value: arg.slice(1, -1) };
      }
      if (!isNaN(arg)) {
        return { type: 'number', value: +arg };
      }
      const parsedColumnId = this.parseColumnId(arg); // TODO: simplify
      if (parsedColumnId.length === 2) {
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
        const [lTable, lColumn] = la.value;
        if (ra.type === 'column') {
          return checkCondition(row[la.value], operator, row[ra.value]);
        }
        debugger;
        return checkCondition(row[la.value], operator, ra.value);
      }
      if (ra.type === 'column') {
        const [rTable, rColumn] = ra.value;
        return checkCondition(la.value, operator, row[rTable][rColumn]);
      }
      return checkCondition(la.value, operator, ra.value);
    }

    debugger;
    return union.filter(row => checkRowWithCondition(row, where));
  };

  this.execute = function(query){
    const lexemes = query.split(/\s+|(?=,)/);
    const { columns, from, join, where } = this.parseQuery(lexemes);

    const unionOfColumns = this.getUnion(columns);
    if (!where) return unionOfColumns;

    const unionReducedByWhere = this.reduceByWhere(unionOfColumns, where);
    return unionReducedByWhere;
  }
}

module.exports = SQLEngine;