import { Router } from "express";
import models from "../models/index.js";

const router = Router();
const messageModel = models.Message;

router.get("/", async (req, res) => {
  try {
    const messagesList = await messageModel.findAll();

    return res.status(200).send({
      message: "Exibindo todas as mensagens",
      data: messagesList
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

    const messageFound = await messageModel.findByPk(id);

    if(!messageFound){
      return res.status(404).send({
        error: "Mensagem não encontrada"
      });
    }

    return res.status(200).send({
      message: "Mensagem encontrada",
      data: messageFound,
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
    const { content } = req.body;

    if(!content || !req.context.me?.id){
      return res.status(400).send({
        error: "Por favor preencha os campos ou efetue o seu login!!"
      });
    }

    const newMessage = {
      text: content,
      userId: req.context.me.id,
    };

    const createdMessage = await messageModel.create(newMessage);

    return res.status(201).send({
      message: "Mensagem enviada",
      data: createdMessage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const messageFound = await messageModel.findByPk(id);
    if(!messageFound){
      return res.status(404).send({
        error: "Mensagem não encontrada"
      });
    }

    await messageModel.update({ text: content }, {where: {
      id: id
    }});

    return res.status(200).send({
      message: "A mensagem foi atualizada"
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

    const messageFound = await messageModel.findByPk(id);

    if(!messageFound){
      return res.status(404).send({
        error: "Mensagem não encontrada"
      });
    }

    await messageModel.destroy({where: {id: id}});

    return res.status(200).send({
      message: "Mensagem deletada"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

export default router;
