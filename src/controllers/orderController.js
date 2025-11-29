// Importa a conexão com o MySQL a partir do arquivo db.js
const db = require('../db');



/* ============================================================
   1️⃣  FUNÇÃO PARA CRIAR UM PEDIDO (POST /order)
   ============================================================ */
exports.createOrder = (req, res) => {

    // Recebe o JSON enviado no corpo da requisição
    const pedidoOriginal = req.body;

    // --------------------------
    // MAPEAMENTO DO JSON
    // Transforma do formato vindo do desafio
    // para o formato que vamos salvar no banco
    // --------------------------
    const pedidoMapeado = {
        // numeroPedido → orderId
        orderId: pedidoOriginal.numeroPedido,

        // valorTotal → value
        value: pedidoOriginal.valorTotal,

        // dataCriacao → creationDate
        creationDate: pedidoOriginal.dataCriacao,

        // items → transformamos cada campo para o nome correto
        items: pedidoOriginal.items.map(item => ({
            productId: Number(item.idItem),      // idItem → productId
            quantity: item.quantidadeItem,       // quantidadeItem → quantity
            price: item.valorItem                // valorItem → price
        }))
    };

    // --------------------------
    // QUERY SQL para tabela Order
    // --------------------------
    const insertOrderQuery = `
        INSERT INTO \`Order\` (orderId, value, creationDate)
        VALUES (?, ?, ?)
    `;

    // Executa o INSERT do pedido
    db.query(
        insertOrderQuery,                             // Query SQL
        [pedidoMapeado.orderId,                      // Valores substituindo '?'
         pedidoMapeado.value,
         pedidoMapeado.creationDate],

        (err) => {                                   // Callback quando a query terminar

            // Se houve erro ao inserir o pedido
            if (err) {
                console.error("Erro ao inserir pedido:", err);
                return res.status(500).json({ error: "Erro ao salvar pedido" });
            }

            // --------------------------
            // Agora insere os itens
            // --------------------------
            const insertItemQuery = `
                INSERT INTO Items (orderId, productId, quantity, price)
                VALUES (?, ?, ?, ?)
            `;

            // Para cada item do pedido, executamos 1 insert
            pedidoMapeado.items.forEach(item => {
                db.query(
                    insertItemQuery,             
                    [pedidoMapeado.orderId,      // orderId
                     item.productId,            // productId
                     item.quantity,             // quantity
                     item.price]                // price
                );
            });

            // Resposta enviada ao cliente quando tudo deu certo
            return res.status(201).json({
                message: "Pedido criado com sucesso!",
                pedido: pedidoMapeado           // Retornamos o pedido já transformado
            });
        }
    );
};





/* ============================================================
   2️⃣  FUNÇÃO PARA BUSCAR UM PEDIDO PELO ID (GET /order/:orderId)
   ============================================================ */
exports.getOrder = (req, res) => {

    // Lê o parâmetro da URL (ex: /order/v1039)
    const orderId = req.params.orderId;

    // SQL para buscar o pedido na tabela Order
    const queryOrder = "SELECT * FROM `Order` WHERE orderId = ?";

    // Executa a query
    db.query(queryOrder, [orderId], (err, orderResult) => {

        // Erro no MySQL
        if (err) return res.status(500).json({ error: "Erro ao buscar pedido" });

        // Se não encontrou o pedido
        if (orderResult.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        // Busca os itens do pedido
        const queryItems = "SELECT * FROM Items WHERE orderId = ?";

        // Executa a query para buscar os itens
        db.query(queryItems, [orderId], (err, itemsResult) => {

            // Se deu erro ao buscar itens
            if (err) return res.status(500).json({ error: "Erro ao buscar itens" });

            // Retorna o pedido + itens
            return res.json({
                order: orderResult[0],   // Registro da tabela Order
                items: itemsResult       // Array com todos os itens do pedido
            });
        });
    });
};





/* ============================================================
   3️⃣  LISTAR TODOS OS PEDIDOS (GET /order/list/all)
   ============================================================ */
exports.listOrders = (req, res) => {

    // SQL simples para trazer todos os pedidos
    const query = "SELECT * FROM `Order`";

    // Executa a query
    db.query(query, (err, result) => {

        // Se erro no MySQL
        if (err) return res.status(500).json({ error: "Erro ao listar pedidos" });

        // Retorna todos os pedidos encontrados
        return res.json(result);
    });
};





/* ============================================================
   4️⃣  ATUALIZAR PEDIDO (PUT /order/:orderId)
   ============================================================ */
exports.updateOrder = (req, res) => {

    // Lê o ID do pedido da URL
    const orderId = req.params.orderId;

    // Lê valores enviados no body JSON
    const { value, creationDate } = req.body;

    // SQL UPDATE
    const query = `
        UPDATE \`Order\`
        SET value = ?, creationDate = ?
        WHERE orderId = ?
    `;

    // Executa a query
    db.query(query, [value, creationDate, orderId], (err, result) => {

        // Erro ao atualizar
        if (err) return res.status(500).json({ error: "Erro ao atualizar pedido" });

        // Sucesso
        return res.json({ message: "Pedido atualizado com sucesso!" });
    });
};




// ============================================================
// 5️⃣  DELETAR PEDIDO (DELETE /order/:orderId)
// ============================================================
exports.deleteOrder = (req, res) => {

    // ID do pedido enviado na URL
    const orderId = req.params.orderId;

    // 1️⃣ Primeiro exclui todos os itens relacionados
    const deleteItemsQuery = "DELETE FROM Items WHERE orderId = ?";

    db.query(deleteItemsQuery, [orderId], (err) => {

        if (err) {
            console.error("Erro ao deletar itens:", err);
            return res.status(500).json({ error: "Erro ao deletar itens do pedido" });
        }

        // 2️⃣ Depois exclui o pedido em si
        const deleteOrderQuery = "DELETE FROM `Order` WHERE orderId = ?";

        db.query(deleteOrderQuery, [orderId], (err) => {

            if (err) {
                console.error("Erro ao deletar pedido:", err);
                return res.status(500).json({ error: "Erro ao deletar pedido" });
            }

            return res.json({ message: "Pedido e itens deletados com sucesso!" });
        });
    });
};

