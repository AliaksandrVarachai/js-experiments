import mockedRuleOffersResponse from './mockedRuleOffersResponseV1.1.json' assert { type: 'json' };
import fs from 'node:fs';

const objToCamelCase = (obj) => {
  const toCamelCase = (str) => str[0].toLowerCase() + str.slice(1);

  let resultObj;

  const camelCaseRecursively = (obj, newParentObj, newParentKey) => {
    let newObj;
    if (Array.isArray(obj)) {
      if (newParentKey === undefined) {
        resultObj = [];
        newObj = resultObj;
      } else {
        newParentObj[newParentKey] = []; // the same assignment both for arr & obj
        newObj = newParentObj[newParentKey]
      }
      obj.forEach((val, index) => {
        camelCaseRecursively(val, newObj, index);
      });
    } else if (typeof obj === 'object') {
      if (newParentKey === undefined) {
        resultObj = {};
        newObj = resultObj;
      } else {
        newParentObj[newParentKey] = {};
        newObj = newParentObj[newParentKey]
      }
      Object.entries(obj).forEach(([key, val]) => {
        const camelCaseKey = toCamelCase(key);
        camelCaseRecursively(val, newObj, camelCaseKey);
      });
    } else {
      newParentObj[newParentKey] = obj;
    }
  };

  camelCaseRecursively(obj);

  return resultObj;
}

const camelCaseObj = objToCamelCase(mockedRuleOffersResponse);

try {
  fs.writeFileSync('./result-v3.json', JSON.stringify(camelCaseObj, null, 4));
} catch (error) {
  console.error(error);
}
