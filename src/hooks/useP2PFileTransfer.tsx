import { useState, useEffect, useRef, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { io, Socket } from 'socket.io-client';

const CHUNK_SIZE = 64 * 1024;
const STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

type Role = 'caller' | 'receiver';

interface ReceivedFile {
  fileName: string;
  fileSize: number;
  chunks: ArrayBuffer[];
  totalReceived: number;
}

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: string;
}

export function useP2PFileTransfer() {
  const [roomId, setRoomId] = useState('');
  const [role, setRole] = useState<Role | null>(null);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [sendProgress, setSendProgress] = useState(0);
  const [receiveProgress, setReceiveProgress] = useState(0);
  const [connected, setConnected] = useState(false);
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [showSendProgress, setShowSendProgress] = useState(false);
  const [showReceiveProgress, setShowReceiveProgress] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const receivingFileRef = useRef<ReceivedFile | null>(null);
  const roleRef = useRef<Role | null>(null);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  const addLog = useCallback(
    (message: string, type: 'info' | 'success' | 'error' = 'info') => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, { message, type, timestamp }]);
    },
    []
  );

  const createPeer = useCallback(
    (initiator: boolean) => {
      if (!socketRef.current) {
        addLog('Socket no inicializado', 'error');
        return;
      }
      if (!roomId.trim()) {
        addLog('roomId vacío. Crea o únete a una sala primero.', 'error');
        return;
      }

      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }

      const peer = new SimplePeer({
        initiator,
        trickle: false,
        config: { iceServers: STUN_SERVERS },
      });

      peerRef.current = peer;

      peer.on('signal', signal => {
        addLog('Enviando señal al otro peer...', 'info');
        socketRef.current!.emit('signal', roomId, signal);
      });

      peer.on('connect', () => {
        addLog('✓ Conexión P2P establecida', 'success');
        setConnected(true);
      });

      peer.on('data', rawData => {
  console.log('DATA RECIBIDA', rawData);

  // 1) Si viene como Uint8Array / ArrayBuffer, intentamos ver si es JSON
  

  if (rawData instanceof Uint8Array || rawData instanceof ArrayBuffer) {
    const uint8 =
      rawData instanceof Uint8Array
        ? rawData
        : new Uint8Array(rawData as ArrayBuffer);

    // Intentar decodificar como texto
    const text = new TextDecoder().decode(uint8);

    // Si parece JSON (empieza por { y termina en }), lo tratamos como mensaje de control
    if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
      try {
        console.log('DATA DECODIFICADA COMO TEXTO JSON', text);
        const msg = JSON.parse(text);

        if (msg.type === 'file_start') {
          const file: ReceivedFile = {
            fileName: msg.fileName,
            fileSize: msg.fileSize,
            chunks: [],
            totalReceived: 0,
          };
          receivingFileRef.current = file;
          setShowReceiveProgress(true);
          addLog(`Recibiendo archivo: ${msg.fileName}`, 'info');
          return;
        }

        if (msg.type === 'file_complete') {
          console.log('FILE_COMPLETE RECIBIDO', msg);
          if (!receivingFileRef.current) return;
          const file = receivingFileRef.current;
          const blob = new Blob(file.chunks, {
            type: 'application/octet-stream',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.fileName;
          a.click();
          URL.revokeObjectURL(url);
          setReceivedFiles(prev => [...prev, file]);
          setShowReceiveProgress(false);
          setReceiveProgress(0);
          receivingFileRef.current = null;
          addLog(`✓ Archivo recibido: ${file.fileName}`, 'success');
          return;
        }
      } catch (e) {
        console.error('Error parseando JSON de control', e, text);
        // si falla, seguimos tratándolo como binario normal
      }
    }

    // Si llegamos aquí, lo tratamos como chunk binario de archivo
    console.log('DATA ES BINARIO (chunk)', uint8);
    if (!receivingFileRef.current) return;
    const file = receivingFileRef.current;
    const arrayBuffer = uint8.buffer.slice(
  uint8.byteOffset,
  uint8.byteOffset + uint8.byteLength
) as ArrayBuffer;
file.chunks.push(arrayBuffer);

    const pct = Math.min(
      Math.round((file.totalReceived / file.fileSize) * 100),
      100
    );
    setReceiveProgress(pct);
    return;
  }

  // 2) Por si algún navegador sí manda string puro
  if (typeof rawData === 'string') {
    console.log('DATA ES STRING', rawData);
    try {
      const msg = JSON.parse(rawData);
      if (msg.type === 'file_start') {
        const file: ReceivedFile = {
          fileName: msg.fileName,
          fileSize: msg.fileSize,
          chunks: [],
          totalReceived: 0,
        };
        receivingFileRef.current = file;
        setShowReceiveProgress(true);
        addLog(`Recibiendo archivo: ${msg.fileName}`, 'info');
      } else if (msg.type === 'file_complete') {
        if (!receivingFileRef.current) return;
        const file = receivingFileRef.current;
        const blob = new Blob(file.chunks, {
          type: 'application/octet-stream',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.fileName;
        a.click();
        URL.revokeObjectURL(url);
        setReceivedFiles(prev => [...prev, file]);
        setShowReceiveProgress(false);
        setReceiveProgress(0);
        receivingFileRef.current = null;
        addLog(`✓ Archivo recibido: ${file.fileName}`, 'success');
      }
    } catch (e) {
      console.error('Error parseando string JSON', e, rawData);
    }
  }
});



      peer.on('close', () => {
        addLog('Conexión P2P cerrada', 'info');
        setConnected(false);
        peerRef.current = null;
      });

      peer.on('error', err => {
        addLog(`Error P2P: ${err.message}`, 'error');
      });
    },
    [addLog, roomId]
  );

  // Socket: se crea SOLO UNA VEZ
  useEffect(() => {
    const socket = io('https://signaling-server-nf8c.onrender.com', { autoConnect: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      addLog('Conectado al servidor de señalización', 'success');
    });

    socket.on('signal', signal => {
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    socket.on('peer-joined', () => {
      addLog('Otro peer se unió a la sala', 'info');
      if (roleRef.current === 'caller') {
        createPeer(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [addLog, createPeer]);

  const joinRoomAsCaller = () => {
    const id = roomId.trim() || Math.random().toString(36).slice(2, 8);
    setRoomId(id);
    socketRef.current?.emit('join', id);
    setRole('caller');
    addLog(`Sala creada: ${id}. Comparte este ID con el receptor.`, 'success');
  };

  const joinRoomAsReceiver = () => {
    if (!roomId.trim()) {
      alert('Ingresa el ID de la sala');
      return;
    }
    socketRef.current?.emit('join', roomId);
    setRole('receiver');
    addLog(`Uniéndote a sala ${roomId} como receptor.`, 'success');
    createPeer(false);
  };

  const handleFileSelect = (file: File | null) => {
    setCurrentFile(file);
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setSelectedFileName(`${file.name} (${sizeMB} MB)`);
      addLog(`Archivo seleccionado: ${file.name} (${sizeMB} MB)`, 'info');
    } else {
      setSelectedFileName('');
    }
  };

  const sendFile = () => {
    if (!currentFile) {
      alert('Selecciona un archivo primero');
      return;
    }
    if (!connected || !peerRef.current) {
      alert('No hay conexión P2P activa');
      return;
    }

    const peer = peerRef.current;
    const fileId = 'file_' + Date.now();

    peer.send(
      JSON.stringify({
        type: 'file_start',
        fileId,
        fileName: currentFile.name,
        fileSize: currentFile.size,
      })
    );

    setShowSendProgress(true);
    setSendProgress(0);

    const reader = new FileReader();
    let offset = 0;
    const totalChunks = Math.ceil(currentFile.size / CHUNK_SIZE);

    const sendChunk = () => {
      if (offset >= currentFile.size) {
        peer.send(
          JSON.stringify({
            type: 'file_complete',
            fileId,
          })
        );
        addLog('✓ Archivo enviado completamente', 'success');
        setShowSendProgress(false);
        setSendProgress(0);
        return;
      }

      const slice = currentFile.slice(offset, offset + CHUNK_SIZE);
      reader.onload = e => {
        const chunkIndex = Math.floor(offset / CHUNK_SIZE);
        peer.send(e.target!.result as ArrayBuffer);
        offset += CHUNK_SIZE;
        const pct = Math.min(
          Math.round((offset / currentFile.size) * 100),
          100
        );
        setSendProgress(pct);
        addLog(
          `Chunk ${chunkIndex + 1}/${totalChunks} enviado (${pct}%)`,
          'info'
        );
        setTimeout(sendChunk, 10);
      };
      reader.readAsArrayBuffer(slice);
    };

    sendChunk();
  };

  const clearLog = () => setLogs([]);

  return {
    roomId,
    setRoomId,
    role,
    logs,
    currentFile,
    selectedFileName,
    sendProgress,
    receiveProgress,
    connected,
    receivedFiles,
    showSendProgress,
    showReceiveProgress,
    joinRoomAsCaller,
    joinRoomAsReceiver,
    handleFileSelect,
    sendFile,
    clearLog,
  };
}
