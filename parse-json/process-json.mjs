import source from './source.json' assert { type: 'json' };
import fs from 'node:fs';

const { tickets } = source;

const filterCriteria = [
  ['id', null],
  ['isFlashSeat', true],
  ['barcodeStatus', '1'],
];

const filteredTickets = tickets.filter(ticket => {
  let result = true;
  for(let [filterKey, filterValue] of filterCriteria) {
    if (ticket[filterKey] !== filterValue) {
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
