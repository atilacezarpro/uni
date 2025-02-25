// Atualiza a lista de participantes do curso na planilha "Dados Moodle"
function updateParticipants() {
  const moodleUrl = "https://vestibular.univar.io/webservice/rest/server.php";
  const token = "7d38f07548d7f351022a3f6b171aaeee";
  const courseId = 8; // ID do curso
  const enrolledUsersFunction = "core_enrol_get_enrolled_users";

  try {
    Logger.log("Obtendo participantes do curso...");
    const enrolledUsers = callMoodleAPI(moodleUrl, token, enrolledUsersFunction, { courseid: courseId });
    Logger.log("Usuários inscritos retornados:", JSON.stringify(enrolledUsers));

    if (enrolledUsers && enrolledUsers.length > 0) {
      const data = enrolledUsers.map(user => {
        Logger.log(`Dados do usuário: ${JSON.stringify(user)}`); // Log completo do usuário para inspeção

        return [
          user.fullname || "Nome não disponível",
          formatCPF(user.username) || "CPF inválido", // Formata o CPF
          user.email || "E-mail não disponível",
          formatPhone(getProfileField(user, "Telefone")) || " ", // Busca e formata o telefone
          getProfileField(user, "Curso") || ".", // Busca a opção de curso
          user.groups ? user.groups.map(group => group.name).join(", ") : "Sem grupo",
          user.roles ? user.roles.map(role => role.shortname).join(", ") : "Papel não disponível",
          formatDate(user.firstaccess) || "Não acessou", // Formata o primeiro acesso
          formatDate(user.lastaccess) || "Não acessou"  // Formata o último acesso
        ];
      });

      updateSheetInBatches("Dados - Agendado", [
        ["Nome", "CPF", "E-mail", "Telefone", "Opção de Curso", "Tipo", "Papel", "Primeiro Acesso", "Último Acesso"]
      ], data, 100);
      Logger.log("Lista de participantes atualizada com sucesso.");
    } else {
      Logger.log("Nenhum usuário inscrito encontrado.");
    }
  } catch (error) {
    Logger.log(`Erro ao atualizar a lista de participantes: ${error.message}`);
  }
}

// Função para formatar o CPF no formato 000.000.000-##
function formatCPF(cpf) {
  if (!cpf) return null;
  const cleanedCPF = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
  const match = cleanedCPF.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  Logger.log(`CPF em formato inválido: ${cpf}`);
  return cpf; // Retorna o valor original se não for possível formatar
}

// Função para obter valores de campos de perfil personalizados
function getProfileField(user, fieldName) {
  if (user.customfields && user.customfields.length > 0) {
    const customField = user.customfields.find(field => field.shortname === fieldName);
    if (customField) {
      Logger.log(`Campo personalizado encontrado: ${fieldName} = ${customField.value}`);
    } else {
      Logger.log(`Campo personalizado não encontrado: ${fieldName}`);
    }
    return customField ? customField.value : null;
  }
  Logger.log("Nenhum campo personalizado disponível para este usuário.");
  return null;
}

// Função para formatar telefone no formato (99) 99999-9999
function formatPhone(phone) {
  if (!phone) return null;
  const cleanedPhone = phone.replace(/\D/g, ""); // Remove caracteres não numéricos
  const match = cleanedPhone.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  Logger.log(`Telefone em formato inválido: ${phone}`);
  return phone; // Retorna o valor original se não for possível formatar
}

// Função para formatar datas no formato dd/mm/yyyy hh:mm:ss
function formatDate(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp * 1000); // Converte o timestamp para milissegundos
  const pad = num => num.toString().padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}








