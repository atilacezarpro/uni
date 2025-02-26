<script>
// Muda ordem dos botões no cadastro
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o contêiner dos botões
    const buttonGroup = document.querySelector('.d-flex.flex-wrap.align-items-center');

    // Seleciona os botões "Criar minha conta" e "Cancelar"
    const submitButton = document.querySelector('#id_submitbutton');
    const cancelButton = document.querySelector('#id_cancel');

    // Verifica se os botões foram encontrados
    if (submitButton && cancelButton) {
        // Remove os botões do contêiner
        buttonGroup.removeChild(submitButton.closest('.fitem'));
        buttonGroup.removeChild(cancelButton.closest('.fitem'));

        // Adiciona o botão "Cancelar" primeiro e depois o botão "Criar minha conta"
        buttonGroup.appendChild(cancelButton.closest('.fitem'));
        buttonGroup.appendChild(submitButton.closest('.fitem'));
    }
});

</script>