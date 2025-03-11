@extends('layouts.customer')

@section('content')
<div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cabeçalho -->
        <div class="mb-10 text-center">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Finalizar Compra</h1>
            <p class="text-gray-600 dark:text-gray-400">Complete seu pagamento para ativar o plano</p>
        </div>

        <!-- Alertas -->
        @if(session('error'))
        <div class="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900 dark:text-red-200" role="alert">
            <p>{{ session('error') }}</p>
        </div>
        @endif

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Formulário de Pagamento -->
            <div class="md:col-span-2">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Informações de Pagamento</h3>
                    </div>
                    
                    <div class="p-6">
                        <form method="POST" action="{{ route('customer.billing.process-payment', $plan->id) }}" id="payment-form">
                            @csrf
                            
                            <!-- Métodos de Pagamento -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pagamento</label>
                                
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <input type="radio" name="payment_method" id="credit_card" value="credit_card" class="hidden peer" checked>
                                        <label for="credit_card" class="flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <i class="fas fa-credit-card text-2xl mb-2 text-gray-700 dark:text-gray-300 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400"></i>
                                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400">Cartão de Crédito</span>
                                        </label>
                                    </div>
                                    
                                    <div>
                                        <input type="radio" name="payment_method" id="pix" value="pix" class="hidden peer">
                                        <label for="pix" class="flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <i class="fas fa-qrcode text-2xl mb-2 text-gray-700 dark:text-gray-300 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400"></i>
                                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400">PIX</span>
                                        </label>
                                    </div>
                                    
                                    <div>
                                        <input type="radio" name="payment_method" id="boleto" value="boleto" class="hidden peer">
                                        <label for="boleto" class="flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <i class="fas fa-barcode text-2xl mb-2 text-gray-700 dark:text-gray-300 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400"></i>
                                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400">Boleto</span>
                                        </label>
                                    </div>
                                </div>
                                
                                @error('payment_method')
                                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                                @enderror
                            </div>
                            
                            <!-- Campos do Cartão de Crédito -->
                            <div id="credit-card-fields">
                                <div class="mb-4">
                                    <label for="card_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número do Cartão</label>
                                    <input type="text" id="card_number" name="card_number" placeholder="0000 0000 0000 0000" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    @error('card_number')
                                        <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                                    @enderror
                                </div>
                                
                                <div class="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label for="card_expiry" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Validade</label>
                                        <input type="text" id="card_expiry" name="card_expiry" placeholder="MM/AA" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        @error('card_expiry')
                                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                                        @enderror
                                    </div>
                                    
                                    <div>
                                        <label for="card_cvc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código de Segurança (CVC)</label>
                                        <input type="text" id="card_cvc" name="card_cvc" placeholder="123" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        @error('card_cvc')
                                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                                        @enderror
                                    </div>
                                </div>
                                
                                <div class="mb-6">
                                    <label for="card_holder" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome no Cartão</label>
                                    <input type="text" id="card_holder" name="card_holder" placeholder="NOME COMO ESTÁ NO CARTÃO" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    @error('card_holder')
                                        <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                                    @enderror
                                </div>
                            </div>
                            
                            <!-- Campos do PIX (inicialmente oculto) -->
                            <div id="pix-fields" class="hidden">
                                <div class="mb-6 text-center">
                                    <div class="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg inline-block">
                                        <i class="fas fa-qrcode text-8xl text-gray-700 dark:text-gray-300 mb-4"></i>
                                        <p class="text-gray-700 dark:text-gray-300 mb-2">QR Code PIX será gerado após confirmação</p>
                                    </div>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                        Após clicar em "Finalizar Pagamento", você receberá um QR Code PIX para pagamento imediato.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Campos do Boleto (inicialmente oculto) -->
                            <div id="boleto-fields" class="hidden">
                                <div class="mb-6">
                                    <div class="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                                        <div class="flex items-center mb-4">
                                            <i class="fas fa-info-circle text-indigo-500 mr-3"></i>
                                            <p class="text-gray-700 dark:text-gray-300">
                                                O boleto será gerado após a confirmação do pedido.
                                            </p>
                                        </div>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">
                                            Após clicar em "Finalizar Pagamento", você será redirecionado para a página do boleto. O acesso ao plano será liberado após a confirmação do pagamento, o que pode levar até 3 dias úteis.
                                        </p>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <label for="cpf" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF (apenas números)</label>
                                    <input type="text" id="cpf" name="cpf" placeholder="00000000000" class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                </div>
                            </div>
                            
                            <!-- Termos e Condições -->
                            <div class="mb-6">
                                <div class="flex items-start">
                                    <div class="flex items-center h-5">
                                        <input id="terms" name="terms" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <label for="terms" class="font-medium text-gray-700 dark:text-gray-300">Concordo com os <a href="#" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Termos de Serviço</a> e <a href="#" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Política de Privacidade</a></label>
                                    </div>
                                </div>
                                @error('terms')
                                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                                @enderror
                            </div>
                            
                            <!-- Botão de Envio -->
                            <div>
                                <button type="submit" class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-center transition-colors duration-200">
                                    Finalizar Pagamento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <!-- Resumo do Pedido -->
            <div class="md:col-span-1">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-6">
                    <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Resumo do Pedido</h3>
                    </div>
                    
                    <div class="p-6">
                        <div class="mb-6">
                            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $plan->name }}</h4>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ $plan->description }}</p>
                        </div>
                        
                        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                            <div class="flex justify-between mb-2">
                                <span class="text-gray-600 dark:text-gray-400">Plano Mensal</span>
                                <span class="text-gray-900 dark:text-white">{{ $plan->formatted_price }}</span>
                            </div>
                            
                            <div class="flex justify-between mb-2">
                                <span class="text-gray-600 dark:text-gray-400">Créditos</span>
                                <span class="text-gray-900 dark:text-white">{{ number_format($plan->credits, 0, ',', '.') }}</span>
                            </div>
                        </div>
                        
                        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                            <div class="flex justify-between font-bold">
                                <span class="text-gray-900 dark:text-white">Total</span>
                                <span class="text-gray-900 dark:text-white">{{ $plan->formatted_price }}</span>
                            </div>
                            <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">Cobrança mensal recorrente</p>
                        </div>
                        
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-shield-alt text-green-500 mr-3"></i>
                                <p class="text-sm text-gray-700 dark:text-gray-300">
                                    Pagamento seguro e criptografado
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
        const creditCardFields = document.getElementById('credit-card-fields');
        const pixFields = document.getElementById('pix-fields');
        const boletoFields = document.getElementById('boleto-fields');
        
        // Função para mostrar/ocultar campos com base no método de pagamento
        function togglePaymentFields() {
            const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
            
            creditCardFields.classList.add('hidden');
            pixFields.classList.add('hidden');
            boletoFields.classList.add('hidden');
            
            if (selectedMethod === 'credit_card') {
                creditCardFields.classList.remove('hidden');
            } else if (selectedMethod === 'pix') {
                pixFields.classList.remove('hidden');
            } else if (selectedMethod === 'boleto') {
                boletoFields.classList.remove('hidden');
            }
        }
        
        // Adicionar evento de mudança para cada método de pagamento
        paymentMethods.forEach(method => {
            method.addEventListener('change', togglePaymentFields);
        });
        
        // Inicializar campos
        togglePaymentFields();
        
        // Máscara para o número do cartão
        const cardNumber = document.getElementById('card_number');
        if (cardNumber) {
            cardNumber.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 16) value = value.slice(0, 16);
                
                // Adicionar espaços a cada 4 dígitos
                let formattedValue = '';
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) formattedValue += ' ';
                    formattedValue += value[i];
                }
                
                e.target.value = formattedValue;
            });
        }
        
        // Máscara para a data de validade
        const cardExpiry = document.getElementById('card_expiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                
                // Formatar como MM/AA
                if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }
                
                e.target.value = value;
            });
        }
        
        // Máscara para o CVC
        const cardCvc = document.getElementById('card_cvc');
        if (cardCvc) {
            cardCvc.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                e.target.value = value;
            });
        }
        
        // Máscara para o CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                e.target.value = value;
            });
        }
    });
</script>
@endpush 