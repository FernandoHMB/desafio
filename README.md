

API desenvolvida em **Node.js + Express + MySQL**, incluindo:

✔ CRUD completo de pedidos  
✔ Mapeamento automático de JSON  
✔ Autenticação JWT  
✔ Rotas protegidas  
✔ Documentação pronta para uso  

---

#  Tecnologias utilizadas
- Node.js + Express  
- MySQL  
- MySQL Workbench  
- JWT (jsonwebtoken)  
- BcryptJS  
- Dotenv  
- Thunder Client  

---

# Estrutura do projeto

```
src/
 ├── controllers/
 │    ├── orderController.js
 │    └── authController.js
 ├── middleware/
 │    └── authMiddleware.js
 ├── routes/
 │    ├── orderRoutes.js
 │    └── authRoutes.js
 ├── swagger.js (opcional)
 ├── db.js
 └── server.js
.env
package.json
README.md
```

---

#  Configuração do ambiente

## Instalar dependências
```
npm install
```

## Rodar o servidor com auto-reload
```
npm run dev
```

---

#  Configuração do MySQL Workbench

### Criar banco:
```sql
CREATE DATABASE pedidosdb;
USE pedidosdb;
```

### Criar tabela Order:
```sql
CREATE TABLE `Order` (
  orderId VARCHAR(50) PRIMARY KEY,
  value DECIMAL(10,2),
  creationDate DATETIME
);
```

### Criar tabela Items:
```sql
CREATE TABLE Items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId VARCHAR(50),
  productId INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (orderId) REFERENCES `Order`(orderId)
);
```

---

#  Arquivo .env (inclui JWT)
```
DB_HOST=localhost
DB_USER=root
DB_PASS=SUA_SENHA
DB_NAME=pedidosdb
PORT=3000
JWT_SECRET=sua_chave_segura_aqui
```

---

#  AUTENTICAÇÃO JWT

O login gera um token:

###  Endpoint:  
```
POST /auth/login
```

### Body:
```json
{
  "username": "admin",
  "password": "123456"
}
```

### Retorno:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

# COMO USAR O TOKEN NAS ROTAS PROTEGIDAS

Todas as rotas `/order` **exigem autenticação**.

No Thunder/Postman:

### Headers:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

#  CRUD de Pedidos (rotas protegidas)

### ✔ Criar pedido — POST /order
Body:
```json
{
  "numeroPedido": "ex123",
  "valorTotal": 100,
  "dataCriacao": "2023-01-01T00:00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 100
    }
  ]
}
```

---

### ✔ Buscar pedido — GET /order/:orderId

---

### ✔ Listar todos — GET /order/list/all

---

### ✔ Atualizar — PUT /order/:orderId
Body:
```json
{
  "value": 999,
  "creationDate": "2024-01-01T00:00:00"
}
```

---

### ✔ Deletar — DELETE /order/:orderId
Retorno:
```json
{
  "message": "Pedido e itens deletados com sucesso!"
}
```

---

#  Testando no Thunder Client

1. Login → gere token  
2. Vá na aba **Auth → Bearer Token**  
3. Cole o token  
4. Envie qualquer requisição para `/order`  

---

#  Conclusão

Este projeto implementa:

✔ CRUD completo  
✔ Autenticação JWT avançada  
✔ Segurança com middleware  
✔ Estrutura robusta  
✔ Pronto para avaliação técnica  

---



---

# Autenticação JWT

A API utiliza autenticação baseada em **Bearer Token (JWT)**.  
Somente duas rotas são públicas:

- `POST /auth/login`
- `/docs` (documentação Swagger)

Todas as rotas dentro de `/order` são protegidas e exigem token JWT.

##  1. Gerando o token
Body:
```json
{
  "username": "admin",
  "password": "123456"
}
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 2. Usando o token
Header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

##  3. Usando no Swagger
Acesse:
```
http://localhost:3000/docs
```

Clique em **Authorize** e cole:
```
Bearer SEU_TOKEN_AQUI
```

Depois teste qualquer rota **/order** normalmente.

---

