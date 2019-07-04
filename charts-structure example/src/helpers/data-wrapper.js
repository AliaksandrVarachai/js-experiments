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

  /**
   * Updates data in the store.
   * @param {Object} newData
   */
  this.set = (newData) => {
    data = newData;
    columns = {};
    data.Columns.forEach((columnName, inx) => {
      columns[columnName] = inx;
    });

    // TODO: remove min/max calculation
    let xMin = +this.getXValue(0);
    let yMin = +this.getYValue(0);
    let xMax = xMin,
      yMax = yMin;
    this.forEach((row, index) => {
      const x = +this.getXValue(row);
      const y = +this.getYValue(row);
      if (x < xMin) {
        xMin = x;
      } else if (x > xMax) {
        xMax = x;
      }
      if (y < yMin) {
        yMin = y;
      } else if (y > yMax) {
        yMax = y;
      }
    });
    data.LimitsByColumn = [
      {MinValue: xMin, MaxValue: xMax},
      {MinValue: yMin, MaxValue: yMax},
    ];
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
   * @param {number} axisIndex - 0 for X and 1 for Y axis.
   * @returns {*} - data item.
   */
  function getValue(row, axisIndex) {
    if (typeof row === 'number')
      return data.Rows[row].R[axisIndex];
    if (typeof row === 'object')
      return row.R[axisIndex];
    throw Error(`Row must be an object or a number, but ${typeof row} provided.`);
  }

  this.getXValue = (row) => getValue(row, 0);
  this.getYValue = (row) => getValue(row, 1);



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

  // Constructor
  this.set(data);
}
