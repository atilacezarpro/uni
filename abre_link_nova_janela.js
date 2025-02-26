<script>
document.addEventListener('DOMContentLoaded', function () {
  // Seleciona todos os links de atividades URL
  var urlLinks = document.querySelectorAll('.modtype_url a');

  // Adiciona o atributo target="_blank" para abrir em nova guia
  urlLinks.forEach(function (link) {
    link.setAttribute('target', '_blank');
  });
});
</script>