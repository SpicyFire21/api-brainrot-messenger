import express from 'express';
import * as messageController from "../controller/message.controller.js";
import * as rsaMiddleware from "../middleware/rsaMiddleware.js"


var router = express.Router();

router.get("/",messageController.getMessages);

router.post('/send',rsaMiddleware.rsaEncryptMiddleware,messageController.addMessage);


router.get(
    "/conversation/:receiverid/:senderid",
    messageController.getConversation,
    rsaMiddleware.rsaDecryptMiddleware,
    (req, res) => res.json({ data: res.locals.data })
);


router.get("/:id",messageController.getMessageById);
router.put('/:id',messageController.updateMessageById);
router.delete('/:id',messageController.deleteMessageById);

export default router;
