module.exports =function (arr) {
  return (
    Math.max.apply(
      Math,
      arr.map((i) => i.id)
    ) + 1
  );
}
