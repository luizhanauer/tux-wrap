import type { AppConfig } from '../domain/types';

// ... (generateReadme, generateAppInstall, generateUninstall, generateDesktop permanecem iguais)

export const generateReadme = (cfg: AppConfig): string => {
  const serviceInstructions = cfg.includeService 
    ? `\n## Instalação do Serviço (Daemon)\nPara instalar o serviço em background, execute como root:\n1. Dê permissão: \`chmod +x install-service.sh uninstall-service.sh\`\n2. Instale: \`sudo ./install-service.sh\`\n` 
    : '';

  const serviceUninstall = cfg.includeService 
    ? `Para remover o serviço do sistema: \`sudo ./uninstall-service.sh\`` 
    : '';

  return `# Template de Instalação: ${cfg.appName}

## Instalação do Aplicativo (Ambiente do Usuário)
1. Coloque o seu arquivo executável real dentro da pasta \`bin/\` e garanta que o nome seja \`${cfg.binName}\`.
2. (Opcional) Substitua o \`icon.png\` pelo ícone da sua aplicação.
3. Dê permissão de execução: \`chmod +x install-app.sh uninstall.sh\`
4. Execute a instalação: \`./install-app.sh\`
${serviceInstructions}
## Desinstalação
Para remover a aplicação do seu usuário: \`./uninstall.sh\`
${serviceUninstall}
`;
};

export const generateAppInstall = (cfg: AppConfig): string => {
  return `#!/bin/bash
set -e

BIN_DIR="$HOME/.local/bin"
APPS_DIR="$HOME/.local/share/applications"
ICONS_DIR="$HOME/.local/share/icons"
FINAL_BIN="$BIN_DIR/${cfg.binName}"
DESKTOP_FILE="$APPS_DIR/${cfg.binName}.desktop"

echo ">>> 🚀 Instalando ${cfg.appName}..."

mkdir -p "$BIN_DIR" "$APPS_DIR" "$ICONS_DIR"

if [ ! -f "bin/${cfg.binName}" ]; then
    echo "❌ Erro: Binário 'bin/${cfg.binName}' não encontrado."
    exit 1
fi

cp "bin/${cfg.binName}" "$FINAL_BIN"
chmod +x "$FINAL_BIN"

if [ -f "icon.png" ]; then
    cp "icon.png" "$ICONS_DIR/${cfg.binName}.png"
fi

cp "${cfg.binName}.desktop" "$DESKTOP_FILE"
chmod +x "$DESKTOP_FILE"

update-desktop-database "$APPS_DIR" 2>/dev/null || true
gtk-update-icon-cache -f -t "$ICONS_DIR" 2>/dev/null || true

echo "✅ App instalado no ambiente do usuário."
`;
};

export const generateUninstall = (cfg: AppConfig): string => {
  return `#!/bin/bash
set -e

echo ">>> 🗑️ Removendo ${cfg.appName}..."

rm -f "$HOME/.local/bin/${cfg.binName}"
rm -f "$HOME/.local/share/applications/${cfg.binName}.desktop"
rm -f "$HOME/.local/share/icons/${cfg.binName}.png"

update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true
gtk-update-icon-cache -f -t "$HOME/.local/share/icons" 2>/dev/null || true

echo "✅ App removido do ambiente do usuário."
`;
};

export const generateDesktop = (cfg: AppConfig): string => {
  const cats = cfg.categories.length > 0 ? `${cfg.categories.join(';')};` : 'Utility;';
  const keys = cfg.keywords.length > 0 ? `${cfg.keywords.join(';')};` : '';

  return `[Desktop Entry]
Type=Application
Name=${cfg.appName}
Comment=${cfg.description}
Exec="$HOME/.local/bin/${cfg.binName}"
Icon=$HOME/.local/share/icons/${cfg.binName}.png
Terminal=${cfg.terminal ? 'true' : 'false'}
Categories=${cats}
${keys ? `Keywords=${keys}` : ''}
StartupNotify=${cfg.startupNotify ? 'true' : 'false'}
StartupWMClass=${cfg.binName}
`;
};

// --- GERAÇÃO DO SERVIÇO REFATORADA E LIMPA ---
export const generateServiceFile = (cfg: AppConfig): string => {
  const linesUnit = [
    `Description=${cfg.appName} Service (Daemon)`,
    cfg.systemdAfter ? `After=${cfg.systemdAfter}` : '',
    cfg.systemdWants ? `Wants=${cfg.systemdWants}` : ''
  ].filter(Boolean).join('\n');

  const linesService = [
    `Type=${cfg.serviceType}`,
    `User=${cfg.serviceUser}`,
    `Group=${cfg.serviceGroup}`,
    cfg.serviceWorkingDirectory ? `WorkingDirectory=${cfg.serviceWorkingDirectory}` : '',
    cfg.environmentVars ? `Environment="${cfg.environmentVars}"` : '',
    `RuntimeDirectory=${cfg.serviceRuntime}`,
    `RuntimeDirectoryMode=${cfg.serviceRuntimeMode}`,
    `ExecStart=/usr/local/bin/${cfg.binName}`,
    `Restart=${cfg.restartPolicy}`,
    cfg.restartPolicy !== 'no' ? `RestartSec=${cfg.restartSec}` : ''
  ].filter(Boolean).join('\n');

  return `[Unit]
${linesUnit}

[Service]
${linesService}

[Install]
WantedBy=multi-user.target
`;
};

export const generateServiceInstall = (cfg: AppConfig): string => {
  return `#!/bin/bash
set -e

if [ "$EUID" -ne 0 ]; then
  echo "❌ Por favor, rode este script como root (sudo)."
  exit 1
fi

echo ">>> 🛡️ Instalando Serviço Systemd: ${cfg.binName}..."

cp "bin/${cfg.binName}" "/usr/local/bin/${cfg.binName}"
chmod +x "/usr/local/bin/${cfg.binName}"

cp "${cfg.binName}.service" "/etc/systemd/system/"
systemctl daemon-reload
systemctl enable "${cfg.binName}.service"
systemctl start "${cfg.binName}.service"

echo "✅ Serviço instalado e iniciado com sucesso."
`;
};

export const generateServiceUninstall = (cfg: AppConfig): string => {
  return `#!/bin/bash
set -e

if [ "$EUID" -ne 0 ]; then
  echo "❌ Por favor, rode este script como root (sudo)."
  exit 1
fi

echo ">>> 🗑️ Removendo Serviço Systemd: ${cfg.binName}..."

systemctl stop "${cfg.binName}.service" || true
systemctl disable "${cfg.binName}.service" || true

rm -f "/etc/systemd/system/${cfg.binName}.service"
rm -f "/usr/local/bin/${cfg.binName}"

systemctl daemon-reload

echo "✅ Serviço removido com sucesso."
`;
};