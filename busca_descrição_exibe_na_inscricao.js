<script>

document.addEventListener("DOMContentLoaded", function() {
    // Função para buscar a descrição do curso via API do Moodle
    function fetchCourseDescription(courseId) {
        var token = '6d7a5baea4d367459949b4885f7ed384';  // Seu token da API
        var apiUrl = `https://open.univar.edu.br/webservice/rest/server.php`;

        // Parâmetros para a chamada da API
        var params = new URLSearchParams();
        params.append('wstoken', token);
        params.append('wsfunction', 'core_course_get_courses_by_field');  // Função para buscar pelo campo
        params.append('moodlewsrestformat', 'json');
        params.append('field', 'id');  // O campo de busca é o ID do curso
        params.append('value', courseId);  // O valor é o ID do curso obtido da URL

        // Faz a chamada à API via fetch usando o método POST
        fetch(apiUrl, {
            method: 'POST',
            body: params
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.courses && data.courses.length > 0) {
                // Obtém a descrição do curso
                var courseDescription = data.courses[0].summary;

                // Seleciona a div com a classe 'box py-3 generalbox info'
                var boxInfoDiv = document.querySelector('.box.py-3.generalbox.info');

                if (boxInfoDiv) {
                    // Insere a descrição dentro da div selecionada
                    boxInfoDiv.innerHTML += `<div class="course-description"><p>${courseDescription}</p></div>`;
                } else {
                    console.error('Elemento com a classe "box py-3 generalbox info" não encontrado.');
                }
            } else {
                console.error('Não foi possível obter os detalhes do curso.');
            }
        })
        .catch(error => {
            console.error('Erro ao fazer a chamada à API do Moodle:', error);
        });
    }

    // Função para obter o ID do curso a partir da URL
    function getCourseIdFromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');  // Obtém o parâmetro 'id' da URL
    }

    // Chama a função para buscar a descrição do curso com o ID da URL
    var courseId = getCourseIdFromUrl();
    if (courseId) {
        fetchCourseDescription(courseId);
    } else {
        console.error('ID do curso não encontrado na URL.');
    }
});

</script>
