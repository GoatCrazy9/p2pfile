export interface ReceivedFile {
  fileName: string;
  fileSize: number;
  chunks: ArrayBuffer[];
  totalReceived: number;
}

export interface SendingFile {
  id: string;
  name: string;
  size: number;
  sent: number;
}

export interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: string;
}

export interface PeerMessage {
  type: string;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  data?: ArrayBuffer;
  chunkIndex?: number;
  totalChunks?: number;
  peerId?: string;
}

export interface PeerInfo {
  peer: import('simple-peer').Instance;
  connected: boolean;
}
