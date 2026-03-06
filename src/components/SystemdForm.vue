<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div class="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
      <div>
        <h2 class="text-lg font-semibold text-slate-200">Habilitar Daemon Systemd</h2>
        <p class="text-sm text-slate-400">Gera os scripts para rodar o binário continuamente no servidor.</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="modelValue.includeService" class="sr-only peer">
        <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 border border-slate-600"></div>
      </label>
    </div>

    <div v-show="modelValue.includeService" class="space-y-8 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
      
      <section>
        <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <span>Ordem de Boot [Unit]</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Esperar por (After)</label>
            <p class="text-xs text-slate-500 mb-2">"Só me ligue DEPOIS que a internet ou banco estiverem prontos."</p>
            <input v-model="modelValue.systemdAfter" type="text" placeholder="Ex: network-online.target" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono text-amber-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Acionar junto (Wants)</label>
            <p class="text-xs text-slate-500 mb-2">"Tente ligar esse outro serviço junto comigo."</p>
            <input v-model="modelValue.systemdWants" type="text" placeholder="Ex: postgresql.service" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono text-amber-300" />
          </div>
        </div>
      </section>

      <section class="border-t border-slate-700/50 pt-6">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Privilégios e Escopo [Service]</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-slate-300 mb-1">Usuário</label>
            <input v-model="modelValue.serviceUser" type="text" placeholder="Ex: root" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-slate-300 mb-1">Grupo</label>
            <input v-model="modelValue.serviceGroup" type="text" placeholder="Ex: root" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-slate-300 mb-1">Runtime Dir</label>
            <input v-model="modelValue.serviceRuntime" type="text" placeholder="Ex: meu-app" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono text-emerald-400" />
          </div>
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-slate-300 mb-1">Permissão</label>
            <input v-model="modelValue.serviceRuntimeMode" type="text" placeholder="Ex: 0770" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono text-rose-400" />
          </div>
          <div class="md:col-span-4">
            <label class="block text-sm font-medium text-slate-300 mb-1">WorkingDirectory (Opcional)</label>
            <p class="text-xs text-slate-500 mb-2">Pasta raiz de onde o binário será executado (útil para apps que leem arquivos <code class="bg-slate-900 px-1 rounded">.env</code> locais).</p>
            <input v-model="modelValue.serviceWorkingDirectory" type="text" placeholder="Ex: /opt/meu-app" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono text-emerald-400" />
          </div>
        </div>
      </section>

      <section class="border-t border-slate-700/50 pt-6">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Comportamento (Lifecycle)</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Tipo (Type)</label>
            <select v-model="modelValue.serviceType" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-200 appearance-none">
              <option value="simple">simple</option>
              <option value="exec">exec</option>
              <option value="notify">notify</option>
              <option value="forking">forking</option>
              <option value="oneshot">oneshot</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Restart Policy</label>
            <select v-model="modelValue.restartPolicy" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-200 appearance-none">
              <option value="always">always</option>
              <option value="on-failure">on-failure</option>
              <option value="on-abnormal">on-abnormal</option>
              <option value="on-success">on-success</option>
              <option value="no">no (Desativado)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1" :class="{'opacity-50': modelValue.restartPolicy === 'no'}">RestartSec (s)</label>
            <input v-model.number="modelValue.restartSec" type="number" min="0" :disabled="modelValue.restartPolicy === 'no'" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm disabled:opacity-50" />
          </div>
        </div>
      </section>

      <section class="border-t border-slate-700/50 pt-6">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Ambiente</h3>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Variáveis Extras (Opcional)</label>
          <p class="text-xs text-slate-500 mb-2">Ex: <code class="bg-slate-900 px-1 rounded">GIN_MODE=release DB_HOST=localhost</code></p>
          <input v-model="modelValue.environmentVars" type="text" placeholder="Ex: PORT=8080" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono text-emerald-400" />
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppConfig } from '../domain/types';
const modelValue = defineModel<AppConfig>({ required: true });
</script>