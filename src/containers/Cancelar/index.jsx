import React, { useState } from 'react';
import styles from './style';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.br';

const Cancelar = ({ onVoltar }) => {
  const [phone, setPhone] = useState('');

  const handleBuscarAgendamento = () => {
    if (phone) {
      console.log('Buscando agendamento para:', phone);
      // Aqui você pode buscar agendamento por telefone depois
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo circular */}
        <div style={styles.logoCircle}>
          <img
            src="/logo.jpg"
            alt="Logo"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={styles.barberLine}></div>
            <p>(beta-teste)</p>
          </div>
        </div>
        <h1 style={styles.titulo}>Conexão Barber</h1>
        <p>(beta-teste)</p>
        <h2 style={styles.subtitulo}>CANCELAMENTO</h2>    
        {/* Campo de telefone */}
        <Cleave
          options={{ phone: true, phoneRegionCode: 'BR' }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Seu telefone"
          style={styles.input}
          required
        />

        {/* Botões lado a lado */}
        <div style={styles.buttonsContainer}>
          <button
            type="submit"
            onClick={handleBuscarAgendamento}
            style={{
              ...styles.button,
              opacity: !phone ? 0.5 : 1,
              cursor: !phone ? 'not-allowed' : 'pointer',
            }}
            disabled={!phone}
          >
            Buscar Agendamento
          </button>

          <button style={styles.cancelButton} onClick={onVoltar}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancelar;
