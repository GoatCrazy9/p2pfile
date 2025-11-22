'use client';

interface SenderPanelProps {
  senderId: string;
  receiverIdInput: string;
  setReceiverIdInput: (value: string) => void;
  currentFile: File | null;
  setCurrentFile: (file: File | null) => void;
  selectedFileName: string;
  sendProgress: number;
  senderConnected: boolean;
  showSendProgress: boolean;
  copySenderId: () => void;
  connectToReceiver: () => void;
  sendFile: () => void;
}

export default function SenderPanel({
  senderId,
  receiverIdInput,
  setReceiverIdInput,
  currentFile,
  setCurrentFile,
  selectedFileName,
  sendProgress,
  senderConnected,
  showSendProgress,
  copySenderId,
  connectToReceiver,
  sendFile,
}: SenderPanelProps) {
  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentFile(file);
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold text-blue-600 mb-4">📤 Emisor</h2>
      <div
        className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
          senderConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {senderConnected ? 'Conectado' : 'Desconectado'}
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-sm mb-2">Tu ID (compartir con receptor):</label>
        <textarea
          readOnly
          value={senderId}
          className="w-full p-2 border rounded text-xs font-mono bg-gray-50"
          rows={3}
        />
        <button
          onClick={copySenderId}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Copiar ID
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-sm mb-2">ID del Receptor:</label>
        <textarea
          value={receiverIdInput}
          onChange={(e) => setReceiverIdInput(e.target.value)}
          placeholder="Pega aquí el ID del receptor..."
          className="w-full p-2 border rounded text-xs font-mono"
          rows={3}
        />
      </div>

      <button
        onClick={connectToReceiver}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold mb-4"
      >
        Conectar con Receptor
      </button>

      <div className="border-t pt-4">
        <label className="block font-semibold text-sm mb-2">Selecciona archivo para enviar:</label>
        <input type="file" onChange={handleFileSelect} className="w-full mb-2" />
        {selectedFileName && <div className="text-sm text-gray-700 mb-2">✓ {selectedFileName}</div>}
        <button
          onClick={sendFile}
          disabled={!currentFile || !senderConnected}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          Enviar Archivo
        </button>

        {showSendProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Enviando archivo...</span>
              <span>{sendProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${sendProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
