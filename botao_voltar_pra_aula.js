<script>
document.addEventListener('DOMContentLoaded', function () {
  // Seleciona o elemento .activity-navigation.container-fluid
  var navigationContainer = document.querySelector('.activity-navigation.container-fluid');

  if (navigationContainer) {
    // Remove o conteúdo atual do elemento
    navigationContainer.innerHTML = '';

    // Cria o botão de voltar
    var backButton = document.createElement('button');
    backButton.innerText = 'Voltar para a aula';
    backButton.style.padding = '10px 20px';
    backButton.style.fontSize = '16px';
    backButton.style.backgroundColor = '#2F4268';
    backButton.style.color = '#ffffff';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.cursor = 'pointer';
    backButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

    // Adiciona o evento de clique para voltar à página anterior
    backButton.addEventListener('click', function () {
      window.history.back();
    });

    // Adiciona o botão ao container
    navigationContainer.appendChild(backButton);
  }
});
</script>
