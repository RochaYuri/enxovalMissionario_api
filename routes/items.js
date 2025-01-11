const express = require("express");
const router = express.Router();
const fs = require("fs");
const filePathItems = "./data/items.json";
const paginate = require("../common/functions/paginate");
const nextID = require("../common/functions/nextID");
const updateItem = require("../common/functions/updateItem");

/**
 * @openapi
 * /items:
 *   get:
 *     tags:
 *       - Itens
 *     description: Buscar todos os itens cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Retorna uma lista de todos os itens cadastrados.
 */
router.get("/", (req, res) => {
  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.json(JSON.parse(data));
  });
});

/**
 * @openapi
 * /items/{id}:
 *   get:
 *     tags:
 *       - Itens
 *     description: Buscar um item pelo código.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Retorna um objeto com as informações do item.
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    const itemsJson = JSON.parse(data);
    const item = itemsJson.find((i) => i.id == parseInt(id));

    res.json(item);
  });
});

/**
 * @openapi
 * /items/page/{page}/{pageSize}:
 *   get:
 *     tags:
 *       - Itens
 *     description: Buscar os itens cadastrados no sistema paginado.
 *     parameters: 
 *       - in: path
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Retorna uma página dos itens cadastrados.
 */
router.get("/page/:page/:pageSize", (req, res) => {
  const page = parseInt(req.params.page);
  const pageSize = parseInt(req.params.pageSize);

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    const itemsJson = JSON.parse(data);
    const items = paginate(itemsJson, page, pageSize);

    res.json(items);
  });
});

/**
 * @openapi
 * /items/add:
 *   post:
 *     tags:
 *       - Itens
 *     description: Cadastrar um novo item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 0
 *               category:
 *                 type: object
 *                 properties: 
 *                            id:
 *                              type: number
 *                              example: 0
 *                            name:
 *                              type: string
 *                              example: nome da categoria
 *               remainQuantity:
 *                 type: number
 *                 example: 1
 *               totalQuantity:
 *                 type: number
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: nome do item
 *               donations:
 *                 type: array
 *                 items:
 *                    type: object
 *                    properties: 
 *                                name:
 *                                  type: string
 *                                  example: "nome do doador"
 *                                contact:
 *                                  type: string
 *                                  example: "(15) 999999999"
 *                                quantity:
 *                                  type: number
 *                                  example: 1
 *               createdAt:
 *                 type: string
 *                 example: 01/01/2025, 00:00:00
 *               createdBy:
 *                 type: string
 *                 example: nomeusuario
 *               updatedAt: 
 *                 type: string
 *                 example: ""
 *               updatedBy:
 *                 type: string
 *                 example: ""
 *     responses:
 *       201:
 *         description: Item cadastrado com sucesso.
 */
router.post("/add", (req, res) => {
  const newItem = req.body;

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let items = JSON.parse(data);

    newItem.id = nextID(items);

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

/**
 * @openapi
 * /items/update:
 *   put:
 *     tags:
 *       - Itens
 *     description: Alterar um item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 0
 *               category:
 *                 type: object
 *                 properties:
 *                            id:
 *                              type: number
 *                              example: 0
 *                            name:
 *                              type: string
 *                              example: nome da categoria
 *               remainQuantity:
 *                 type: number
 *                 example: 1
 *               totalQuantity:
 *                 type: number
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: nome do item
 *               donations:
 *                 type: array
 *                 items:
 *                    type: object
 *                    properties: 
 *                                name:
 *                                  type: string
 *                                  example: "nome do doador"
 *                                contact:
 *                                  type: string
 *                                  example: "(15) 999999999"
 *                                quantity:
 *                                  type: number
 *                                  example: 1
 *               createdAt:
 *                 type: string
 *                 example: 01/01/2025, 00:00:00
 *               createdBy:
 *                 type: string
 *                 example: nomeusuario
 *               updatedAt:
 *                 type: string
 *                 example: 01/01/2025, 00:00:00
 *               updatedBy:
 *                 type: string
 *                 example: nomeusuario
 *     responses:
 *       200:
 *         description: Item alterado com sucesso.
 */
router.put("/update", (req, res) => {
  const itemData = req.body;

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let items = JSON.parse(data);

    const indexOf = items.findIndex((item) => item.id === itemData.id);

    if (indexOf > -1) {
      items.splice(indexOf, 1, itemData);
    } else {
      return res.status(404).send("Item not found");
    }

    fs.writeFile(filePathItems, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File successfully updated");
    });
  });
});

/**
 * @openapi
 * /items/donations:
 *   put:
 *     tags:
 *       - Itens
 *     description: Editar itens para adicionar doadores.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                    type: object
 *                    properties:
 *                                itemId:
 *                                  type: number
 *                                  example: 1
 *                                donationsObject:
 *                                  type: object
 *                                  properties:
 *                                             name:
 *                                                type: string
 *                                                example: "nome do doador"
 *                                             contact:
 *                                                type: string
 *                                                example: (15) 999999999
 *                                             quantity:
 *                                                type: number
 *                                                example: 1
 *     responses:
 *       200:
 *         description: Itens alterados com sucesso.
 */
router.put("/donations", (req, res) => {
  const { updates } = req.body;

  fs.readFile(filePathItems, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let items = JSON.parse(data);

    // Processar cada atualização no array
    updates.forEach((update) => {
      const { itemId, donationsObject } = update;
      items = updateItem(items, itemId, donationsObject);
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

/**
 * @openapi
 * /items/remove/{id}:
 *   delete:
 *     tags:
 *       - Itens
 *     description: Remover um usuário.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso.
 */
router.delete("/remove/:id", (req, res) => {
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

module.exports = router;
