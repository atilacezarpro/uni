<script>
// Muda ordem do menu
window.addEventListener("load", function() {

    // Adiciona o ouvinte de clique ao documento inteiro (ou outro elemento pai mais próximo)
    document.addEventListener("click", function(event) {
        // Verifica se o alvo do clique contém a classe 'text_to_html'
        if (event.target.classList.contains("text_to_html")) {

            // Obtenha a URL atual
            var currentUrl = new URL(window.location.href);
         
            // Log para ver a URL atual

            // Altere o valor do parâmetro 'section' para 0
            currentUrl.searchParams.set('section', '0');


            // Verificar se a URL foi modificada corretamente
            if (currentUrl.href.includes("section=0")) {

                // Redireciona para a nova URL
                window.location.href = currentUrl.href;
            } else {
                console.log("A URL não foi modificada corretamente.");
            }
        }
    });
});
</script>
