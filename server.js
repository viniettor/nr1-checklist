const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// MODEL - Esquema do banco de dados
const ChecklistSchema = new mongoose.Schema({
  empresa: String,
  cnpj: String,
  email: String,
  telefone: String,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});
const Checklist = mongoose.model('Checklist', ChecklistSchema);

// CONEXAO COM MONGODB ATLAS (ONLINE)
const MONGODB_URI = 'mongodb+srv://viniettor_db_user:QDR0IBmdA29z7Dhp@cluster0.vpuce8n.mongodb.net/nr1-checklist';

console.log('Conectando ao MongoDB Atlas...');
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Conectado ao MongoDB Atlas com sucesso!');
  console.log('Banco de dados online e funcionando');
})
.catch(err => {
  console.error('Erro ao conectar ao MongoDB Atlas:', err.message);
  console.log('Verifique sua string de conexao e credenciais');
});

// ROTA para salvar checklist
app.post('/api/salvar', async (req, res) => {
  try {
    console.log('Dados recebidos - Empresa:', req.body.empresa);
    console.log('Telefone recebido:', req.body.telefone);
    
    const novo = new Checklist(req.body);
    await novo.save();
    
    res.json({ 
      sucesso: true, 
      message: 'Checklist salvo com sucesso!',
      id: novo._id 
    });
  } catch (error) {
    console.error('Erro ao salvar:', error);
    res.status(500).json({ 
      sucesso: false, 
      error: error.message 
    });
  }
});

// ROTA para listar todos (para testes)
app.get('/api/listar', async (req, res) => {
  try {
    const checklists = await Checklist.find().sort({ createdAt: -1 });
    res.json(checklists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROTA principal - serve o site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`\nServidor rodando em: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/listar`);
  console.log(`Site: http://localhost:${PORT}\n`);
  console.log(`Acesse manualmente no navegador: http://localhost:${PORT}`);
});