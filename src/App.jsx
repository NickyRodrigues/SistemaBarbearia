import React, { useState } from 'react';
import Home from './containers/Home';
import EscolherBarbeiro from './containers/Escolherbarbeiro';
import DataHora from './containers/DataHora';
import Cancelar from './containers/Cancelar'; // ✅ Importa a tela de cancelamento

const App = () => {
  const [etapa, setEtapa] = useState('cliente');
  const [dadosCliente, setDadosCliente] = useState(null);
  const [dadosAgendamento, setDadosAgendamento] = useState(null);

  // Quando o cliente preenche nome e telefone
  const handleClienteSubmit = (dados) => {
    setDadosCliente(dados);
    setEtapa('barbeiro');
  };

  // Quando o cliente escolhe barbeiro e serviço
  const handleSelecionarBarbeiro = ({ barbeiro, servico, servicos, valorTotal, tempoTotal }) => {
    setDadosAgendamento({ 
      barbeiro, 
      servico, 
      servicos, // ✅ Para múltiplos serviços
      valorTotal, 
      tempoTotal 
    });
    setEtapa('datahora');
  };

  // Quando o agendamento é finalizado com data e hora
  const handleAgendamentoFinalizado = (agendamentoFinal) => {
    // ✅ Se é um novo agendamento, volta para a Home
    if (agendamentoFinal.novoAgendamento) {
      setDadosCliente(null);
      setDadosAgendamento(null);
      setEtapa('cliente');
      return;
    }
    
    // ✅ Senão, processa o agendamento normalmente
    console.log('Agendamento concluído:', {
      cliente: dadosCliente,
      ...agendamentoFinal,
    });
    // Aqui você pode salvar no banco, exibir mensagem, etc.
  };

  return (
    <>
      {/* Etapa de identificação */}
      {etapa === 'cliente' && (
        <Home
          onAgendar={handleClienteSubmit}
          onCancelar={() => setEtapa('cancelar')} // ✅ Envia para a tela de cancelamento
        />
      )}

      {/* Etapa de seleção de barbeiro/serviço */}
      {etapa === 'barbeiro' && (
        <EscolherBarbeiro
          onSelecionar={handleSelecionarBarbeiro}
          onVoltar={() => setEtapa('cliente')}
        />
      )}

      {/* Etapa de seleção de data e hora */}
      {etapa === 'datahora' && dadosAgendamento && (
        <DataHora
          dadosAgendamento={{
            cliente: dadosCliente,
            barbeiro: dadosAgendamento.barbeiro,
            servico: dadosAgendamento.servico,
            servicos: dadosAgendamento.servicos, // ✅ Para múltiplos serviços
            valorTotal: dadosAgendamento.valorTotal,
            tempoTotal: dadosAgendamento.tempoTotal,
          }}
          onVoltar={() => setEtapa('barbeiro')}
          onContinuar={handleAgendamentoFinalizado}
        />
      )}

      {/* Etapa de cancelamento */}
      {etapa === 'cancelar' && (
        <Cancelar onVoltar={() => setEtapa('cliente')} />
      )}
    </>
  );
};

export default App;