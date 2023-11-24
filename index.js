const express = require('express');
const fs = require('fs');

const server = express();
server.use(express.json());

const dados = require('./dados.json');

server.listen(3000, () =>{
    console.log(`O servidor está funcionando! :D`);
})

const medicamentosRouter = express.Router();
const clientesRouter = express.Router();
const fornecedoresRouter = express.Router();


server.use('/medicamentos', medicamentosRouter);
server.use('/clientes', clientesRouter);
server.use('/fornecedores', fornecedoresRouter);


const salvarDadosMiddleware = (req, res, next) => {
  salvarDados();
  next();
};

medicamentosRouter.route('/')
  .post(salvarDadosMiddleware, cadastrarMedicamento)
  .get(obterMedicamentos);

medicamentosRouter.route('/:id')
  .put(salvarDadosMiddleware, atualizarMedicamento)
  .delete(salvarDadosMiddleware, excluirMedicamento);


clientesRouter.route('/')
  .post(salvarDadosMiddleware, cadastrarCliente)
  .get(obterClientes);


clientesRouter.route('/:id')
  .put(salvarDadosMiddleware, atualizarCliente)
  .delete(salvarDadosMiddleware, excluirCliente);


fornecedoresRouter.route('/')
  .post(salvarDadosMiddleware, cadastrarFornecedor)
  .get(obterFornecedores);

fornecedoresRouter.route('/:id')
  .put(salvarDadosMiddleware, atualizarFornecedor)
  .delete(salvarDadosMiddleware, excluirFornecedor);



function cadastrarMedicamento(req, res) {
  const novoMedicamento = req.body;
  if (!validarMedicamento(novoMedicamento)) {
    return res.status(400).json({ mensagem: 'Dados incompletos, tente novamente' });
  }
  dados.medicamentos.push(novoMedicamento);
  res.status(201).json({ mensagem: 'Novo medicamento cadastrado com sucesso!' });
}

function cadastrarCliente(req, res) {
    const novoCliente = req.body;
    if (!validarCliente(novoCliente)) {
      return res.status(400).json({ mensagem: 'Dados incompletos, tente novamente' });
    }
    dados.clientes.push(novoCliente); // Fix: Use dados.clientes instead of dados..clientesRouter
    res.status(201).json({ mensagem: 'Novo cliente cadastrado com sucesso!' });
  }

 
function obterClientes(req, res) {
    res.json(dados.clientes);
  }

  function excluirCliente(req, res) {
    const clienteId = parseInt(req.params.id);
    dados.clientes = dados.clientes.filter(c => c.id !== clienteId);
  
    res.status(200).json({ mensagem: 'Cliente excluído com sucesso' });
  }
  
   

function atualizarCliente(req, res) {
    const clienteId = parseInt(req.params.id);
    const atualizarCliente = req.body;
    const idCliente = dados.clientes.findIndex(c => c.id === clienteId);
  
    if (idCliente === -1) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado :/' });
    }
  
    Object.assign(dados.clientes[idCliente], atualizarCliente);
    res.json({ mensagem: 'Cliente atualizado com sucesso!' });
  }
  

  function cadastrarFornecedor(req, res) {
    const novoFornecedor = req.body;
    if (!validarFornecedor(novoFornecedor)) {
      return res.status(400).json({ mensagem: 'Dados incompletos, tente novamente' });
    }
    dados.fornecedores.push(novoFornecedor);
    res.status(201).json({ mensagem: 'Novo fornecedor cadastrado com sucesso!' });
  }
  
  function validarFornecedor(fornecedor) {
    return fornecedor.id && fornecedor.nome && fornecedor.contato && fornecedor.email;
  }

  function obterFornecedores(req, res) {
    res.json(dados.fornecedores);
  }
  
  function atualizarFornecedor(req, res) {
    const fornecedorId = parseInt(req.params.id);
    const atualizarFornecedor = req.body;
    const idFornecedor = dados.fornecedores.findIndex(f => f.id === fornecedorId);
  
    if (idFornecedor === -1) {
      return res.status(404).json({ mensagem: 'Fornecedor não encontrado :/' });
    }
  
    Object.assign(dados.fornecedores[idFornecedor], atualizarFornecedor);
    res.json({ mensagem: 'Fornecedor atualizado com sucesso!' });
  }

  function excluirFornecedor(req, res) {
    const fornecedorId = parseInt(req.params.id);
    dados.fornecedores = dados.fornecedores.filter(f => f.id !== fornecedorId);
  
    res.status(200).json({ mensagem: 'Fornecedor excluído com sucesso' });
  }
  

function obterMedicamentos(req, res) {
  res.json(dados.medicamentos);
}

function atualizarMedicamento(req, res) {
  const medicamentoId = parseInt(req.params.id);
  const atualizarMedicamento = req.body;
  const idMedicamento = dados.medicamentos.findIndex(m => m.id === medicamentoId);

  if (idMedicamento === -1) {
    return res.status(404).json({ mensagem: 'Medicamento não encontrado :/' });
  }

  Object.assign(dados.medicamentos[idMedicamento], atualizarMedicamento);
  res.json({ mensagem: 'Medicamento atualizado com sucesso!' });
}

function excluirMedicamento(req, res) {
  const medicamentoId = parseInt(req.params.id);
  dados.medicamentos = dados.medicamentos.filter(m => m.id !== medicamentoId);
  res.status(200).json({ mensagem: 'Medicamento excluído com sucesso' });
}

function validarMedicamento(medicamento) {
  return medicamento.id && medicamento.nome && medicamento.fabricante && medicamento.preco && medicamento.quantidade;
}


function salvarDados() {
  fs.writeFileSync(__dirname + './dados.json', JSON.stringify(dados, null, 2));
}
