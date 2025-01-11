const express = require("express");
const router = express.Router();
const fs = require("fs");
const filePathUsers = "./data/users.json";
const paginate = require("../common/functions/paginate");
const nextID = require("../common/functions/nextID");

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Usuários
 *     description: Buscar todos os usuários cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Retorna uma lista de todos os usuários.
 */
router.get("/", (req, res) => {
  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.json(JSON.parse(data));
  });
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Usuários
 *     description: Buscar um usuário pelo código.
 *     parameters: 
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Retorna um objeto com as informações do usuário.
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    const usersJson = JSON.parse(data);
    const user = usersJson.find(u => u.id == parseInt(id))

    res.json(user);
  });
});

/**
 * @openapi
 * /users/page/{page}/{pageSize}:
 *   get:
 *     tags:
 *       - Usuários
 *     description: Buscar os usuários cadastrados no sistema paginado.
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
 *         description: Retorna uma página dos usuários cadastrados.
 */
router.get("/page/:page/:pageSize", (req, res) => {
  const page = parseInt(req.params.page);
  const pageSize = parseInt(req.params.pageSize);

  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    const usersJson = JSON.parse(data);
    const users = paginate(usersJson, page, pageSize);

    res.json(users);
  });
});

/**
 * @openapi
 * /users/add:
 *   post:
 *     tags:
 *       - Usuários
 *     description: Cadastrar um novo usuário.
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
 *                 example: Nome do Usuário
 *               username:
 *                 type: string
 *                 example: nomeusuario
 *               password:
 *                 type: string
 *                 example: senha
 *               email:
 *                 type: string
 *                 example: email@gmail.com
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [role1, role2] 
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
 *       200:
 *         description: Usuário cadastrado com sucesso.
 */
router.post("/add", (req, res) => {
  const newUser = req.body;

  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let users = JSON.parse(data);

    newUser.id = nextID(users);

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

/**
 * @openapi
 * /users/update:
 *   put:
 *     tags:
 *       - Usuários
 *     description: Cadastrar um novo usuário.
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
 *                 example: Nome do Usuário
 *               username:
 *                 type: string
 *                 example: nomeusuario
 *               password:
 *                 type: string
 *                 example: senha
 *               email:
 *                 type: string
 *                 example: email@gmail.com
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [role1, role2] 
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
 *         description: Usuário cadastrado com sucesso.
 */
router.put("/update", (req, res) => {
  const newUser = req.body;

  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let users = JSON.parse(data);

    const indexOf = users.findIndex(
      (user) => user.username.toLowerCase() === newUser.username.toLowerCase()
    );
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

/**
 * @openapi
 * /users/remove/{id}:
 *   delete:
 *     tags:
 *       - Usuários
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
  const id = req.params.id;

  fs.readFile(filePathUsers, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    let users = JSON.parse(data);

    const index = users.findIndex((user) => user.id == id);

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

module.exports = router;
