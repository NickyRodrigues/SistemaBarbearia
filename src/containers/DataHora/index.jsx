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
  'John lennon tessaro': {
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

  const config = horariosPorBarbeiro[barbeiro.nome];

  useEffect(() => {
    if (dataSelecionada) {
      gerarHorariosDisponiveis();
    }
  }, [dataSelecionada]);

  const gerarHorariosDisponiveis = () => {
    if (!config) return;

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
    const dia = date.getDay(); // 0 = domingo, 1 = segunda, ...
    return config.dias.includes(dia);
  };

  const confirmar = () => {
    if (!dataSelecionada || !horarioSelecionado) return;
    onContinuar({
      ...dadosAgendamento,
      data: dataSelecionada.toISOString().split('T')[0],
      horario: horarioSelecionado,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoCircle}>
        <img src="/public/logo.jpg" alt="Logo" style={styles.logoImg} />
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
