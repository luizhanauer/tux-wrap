export interface AppConfig {
  // Comum
  appName: string;
  binName: string;
  description: string;

  // XDG Desktop Options
  terminal: boolean;
  startupNotify: boolean;
  categories: string[];
  keywords: string[];

  // Systemd Options
  includeService: boolean;
  serviceUser: string;
  serviceGroup: string;
  serviceRuntime: string;
  serviceRuntimeMode: string; // Novo: Permissão Octal
  serviceWorkingDirectory: string; // Novo: Contexto de execução
  systemdAfter: string; // Novo: Ordem de boot
  systemdWants: string; // Novo: Dependências flexíveis
  serviceType: 'simple' | 'exec' | 'notify' | 'oneshot' | 'forking';
  restartPolicy: 'no' | 'always' | 'on-success' | 'on-failure' | 'on-abnormal';
  restartSec: number;
  environmentVars: string;
}

export const DESKTOP_CATEGORIES = [
  'Utility', 'Development', 'Game', 'Network', 'System', 'AudioVideo', 'Graphics', 'Office'
];