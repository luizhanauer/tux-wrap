import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildAndDownloadZip } from './ZipService';
import type { AppConfig } from '../domain/types';
import * as FileSaver from 'file-saver';

// Mock do file-saver para impedir downloads reais no terminal
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

describe('ZipService', () => {
  const baseConfig: AppConfig = {
    appName: 'Test App',
    binName: 'test-app',
    description: 'A simple test application',
    terminal: false,
    startupNotify: true,
    categories: ['Utility'],
    keywords: [],
    includeService: false,
    serviceUser: 'root',
    serviceGroup: 'root',
    serviceRuntime: 'test-app',
    serviceRuntimeMode: '0770',
    serviceWorkingDirectory: '',
    systemdAfter: '',
    systemdWants: '',
    serviceType: 'simple',
    restartPolicy: 'always',
    restartSec: 5,
    environmentVars: ''
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve rejeitar e lançar um erro se o binName estiver vazio', async () => {
    const invalidConfig = { ...baseConfig, binName: '' };
    
    // Testa a validação (Early Return)
    await expect(buildAndDownloadZip(invalidConfig, null)).rejects.toThrowError(
      "Nome do binário ausente."
    );
    
    // Garante que o saveAs nunca foi acionado
    expect(FileSaver.saveAs).not.toHaveBeenCalled();
  });

  it('deve gerar o ZIP e chamar saveAs com o nome correto para XDG puro', async () => {
    await buildAndDownloadZip(baseConfig, null);

    // Validação limpa: garantimos que foi chamado 1x e checamos os tipos passados
    expect(FileSaver.saveAs).toHaveBeenCalledOnce();
    expect(FileSaver.saveAs).toHaveBeenCalledWith(
      expect.any(Blob), 
      'test-app-template.zip'
    );
  });

  it('deve processar o arquivo de ícone quando fornecido', async () => {
    const fakeIcon = new File(['fake-image-content'], 'icon.png', { type: 'image/png' });
    
    await buildAndDownloadZip(baseConfig, fakeIcon);

    expect(FileSaver.saveAs).toHaveBeenCalledOnce();
    expect(FileSaver.saveAs).toHaveBeenCalledWith(
      expect.any(Blob), 
      'test-app-template.zip'
    );
  });

  it('deve processar a estrutura com Systemd sem falhar', async () => {
    const systemdConfig = { ...baseConfig, includeService: true };
    
    await buildAndDownloadZip(systemdConfig, null);

    expect(FileSaver.saveAs).toHaveBeenCalledOnce();
    expect(FileSaver.saveAs).toHaveBeenCalledWith(
      expect.any(Blob), 
      'test-app-template.zip'
    );
  });
});