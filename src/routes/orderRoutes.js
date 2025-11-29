// Importa o Express para criar o roteador
const express = require('express');

// Cria um "mini servidor" que só responde rotas relacionadas a /order
const router = express.Router();

// Importa o controller que vai conter a lógica de cada rota
const orderController = require('../controllers/orderController');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Operações relacionadas a pedidos
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               numeroPedido: "v10089015vdb-01"
 *               valorTotal: 10000
 *               dataCriacao: "2023-07-19T12:24:11.5299601+00:00"
 *               items:
 *                 - idItem: "2434"
 *                   quantidadeItem: 1
 *                   valorItem: 1000
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Buscar um pedido pelo ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 */
router.get('/:orderId', orderController.getOrder);

/**
 * @swagger
 * /order/list/all:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get('/list/all', orderController.listOrders);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualizar um pedido pelo ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             value: 999
 *             creationDate: "2024-01-01T00:00:00"
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 */
router.put('/:orderId', orderController.updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deletar um pedido pelo ID (e seus itens)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 */
router.delete('/:orderId', orderController.deleteOrder);


// Exporta o roteador para ser usado em server.js
module.exports = router;

