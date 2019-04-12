function orderBy(value, prop) {
  return value.sort((a, b) => parseFloat(a[prop]) - parseFloat(b[prop]));
}

module.exports = {
  orderBy
}