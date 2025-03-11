<!-- Adicione estes itens ao menu lateral -->
<li>
    <a href="{{ route('admin.roles.index') }}" class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700">
        <i class="fas fa-user-tag w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"></i>
        <span class="ml-3">Roles</span>
    </a>
</li>
<li>
    <a href="{{ route('admin.permissions.index') }}" class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700">
        <i class="fas fa-key w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"></i>
        <span class="ml-3">Permissões</span>
    </a>
</li> 