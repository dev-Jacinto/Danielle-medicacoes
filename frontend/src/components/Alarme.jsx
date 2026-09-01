import { useEffect, useRef } from 'react';

// Componente que mostra um aviso em tela cheia, com som repetindo,
// até a pessoa clicar em "OK".
function Alarme({ medicamentoNome, dose, onFechar }) {
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // Gera um "bipe" curto usando um osciloscópio de áudio nativo do navegador
    function tocarBipe() {
      const oscilador = audioContext.createOscillator();
      const volume = audioContext.createGain();

      oscilador.connect(volume);
      volume.connect(audioContext.destination);

      oscilador.type = 'sine';
      oscilador.frequency.value = 880; // frequência do som (nota musical A5)
      volume.gain.value = 0.3;

      oscilador.start();
      oscilador.stop(audioContext.currentTime + 0.3);
    }

    tocarBipe();
    intervalRef.current = setInterval(tocarBipe, 1000);

    // Ao desmontar o componente (quando fechar o alarme), para tudo
    return () => {
      clearInterval(intervalRef.current);
      audioContext.close();
    };
  }, []);

  function handleFechar() {
    clearInterval(intervalRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    onFechar();
  }

  return (
    <div style={estiloFundo}>
      <div style={estiloCaixa}>
        <h2>⏰ Hora do remédio!</h2>
        <p>
          Faltam 5 minutos para tomar: <strong>{medicamentoNome}</strong>
          {dose && ` (${dose})`}
        </p>
        <button onClick={handleFechar} style={estiloBotao}>
          OK
        </button>
      </div>
    </div>
  );
}

const estiloFundo = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const estiloCaixa = {
  background: 'white',
  padding: '30px',
  borderRadius: '8px',
  textAlign: 'center',
  maxWidth: '400px',
};

const estiloBotao = {
  marginTop: '15px',
  padding: '10px 30px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default Alarme;