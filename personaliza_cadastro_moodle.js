<script>
document.addEventListener("DOMContentLoaded", function() {
    // Modifica a página de login e cadastro
    var style = document.createElement('style');
    style.innerHTML = `
        @media only screen and (max-width: 768px) { 
            .form-items::before { 
                content: url('https://lh3.googleusercontent.com/d/1DfrHQVKtPOZ1TYrguVXONWqChdzU82OH'); 
                display: block; 
                margin: 0 auto 20px auto; 
                max-width: 100%; 
                height: auto; 
                text-align: center;
            }
        }       
        .login-wrapper .login-logo-area {display: none !important;}
        .login-wrapper .login-area .login-background-area .login-color-area {background-color: rgba(0, 0, 0, .0) !important;}
        .login-wrapper .login-area .login-background-area { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
        .login-wrapper .login-area .login-form-area .form-content { background: #3d4094 !important; }
        .login-wrapper .login-area .login-form-area h1 {display: none !important;}
        .login-wrapper .login-area .login-form-area .btn-primary { background: #00a859 !important;}
        .login-wrapper .login-area { background: #3d4094 !important;}
        body[data-templates="login"] { background-color: #3d4094;}
        .form-content {display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5;}
        .form-items {width: 100%; max-width: 500px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);}
        .form-items #username {max-width: 460px !important;}
        .form-items #password {max-width: 460px !important;}
        .login-form-username, .login-form-password { margin-bottom: 20px;}
        .login-form .form-control {width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;}
        .login-form .form-control:focus {border-color: #007bff; outline: none;}
        .login-form-submit button {width: 100%; padding: 12px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease;}
        .login-form-submit button:hover { background-color: #0056b3;}
        .login-form-forgotpassword a {font-size: 14px; color: #007bff; text-decoration: none; display: block; text-align: center; padding-top: 10px;}
        .login-form-forgotpassword a:hover {text-decoration: underline;}

        /* Oculta as instruções de login e o botão de criar conta */
        .login-instructions, .login-signup {
            display: none !important;
        }

        /* Estilo para o botão "Primeiro acesso - Cadastro" */
        .first-access-button {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: #3d4094;
            color: #fff !important;
            text-align: center;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            text-decoration: none;
    text-transform: uppercase;
        }
        .first-access-button:hover {
            background-color: #1c1e58;
            text-decoration: none !important;
        }
    `;
    document.head.appendChild(style);

    var formItems = document.querySelector('.form-items');
    if (formItems) {
        var welcomeMessage = document.createElement('div');

        // Verifica se é a página de cadastro
        if (window.location.pathname.includes('signup.php')) {
            welcomeMessage.innerHTML = '<p style="font-size: 18px; font-weight: bold;">Faça seu cadastro!</p>' +
                                      '<p style="font-size: 14px; font-weight: normal;">Preencha os campos abaixo para realizar seu cadastro. <br>  - O CPF deve ser apenas números, sem pontos e/ou traços.<br>  - Seu nome deve estar completo (ele será impresso no certificado).</p>';

            // Oculta o elemento específico na página de cadastro
            var elementToHide = document.querySelector('.d-flex.align-items-center.mb-2');
            if (elementToHide) {
                elementToHide.style.display = 'none';
            }
        } else if (document.body.getAttribute('data-templates') === 'login' && !window.location.pathname.includes('forgot_password.php')) {
            // Modifica a página de login
            welcomeMessage.innerHTML = '<p style="font-size: 18px; font-weight: bold;">Olá, boas-vindas!</p>' +
                                      '<p style="font-size: 14px; font-weight: normal;">Ao fazer login desbloqueie recursos avançados e aproveite uma experiência personalizada em nossa plataforma.</p>';
        }
        formItems.insertBefore(welcomeMessage, formItems.firstChild);
    }

    var loginForm = document.querySelector('.loginform');
    if (loginForm) {
        var usernameField = document.getElementById('username');
        var passwordField = document.getElementById('password');
       
        if (usernameField && passwordField) {
            usernameField.placeholder = 'CPF (sem pontos e/ou traços)';
            passwordField.placeholder = 'Digite sua senha';
        }

        if (usernameField) {
            var usernameLabel = document.createElement('label');
            usernameLabel.classList.add('input-label');
            usernameLabel.innerHTML = '<i class="fas fa-envelope"></i> Login';
            usernameLabel.style.display = 'block';
            usernameLabel.style.fontSize = '16px';
            usernameLabel.style.marginBottom = '5px';

            usernameField.parentNode.insertBefore(usernameLabel, usernameField);
        }

        if (passwordField) {
            var passwordLabel = document.createElement('label');
            passwordLabel.classList.add('input-label');
            passwordLabel.innerHTML = '<i class="fas fa-lock"></i> Senha';
            passwordLabel.style.display = 'block';
            passwordLabel.style.fontSize = '16px';
            passwordLabel.style.marginBottom = '5px';

            passwordField.parentNode.insertBefore(passwordLabel, passwordField);
        }

        var loginButton = document.getElementById('loginbtn');
        if (loginButton) {
            loginButton.classList.add('chakra-button', 'css-tkf23g');
            loginButton.innerHTML = 'Entrar na plataforma';
        }

        var forgotPasswordLink = document.querySelector('.login-form-forgotpassword a');
        if (forgotPasswordLink) {
            forgotPasswordLink.innerHTML = 'Esqueceu a sua senha?';

            var firstAccessLink = document.createElement('a');
            firstAccessLink.href = 'https://open.univar.edu.br/login/signup.php';
            firstAccessLink.innerHTML = 'Primeiro acesso - Cadastro';
            firstAccessLink.classList.add('first-access-button'); // Transformar em botão
            var firstAccessWrapper = document.createElement('div');
            firstAccessWrapper.appendChild(firstAccessLink);
            forgotPasswordLink.parentNode.insertBefore(firstAccessWrapper, forgotPasswordLink);
        }
    }
});
</script>
