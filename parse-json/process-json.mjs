import source from './source.json' assert { type: 'json' };
import fs from 'node:fs';

const { tickets } = source;

const filterCriteria = [
  ["id", null],
  ["type", null],
  ["rights", null],
  ["flashEventId", null], //
  ["assignee", null],
  ["status", "SOLD"],
  ["cansell", true],
  ["barcodeStatus", "1"],
  ["resaleAllowed", true],
  ["fulfillment.isFlashSeat", true], //
  ["fulfillment.deliveryMethodType", 4],   // ?
  ["flashSeatId", null], //
  ["primarySeatIdentifier", null],
  ["flashMemberId", null],
];

const getNestedValue = (keyPath, source) => {
  const dotIndex = keyPath.indexOf('.');
  if (dotIndex < 0) {
    return source[keyPath];
  }
  const startKey = keyPath.slice(0, dotIndex);
  const restKey = keyPath.slice(dotIndex + 1);
  if (restKey.length > 0) {
    return getNestedValue(restKey, source[startKey]);
  }
};

const filteredTickets = tickets.filter(ticket => {
  let result = true;
  for(let [filterKey, filterValue] of filterCriteria) {
    if (getNestedValue(filterKey, ticket) !== filterValue) {
      result = false;
      break;
    }
  }
  return result;
});
console.log(`FOUND: ${filteredTickets.length}`);

try {
  fs.writeFileSync('./filtered.json', JSON.stringify(filteredTickets, null, 4));
} catch (error) {
  console.error(error);
}