// Atualiza as tentativas do questionário na planilha "Dados Prova"
function updateAttempts() {
  const moodleUrl = "https://vestibular.univar.io/webservice/rest/server.php";
  const token = "7d38f07548d7f351022a3f6b171aaeee";
  const courseId = 8; // ID do curso
  const cmid = 71; // ID do módulo do questionário
  const quizAttemptsFunction = "mod_quiz_get_user_attempts";
  const quizParticipantsFunction = "core_enrol_get_enrolled_users";
  const batchSize = 20; // Número de participantes por lote

  try {
    Logger.log("Obtendo o quizId a partir do cmid...");
    const quizId = getQuizIdFromCmid(moodleUrl, token, courseId, cmid);
    if (!quizId) {
      Logger.log("Não foi possível localizar o quizId para o módulo.");
      updateSheet("Prova - Agendado", [["Erro"]], [["Não foi possível localizar o quizId"]]);
      return;
    }
    Logger.log(`quizId localizado: ${quizId}`);

    Logger.log("Obtendo participantes do curso...");
    const participants = callMoodleAPI(moodleUrl, token, quizParticipantsFunction, { courseid: courseId });
    Logger.log("Participantes retornados: ", participants);

    if (!participants || participants.length === 0) {
      Logger.log("Nenhum participante encontrado no curso.");
      updateSheet("Prova - Agendado", [["Erro"]], [["Nenhum participante encontrado"]]);
      return;
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Prova - Agendado") ||
      SpreadsheetApp.getActiveSpreadsheet().insertSheet("Prova - Agendado");
    sheet.clear(); // Limpa a planilha antes de atualizar os dados
   sheet.appendRow(["Nome", "CPF", "E-mail", "Telefone", "Opção de Curso", "Grupo", "Papel", "Estado", "Nota", "Início da Tentativa"]); // Adiciona os cabeçalhos

// Dividir participantes em lotes e processar
for (let i = 0; i < participants.length; i += batchSize) {
  const batch = participants.slice(i, i + batchSize);
  Logger.log(`Processando lote ${Math.ceil(i / batchSize) + 1} de participantes...`);

  const batchData = [];
  batch.forEach(participant => {
    try {
      const attempts = callMoodleAPI(moodleUrl, token, quizAttemptsFunction, {
        quizid: quizId,
        userid: participant.id,
      });

      Logger.log(`Tentativas retornadas para o usuário ${participant.fullname}: `, attempts);

      const groupNames = participant.groups
        ? participant.groups.map(group => group.name).join(", ")
        : "Sem grupo";

      if (attempts && attempts.attempts && attempts.attempts.length > 0) {
        attempts.attempts.forEach(attempt => {
          batchData.push([
            participant.fullname || "Nome não disponível",
            formatCPF(participant.username) || "CPF inválido",
            participant.email || "E-mail não disponível",
            formatPhone(getProfileField(participant, "Telefone")) || " ",
            getProfileField(participant, "Curso") || ".",
            groupNames,
            participant.roles ? participant.roles.map(role => role.shortname).join(", ") : "Papel não disponível",
            attempt.state === "finished" ? "Finalizada" : attempt.state || "Estado não disponível",
            attempt.sumgrades !== null ? attempt.sumgrades : " ",
            attempt.timestart ? formatDate(attempt.timestart) : "Não iniciado"
          ]);
        });
      } else {
        batchData.push([
          participant.fullname || "Nome não disponível",
          formatCPF(participant.username) || "CPF inválido",
          participant.email || "E-mail não disponível",
          formatPhone(getProfileField(participant, "Telefone")) || " ",
          getProfileField(participant, "Curso") || ".",
          groupNames,
          participant.roles ? participant.roles.map(role => role.shortname).join(", ") : "Papel não disponível",
          "Sem tentativa",
          " ",
          "Não iniciado"
        ]);
      }
    } catch (error) {
      Logger.log(`Erro ao processar tentativas para o participante ${participant.fullname}: ${error.message}`);
    }
  });

  // Atualiza os dados na planilha em lotes
  if (batchData.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, batchData.length, batchData[0].length).setValues(batchData);
  }
}


    Logger.log("Tentativas atualizadas com sucesso na planilha Dados Redação.");
  } catch (error) {
    Logger.log(`Erro ao atualizar tentativas: ${error.message}`);
  }
}

// Função para obter valores de campos de perfil personalizados
function getProfileField(user, fieldName) {
  if (user.customfields && user.customfields.length > 0) {
    const customField = user.customfields.find(field => field.shortname === fieldName);
    if (customField) {
      Logger.log(`Campo personalizado encontrado: ${fieldName} = ${customField.value}`);
    } else {
      Logger.log(`Campo personalizado não encontrado: ${fieldName}`);
    }
    return customField ? customField.value : null;
  }
  Logger.log("Nenhum campo personalizado disponível para este usuário.");
  return null;
}

// Função para formatar o CPF no formato 000.000.000-##
function formatCPF(cpf) {
  if (!cpf) return null;
  const cleanedCPF = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
  const match = cleanedCPF.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  Logger.log(`CPF em formato inválido: ${cpf}`);
  return cpf; // Retorna o valor original se não for possível formatar
}

// Função para formatar telefone no formato (99) 99999-9999
function formatPhone(phone) {
  if (!phone) return null;
  const cleanedPhone = phone.replace(/\D/g, ""); // Remove caracteres não numéricos
  const match = cleanedPhone.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  Logger.log(`Telefone em formato inválido: ${phone}`);
  return phone; // Retorna o valor original se não for possível formatar
}

// Função para formatar datas no formato dd/mm/yyyy hh:mm:ss
function formatDate(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp * 1000); // Converte o timestamp para milissegundos
  const pad = num => num.toString().padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Função para obter o quizId a partir do cmid
