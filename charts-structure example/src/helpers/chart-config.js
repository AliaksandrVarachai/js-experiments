export default function ChartConfig(data, canvas, customSettings) {
  const settings = {
    margins: {
      left: 80,
      right: 20,
      top: 20,
      bottom: 40
    },
    //groupColumnName: '',
    axes: {
      columnX: '',
      columnY: '',
      rangeX: {
        min: 0,
        max: 0
      },
      rangeY: {
        min: 0,
        max: 0
      },
    },
  };

  /**
   * @typedef {number} MergedType
   */

  /**
   * Enum of allowed types used for merge settings.
   * @readonly
   * @enum {MergedType}
   */
  const types = {
    NONE: 0,
    PRIMITIVE: 1,
    ARRAY: 2,
    OBJECT: 3,
  };

  /**
   * Checks if data is primitive.
   * @param {*} val - checked value.
   * @returns {boolean} - true if data is primitive or null
   */
  function isPrimitive(val) {
    const valType = typeof val;
    return valType === 'number' || valType === 'string' || valType === 'boolean' || valType === null || valType === undefined;
  }

  /**
   * Gets common type of a source and target.
   * @param {*} source
   * @param {*} target
   * @returns {MergedType}
   */
  function getCommonType(source, target) {
    if (isPrimitive(source)) {
      if (isPrimitive(target))
        return types.PRIMITIVE;
      return types.NONE;
    }
    if (Array.isArray(source)) {
      if (Array.isArray(target))
        return types.ARRAY;
      return types.NONE;
    }
    if (Object.getPrototypeOf(source) === Object.prototype) {
      if (Object.getPrototypeOf(target) === Object.prototype)
        return types.OBJECT;
      return types.NONE;
    }
  }

  // TODO: remove undefinite from allowed values
  /**
   * Merges source to target.
   * @param {Object|Array} source - source settings.
   * @param {Object|Array} target - target settings to change.
   */
  function mergeSettings(source, target) {
    switch(getCommonType(source, target)) {

      case types.PRIMITIVE:
        throw Error('Source and target must be objects or arrays.');

      case types.ARRAY: {
        if (source.length !== target.length)
          throw Error('Source and target arrays must have the same length.');
        source.forEach((sourceItem, inx) => {
          const commonType = getCommonType(sourceItem, target[inx]);
          if (commonType === types.NONE)
            throw Error('Source and target array must have the same types of elements.');
          if (commonType === types.PRIMITIVE) {
            target[inx] = sourceItem;
          } else {
            mergeSettings(sourceItem, target[inx]);
          }
        });
        break;
      }

      case types.OBJECT: {
        Object.keys(source).forEach(key => {
          if (!target.hasOwnProperty(key))
            throw Error(`Target does not contain property "${key}".`);
          const commonType = getCommonType(source[key], target[key]);
          if (commonType === types.NONE)
            throw Error('Source and target array must have the same types of elements.');
          if (commonType === types.PRIMITIVE) {
            target[key] = source[key];
          } else {
            mergeSettings(source[key], target[key]);
          }
        });
        break;
      }

      default:
        throw Error('Source and Target must have the same types.');
    }
  }

  // Getter
  this.get = function() {
    return settings;
  };

  // When another column is chosen or filter is applied
  this.updateData = function({ columnXName = '', columnYName = '', filter = ''}) {
    // TODO: recalculate domain and range of data (min/max values and ticks)
    if (columnXName) {
      settings.axes.columnX = columnXName;
    }
    if (columnYName) {
      settings.axes.columnY = columnYName;
    }
    if (filter) {
      // redraw
    }
  };

  // For resize
  this.updateCanvasSize = function({ width, height }) {
    settings.axes.rangeX.min = settings.margins.left;
    settings.axes.rangeX.max = width - settings.margins.right;
    settings.axes.rangeY.min = settings.margins.bottom;
    settings.axes.rangeY.max = height - settings.margins.top;
  };

  // Group color or point's shape is changed
  this.updateSettings = function(customSettings) {
    mergeSettings(customSettings, settings);
  };

  // Getter
  this.getSettings = function() {
    return settings;
  };

  // Constructor
  this.updateData(data);
  this.updateCanvasSize({width: canvas.width, height: canvas.height});
  this.updateSettings(customSettings);
}
