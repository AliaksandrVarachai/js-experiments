function elderAgeSimple(m,n,l,t) {
  let sum = 0;
  const array = [];
  for (let i = 0; i < n; ++i) {
    const row = [];
    for (let j = 0; j < m; ++j) {
      const value = j ^ i;
      row.push(value);
      if (value > l) sum += value - l;
    }
    array.push(row);
  }
  // console.log(`${m}x${n}:`);
  // array.forEach(row => console.log(row.join(',')))
  return sum % t;
}

module.exports = {
  elderAgeSimple,
}
