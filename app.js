//#region imports

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = 5000;
const filePathItems = "./data/items.json";
const filePathCategories = "./data/categories.json";
const filePathUsers = "./data/users.json";

//#endregion

//#region middlewares

app.use(bodyParser.json());
app.use(cors());

//#endregion

//#region functions

const nextItemID = (items) => {
  return (
    Math.max.apply(
      Math,
      items.map((item) => item.id)
    ) + 1
  );
};

const nextCategoryID = (categories) => {
  return (
    Math.max.apply(
      Math,
      categories.map((category) => category.id)
    ) + 1
  );
};

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

//#endregion

//#region users

app.get("/users", (req, res) => {
  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post("/addUser", (req, res) => {
  const newUser = req.body;

  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let users = JSON.parse(data);

    users.push(newUser);

    fs.writeFile(filePathUsers, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File successfully updated");
    });
  });
});

app.put("/updateUser", (req, res) => {
  const newUser = req.body;

  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let users = JSON.parse(data);

    const indexOf = users.findIndex((user) => user.username.toLowerCase() === newUser.username.toLowerCase());
    if (indexOf > -1) {
      users.splice(indexOf, 1, newUser);
    } else {
      return res.status(404).send("User not found");
    }

    fs.writeFile(filePathUsers, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File successfully updated");
    });
  });
});

app.delete("/removeUser/:username", (req, res) => {
  const username = req.params.username;

  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let users = JSON.parse(data);

    const index = users.findIndex(
      (user) => user.username.toLowerCase() == username.toLowerCase()
    );

    if (index > -1) {
      users.splice(index, 1);
    } else {
      res.status(404).send("User not found");
      return;
    }

    fs.writeFile(filePathUsers, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File removed successfully");
    });
  });
});

//#endregion

//#region items

app.get("/items", (req, res) => {
  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post("/addItem", (req, res) => {
  const newItem = req.body;

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let items = JSON.parse(data);

    newItem.id = nextItemID(items);

    items.push(newItem);

    fs.writeFile(filePathItems, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File successfully updated");
    });
  });
});

app.put("/updateItem", (req, res) => {
  const itemData = req.body;

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let items = JSON.parse(data);

    const indexOf = items.findIndex(
      (item) => item.id === itemData.id
    );

    if (indexOf > -1) {
      items.splice(indexOf, 1, itemData);
    } else {
      return res.status(404).send("Item not found");
    }

    fs.writeFile(
      filePathItems,
      JSON.stringify(items, null, 2),
      (err) => {
        if (err) {
          res.status(500).send("Error writing file");
          return;
        }
        res.send("File successfully updated");
      }
    );
  });
});

app.put("/updateResponsibles", (req, res) => {
  const { updates } = req.body;

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let items = JSON.parse(data);

    // Processar cada atualização no array
    updates.forEach((update) => {
      const { itemId, responsibleObject } = update;
      items = updateItem(items, itemId, responsibleObject);
    });

    fs.writeFile(filePathItems, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File successfully updated");
    });
  });
});

app.delete("/removeItem/:id", (req, res) => {
  const itemId = req.params.id;

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let items = JSON.parse(data);

    const index = items.findIndex((item) => item.id == itemId);

    if (index > -1) {
      items.splice(index, 1);
    } else {
      res.status(404).send("Item not found");
      return;
    }

    fs.writeFile(filePathItems, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File removed successfully");
    });
  });
});

//#endregion

//#region categories

app.get("/categories", (req, res) => {
  fs.readFile(filePathCategories, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post("/addCategory", (req, res) => {
  const newCategory = req.body;

  fs.readFile(filePathCategories, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let categories = JSON.parse(data);

    newCategory.id = nextCategoryID(categories);

    categories.push(newCategory);

    fs.writeFile(
      filePathCategories,
      JSON.stringify(categories, null, 2),
      (err) => {
        if (err) {
          res.status(500).send("Error writing file");
          return;
        }
        res.send("File successfully updated");
      }
    );
  });
});

app.put("/updateCategory", (req, res) => {
  const categoryData = req.body;

  fs.readFile(filePathCategories, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let categories = JSON.parse(data);

    const indexOf = categories.findIndex(
      (category) => category.id === categoryData.id
    );

    if (indexOf > -1) {
      categories.splice(indexOf, 1, categoryData);
    } else {
      return res.status(404).send("Item not found");
    }

    fs.writeFile(
      filePathCategories,
      JSON.stringify(categories, null, 2),
      (err) => {
        if (err) {
          res.status(500).send("Error writing file");
          return;
        }
        res.send("File successfully updated");
      }
    );
  });
});

app.delete("/removeCategory/:id", (req, res) => {
  const categoryId = req.params.id;

  fs.readFile(filePathCategories, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let categories = JSON.parse(data);

    const index = categories.findIndex((category) => category.id == categoryId);

    if (index > -1) {
      categories.splice(index, 1);
    } else {
      res.status(404).send("Item not found");
      return;
    }

    fs.writeFile(
      filePathCategories,
      JSON.stringify(categories, null, 2),
      (err) => {
        if (err) {
          res.status(500).send("Error writing file");
          return;
        }
        res.send("File removed successfully");
      }
    );
  });
});

//#endregion

app.listen(port, () => {});
