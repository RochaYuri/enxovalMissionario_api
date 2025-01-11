const express = require("express");
const router = express.Router();
const fs = require("fs");
const filePathPersonaInfos = "./data/personalInfos.json";

/**
 * @openapi
 * /personalInfos:
 *   get:
 *     tags:
 *       - Informações Pessoais
 *     description: Buscar as informações pessoais do missionário.
 *     responses:
 *       200:
 *         description: Retorna uma lista de todos os usuários.
 */
router.get("/", (req, res) => {
  fs.readFile(filePathPersonaInfos, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.json(JSON.parse(data));
  });
});

/**
 * @openapi
 * /personalInfos/update:
 *   put:
 *     tags:
 *       - Informações Pessoais
 *     description: Atualiza as informações pessoais do missionário(a).
 *     requestBody:                 
 *       required: true             
 *       content:
 *         application/json:       
 *           schema:               
 *             type: object
 *             properties:
 *               name:
 *                 type: number
 *                 example: Nome do Missionário(a)
 *               missionryName:
 *                 type: string
 *                 example: Elder Missionário(a)
 *               mission:
 *                 type: string
 *                 example: Nome da Missão
 *               start:
 *                 type: string
 *                 example: 01/2025
 *               end:
 *                 type: string
 *                 example: 01/2027
 *               missionOfficeLink:
 *                 type: string
 *                 example: https://linkdoescritoriodamissaonomaps.com.br
 *               testimony:
 *                 type: string
 *                 example: Testemunho do missionário(a)
 *     responses:
 *       200:
 *         description: Usuário cadastrado com sucesso.
 */
router.put("/update", (req, res) => {
  const newInfos = req.body;

  fs.readFile(filePathPersonaInfos, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    fs.writeFile(filePathPersonaInfos, JSON.stringify(newInfos, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error writing file");
        return;
      }
      res.send("File successfully updated");
    });
  });
});

module.exports = router;
