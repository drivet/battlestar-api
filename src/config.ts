function getEnv(key: string) {
  return process.env[key];
}

export function getTablesApiBase(): string {
  return getEnv('TABLES_API_BASE') || 'http://localhost:3001';
}

export function getTablesApiKey(): string {
  return getEnv('TABLES_API_KEY') || 'password';
}

export function getProfilesApiBase(): string {
  return getEnv('PROFILES_API_BASE') || 'http://localhost:3100';
}

export function getProfilesApiKey(): string {
  return getEnv('PROFILES_API_KEY') || 'password';
}

export function getPort(): number {
  return Number(getEnv('PORT')) || 3001;
}
