module.exports = function (items, itemId, donationsObject) {
  return items.map((item) => {
    if (item.id === itemId) {
      let newQuantity = item.remainQuantity - donationsObject.quantity;

      if (newQuantity < 0) {
        newQuantity = 0;
      }

      return {
        ...item,
        remainQuantity: newQuantity,
        donations: [...item.donations, donationsObject],
      };
    }
    
    return item;
  });
}
