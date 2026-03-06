<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <section>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Metadados da Aplicação</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Nome de Exibição</label>
          <p class="text-xs text-slate-500 mb-2">Como o app aparecerá no menu do sistema.</p>
          <input v-model="modelValue.appName" type="text" placeholder="Ex: Minha Aplicação" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Binário (CLI)</label>
          <p class="text-xs text-slate-500 mb-2">O nome real do arquivo executável (sem espaços).</p>
          <input v-model="modelValue.binName" type="text" placeholder="Ex: minha-aplicacao" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-emerald-400 font-mono text-sm" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-300 mb-1">Descrição Curta</label>
          <p class="text-xs text-slate-500 mb-2">Texto exibido ao passar o mouse sobre o ícone.</p>
          <input v-model="modelValue.description" type="text" placeholder="Ex: Ferramenta utilitária para gerenciamento local..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Configurações XDG (.desktop)</h2>
      
      <div class="mb-6">
        <label class="block text-sm font-medium text-slate-300 mb-1">Categorias de Menu</label>
        <p class="text-xs text-slate-500 mb-3">Define em qual pasta do menu do sistema operacional seu app ficará agrupado.</p>
        <div class="flex flex-wrap gap-3">
          <label v-for="cat in DESKTOP_CATEGORIES" :key="cat" class="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 cursor-pointer hover:border-indigo-500 transition-colors">
            <input type="checkbox" :value="cat" v-model="modelValue.categories" class="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-800" />
            <span class="text-sm text-slate-300">{{ cat }}</span>
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Palavras-chave (Busca)</label>
          <p class="text-xs text-slate-500 mb-2">Digite uma palavra e aperte <kbd class="bg-slate-700 px-1 rounded">Espaço</kbd> ou <kbd class="bg-slate-700 px-1 rounded">Enter</kbd>.</p>
          
          <div class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all flex flex-wrap gap-2 min-h-[46px] items-center">
            <span v-for="(kw, idx) in modelValue.keywords" :key="idx" class="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded-md flex items-center gap-1 border border-indigo-500/30">
              {{ kw }}
              <button @click="removeKeyword(idx)" class="hover:text-white font-bold ml-1">&times;</button>
            </span>
            <input 
              v-model="currentKeyword" 
              @keydown.space.prevent="addKeyword" 
              @keydown.enter.prevent="addKeyword"
              @keydown.,.prevent="addKeyword"
              @blur="addKeyword"
              type="text" 
              placeholder="Adicionar tag..." 
              class="bg-transparent border-none outline-none text-sm text-slate-200 flex-1 min-w-[100px]" 
            />
          </div>
        </div>

        <div class="flex flex-col justify-center space-y-4 pt-6">
          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" v-model="modelValue.terminal" class="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-800 w-4 h-4 mt-0.5" />
            <div>
              <span class="text-sm text-slate-300 block">Executar no Terminal</span>
              <span class="text-xs text-slate-500 block">Abre uma janela de terminal (útil para CLIs).</span>
            </div>
          </label>
          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" v-model="modelValue.startupNotify" class="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-800 w-4 h-4 mt-0.5" />
            <div>
              <span class="text-sm text-slate-300 block">Notificação de Inicialização</span>
              <span class="text-xs text-slate-500 block">Faz o cursor girar enquanto o app carrega.</span>
            </div>
          </label>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Ícone</h2>
      <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-800/50 hover:bg-slate-700 transition-colors group">
        <div class="flex items-center justify-center gap-4">
          <svg class="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span class="text-sm text-slate-300"><span class="font-semibold text-indigo-400">Anexar ícone (.png)</span></span>
          <span class="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">{{ fileName || 'Nenhum' }}</span>
        </div>
        <input type="file" class="hidden" accept="image/png" @change="handleUpload" />
      </label>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DESKTOP_CATEGORIES } from '../domain/types';
import type { AppConfig } from '../domain/types';

const modelValue = defineModel<AppConfig>({ required: true });
defineProps<{ fileName: string }>();
const emit = defineEmits<{ (e: 'iconUpdate', file: File | null, name: string): void }>();

const currentKeyword = ref('');

const addKeyword = (): void => {
  if (!currentKeyword.value.trim()) return;

  const words = currentKeyword.value.split(/[\s,;.-]+/);
  words.forEach(w => {
    const cleanWord = w.trim();
    if (!cleanWord) return;
    if (modelValue.value.keywords.includes(cleanWord)) return;
    
    modelValue.value.keywords.push(cleanWord);
  });

  currentKeyword.value = '';
};

const removeKeyword = (idx: number): void => {
  modelValue.value.keywords.splice(idx, 1);
};

const handleUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (!files || files.length === 0) return;

  const file = files[0];
  if (!file) return;

  emit('iconUpdate', file, file.name);
};
</script>