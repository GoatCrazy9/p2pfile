'use client';

import { useP2PFileTransfer } from '@/hooks/useP2PFileTransfer';

export default function Home() {
  const {
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
  } = useP2PFileTransfer();

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 text-center">
            P2P File Transfer
          </h1>
          <p className="mt-2 text-sm text-slate-500 text-center">
            Transferencia de archivos punto a punto usando WebRTC y un servidor de señalización.
          </p>
        </header>

        {/* Room / Estado */}
        <section className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ID de sala
              </label>
              <input
                type="text"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Ejemplo: abc123 (vacío para generar uno)"
              />
              <p className="mt-1 text-xs text-slate-500">
                Ambos usuarios deben utilizar el mismo ID de sala para conectarse.
              </p>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={joinRoomAsCaller}
                className="flex-1 md:flex-none md:min-w-[150px] inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Crear sala (emisor)
              </button>
              <button
                onClick={joinRoomAsReceiver}
                className="flex-1 md:flex-none md:min-w-[170px] inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Unirse como receptor
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span>
              Rol actual:{' '}
              <span className="font-medium text-slate-800">
                {role ?? 'sin definir'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              Estado de conexión:
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                  connected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full mr-1 ${
                    connected ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                {connected ? 'Conectado' : 'Desconectado'}
              </span>
            </span>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Envío */}
          <section className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Enviar archivo
            </h2>

            <label className="block">
              <span className="text-sm text-slate-700">Seleccionar archivo</span>
              <input
                type="file"
                onChange={e => handleFileSelect(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </label>

            {selectedFileName && (
              <p className="mt-2 text-xs text-slate-600">
                Archivo seleccionado: <span className="font-medium">{selectedFileName}</span>
              </p>
            )}

            <button
              onClick={sendFile}
              disabled={!currentFile || !connected}
              className="mt-4 w-full inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Enviar archivo
            </button>

            {showSendProgress && (
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Progreso de envío</span>
                  <span>{sendProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-[width] duration-150"
                    style={{ width: `${sendProgress}%` }}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Recepción */}
          <section className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Recepción
            </h2>

            {showReceiveProgress && (
              <div className="mb-4">
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Progreso de recepción</span>
                  <span>{receiveProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-[width] duration-150"
                    style={{ width: `${receiveProgress}%` }}
                  />
                </div>
              </div>
            )}

            {receivedFiles.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-slate-800 mb-2">
                  Historial de archivos recibidos
                </h3>
                <ul className="space-y-1 text-xs text-slate-700">
                  {receivedFiles.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border border-slate-200 rounded px-2 py-1"
                    >
                      <span className="truncate mr-2">{f.fileName}</span>
                      <span className="whitespace-nowrap text-slate-500">
                        {(f.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Aún no se han recibido archivos en esta sesión.
              </p>
            )}
          </section>
        </div>

        {/* Log */}
        <section className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-900">Registro de eventos</h2>
            <button
              onClick={clearLog}
              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Limpiar registro
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 font-mono text-[11px] p-2 rounded-md max-h-64 overflow-y-auto border border-slate-800">
            {logs.length === 0 ? (
              <div className="text-slate-400">No hay eventos registrados aún.</div>
            ) : (
              logs.map((l, i) => (
                <div key={i}>
                  [{l.timestamp}] {l.message}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
