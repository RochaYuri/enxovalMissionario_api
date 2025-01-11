module.exports = function (array, page, pageSize) {
  const firstIndex = page * pageSize - pageSize;
  const lastIndex = firstIndex + pageSize;
  return array.slice(firstIndex, lastIndex);
}
