# 🐧 TuxWrap

[![Deploy to GitHub Pages](https://github.com/luizhanauer/tux-wrap/actions/workflows/deploy.yml/badge.svg)](https://github.com/luizhanauer/tux-wrap/actions)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**TuxWrap** é uma ferramenta web estática (Client-Side) projetada para empacotar binários soltos (Go, Rust, C++, etc.) para o ecossistema Linux. Ele gera de forma limpa e padronizada os scripts de instalação, atalhos visuais (XDG Base Directory) e serviços de background (Systemd).

🌐 **Acesse a ferramenta online:** [luizhanauer.github.io/tux-wrap](https://luizhanauer.github.io/tux-wrap/)

---

## 🎯 Objetivo (Single Responsibility)

Desenvolvedores frequentemente compilam binários incríveis, mas falham na hora de integrá-los ao sistema operacional do usuário final. O TuxWrap resolve isso criando o "andaime" perfeito em volta do seu executável, garantindo que ele vá para os diretórios corretos (`~/.local/bin`), apareça no menu de aplicativos (`.desktop`) ou rode com segurança máxima em background (`systemd` com `RuntimeDirectoryMode=0770`).

## ✨ Features

- **Padrão XDG Estrito:** Instalação limpa no ambiente do usuário (`~/.local/share/applications`).
- **Daemon Generator:** Geração de arquivos `.service` do Systemd com controle rigoroso de ciclo de vida (After, Wants, Restart Policies) e permissões.
- **Live Preview IDE:** Visualize os scripts compilados em tempo real com *Syntax Highlighting* antes de baixar.
- **Zero Backend:** Geração de pacotes `.zip` processada inteiramente no navegador via `jszip`.
- **Clean Architecture:** Código modularizado separando regras de domínio, geradores de texto e interface visual.

---

## 🚀 Como Executar Localmente

Se desejar contribuir ou modificar o gerador para as suas necessidades, o projeto é de fácil configuração:

```bash
# 1. Clone o repositório
git clone https://github.com/luizhanauer/tux-wrap.git

# 2. Entre no diretório
cd tux-wrap

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento Vite
npm run dev
```

---

## 📦 Como usar o Template gerado pelo TuxWrap?

Ao preencher os dados na interface e clicar em "Exportar Template", você receberá um arquivo `.zip`.

1. Extraia o conteúdo.
2. Coloque o seu **arquivo executável real** dentro da pasta `bin/` (garanta que ele tenha o mesmo nome configurado no painel).
3. **Para instalar no usuário (App de Interface/CLI):**
```bash
chmod +x install-app.sh uninstall.sh
./install-app.sh
```


4. **Para instalar como Daemon (Background Service):**
```bash
chmod +x install-service.sh uninstall-service.sh
sudo ./install-service.sh
```


---

## Contribuição

Contribuições são bem-vindas! Se você encontrar algum problema ou tiver sugestões para melhorar a aplicação, sinta-se à vontade para abrir uma issue ou enviar um pull request.

Se você gostou do meu trabalho e quer me agradecer, você pode me pagar um café :)

<a href="https://www.paypal.com/donate/?hosted_button_id=SFR785YEYHC4E" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 150px !important;" ></a>

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para obter mais informações.