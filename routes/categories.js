const express = require("express");
const router = express.Router();
const fs = require("fs");
const filePathCategories = "./data/categories.json";
const paginate = require("../common/functions/paginate");
const nextID = require("../common/functions/nextID");

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *       - Categorias
 *     description: Buscar todas as categorias cadastradas no sistema.
 *     responses:
 *       200:
 *         description: Retorna uma lista de todas as categorias cadastradas.
 */
router.get("/", (req, res) => {
  fs.readFile(filePathCategories, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.json(JSON.parse(data));
  });
});

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categorias
 *     description: Buscar uma categoria pelo código.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Retorna um objeto com as informações da categoria.
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(filePathCategories, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    const categoriesJson = JSON.parse(data);
    const category = categoriesJson.find((i) => i.id == parseInt(id));

    res.json(category);
  });
});

/**
 * @openapi
 * /categories/page/{page}/{pageSize}:
 *   get:
 *     tags:
 *       - Categorias
 *     description: Buscar as categorias cadastradas no sistema paginado.
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
 *         description: Retorna uma página das categorias cadastradas.
 */
router.get("/page/:page/:pageSize", (req, res) => {
  const page = parseInt(req.params.page);
  const pageSize = parseInt(req.params.pageSize);

  fs.readFile(filePathCategories, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    const categoriesJson = JSON.parse(data);
    const categories = paginate(categoriesJson, page, pageSize);

    res.json(categories);
  });
});

/**
 * @openapi
 * /categories/add:
 *   post:
 *     tags:
 *       - Categorias
 *     description: Cadastrar uma nova categoria.
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
 *               name:
 *                 type: string
 *                 example: nome da categoria
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
 *         description: Categoria cadastrada com sucesso.
 */
router.post("/add", (req, res) => {
  const newCategory = req.body;

  fs.readFile(filePathCategories, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let categories = JSON.parse(data);

    newCategory.id = nextID(categories);

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

/**
 * @openapi
 * /categories/update:
 *   put:
 *     tags:
 *       - Categorias
 *     description: Alterar uma categoria.
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
 *               name:
 *                 type: string
 *                 example: nome da categoria
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
 *         description: Categoria alterada com sucesso.
 */
router.put("/update", (req, res) => {
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

/**
 * @openapi
 * /categories/remove/{id}:
 *   delete:
 *     tags:
 *       - Categorias
 *     description: Remover uma categoria.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso.
 */
router.delete("/remove/:id", (req, res) => {
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

module.exports = router;
