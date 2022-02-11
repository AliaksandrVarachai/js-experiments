function SQLEngine(db) {
  // @returns [tableId: string, columnId: string]
  this.parseColumnId = function(columnLexeme) {
    return columnLexeme.split('.');
  };

  this.parseSelect = function(lexemes) {
    if (!(/select/i).test(lexemes[0])) throw Error('SELECT query must start with "select"');
    const len = lexemes.length;

    let i = 1;
    while (i < len && !(/from/i).test(lexemes[i])) ++i;
    const fromPos = i;
    const columnLexemes = lexemes.slice(1, fromPos);

    ++i;
    while (i < len && !(/join/i).test(lexemes[i])) ++i;  // TODO: replace with joinS
    const joinPos = i;
    const fromLexemes = lexemes.slice(fromPos + 1, joinPos);

    ++i;
    while (i < len && !(/where/i).test(lexemes[i])) ++i;
    const wherePos = i;
    const joinLexemes = lexemes.slice(joinPos + 1, wherePos);

    const whereLexemes = lexemes.slice(wherePos + 1);

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
    return { name: 'condition', leftArg, operator, rightArg };
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


  this.parseWhere = function(whereLexems) {
    return {
      name: 'where',
      condition: this.parseCondition(whereLexems),
    }
  }

  this.execute = function(query){
    const lexemes = query.split(/\s+|(?=,)/);
    const { columns, from, join, where } = this.parseSelect(lexemes);

    // groupedColumnIds
    const groupedColumnIds = {};
    columns.forEach(([tableId, columnId]) => {
      if (groupedColumnIds[tableId]) {
        groupedColumnIds[tableId].push(columnId);
      } else {
        groupedColumnIds[tableId] = [columnId];
      }
    });

    // merge grouped columns to result object
    let queryResult = [];
    Object.entries(groupedColumnIds).forEach(([tableId, columnIds], groupedColumnIndex) => {
      const dbTable = db[tableId];
      if (groupedColumnIndex === 0) {
        columnIds.forEach(columnId => {
          dbTable.forEach((dbRow, dbRowIndex) => {
            queryResult[dbRowIndex] = { [`${tableId}.${columnId}`]: dbRow[columnId] };
          });
        });
        return;
      }
      debugger;

      const intermediateQueryResult = [];
      columnIds.forEach(columnId => {
        dbTable.forEach((dbRow, dbRowIndex) => {
          intermediateQueryResult[dbRowIndex] = { [`${tableId}.${columnId}`]: dbRow[columnId] };
        });
      });
      debugger;

      // union of queryResult & intermediateQueryResult sets
      const unitedQueryResult = [];
      queryResult.forEach(queryResultRow => {
        intermediateQueryResult.forEach(intermediateQueryRow => {
          unitedQueryResult.push({ ...queryResultRow, ...intermediateQueryRow });
        });
      });
      queryResult = unitedQueryResult;
    });
    debugger;

    return queryResult;
  }
}

module.exports = SQLEngine;