import React, { useState } from 'react';
import styles from './style';

const barbeiros = [
  {
    nome: 'Marcos Timoteo',
    imagem: '/public/marcos.jpg',
    servicos: [
      { nome: 'Corte', valor: 35, tempo: '00:30' },
      { nome: 'Barba', valor: 35, tempo: '00:25' },
      { nome: 'Corte + Barba', valor: 70, tempo: '00:50' },
      { nome: 'Barba Infinita', valor: 89.99, tempo: '00:25' },
      { nome: 'Corte Infinito', valor: 99.99, tempo: '00:25' },
      { nome: 'Selagem', valor: 85, tempo: '01:00' },
    ],
  },
  {
    nome: 'John lennon tessaro',
    imagem: '/public/john.jpg',
    servicos: [
      { nome: 'Corte', valor: 35, tempo: '00:20' },
      { nome: 'Barba', valor: 35, tempo: '00:20' },
      { nome: 'Corte e Barba', valor: 70, tempo: '00:30' },
      { nome: 'Sobrancelha', valor: 15, tempo: '00:10' },
      { nome: 'Plano Mensal Seg á Qua', valor: 90, tempo: '00:20' },
      { nome: 'Corte Plano', valor: 100, tempo: '00:20' },
      { nome: 'Selagem', valor: 125, tempo: '00:40' },
      { nome: 'Alisamento', valor: 125, tempo: '00:40' },
    ],
  },
  {
    nome: 'Deyvidi',
    imagem: '/public/deyvidi.jpg',
    servicos: [
      { nome: 'Corte', valor: 35, tempo: '00:25' },
      { nome: 'Barba', valor: 35, tempo: '00:20' },
      { nome: 'Corte e Barba', valor: 70, tempo: '00:50' },
      { nome: 'Sobrancelha', valor: 10, tempo: '00:05' },
      { nome: 'Selagem', valor: 100, tempo: '00:10' },
      { nome: 'Corte Infinito', valor: 89.99, tempo: '00:25' },
      { nome: 'Barba Infinita', valor: 89.99, tempo: '00:20' },
      { nome: 'Platinado', valor: 100, tempo: '00:20' },
    ],
  },
];

const EscolherBarbeiro = ({ onVoltar, onSelecionar }) => {
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const handleSelecionarBarbeiro = (barbeiro) => {
    setBarbeiroSelecionado(barbeiro);
    setServicoSelecionado(null); // limpa o serviço se mudar o barbeiro
  };

  const avancar = () => {
    if (barbeiroSelecionado && servicoSelecionado) {
      onSelecionar({
        barbeiro: barbeiroSelecionado,
        servico: servicoSelecionado,
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoCircle}>
        <img src="/logo.jpg" alt="Logo" style={styles.logoImg} />
      </div>
      <h1 style={styles.titulo}>Conexão Barber</h1>
      <p>(beta-teste)</p>
      <h2 style={styles.subtitulo}>PROFISSIONAL</h2>

      <div style={styles.lista}>
        {barbeiros.map((barbeiro, index) => (
          <button
            key={index}
            style={{
              ...styles.barbeiroCard,
              backgroundColor:
                barbeiroSelecionado?.nome === barbeiro.nome ? '#ffc132' : '#ffe97f',
            }}
            onClick={() => handleSelecionarBarbeiro(barbeiro)}
          >
            <div style={styles.cardContent}>
              <img src={barbeiro.imagem} alt={barbeiro.nome} style={styles.avatar} />
              <span style={styles.nome}>{barbeiro.nome}</span>
            </div>
          </button>
        ))}
      </div>

      {barbeiroSelecionado && (
        <>
          <h2 style={styles.subtitulo}>SERVIÇO</h2>
          <div style={styles.lista}>
            {barbeiroSelecionado.servicos.map((servico, i) => (
              <button
                key={i}
                onClick={() => setServicoSelecionado(servico)}
                style={{
                  ...styles.servicoCard,
                  border: servicoSelecionado?.nome === servico.nome ? '2px solid #5daaff' : '2px solid transparent',
                  backgroundColor: servicoSelecionado?.nome === servico.nome ? '#FFC132' : '#FFE97F',
                }}
              >
                <strong>{servico.nome}</strong>
                <p style={{ margin: 0, fontSize: '12px' }}>
                  Valor: R$ {servico.valor.toFixed(2)}
                </p>
                <p style={{ margin: 0, fontSize: '12px' }}>
                  Tempo: {servico.tempo}
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button style={styles.botaoVoltar} onClick={onVoltar}>
          Voltar
        </button>
        <button
          style={{
            ...styles.botaoVoltar,
            backgroundColor: barbeiroSelecionado && servicoSelecionado ? '#5daaff' : '#aaa',
            cursor: barbeiroSelecionado && servicoSelecionado ? 'pointer' : 'not-allowed',
          }}
          onClick={avancar}
          disabled={!barbeiroSelecionado || !servicoSelecionado}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default EscolherBarbeiro;
