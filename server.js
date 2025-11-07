const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const FILE = path.join(__dirname, 'dados.json');

// permitir JSON no body
app.use(express.json());

// servir arquivos estáticos (index.html, registros.html, logo.png, etc.)
app.use(express.static(path.join(__dirname)));

// retorna os dados
app.get('/dados', (req, res) => {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({
      impacts: [],
      churns: [],
      vendas: [],
      reunioes: [],
      oportunidades: [],
      novidades: [],
      dificuldades: []
    }, null, 2), 'utf8');
  }

  try {
    const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Erro ao ler dados.json:', err);
    res.status(500).json({ error: 'Falha ao ler dados do servidor' });
  }
});

// salva dados recebidos
app.post('/dados', (req, res) => {
  try {
    fs.writeFileSync(FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar dados.json:', err);
    res.status(500).json({ error: 'Falha ao salvar dados no servidor' });
  }
});

// fallback para qualquer rota não encontrada
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
