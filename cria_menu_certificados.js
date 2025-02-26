<script>
// Adiciona opção "Cerificados"
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona a lista de navegação
    var navList = document.querySelector('.nav.more-nav.navbar-nav');
 
    if (navList) {
        // Cria um novo item de navegação para "Certificados"
        var newNavItem = document.createElement('li');
        var newNavLink = document.createElement('a');
        newNavLink.href = 'https://open.univar.edu.br/admin/tool/certificate/my.php';
        newNavLink.textContent = 'Certificados';
     
        newNavItem.appendChild(newNavLink);
     
        // Localiza o item "Sobre" e "Cursos"
        var sobreItem = Array.from(navList.children).find(item => item.textContent.trim() === 'Sobre');
        var cursosItem = Array.from(navList.children).find(item => item.textContent.trim() === 'Cursos');
     
        // Insere "Certificados" entre "Sobre" e "Cursos"
        if (sobreItem && cursosItem) {
            navList.insertBefore(newNavItem, cursosItem);
        }
    }
});

</script>
