import { Router } from "express";
import models from "../models/index.js";

const router = Router();
const messageModel = models.Message;

router.get("/", async (request, response) => {
  try {
    const messagesList = await messageModel.findAll();

    return response.status(200).send({
      message: "Exibindo todas as mensagens",
      data: messagesList
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

    const messageFound = await messageModel.findByPk(id);

    if(!messageFound){
      return response.status(404).send({
        error: "Mensagem não encontrada"
      });
    }

    return response.status(200).send({
      message: "Mensagem encontrada",
      data: messageFound,
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
    const { content } = request.body;

    if(!content || !request.context.me?.id){
      return response.status(400).send({
        error: "Por favor preencha os campos ou efetue o seu login!!"
      });
    }

    const newMessage = {
      text: content,
      userId: request.context.me.id,
    };

    const createdMessage = await messageModel.create(newMessage);

    return response.status(201).send({
      message: "Mensagem enviada",
      data: createdMessage
    });
  } catch (err) {
    console.error(err);
    response.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { content } = request.body;

    const messageFound = await messageModel.findByPk(id);
    if(!messageFound){
      return response.status(404).send({
        error: "Mensagem não encontrada"
      });
    }

    await messageModel.update({ text: content }, {where: {
      id: id
    }});

    return response.status(200).send({
      message: "A mensagem foi atualizada"
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

    const messageFound = await messageModel.findByPk(id);

    if(!messageFound){
      return response.status(404).send({
        error: "Mensagem não encontrada"
      });
    }

    await messageModel.destroy({where: {id: id}});

    return response.status(200).send({
      message: "Mensagem deletada"
    });
  } catch (err) {
    console.error(err);
    response.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

export default router;
