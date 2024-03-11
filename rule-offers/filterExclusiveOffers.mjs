import mockedFullRuleOffersResponse from './mockedFullRuleOffersResponse.json' assert { type: 'json' };
import fs from 'node:fs';

const { ruleOffers, ruleOfferFeeDetails } = mockedFullRuleOffersResponse;

const exclusiveRuleOffers = ruleOffers.filter(offer => offer.offerCategory === 'Exclusive');

// {
//   "feeId": 21944701,
//   "assignment": "Offer",
//   "optional": false,
//   "associatedWith": "21853161"
// },
const exclusiveRuleOffersWithFees = [];
const offersWithOfferAssignment = {};

ruleOfferFeeDetails[0].assignments.forEach(assignment => {
  if (assignment.assignment === 'Offer') {
    exclusiveRuleOffers.forEach(offer => {
      if (assignment.associatedWith === offer.ruleOfferOriginId) {
        // exclusiveRuleOffersWithFees.push(offer);
        offersWithOfferAssignment[offer.ruleOfferId] = true;
      }
    });
  }

  if (assignment.assignment === 'Group') {
    exclusiveRuleOffers.forEach(offer => {
      // if (!offersWithOfferAssignment[offer.ruleOfferId]) return;
      const groupsWithFees = [];
      offer.ruleOfferGroups.forEach(group => {
        // 21944781 -
        if (assignment.associatedWith === group.ruleOfferGroupId) {
          groupsWithFees.push(group);
        }
      });
      console.log('******** groupsWithFees=', groupsWithFees)
      if (groupsWithFees.length > 0) {
        const offerWithFilteredGroups = {
          ...offer,
          ruleOfferGroups: groupsWithFees,
        }
        exclusiveRuleOffersWithFees.push(offerWithFilteredGroups);
      }
    })
  }
});

// console.log('********', offersWithOfferAssignment)

// console.log('*********** foundMultiInventoryRuleOfferGroups.length=', foundMultiInventoryRuleOfferGroups.length)


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

// const camelCaseObj = objToCamelCase(mockedFullRuleOffersResponse);

try {
  fs.writeFileSync('./filtered-exclusive-offers.json', JSON.stringify(exclusiveRuleOffers, null, 4));
  fs.writeFileSync('./exclusive-rule-offers-with-fees.json', JSON.stringify(exclusiveRuleOffersWithFees, null, 4));
} catch (error) {
  console.error(error);
}
