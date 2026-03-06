import { describe, it, expect } from 'vitest';
import type { AppConfig } from '../domain/types';
import { 
  generateReadme, 
  generateAppInstall, 
  generateDesktop, 
  generateServiceFile 
} from './TemplateGenerator';

describe('TemplateGenerator Service', () => {
  // Fixture base imutável para os testes
  const baseConfig: AppConfig = {
    appName: 'Test App',
    binName: 'test-app',
    description: 'A simple test application',
    terminal: false,
    startupNotify: true,
    categories: ['Utility', 'Network'],
    keywords: ['test', 'cli'],
    includeService: false,
    serviceUser: 'root',
    serviceGroup: 'linux-updater',
    serviceRuntime: 'test-app-runtime',
    serviceRuntimeMode: '0770',
    serviceWorkingDirectory: '/opt/test-app',
    systemdAfter: 'network-online.target',
    systemdWants: '',
    serviceType: 'simple',
    restartPolicy: 'always',
    restartSec: 5,
    environmentVars: 'ENV=test'
  };

  describe('generateDesktop()', () => {
    it('deve gerar um arquivo .desktop válido com categorias e keywords formatadas', () => {
      const result = generateDesktop(baseConfig);

      expect(result).toContain('Name=Test App');
      expect(result).toContain('Exec="$HOME/.local/bin/test-app"');
      expect(result).toContain('Icon=$HOME/.local/share/icons/test-app.png');
      expect(result).toContain('Categories=Utility;Network;');
      expect(result).toContain('Keywords=test;cli;');
      expect(result).toContain('Terminal=false');
    });

    it('deve lidar corretamente com arrays de categories e keywords vazios', () => {
      const emptyConfig = { ...baseConfig, categories: [], keywords: [] };
      const result = generateDesktop(emptyConfig);

      expect(result).toContain('Categories=Utility;'); // Fallback definido no domínio
      expect(result).not.toContain('Keywords='); // Não deve renderizar a linha se vazio
    });
  });

  describe('generateAppInstall()', () => {
    it('deve gerar o script de instalação mapeando os diretórios XDG corretamente', () => {
      const result = generateAppInstall(baseConfig);

      expect(result).toContain('FINAL_BIN="$BIN_DIR/test-app"');
      expect(result).toContain('cp "bin/test-app" "$FINAL_BIN"');
      expect(result).toContain('cp "test-app.desktop" "$DESKTOP_FILE"');
      expect(result).toContain('gtk-update-icon-cache -f -t "$ICONS_DIR"');
    });
  });

  describe('generateReadme()', () => {
    it('NÃO deve incluir instruções de Systemd se includeService for false', () => {
      const result = generateReadme(baseConfig);

      expect(result).toContain('# Template de Instalação: Test App');
      expect(result).not.toContain('Instalação do Serviço (Daemon)');
      expect(result).not.toContain('sudo ./install-service.sh');
    });

    it('DEVE incluir instruções de Systemd se includeService for true', () => {
      const serviceConfig = { ...baseConfig, includeService: true };
      const result = generateReadme(serviceConfig);

      // CORREÇÃO AQUI: Ajustado para refletir o texto exato gerado pelo TemplateGenerator.ts
      expect(result).toContain('Instalação do Serviço (Daemon)');
      expect(result).toContain('sudo ./install-service.sh');
      expect(result).toContain('sudo ./uninstall-service.sh');
    });
  });

  describe('generateServiceFile()', () => {
    it('deve renderizar todas as linhas quando todos os campos opcionais estiverem preenchidos', () => {
      const result = generateServiceFile(baseConfig);

      expect(result).toContain('Description=Test App Service (Daemon)');
      expect(result).toContain('After=network-online.target');
      expect(result).toContain('WorkingDirectory=/opt/test-app');
      expect(result).toContain('Environment="ENV=test"');
      expect(result).toContain('RuntimeDirectoryMode=0770');
      expect(result).toContain('Restart=always');
      expect(result).toContain('RestartSec=5');
    });

    it('deve OMITIR linhas opcionais (After, Wants, WorkingDirectory, Environment) usando o filtro booleano se estiverem vazias', () => {
      const cleanConfig = { 
        ...baseConfig, 
        systemdAfter: '', 
        systemdWants: '', 
        serviceWorkingDirectory: '', 
        environmentVars: '',
        restartPolicy: 'no' as const
      };
      const result = generateServiceFile(cleanConfig);

      // Não deve ter rastros das diretivas vazias
      expect(result).not.toContain('After=');
      expect(result).not.toContain('Wants=');
      expect(result).not.toContain('WorkingDirectory=');
      expect(result).not.toContain('Environment=');
      expect(result).not.toContain('RestartSec='); // Omitido pois restartPolicy é 'no'
      
      // Mas as essenciais continuam lá
      expect(result).toContain('Type=simple');
      expect(result).toContain('RuntimeDirectory=test-app-runtime');
      expect(result).toContain('Restart=no');
    });
  });
});