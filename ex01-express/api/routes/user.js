import { Router } from "express";
import models from "../models/index.js";

const router = Router();
const userModel = models.User;

router.get("/", async (req, res) => {
  try {
    const usersList = await userModel.findAll();

    return res.status(200).send({
      data: usersList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userFound = await userModel.findByPk(id);

    if(!userFound){
      return res.status(404).send({
        error: "Usuário não encontrado",
      });
    }
    return res.status(200).send({
      message: "Usuário encontrado",
      data: userFound
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if(!name || !email){
      return res.status(400).send({
        error: "Preencha os campos obrigatórios!!"
      });
    }
    
    const userData = {
      email,
      username: name 
    };

    const createdUser = await userModel.create(userData);
    
    return res.status(201).send({
      message: "Usuário criado",
      data: createdUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.put("/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const existingUser = await userModel.findByPk(id);

    if(!existingUser){
      return res.status(404).send({
        error: "Usuário não encontrado!!"
      });
    }

    const updatedUser = {
      email: email,
      username: name 
    };

    await userModel.update(updatedUser, {where: {
      id: id
    }});

    return res.status(200).send({
      message: "Usuário atualizado",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await userModel.findByPk(id);

    if(!existingUser){
      return res.status(404).send({
        error: "Usuário não encontrado!!"
      });
    }

    await userModel.destroy({
      where:{
        id: id,
      }
    });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

export default router;
