import { Router } from "express";
import models from "../models/index.js";

const router = Router();
const userModel = models.User;

router.get("/", async (request, response) => {
  try {
    const usersList = await userModel.findAll();

    return response.status(200).send({
      data: usersList,
    });
  } catch (err) {
    console.error(err);
    response.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const userFound = await userModel.findByPk(id);

    if(!userFound){
      return response.status(404).send({
        error: "Usuário não encontrado",
      });
    }
    return response.status(200).send({
      message: "Usuário encontrado",
      data: userFound
    });
  } catch (err) {
    console.error(err);
    response.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.post("/", async (request, response) => {
  try {
    const { name, email } = request.body;

    if(!name || !email){
      return response.status(400).send({
        error: "Preencha os campos obrigatórios!!"
      });
    }
    
    const userData = {
      email,
      username: name 
    };

    const createdUser = await userModel.create(userData);
    
    return response.status(201).send({
      message: "Usuário criado",
      data: createdUser
    });
  } catch (err) {
    console.error(err);
    response.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.put("/:id", async(request, response) => {
  try {
    const { id } = request.params;
    const { name, email } = request.body;

    const existingUser = await userModel.findByPk(id);

    if(!existingUser){
      return response.status(404).send({
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

    return response.status(200).send({
      message: "Usuário atualizado",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    response.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const existingUser = await userModel.findByPk(id);

    if(!existingUser){
      return response.status(404).send({
        error: "Usuário não encontrado!!"
      });
    }

    await userModel.destroy({
      where:{
        id: id,
      }
    });

    return response.status(204).send();
  } catch (err) {
    console.error(err);
    response.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

export default router;
