@extends('layouts.admin')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Gerenciamento de API</h1>
            <x-forms.button variant="primary" class="cursor-pointer" onclick="openCreateModal()">
                <i class="fas fa-plus mr-2"></i> Nova Chave API
            </x-forms.button>
        </div>
        
        <x-card class="mt-6">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chave</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Último Uso</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        @foreach($apiKeys as $key)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ $key->name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex items-center">
                                    <span class="text-gray-900 dark:text-white font-mono">{{ Str::mask($key->key, '*', 4, 4) }}</span>
                                    <button onclick="copyToClipboard('{{ $key->key }}')" class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {{ $key->last_used_at ? $key->last_used_at->format('d/m/Y H:i') : 'Nunca utilizada' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($key->is_active)
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                        Ativa
                                    </span>
                                @else
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                        Inativa
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="openEditModal('{{ $key->id }}', '{{ $key->name }}', {{ $key->is_active ? 'true' : 'false' }})" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3 cursor-pointer">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <form method="POST" action="{{ route('api-keys.destroy', $key) }}" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir esta chave?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 cursor-pointer">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </x-card>
    </div>
</div>

<!-- Modal de Criação de Chave API -->
<div id="createApiKeyModal" class="fixed inset-0 overflow-y-auto hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form method="POST" action="{{ route('api-keys.store') }}">
                @csrf
                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 sm:mx-0 sm:h-10 sm:w-10">
                            <i class="fas fa-key text-indigo-600 dark:text-indigo-400"></i>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                Nova Chave API
                            </h3>
                            <div class="mt-4">
                                <x-forms.input
                                    name="name"
                                    label="Nome da Chave"
                                    placeholder="Ex: Integração Website"
                                    required
                                />
                                
                                <div class="mt-4">
                                    <x-forms.checkbox
                                        name="is_active"
                                        id="is_active"
                                        label="Chave Ativa"
                                        checked
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <x-forms.button type="submit" variant="primary" class="w-full sm:w-auto sm:ml-3 cursor-pointer">
                        Criar Chave
                    </x-forms.button>
                    <x-forms.button type="button" variant="secondary" class="mt-3 sm:mt-0 w-full sm:w-auto cursor-pointer" onclick="closeCreateModal()">
                        Cancelar
                    </x-forms.button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal de Edição de Chave API -->
<div id="editApiKeyModal" class="fixed inset-0 overflow-y-auto hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form id="editApiKeyForm" method="POST">
                @csrf
                @method('PUT')
                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 sm:mx-0 sm:h-10 sm:w-10">
                            <i class="fas fa-edit text-indigo-600 dark:text-indigo-400"></i>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                Editar Chave API
                            </h3>
                            <div class="mt-4">
                                <x-forms.input
                                    name="name"
                                    id="edit_name"
                                    label="Nome da Chave"
                                    required
                                />
                                
                                <div class="mt-4">
                                    <x-forms.checkbox
                                        name="is_active"
                                        id="edit_is_active"
                                        label="Chave Ativa"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <x-forms.button type="submit" variant="primary" class="w-full sm:w-auto sm:ml-3 cursor-pointer">
                        Atualizar Chave
                    </x-forms.button>
                    <x-forms.button type="button" variant="secondary" class="mt-3 sm:mt-0 w-full sm:w-auto cursor-pointer" onclick="closeEditModal()">
                        Cancelar
                    </x-forms.button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Chave API copiada para a área de transferência!');
        });
    }
    
    function openCreateModal() {
        document.getElementById('createApiKeyModal').classList.remove('hidden');
    }
    
    function closeCreateModal() {
        document.getElementById('createApiKeyModal').classList.add('hidden');
    }
    
    function openEditModal(id, name, isActive) {
        document.getElementById('edit_name').value = name;
        document.getElementById('edit_is_active').checked = isActive;
        document.getElementById('editApiKeyForm').action = `/dashboard/api-keys/${id}`;
        document.getElementById('editApiKeyModal').classList.remove('hidden');
    }
    
    function closeEditModal() {
        document.getElementById('editApiKeyModal').classList.add('hidden');
    }
</script>
@endsection 