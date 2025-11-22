'use client';

import type { ReceivedFile } from '@/types';

interface ReceiverPanelProps {
  receiverId: string;
  senderIdInput: string;
  setSenderIdInput: (value: string) => void;
  receiverConnected: boolean;
  receiveProgress: number;
  showReceiveProgress: boolean;
  receivedFiles: ReceivedFile[];
  copyReceiverId: () => void;
  connectAsReceiver: () => void;
  downloadFile: (blob: Blob, fileName: string) => void;
}

export default function ReceiverPanel({
  receiverId,
  senderIdInput,
  setSenderIdInput,
  receiverConnected,
  receiveProgress,
  showReceiveProgress,
  receivedFiles,
  copyReceiverId,
  connectAsReceiver,
  downloadFile,
}: ReceiverPanelProps) {
  function handleDownload(file: ReceivedFile): void {
    const blob = new Blob(file.chunks as BlobPart[], { type: 'application/octet-stream' });
    downloadFile(blob, file.fileName);
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold text-blue-600 mb-4">📥 Receptor</h2>
      <div
        className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
          receiverConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {receiverConnected ? 'Conectado' : 'Desconectado'}
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-sm mb-2">Tu ID (compartir con emisor):</label>
        <textarea
          readOnly
          value={receiverId}
          className="w-full p-2 border rounded text-xs font-mono bg-gray-50"
          rows={3}
        />
        <button
          onClick={copyReceiverId}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Copiar ID
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-sm mb-2">ID del Emisor:</label>
        <textarea
          value={senderIdInput}
          onChange={(e) => setSenderIdInput(e.target.value)}
          placeholder="Pega aquí el ID del emisor..."
          className="w-full p-2 border rounded text-xs font-mono"
          rows={3}
        />
      </div>

      <button
        onClick={connectAsReceiver}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold mb-4"
      >
        Esperar Conexión
      </button>

      {showReceiveProgress && (
        <div className="border-t pt-4">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Recibiendo archivo...</span>
            <span>{receiveProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${receiveProgress}%` }}
            />
          </div>
        </div>
      )}

      {receivedFiles.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <label className="block font-semibold text-sm mb-2">Archivos Recibidos:</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {receivedFiles.map((file, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded text-sm">
                <div>
                  <div className="font-semibold">{file.fileName}</div>
                  <div className="text-xs text-gray-600">
                    {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                >
                  Re-descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
