const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const cors = require('cors');
const port = 5000;
const filePath = "./data/items.json";

app.use(bodyParser.json());
app.use(cors());

// Função para atualizar o item
const updateItem = (items, itemId, responsibleObject) => {
  return items.map((item) => {
    if (item.id === itemId) {
      const newQuantity = item.quantity - responsibleObject.quantity;
      if (newQuantity < 0) {
        newQuantity = 0;
        return item;
      }
      return {
        ...item,
        quantity: newQuantity,
        responsible: [...item.responsible, responsibleObject],
      };
    }
    return item;
  });
};

// Endpoint para obter os itens
app.get("/items", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint para atualizar os itens
app.post("/items", (req, res) => {
  const { updates } = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let items = JSON.parse(data);

    // Processar cada atualização no array
    updates.forEach(update => {
      const { itemId, responsibleObject } = update;
      items = updateItem(items, itemId, responsibleObject);
    });

    fs.writeFile(filePath, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File successfully updated");
    });
  });
});


app.listen(port, () => {
});
