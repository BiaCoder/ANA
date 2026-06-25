// 1. Mapear os elementos do HTML
const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');

// 2. FUNÇÃO NOVA: Salvar todas as tarefas atuais no Local Storage
function salvarTarefasNoNavegador() {
    const todasAsLinhas = listaTarefas.querySelectorAll('li');
    const listaDeProjetos = [];

    // Passa por cada tarefa na tela e extrai o texto e o estado (se tá concluída ou não)
    todasAsLinhas.forEach(linha => {
        const texto = linha.querySelector('span').innerText;
        const estaConcluida = linha.classList.contains('concluida');
        
        // Guarda como um objeto estruturado
        listaDeProjetos.push({ texto: texto, concluida: estaConcluida });
    });

    // O Local Storage só aceita texto puro, então transformamos nossa lista em texto (JSON)
    localStorage.setItem('minhasTarefasSalvas', JSON.stringify(listaDeProjetos));
}

// 3. Montar a estrutura da tarefa e colocar na tela (Centralizado para evitar repetição de código)
function criarElementoTarefaNaTela(texto, estaConcluida = false) {
    const novaLinha = document.createElement('li');
    
    const spanTexto = document.createElement('span');
    spanTexto.innerText = texto;
    novaLinha.appendChild(spanTexto);

    const botaoDeletar = document.createElement('button');
    botaoDeletar.innerText = "X";
    botaoDeletar.classList.add('botao-deletar');
    novaLinha.appendChild(botaoDeletar);

    // Se o banco de dados disser que a tarefa já estava concluída, aplica a classe
    if (estaConcluida) {
        novaLinha.classList.add('concluida');
    }

    // INTERAÇÃO: Clicar para riscar
    spanTexto.addEventListener('click', function() {
        novaLinha.classList.toggle('concluida');
        salvarTarefasNoNavegador(); // Atualiza o banco ao riscar
    });

    // INTERAÇÃO: Clicar para deletar
    botaoDeletar.addEventListener('click', function() {
        novaLinha.remove();
        salvarTarefasNoNavegador(); // Atualiza o banco ao deletar
    });

    listaTarefas.appendChild(novaLinha);
}

// 4. Função que o botão principal dispara ao ser clicado
function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === "") {
        alert("Por favor, digite uma tarefa!");
        return; 
    }

    // Cria na tela
    criarElementoTarefaNaTela(textoTarefa);

    // Salva o novo estado no banco de dados
    salvarTarefasNoNavegador();

    campoTarefa.value = "";
    campoTarefa.focus();
}

// 5. FUNÇÃO NOVA: Buscar as tarefas salvas quando a página carregar
function carregarTarefasSalvas() {
    const dadosSalvos = localStorage.getItem('minhasTarefasSalvas');

    // Se existir algo salvo no banco do navegador...
    if (dadosSalvos) {
        // Transforma o texto de volta em uma lista de objetos reais
        const listaDeTarefas = JSON.parse(dadosSalvos);

        // Recria cada uma delas na tela
        listaDeTarefas.forEach(tarefa => {
            criarElementoTarefaNaTela(tarefa.texto, tarefa.concluida);
        });
    }
}

// --- EVENTOS DE DISPARO ---
botaoAdicionar.addEventListener('click', adicionarTarefa);

campoTarefa.addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});

// DISPARO INICIAL: Assim que abrir o site, roda a função que busca os dados salvos
carregarTarefasSalvas();