// New response structure:
// const rawJsonStructure = {
//   Dimensions: {
//     ColumnCount: 8,
//     RowCount: 10000
//   },
//   Columns: [
//     {
//       Id: '361444379-dfe1-...',
//       Name: 'TEST_X'
//     }
//   ],
//   Rows: [
//     {
//       RowIndex: 30,  // TODO: is it an index from DB? Is it useful for FE?
//       Row: [
//         'ABCDEFG_1',
//         '-1'         // TODO: transform to number or provide type
//       ]
//     }
//   ]
// };

// TODO: add update
export default function DataWrapper(data) {
  let columns;

  this.set(data);

  /**
   * Updates data in the store.
   * @param {Object} newData
   */
  this.set = function(newData) {
    data = newData;
    columns = {};
    data.Columns.forEach((columnName, inx) => {
      columns[columnName] = inx;
    });
  };

  /**
   * Gets data from the store.
   * @returns {Object}
   */
  this.get = function() {
    return data;
  };

  this.getDimensions = function() {
    return data.Dimensions; // { ColumnCount: number, RowCount: number }
  };

  this.getLimitsByColumn = function() {
    return data.LimitsByColumn;  // Array[2] of { ColumnId: string, MinValue: number, MaxValue: number }
  };

  /**
   * Gets data item by its row and column.
   * @param {number|Object} row - row index or row object.
   * @param {string} colName - column name.
   * @returns {*} - data item.
   */
  this.getValue = function(row, colName) {
    const colIndex = columns[colName];
    if (typeof row === 'number')
      return data.Rows[row][colIndex];
    if (typeof row === 'object')
      return row[colIndex];
    throw Error(`Row must be an object or a number, but ${typeof row} provided`);
  };

  /**
   * Provides array-like forEach method.
   * @param {function} callback
   */
  this.forEach = function(callback) {
    data.Rows.forEach(callback)
  };

  Object.defineProperty(this, 'length', {
    get: function() {
      return data.Dimensions.RowCount;
    }
  });
}
