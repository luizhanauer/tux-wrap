<template>
  <div class="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden flex flex-col">
        
        <header class="p-6 border-b border-slate-700 bg-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 class="text-2xl font-bold text-indigo-400">TuxWrap</h1>
            <p class="text-sm text-slate-400 mt-1">Gerador estrito de pacotes XDG e Systemd.</p>
          </div>
          
          <button @click="triggerDownload" class="group bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex flex-col items-start sm:items-end text-left sm:text-right border border-indigo-500/50 hover:border-indigo-400 shrink-0">
            <span class="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Exportar Template (.zip)
            </span>
            <span class="text-[10px] text-indigo-200/70 mt-1 max-w-[250px] leading-tight group-hover:text-indigo-100 transition-colors">
              Baixe o exemplo padrão agora ou altere os formulários para customizar em tempo real.
            </span>
          </button>
        </header>

        <nav class="flex border-b border-slate-700 bg-slate-900">
          <button 
            @click="activeTab = 'desktop'" 
            class="flex-1 py-4 text-sm font-medium transition-colors border-b-2"
            :class="activeTab === 'desktop' ? 'border-indigo-500 text-indigo-400 bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'"
          >
            Área de Trabalho (.desktop)
          </button>
          <button 
            @click="activeTab = 'systemd'" 
            class="flex-1 py-4 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2"
            :class="activeTab === 'systemd' ? 'border-indigo-500 text-indigo-400 bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'"
          >
            Daemon Background (Systemd)
            <span v-if="appConfig.includeService" class="flex w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>
        </nav>

        <main class="p-6 flex-1 bg-slate-800">
          <DesktopForm 
            v-if="activeTab === 'desktop'"
            v-model="appConfig" 
            :fileName="iconName" 
            @iconUpdate="updateIcon" 
          />
          <SystemdForm 
            v-if="activeTab === 'systemd'"
            v-model="appConfig" 
          />
        </main>
      </div>

      <PackagerPreview :config="appConfig" :fileName="iconName" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { AppConfig } from './domain/types';
import { buildAndDownloadZip } from './services/ZipService';
import DesktopForm from './components/DesktopForm.vue';
import SystemdForm from './components/SystemdForm.vue';
import PackagerPreview from './components/PackagerPreview.vue';

const activeTab = ref<'desktop' | 'systemd'>('desktop');

const appConfig = reactive<AppConfig>({
  appName: 'Meu App',
  binName: 'meu-app',
  description: 'Uma aplicação empacotada com TuxWrap.',
  terminal: false,
  startupNotify: true,
  categories: ['Utility'],
  keywords: [],
  includeService: false,
  serviceUser: 'root',
  serviceGroup: 'root',
  serviceRuntime: 'meu-app',
  serviceRuntimeMode: '0770',
  serviceWorkingDirectory: '',
  systemdAfter: '', // Deixado em branco por padrão
  systemdWants: '', // Deixado em branco por padrão
  serviceType: 'simple',
  restartPolicy: 'always',
  restartSec: 5,
  environmentVars: ''
});

const iconFile = ref<File | null>(null);
const iconName = ref<string>('');

const updateIcon = (file: File | null, name: string): void => {
  iconFile.value = file;
  iconName.value = name;
};

const triggerDownload = async (): Promise<void> => {
  try {
    await buildAndDownloadZip(appConfig, iconFile.value);
  } catch (error) {
    console.error(error);
    alert("Falha: Certifique-se de preencher o nome do executável.");
  }
};
</script>