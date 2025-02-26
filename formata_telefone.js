<script>

document.addEventListener('DOMContentLoaded', function () {
    let usernameField = document.querySelector('input[name="username"]');
    if (usernameField) {
        usernameField.addEventListener('input', function () {
            // Se o valor for um dos usuários permitidos, permite
            if (this.value === 'neadsuporte' || this.value === 'suporte') {
                return; // Permite o valor sem alterações
            }
            // Remove qualquer caractere que não seja número e limita a 11 dígitos
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    let telefoneField = document.querySelector('#id_profile_field_Telefone');
    if (telefoneField) {
        // Adiciona o placeholder ao campo de telefone
        telefoneField.placeholder = '(66) 99999-9999';

        // Função para aplicar a máscara ao número
        telefoneField.addEventListener('input', function () {
            // Remove tudo que não for número
            let value = telefoneField.value.replace(/\D/g, '');
            let formattedValue = '';

            // Aplica a formatação gradativa
            if (value.length > 0) {
                formattedValue = '(' + value.substring(0, 2);
            }
            if (value.length > 2) {
                formattedValue += ') ' + value.substring(2, 7);
            }
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 11);
            }

            telefoneField.value = formattedValue;
        });

        // Permite apagar os números sem travar na máscara
        telefoneField.addEventListener('keydown', function (event) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                // Se a tecla for Backspace ou Delete, permite apagar
                this.value = this.value.replace(/[\D]/g, '').slice(0, this.value.length - 1);
                this.dispatchEvent(new Event('input')); // Dispara o evento de input para aplicar a formatação
            }
        });
    }
});
</script>
