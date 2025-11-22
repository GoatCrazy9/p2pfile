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

  const totalEvents = logs.length;
  const lastEvent = logs[logs.length - 1]?.timestamp ?? 'Sin eventos';

  return (
    <main className="min-h-screen bg-[#F5F5FB] text-slate-900">
      <div className="flex min-h-screen max-w-6xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 border-r border-slate-200 bg-white/90">
          <div className="flex flex-col w-full p-5 gap-8">
            <div>
              <span className="text-xl font-semibold text-slate-900">P2P Dash</span>
              <p className="text-xs text-slate-500 mt-1">
                Transferencia directa de archivos.
              </p>
            </div>

            <nav className="flex-1 space-y-1 text-sm">
              <p className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                Panel
              </p>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Transferencias
              </button>

              <p className="mt-4 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                Sesión
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600">
                  <span>Rol actual</span>
                  <span className="font-semibold text-slate-900">
                    {role ?? 'sin definir'}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600">
                  <span>Estado</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${
                      connected
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        connected ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    {connected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </div>

              <p className="mt-4 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                Métricas
              </p>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span>Eventos</span>
                  <span className="font-semibold">{totalEvents}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span>Último evento</span>
                  <span className="truncate max-w-[90px] text-[10px] text-slate-500">
                    {lastEvent}
                  </span>
                </div>
              </div>
            </nav>

            <div className="text-[11px] text-slate-400">
              P2P File Transfer no almacena los archivos en el servidor; solo coordina la conexión.
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <section className="flex-1 px-4 md:px-8 py-6 md:py-8">
          {/* Top bar */}
          <header className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-slate-400">Dashboard / Transferencias</p>
              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                  Panel de transferencia
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[11px] font-medium text-indigo-600 border border-indigo-100">
                  Beta
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configura la sala, envía archivos y supervisa el estado de la sesión en tiempo real.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Sesión actual</p>
                <p className="text-xs text-slate-500">
                  {connected ? 'Sesión activa' : 'A la espera de conexión'}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200" />
            </div>
          </header>

          {/* Tarjetas superiores */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-500">Archivos enviados</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {logs.filter(l => l.message.includes('Envío completado')).length}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">En esta sesión.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-500">Archivos recibidos</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {receivedFiles.length}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Guardados localmente.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-500">Estado</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {connected ? 'Conectado' : 'Desconectado'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Usa el mismo ID de sala en ambos lados.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-500">Modo</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {role ?? 'Sin definir'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Elige emisor o receptor para iniciar.
              </p>
            </div>
          </div>

          {/* Bloque sala + acciones */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 mb-6">
            <div className="grid md:grid-cols-[2fr,1.5fr] gap-4 md:gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  ID de sala
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={e => setRoomId(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Ejemplo: abc123 (vacío para generar uno)"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Usa el mismo ID en ambos navegadores para establecer la conexión.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={joinRoomAsCaller}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    Crear sala (emisor)
                  </button>
                  <button
                    onClick={joinRoomAsReceiver}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    Unirse como receptor
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Abre esta página en otro navegador o dispositivo y pega el mismo ID para vincularlos.
                </p>
              </div>
            </div>
          </div>

          {/* Sección principal: envío / recepción */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Envío */}
            <section className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Enviar archivo
                </h2>
                <span className="text-[11px] text-slate-500">
                  Tamaño recomendado: &lt; 100 MB
                </span>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-slate-800">
                  Seleccionar archivo
                </span>
                <input
                  type="file"
                  onChange={e => handleFileSelect(e.target.files?.[0] ?? null)}
                  className="mt-2 block w-full text-sm text-slate-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                />
              </label>

              {selectedFileName && (
                <p className="text-xs text-slate-600">
                  Archivo seleccionado:{' '}
                  <span className="font-medium text-slate-900">
                    {selectedFileName}
                  </span>
                </p>
              )}

              <button
                onClick={sendFile}
                disabled={!currentFile || !connected}
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                Enviar archivo
              </button>

              {showSendProgress && (
                <div className="mt-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span>Progreso de envío</span>
                    <span>{sendProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-[width] duration-150"
                      style={{ width: `${sendProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Recepción */}
            <section className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Recepción
              </h2>

              {showReceiveProgress && (
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span>Progreso de recepción</span>
                    <span>{receiveProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-[width] duration-150"
                      style={{ width: `${receiveProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {receivedFiles.length > 0 ? (
                <div>
                  <h3 className="text-xs font-medium text-slate-800 mb-2">
                    Historial de archivos recibidos
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-800">
                    {receivedFiles.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between border border-slate-200 rounded-xl px-2 py-1 bg-slate-50"
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

          {/* Registro */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Registro de eventos
              </h2>
              <button
                onClick={clearLog}
                className="px-3 py-1 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Limpiar registro
              </button>
            </div>

            <div className="bg-slate-950 text-slate-100 font-mono text-[11px] p-2 rounded-xl max-h-64 overflow-y-auto border border-slate-800">
              {logs.length === 0 ? (
                <div className="text-slate-400">
                  No hay eventos registrados aún.
                </div>
              ) : (
                logs.map((l, i) => (
                  <div key={i}>
                    [{l.timestamp}] {l.message}
                  </div>
                ))
              )}
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              El registro solo se mantiene en esta pestaña del navegador y se limpia al recargar.
            </p>
          </section>

          <footer className="text-center text-[11px] text-slate-500 mt-5">
            P2P File Transfer envía los archivos directamente entre navegadores
            mediante WebRTC; el servidor de señalización solo coordina la sesión.
          </footer>
        </section>
      </div>
    </main>
  );
}
