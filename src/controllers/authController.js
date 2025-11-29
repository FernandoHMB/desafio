const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Usuário fixo (poderia vir do MySQL)
const usuarioFake = {
    id: 1,
    username: "admin",
    passwordHash: bcrypt.hashSync("123456", 10)  // senha: 123456
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Valida usuário
    if (username !== usuarioFake.username) {
        return res.status(401).json({ error: "Usuário incorreto" });
    }

    // Valida senha
    const senhaValida = bcrypt.compareSync(password, usuarioFake.passwordHash);
    if (!senhaValida) {
        return res.status(401).json({ error: "Senha incorreta" });
    }

    // Cria token JWT
    const token = jwt.sign(
        { id: usuarioFake.id, username: usuarioFake.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return res.json({ token });
};