function getQuizIdFromCmid(moodleUrl, token, courseId, cmid) {
  const courseContentsFunction = "core_course_get_contents";
  const courseContents = callMoodleAPI(moodleUrl, token, courseContentsFunction, { courseid: courseId });
  Logger.log("Estrutura do curso retornada: ", courseContents);

  for (const section of courseContents) {
    for (const module of section.modules) {
      if (module.id === cmid && module.modname === "quiz") {
        Logger.log(`Módulo encontrado: ${JSON.stringify(module)}`);
        return module.instance; // Retorna o quizId
      }
    }
  }
  Logger.log("Quiz ID não encontrado para o módulo.");
  return null; // Retorna null se não encontrar o quizId
}








// Função genérica para chamar a API do Moodle
function callMoodleAPI(url, token, functionName, params) {
  if (!url || !token || !functionName) {
    throw new Error("Parâmetros inválidos fornecidos para callMoodleAPI.");
  }

  params.wstoken = token;
  params.wsfunction = functionName;
  params.moodlewsrestformat = "json";

  const query = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");

  try {
    const response = UrlFetchApp.fetch(`${url}?${query}`);
    Logger.log(`Resposta da API para ${functionName}: ${response.getContentText()}`);
    return JSON.parse(response.getContentText());
  } catch (e) {
    Logger.log(`Erro na API do Moodle: ${e.message}`);
    throw new Error(`Erro ao acessar a API Moodle: ${e.message}`);
  }
}

// Função para atualizar a planilha em lotes
function updateSheetInBatches(sheetName, headers, data, batchSize) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  } else {
    sheet.clear(); // Limpa a planilha antes de atualizar
  }

  // Adiciona os cabeçalhos
  if (headers && headers.length > 0) {
    sheet.appendRow(headers[0]);
  }

  // Atualiza os dados em lotes
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    sheet.getRange(sheet.getLastRow() + 1, 1, batch.length, batch[0].length).setValues(batch);
  }
}



// Abre a planilha pelo nome
function importarEDepoisFormatar() {
  // Nome da planilha a ser monitorada
  const nomePlanilha = "Dados - Matriculas";

  // URL e intervalo do IMPORTRANGE
  const urlOrigem = "https://docs.google.com/spreadsheets/d/1k4hc9axeaLr1PkFhJN4QcgAL4dtHdWk0IR6k2RNW6ac/edit?gid=2042690637";
  const intervaloOrigem = "Org!A:O";

  // Acessa a planilha
  const planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nomePlanilha);
  if (!planilha) {
    Logger.log("Planilha não encontrada: " + nomePlanilha);
    return;
  }

  // Limpa os dados existentes para evitar conflitos
  planilha.getRange("A2:O").clearContent();

  // Define a fórmula IMPORTRANGE na célula A2
  const celulaImportRange = planilha.getRange("A2");
  celulaImportRange.setFormula(`=IMPORTRANGE("${urlOrigem}"; "${intervaloOrigem}")`);

  // Aguarda o carregamento do IMPORTRANGE
  SpreadsheetApp.flush();

  // Verifica se os dados foram importados completamente
  Utilities.sleep(5000);
  const lastRow = planilha.getLastRow();

  // Copia todos os dados para a planilha temporária
  const dadosCompletos = planilha.getRange(2, 1, lastRow - 1, 15).getValues();

  // Formatar a coluna C (CPF) nos dados completos
  const colunaCPF = 2; // Índice baseado em 0 para os dados completos
  const dadosFormatados = dadosCompletos.map((linha) => {
    if (linha[colunaCPF] && typeof linha[colunaCPF] === "number") {
      linha[colunaCPF] = linha[colunaCPF].toString().padStart(11, '0');
    }
    if (linha[colunaCPF] && typeof linha[colunaCPF] === "string" && linha[colunaCPF].length === 11 && linha[colunaCPF].match(/\d{11}/)) {
      linha[colunaCPF] = linha[colunaCPF].replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return linha;
  });

  // Cria uma nova planilha temporária para armazenar os dados formatados
  const planilhaTemp = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TempDados") || SpreadsheetApp.getActiveSpreadsheet().insertSheet("TempDados");
  planilhaTemp.clear();
  planilhaTemp.getRange(1, 1, dadosFormatados.length, dadosFormatados[0].length).setValues(dadosFormatados);

  Logger.log("Dados completos formatados armazenados na planilha TempDados");
}

// Adiciona um menu personalizado no Google Sheets
 function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Moodle") // Nome do menu
    .addItem("Atualizar", "updateAttempts") // Botão 2
    .addToUi();
}
