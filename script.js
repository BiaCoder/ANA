// 1. MAPEANDO OS ELEMENTOS DO HTML
const inputTarefa = document.getElementById('campo-tarefa');
const inputDetalhes = document.getElementById('input-detalhes');
const selectCategoria = document.getElementById('select-categoria');
const inputData = document.getElementById('input-data');
const botaoAdicionar = document.getElementById('botao-add-avancado');
const listaCompleta = document.getElementById('lista-tarefas');

// Nossa lista de tarefas que começará vazia ou lerá o que já está salvo
let minhaListaDeItens = [];

// 2. FUNÇÃO PARA ADICIONAR UMA NOVA TAREFA
function adicionarNovaTarefa() {
    // Validação simples: não deixa adicionar se o nome da tarefa estiver vazio
    if (inputTarefa.value.trim() === '') {
        alert('Por favor, digite pelo menos o nome da tarefa! 🤔');
        return;
    }

    // Criamos um objeto completo com todas as informações digitadas
    const novaTarefa = {
        id: Date.now(), // Gera um ID único para cada tarefa
        texto: inputTarefa.value,
        detalhes: inputDetalhes.value,
        categoria: selectCategoria.value,
        data: inputData.value,
        concluida: false
    };

    // Adiciona o objeto na nossa lista
    minhaListaDeItens.push(novaTarefa);

    // Limpa os campos do formulário para o usuário digitar a próxima
    inputTarefa.value = '';
    inputDetalhes.value = '';
    inputData.value = '';

    // Atualiza a tela e salva no banco de dados do navegador
    mostrarTarefasNaTela();
    salvarNoLocalStorage();
}

// 3. FUNÇÃO PARA MOSTRAR AS TAREFAS NA TELA
function mostrarTarefasNaTela() {
    let novaLi = '';

    minhaListaDeItens.forEach((tarefa) => {
        // Formata a data de AAAA-MM-DD para o padrão brasileiro DD/MM/AAAA se ela existir
        let dataFormatada = '';
        if (tarefa.data) {
            const [ano, mes, dia] = tarefa.data.split('-');
            dataFormatada = `📅 ${dia}/${mes}/${ano}`;
        }

        novaLi += `
            <li class="item-tarefa ${tarefa.concluida ? 'done' : ''}">
                <div class="tarefa-conteudo">
                    <div class="tarefa-linha-topo">
                        <span class="tarefa-texto">${tarefa.texto}</span>
                        <span class="tarefa-tag">${tarefa.categoria}</span>
                    </div>
                    ${tarefa.detalhes ? `<p class="tarefa-detalhes">${tarefa.detalhes}</p>` : ''}
                    ${dataFormatada ? `<span class="tarefa-data-entrega">${dataFormatada}</span>` : ''}
                </div>
                <div class="tarefa-acoes">
                    <button class="btn-check" onclick="alternarConclusao(${tarefa.id})">✔️</button>
                    <button class="btn-delete" onclick="deletarTarefa(${tarefa.id})">🗑️</button>
                </div>
            </li>
        `;
    });

    listaCompleta.innerHTML = novaLi;
}

// 4. FUNÇÃO PARA MARCAR COMO CONCLUÍDA / PENDENTE
function alternarConclusao(idBuscado) {
    minhaListaDeItens = minhaListaDeItens.map(tarefa => {
        if (tarefa.id === idBuscado) {
            return { ...tarefa, concluida: !tarefa.concluida };
        }
        return tarefa;
    });

    mostrarTarefasNaTela();
    salvarNoLocalStorage();
}

// 5. FUNÇÃO PARA DELETAR UMA TAREFA
function deletarTarefa(idBuscado) {
    minhaListaDeItens = minhaListaDeItens.filter(tarefa => tarefa.id !== idBuscado);
    
    mostrarTarefasNaTela();
    salvarNoLocalStorage();
}

// 6. FUNÇÃO PARA SALVAR NO BANCO DO NAVEGADOR (LOCALSTORAGE)
function salvarNoLocalStorage() {
    localStorage.setItem('minhasTarefasSalvas', JSON.stringify(minhaListaDeItens));
}

// 7. FUNÇÃO PARA CARREGAR AS TAREFAS SALVAS AUTOMATICAMENTE
function carregarTarefasSalvas() {
    const dadosSalvos = localStorage.getItem('minhasTarefasSalvas');
    
    if (dadosSalvos) {
        minhaListaDeItens = JSON.parse(dadosSalvos);
    }
    
    mostrarTarefasNaTela();
}

// 8. OUVINTES DE EVENTOS (DISPARADORES)
botaoAdicionar.addEventListener('click', adicionarNovaTarefa);

// Permite adicionar a tarefa apertando a tecla "Enter" no campo principal
inputTarefa.addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        adicionarNovaTarefa();
    }
});

// Executa automaticamente assim que a página abre para carregar os dados
carregarTarefasSalvas();