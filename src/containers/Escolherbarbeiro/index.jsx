import React, { useState } from 'react';
import styles from './style';

const barbeiros = [
  {
    nome: 'Marcos Timoteo',
    imagem: '/marcos.jpg',
    servicos: [
      { id: 1, nome: 'Corte', valor: 35, tempo: '00:30' },
      { id: 2, nome: 'Barba', valor: 35, tempo: '00:25' },
      { id: 3, nome: 'Corte + Barba', valor: 70, tempo: '00:50' },
      { id: 4, nome: 'Barba Infinita', valor: 89.99, tempo: '00:25' },
      { id: 5, nome: 'Corte Infinito', valor: 99.99, tempo: '00:25' },
      { id: 6, nome: 'Selagem', valor: 85, tempo: '01:00' },
    ],
  },
  {
    nome: 'John Lennon Tessaro',
    imagem: '/john.jpg',
    servicos: [
      { id: 7, nome: 'Corte', valor: 35, tempo: '00:20' },
      { id: 8, nome: 'Barba', valor: 35, tempo: '00:20' },
      { id: 9, nome: 'Corte e Barba', valor: 70, tempo: '00:30' },
      { id: 10, nome: 'Sobrancelha', valor: 15, tempo: '00:10' },
      { id: 11, nome: 'Plano Mensal Seg á Qua', valor: 90, tempo: '00:20' },
      { id: 12, nome: 'Corte Plano', valor: 100, tempo: '00:20' },
      { id: 13, nome: 'Selagem', valor: 125, tempo: '00:40' },
      { id: 14, nome: 'Alisamento', valor: 125, tempo: '00:40' },
    ],
  },
  {
    nome: 'Deyvidi',
    imagem: '/deyvidi.jpg',
    servicos: [
      { id: 15, nome: 'Corte', valor: 35, tempo: '00:25' },
      { id: 16, nome: 'Barba', valor: 35, tempo: '00:20' },
      { id: 17, nome: 'Corte e Barba', valor: 70, tempo: '00:50' },
      { id: 18, nome: 'Sobrancelha', valor: 10, tempo: '00:05' },
      { id: 19, nome: 'Selagem', valor: 100, tempo: '00:10' },
      { id: 20, nome: 'Corte Infinito', valor: 89.99, tempo: '00:25' },
      { id: 21, nome: 'Barba Infinita', valor: 89.99, tempo: '00:20' },
      { id: 22, nome: 'Platinado', valor: 100, tempo: '00:20' },
    ],
  },
];

const EscolherBarbeiro = ({ onVoltar, onSelecionar }) => {
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);

  const handleSelecionarBarbeiro = (barbeiro) => {
    setBarbeiroSelecionado(barbeiro);
    setServicosSelecionados([]); // limpa os serviços se mudar o barbeiro
  };

  const handleToggleServico = (servico) => {
    setServicosSelecionados(prev => {
      const servicoExiste = prev.find(s => s.id === servico.id);
      
      if (servicoExiste) {
        // Remove o serviço se já estiver selecionado
        return prev.filter(s => s.id !== servico.id);
      } else {
        // Adiciona o serviço se não estiver selecionado
        return [...prev, servico];
      }
    });
  };

  const calcularTotal = () => {
    return servicosSelecionados.reduce((total, servico) => total + servico.valor, 0);
  };

  const calcularTempoTotal = () => {
    let totalMinutos = 0;
    servicosSelecionados.forEach(servico => {
      const [horas, minutos] = servico.tempo.split(':').map(Number);
      totalMinutos += (horas * 60) + minutos;
    });
    
    const horas = Math.floor(totalMinutos / 60);
    const minutosRestantes = totalMinutos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutosRestantes.toString().padStart(2, '0')}`;
  };

  const avancar = () => {
    if (barbeiroSelecionado && servicosSelecionados.length > 0) {
      // ✅ GARANTE que sempre envia um objeto servico válido
      const servicoCombinado = {
        nome: servicosSelecionados.map(s => s.nome).join(' + '),
        valor: calcularTotal(),
        tempo: calcularTempoTotal()
      };

      console.log('Enviando dados:', {
        barbeiro: barbeiroSelecionado,
        servico: servicoCombinado
      });

      onSelecionar({
        barbeiro: barbeiroSelecionado,
        servico: servicoCombinado,
        servicos: servicosSelecionados,
        valorTotal: calcularTotal(),
        tempoTotal: calcularTempoTotal()
      });
    }
  };

  const isServicoSelecionado = (servicoId) => {
    return servicosSelecionados.some(s => s.id === servicoId);
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
          <h2 style={styles.subtitulo}>
            SERVIÇOS
          </h2>
          <div style={styles.lista}>
            {barbeiroSelecionado.servicos.map((servico, i) => {
              const selecionado = isServicoSelecionado(servico.id);
              return (
                <button
                  key={i}
                  onClick={() => handleToggleServico(servico)}
                  style={{
                    ...styles.servicoCard,
                    border: selecionado ? '2px solid #2ed573' : '2px solid transparent',
                    backgroundColor: selecionado ? '#2ed573' : '#FFE97F',
                    color: selecionado ? '#fff' : '#000',
                    position: 'relative'
                  }}
                >
                  {selecionado && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#fff',
                      color: '#000000ff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}
                  <strong>{servico.nome}</strong>
                  <p style={{ margin: 0, fontSize: '12px' }}>
                    Valor: R$ {servico.valor.toFixed(2)}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px' }}>
                    Tempo: {servico.tempo}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Resumo dos serviços selecionados */}
          {servicosSelecionados.length > 0 && (
            <div style={{
              backgroundColor: '#333',
              border: '2px solid #2ed573',
              borderRadius: '12px',
              padding: '16px',
              margin: '20px 0',
              color: '#fff'
            }}>
              <h3 style={{ 
                color: '#2ed573', 
                margin: '0 0 12px 0', 
                fontSize: '16px',
                textAlign: 'center'
              }}>
                📋 RESUMO
              </h3>
              
              <div style={{ marginBottom: '12px' }}>
                {servicosSelecionados.map((servico) => (
                  <div key={servico.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                    fontSize: '14px'
                  }}>
                    <span>{servico.nome}</span>
                    <span>R$ {servico.valor.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div style={{
                borderTop: '1px solid #2ed573',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ color: '#2ed573', fontWeight: 'bold' }}>
                  💰 Total: R$ {calcularTotal().toFixed(2)}
                </div>
                <div style={{ color: '#2ed573', fontWeight: 'bold' }}>
                  ⏱️ Tempo: {calcularTempoTotal()}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button style={styles.botaoVoltar} onClick={onVoltar}>
          Voltar
        </button>
        <button
          style={{
            ...styles.botaoVoltar,
            backgroundColor: barbeiroSelecionado && servicosSelecionados.length > 0 ? '#5daaff' : '#aaa',
            cursor: barbeiroSelecionado && servicosSelecionados.length > 0 ? 'pointer' : 'not-allowed',
          }}
          onClick={avancar}
          disabled={!barbeiroSelecionado || servicosSelecionados.length === 0}
        >
          Próximo {servicosSelecionados > 0 && `(${servicosSelecionados.length})`}
        </button>
      </div>
    </div>
  );
};

export default EscolherBarbeiro;