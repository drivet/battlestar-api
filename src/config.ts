function getEnv(key: string) {
  return process.env[key];
}

export function getAuthTokenPublicKey(): string {
  return getEnv('AUTH_TOKEN_PUBLIC_KEY') || 'password';
}

export function getAuthTokenPrivateKey(): string {
  return getEnv('AUTH_TOKEN_PRIVATE_KEY') || 'password';
}

export function getTablesApiBase(): string {
  return getEnv('TABLES_API_BASE') || 'http://localhost:3001';
}

export function getTablesApiKey(): string {
  return getEnv('TABLES_API_KEY') || 'password';
}

export function getPort(): number {
  return Number(getEnv('PORT')) || 3001;
}
