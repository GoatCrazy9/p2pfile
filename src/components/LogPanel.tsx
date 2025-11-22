'use client';

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: string;
}

interface LogPanelProps {
  logs: LogEntry[];
  clearLog: () => void;
}

export default function LogPanel({ logs, clearLog }: LogPanelProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h3 className="text-lg font-bold mb-4">📋 Log del Sistema</h3>
      <div className="bg-gray-900 text-gray-300 p-4 rounded font-mono text-xs max-h-64 overflow-y-auto">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`mb-1 ${
              log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-blue-400'
            }`}
          >
            [{log.timestamp}] {log.message}
          </div>
        ))}
      </div>
      <button
        onClick={clearLog}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
      >
        Limpiar Log
      </button>
    </div>
  );
}
