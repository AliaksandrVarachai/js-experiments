function SQLEngine(database) {
  this.parseColumnId = function(columnLexem) {
    const [table, column] = columnLexem.split('.');
    return {
      name: 'column',
      table,
      column,
    }
  };

  this.parseSelect = function(lexems) {
    if (!(/select/i).test(lexems[0])) throw Error('SELECT query must start with "select"');
    const len = lexems.length;

    let i = 1;
    while (i < len && !(/from/i).test(lexems[i])) ++i;
    const fromPos = i;
    const columnLexems = lexems.slice(1, fromPos);
    console.log(columnLexems, i)

    ++i;
    while (i < len && !(/join/i).test(lexems[i])) ++i;  // TODO: replace with joinS
    const joinPos = i;
    const fromLexems = lexems.slice(fromPos + 1, joinPos);

    ++i;
    while (i < len && !(/where/i).test(lexems[i])) ++i;
    const wherePos = i;
    const joinLexems = lexems.slice(joinPos + 1, wherePos);

    const whereLexems = lexems.slice(wherePos + 1);

    return {
      name: 'select',
      columns: this.parseColumnIds(columnLexems),
      from: this.parseTables(fromLexems),
      join: joinLexems.length ? this.parseJoin(joinLexems) : null,
      where: whereLexems.length ? this.parseWhere(whereLexems) : null,
    };
  };

  this.parseTables = function(tableLexems) {
    return {
      name: 'tables',
      tables: tableLexems.filter(lexem => lexem !== ','),
    };
  };

  this.parseColumnIds = function(columnLexems) {
    return {
      name: 'columns',
      columns: columnLexems.filter(lexem => lexem !== ',').map(this.parseColumnId),
    }
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
    const lexems = query.split(/\s+/);
    const { columns, from, join, where } = this.parseSelect(lexems);


  }

}

module.exports = SQLEngine;