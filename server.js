import express from 'express';
import { render } from './app/server.tsx';

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static('build/client'));

// Handler para todas as rotas
app.get('*', async (req, res) => {
  try {
    const response = await render(req);
    res.status(200).send(response);
  } catch (error) {
    console.error('Erro no render:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
