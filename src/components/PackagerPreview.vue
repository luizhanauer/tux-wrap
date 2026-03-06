<template>
  <aside class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 flex flex-col sticky top-8 shadow-2xl h-[calc(100vh-4rem)] overflow-hidden">
    
    <div class="px-4 py-3 border-b border-slate-700/80 bg-slate-800/80 flex items-center gap-3 shrink-0">
      <div class="flex gap-1.5">
        <div class="w-3 h-3 rounded-full bg-rose-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
      </div>
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        Live Preview
      </h2>
    </div>
    
    <div class="p-4 font-mono text-sm text-slate-300 border-b border-slate-800 bg-slate-900 shrink-0">
      <p class="text-indigo-400 mb-3 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
        {{ config.binName || 'projeto' }}-template/
      </p>
      
      <ul class="space-y-1 ml-2 pl-2 border-l border-slate-700/50">
        <li class="relative flex items-center before:absolute before:w-3 before:h-[1px] before:bg-slate-700/50 before:-left-2">
          <button @click="activeView = 'desktop'" class="flex items-center gap-2 hover:text-indigo-400 transition-all w-full text-left py-1 px-2 rounded-md" :class="activeView === 'desktop' ? 'text-indigo-400 font-bold bg-indigo-500/10' : ''">
            📄 {{ config.binName || 'app' }}.desktop
          </button>
        </li>
        <li class="relative flex items-center before:absolute before:w-3 before:h-[1px] before:bg-slate-700/50 before:-left-2">
          <button @click="activeView = 'install'" class="flex items-center gap-2 hover:text-indigo-400 transition-all w-full text-left py-1 px-2 rounded-md" :class="activeView === 'install' ? 'text-indigo-400 font-bold bg-indigo-500/10' : ''">
            📄 install-app.sh
          </button>
        </li>
        <template v-if="config.includeService">
          <li class="relative flex items-center before:absolute before:w-3 before:h-[1px] before:bg-slate-700/50 before:-left-2">
            <button @click="activeView = 'service'" class="flex items-center gap-2 text-amber-300/80 hover:text-amber-400 transition-all w-full text-left py-1 px-2 rounded-md" :class="activeView === 'service' ? 'font-bold bg-amber-500/10 !text-amber-400' : ''">
              ⚙️ {{ config.binName || 'app' }}.service
            </button>
          </li>
        </template>
        <li v-if="fileName" class="relative flex items-center before:absolute before:w-3 before:h-[1px] before:bg-slate-700/50 before:-left-2 text-emerald-400 py-1 px-2">
          🖼️ icon.png
        </li>
        <li class="relative flex items-center before:absolute before:w-3 before:h-[1px] before:bg-slate-700/50 before:-left-2 text-slate-500 py-1 px-2">
          📁 bin/ ...
        </li>
      </ul>
    </div>

    <div class="flex-1 bg-[#0d1117] flex flex-col overflow-hidden relative group">
      
      <div class="bg-[#161b22] px-4 py-2 border-b border-slate-800 flex justify-between items-center shrink-0">
        <span class="text-xs font-mono text-slate-400">{{ activeFileName }}</span>
        <button @click="copyCode" class="text-xs text-slate-500 hover:text-slate-300 transition-colors bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100">
          Copiar
        </button>
      </div>
      
      <div class="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre class="font-mono text-[13px] leading-relaxed whitespace-pre-wrap"><code v-html="highlightedCode"></code></pre>
      </div>

    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { AppConfig } from '../domain/types';
import { generateDesktop, generateAppInstall, generateServiceFile } from '../services/TemplateGenerator';

const props = defineProps<{ 
  config: AppConfig;
  fileName: string;
}>();

const activeView = ref<'desktop' | 'install' | 'service'>('desktop');

const viewMap: Record<string, (c: AppConfig) => string> = {
  'desktop': generateDesktop,
  'install': generateAppInstall,
  'service': generateServiceFile
};

const activeFileName = computed((): string => {
  if (activeView.value === 'desktop') return `${props.config.binName || 'app'}.desktop`;
  if (activeView.value === 'install') return 'install-app.sh';
  return `${props.config.binName || 'app'}.service`;
});

const generatedCode = computed((): string => {
  const generator = viewMap[activeView.value];
  if (!generator) return '';
  return generator(props.config);
});

// Colorizador com Early Return (No Else) e Regex estrito
const highlightedCode = computed((): string => {
  const code = generatedCode.value;
  let escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (activeView.value === 'install') {
    escaped = escaped.replace(/(\#!\/bin\/bash)/g, '<span class="text-slate-500 italic">$1</span>');
    escaped = escaped.replace(/(echo .*?)(?=\n|$)/g, '<span class="text-emerald-400">$1</span>');
    escaped = escaped.replace(/(mkdir -p|cp|chmod \+x|rm -f|update-desktop-database|gtk-update-icon-cache)/g, '<span class="text-sky-400">$1</span>');
    escaped = escaped.replace(/(if |then|fi)/g, '<span class="text-pink-400">$1</span>');
    escaped = escaped.replace(/(\$[A-Z_]+)/g, '<span class="text-amber-300">$1</span>');
    
    return `<span class="text-slate-300">${escaped}</span>`;
  }

  escaped = escaped.replace(/^(\[.*?\])/gm, '<span class="text-indigo-400 font-bold">$1</span>');
  escaped = escaped.replace(/^([a-zA-Z0-9_-]+)=/gm, '<span class="text-sky-400">$1</span><span class="text-slate-500">=</span>');

  return `<span class="text-slate-300">${escaped}</span>`;
});

const copyCode = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(generatedCode.value);
  } catch (err) {
    console.error('Falha ao copiar', err);
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}
</style>