
const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;


// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('trivia.db'); // Use o caminho de um arquivo para persistir os dados

// Middleware para interpretar JSON
app.use(express.json());

// Criar tabela de perguntas
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS perguntas (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT)");
});

//Adicionar uma nova pergunta
app.post('/trivia/insert', (req, res) => {
    const { question, answer } = req.body;
    db.run(`INSERT INTO questions (question, answer) VALUES (?, ?)`, [question, answer], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: "Pergunta criada com sucesso!" });
    });
});

//Listar todas as perguntas
app.get('/trivia/get', (req, res) => {
    db.all("SELECT * FROM questions", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//Obter uma única pergunta
app.get('/questions/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM questions WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Pergunta não encontrada" });
        }
        res.json(row);
    });
});

//Atualizar uma pergunta
app.put('/questions/:id', (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    db.run(`UPDATE questions SET question = ?, answer = ? WHERE id = ?`, [question, answer, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Pergunta não encontrada" });
        }
        res.json({ message: "Pergunta atualizada com sucesso!" });
    });
});

//Remover uma pergunta
app.delete('/questions/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM questions WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Pergunta não encontrada" });
        }
        res.json({ message: "Pergunta removida com sucesso!" });
    });
});

//Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
