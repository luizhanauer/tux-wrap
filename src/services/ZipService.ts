import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { AppConfig } from '../domain/types';
import { 
  generateReadme, generateAppInstall, generateUninstall, generateDesktop,
  generateServiceFile, generateServiceInstall, generateServiceUninstall
} from './TemplateGenerator';

export const buildAndDownloadZip = async (config: AppConfig, iconFile: File | null): Promise<void> => {
  if (!config.binName) {
    throw new Error("Nome do binário ausente.");
  }

  const zip = new JSZip();

  // Estrutura Base (Domínio do Usuário)
  zip.file("README.md", generateReadme(config));
  zip.folder("bin")?.file(config.binName, "# Substitua este arquivo pelo seu executável real.\n");
  zip.file("install-app.sh", generateAppInstall(config));
  zip.file("uninstall.sh", generateUninstall(config));
  zip.file(`${config.binName}.desktop`, generateDesktop(config));

  // Ícone
  if (iconFile) {
    // CORREÇÃO: Converter o File para ArrayBuffer garante 100% de compatibilidade 
    // com o JSZip tanto no Browser real quanto no Node.js (Vitest).
    const iconBuffer = await iconFile.arrayBuffer();
    zip.file("icon.png", iconBuffer);
  }

  // Estrutura Systemd (Domínio do Sistema)
  if (config.includeService) {
    zip.file(`${config.binName}.service`, generateServiceFile(config));
    zip.file("install-service.sh", generateServiceInstall(config));
    zip.file("uninstall-service.sh", generateServiceUninstall(config));
  }

  // Gera o Blob final e aciona o download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${config.binName}-template.zip`);
};