export type BackendPayload = {
  message?: string;
  result?: boolean;
  [key: string]: unknown;
};

export class BackendError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message || 'Backend error');
    this.name = 'BackendError';
    this.status = status;
    this.message = message;
  }
}
