// src/containers/DataHora/index.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './style';

const horariosPorBarbeiro = {
  'Marcos Timoteo': {
    dias: [2, 3, 4, 5, 6, 0], // Terça a Domingo
    inicio: '10:00',
    fim: '18:40',
  },
  'John Lennon Tessaro': {
    dias: [1, 3, 4, 5, 6], // Segunda, Quarta a Sábado
    inicio: '06:30',
    fim: '17:30',
  },
  'Deyvidi': {
    dias: [2, 3, 4, 5, 6], // Terça a Sábado
    inicio: '10:00',
    fim: '19:30',
  },
};

const DataHora = ({ onVoltar, dadosAgendamento, onContinuar }) => {
  const { barbeiro, servico } = dadosAgendamento;
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false); // ✅ NOVO ESTADO
  const [dadosCompletos, setDadosCompletos] = useState(null); // ✅ DADOS FINAIS
  const [lembrete, setLembrete] = useState(false); // ✅ PARA CONFIRMAÇÃO
  const [googleAgenda, setGoogleAgenda] = useState(false); // ✅ PARA CONFIRMAÇÃO

  // ✅ Verificação de segurança
  if (!barbeiro || !servico) {
    console.error('Dados inválidos:', { barbeiro, servico });
    return (
      <div style={styles.container}>
        <h1 style={styles.titulo}>Erro: Dados não encontrados</h1>
        <button style={styles.botaoVoltar} onClick={onVoltar}>
          Voltar
        </button>
      </div>
    );
  }

  const config = horariosPorBarbeiro[barbeiro.nome];

  console.log('Dados recebidos:', { barbeiro: barbeiro.nome, servico, config });

  useEffect(() => {
    if (dataSelecionada) {
      gerarHorariosDisponiveis();
    }
  }, [dataSelecionada]);

  const gerarHorariosDisponiveis = () => {
    if (!config || !config.inicio || !config.fim) return;

    const duracaoMin = tempoParaMinutos(servico.tempo); // ex: "00:30" → 30
    const horarios = [];

    let [hora, minuto] = config.inicio.split(':').map(Number);
    const [fimHora, fimMinuto] = config.fim.split(':').map(Number);

    while (
      hora < fimHora ||
      (hora === fimHora && minuto + duracaoMin <= fimMinuto)
    ) {
      const hStr = hora.toString().padStart(2, '0');
      const mStr = minuto.toString().padStart(2, '0');
      horarios.push(`${hStr}:${mStr}`);

      minuto += duracaoMin;
      if (minuto >= 60) {
        hora++;
        minuto = minuto % 60;
      }
    }

    setHorariosDisponiveis(horarios);
  };

  const tempoParaMinutos = (tempoStr) => {
    const [h, m] = tempoStr.split(':').map(Number);
    return h * 60 + m;
  };

  const isDiaDisponivel = (date) => {
    if (!config || !config.dias) return false;
    const dia = date.getDay(); // 0 = domingo, 1 = segunda, ...
    return config.dias.includes(dia);
  };

  const confirmar = () => {
    if (!dataSelecionada || !horarioSelecionado) return;
    
    // ✅ PREPARA DADOS COMPLETOS E MOSTRA CONFIRMAÇÃO
    const dadosFinais = {
      ...dadosAgendamento,
      data: dataSelecionada.toISOString().split('T')[0],
      horario: horarioSelecionado,
    };
    
    setDadosCompletos(dadosFinais);
    setMostrarConfirmacao(true);
    console.log('Dados finais do agendamento:', dadosFinais);
  };

  // ✅ FUNÇÕES DA TELA DE CONFIRMAÇÃO
  const formatarData = (dataStr) => {
    if (!dataStr) return 'Data não informada';
    const dataObj = new Date(dataStr + 'T00:00:00');
    return dataObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const adicionarGoogleCalendar = () => {
    const { barbeiro, servicos, data, horario, valorTotal } = dadosCompletos;
    const titulo = `Agendamento Barbearia - ${servicos?.map(s => s.nome).join(' + ') || servico.nome}`;
    const descricao = `Barbeiro: ${barbeiro?.nome}\\nServiços: ${servicos?.map(s => s.nome).join(', ') || servico.nome}\\nValor: R$ ${(valorTotal || servico.valor || 0).toFixed(2)}`;
    
    if (data && horario) {
      const dataHora = new Date(`${data}T${horario}:00`);
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${dataHora.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(descricao)}&location=Conexão Barber`;
      window.open(googleUrl, '_blank');
      setGoogleAgenda(true);
    }
  };

  const compartilhar = async () => {
    const { barbeiro, servicos, data, horario, valorTotal, cliente } = dadosCompletos;
    const servicosTexto = servicos?.map(s => s.nome).join(' + ') || servico.nome;
    const valor = valorTotal || servico.valor || 0;
    const nomeCliente = cliente?.name || 'Cliente';
    
    const texto = `🔥 ${nomeCliente} agendou na Conexão Barber!\\n\\n👤 ${barbeiro?.nome}\\n📅 ${new Date(data + 'T00:00:00').toLocaleDateString('pt-BR').slice(0, 5)}\\n🕐 ${horario}\\n✂️ ${servicosTexto}\\n💰 R$ ${valor.toFixed(2)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: texto });
      } catch (err) {
        navigator.clipboard.writeText(texto);
        alert('Texto copiado para área de transferência!');
      }
    } else {
      navigator.clipboard.writeText(texto);
      alert('Texto copiado para área de transferência!');
    }
  };

  const voltarParaCalendario = () => {
    setMostrarConfirmacao(false);
    setDadosCompletos(null);
  };

  const novoAgendamento = () => {
    // Volta para a Home (etapa 'cliente')
    if (onContinuar) {
      onContinuar({ novoAgendamento: true });
    }
  };

  // ✅ SE DEVE MOSTRAR CONFIRMAÇÃO, RENDERIZA A TELA DE CONFIRMAÇÃO
  if (mostrarConfirmacao && dadosCompletos) {
    const { barbeiro, servicos, data, horario, valorTotal, name } = dadosCompletos;
    
    return (
      <div style={styles.container}>
        <div style={styles.logoCircle}>
          <img src="/logo.jpg" alt="Logo" style={styles.logoImg} />
        </div>

        <h1 style={styles.titulo}>Conexão Barber</h1>
        <p>(beta-teste)</p>

        {/* Status Confirmado */}
        <div style={styles.statusConfirmado}>
          <span style={styles.checkIcon}>✓</span>
          <span style={styles.statusTexto}>CONFIRMADO!</span>
        </div>

        {/* Card de Resumo */}
        <div style={styles.resumoCard}>
          {/* Cliente */}
          <div style={styles.resumoItem}>
            <span style={styles.resumoLabel}>Cliente</span>
            <span style={styles.resumoValor}>
              {dadosCompletos.cliente?.name || dadosCompletos.name || 'Cliente'}
            </span>
          </div>

          {/* Horário - Apenas DD/MM às HH:MM */}
          <div style={styles.resumoItem}>
            <span style={styles.resumoLabel}>Horário</span>
            <div style={styles.horarioSimples}>
              <span style={styles.dataSimples}>
                {new Date(data + 'T00:00:00').toLocaleDateString('pt-BR').slice(0, 5)} às {horario}
              </span>
            </div>
          </div>

          {/* Profissional */}
          <div style={styles.resumoItem}>
            <span style={styles.resumoLabel}>Profissional</span>
            <span style={styles.resumoValorDestaque}>{barbeiro?.nome}</span>
          </div>

          {/* Serviços */}
          <div style={styles.resumoItemServicos}>
            <span style={styles.resumoLabel}>Serviço</span>
            <div style={styles.servicosLista}>
              {servicos ? (
                servicos.map((servico, index) => (
                  <div key={index} style={styles.servicoItem}>
                    <span>{servico.nome}</span>
                    <span>R$ {servico.valor.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div style={styles.servicoItem}>
                  <span>{servico.nome}</span>
                  <span>R$ {servico.valor.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Valor Total */}
          <div style={styles.resumoItem}>
            <span style={styles.resumoLabel}>Valor</span>
            <span style={styles.valorTotal}>R$ {(valorTotal || servico.valor || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Seção de Lembretes - Apenas Google Agenda */}
        <h3 style={styles.lembretesTitulo}>Quer ser lembrado?</h3>

        <div style={styles.lembretesContainer}>
          {/* Google Calendar */}
          <button
            onClick={adicionarGoogleCalendar}
            style={{
              ...styles.lembreteBtn,
              backgroundColor: googleAgenda ? '#5daaff' : '#333',
              color: googleAgenda ? '#fff' : '#fff',
              border: googleAgenda ? '2px solid #4a90e2' : '2px solid #555'
            }}
          >
            <span style={styles.lembreteIcon}>📅</span>
            <span>Envie para meu Google Agenda</span>
            {googleAgenda && <span style={styles.checkMark}>✓</span>}
          </button>
        </div>

        {/* Botões de Ação - Apenas Agendar Novamente */}
        <div style={styles.botoesContainer}>
          {/* Agendar Novamente */}
          <button onClick={novoAgendamento} style={styles.botaoAgendar}>
            Agendar novamente
          </button>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>Chegue 10 minutos antes do horário</p>
          <p>Em caso de atraso, reagende seu horário</p>
        </div>
      </div>
    );
  }

  // ✅ RENDERIZAÇÃO NORMAL DO CALENDÁRIO (COMO ESTAVA ANTES)
  return (
    <div style={styles.container}>
      <div style={styles.logoCircle}>
        <img src="/logo.jpg" alt="Logo" style={styles.logoImg} />
      </div>

      <h1 style={styles.titulo}>Conexão Barber</h1>
      <p>(beta-teste)</p>
      <h2 style={styles.subtitulo}>DATA</h2>

      <div style={styles.calendarioWrapper}>
        <DatePicker
          selected={dataSelecionada}
          onChange={(date) => {
            setDataSelecionada(date);
            setHorarioSelecionado(null);
          }}
          inline
          filterDate={isDiaDisponivel}
          minDate={new Date()}
        />
      </div>

      <p style={{ color: '#ccc', marginTop: 10 }}>Selecione um horário</p>

      <div style={styles.horariosWrapper}>
        {horariosDisponiveis.map((hora, i) => (
          <button
            key={i}
            onClick={() => setHorarioSelecionado(hora)}
            style={{
              ...styles.horarioBtn,
              backgroundColor:
                horarioSelecionado === hora ? '#ffc132' : '#ffe97f',
            }}
          >
            {hora}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: 20 }}>
        <button style={styles.botaoVoltar} onClick={onVoltar}>
          Voltar
        </button>
        <button
          style={{
            ...styles.botaoVoltar,
            backgroundColor:
              dataSelecionada && horarioSelecionado ? '#5daaff' : '#aaa',
            cursor:
              dataSelecionada && horarioSelecionado ? 'pointer' : 'not-allowed',
          }}
          onClick={confirmar}
          disabled={!dataSelecionada || !horarioSelecionado}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default DataHora;