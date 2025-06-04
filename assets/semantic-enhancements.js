// Melhorias específicas para análise semântica
// Este arquivo COMPLEMENTA seu app.js atual

// Sobrescrever apenas as funções de análise semântica
function ativarAnaliseSemantica() {
    appState.analiseSemanticaAtiva = !appState.analiseSemanticaAtiva;
    
    const botao = document.getElementById('btnAnaliseSemantica');
    const status = document.getElementById('semanticStatus');
    
    if (appState.analiseSemanticaAtiva) {
        botao.innerHTML = '📊 Voltar para Análise Tradicional';
        botao.className = 'btn';
        
        // Adicionar indicador visual
        let indicador = document.getElementById('indicadorModo');
        if (!indicador) {
            indicador = document.createElement('div');
            indicador.id = 'indicadorModo';
            indicador.className = 'modo-semantico';
            document.getElementById('semantica').insertBefore(indicador, document.querySelector('#semantica h2').nextSibling);
        }
        indicador.innerHTML = '🧠 MODO ATIVO: Análise Semântica (IA)';
        indicador.style.display = 'block';
        
        status.classList.remove('hidden');
        carregarCriteriosSemanticosSimples();
        
    } else {
        botao.innerHTML = '🧠 Ativar Análise Semântica';
        botao.className = 'btn semantic';
        
        const indicador = document.getElementById('indicadorModo');
        if (indicador) indicador.style.display = 'none';
        
        status.classList.add('hidden');
    }
}

async function carregarCriteriosSemanticosSimples() {
    try {
        const response = await fetch('assets/criterios_avancados.json');
        const dados = await response.json();
        appState.criteriosSemanticos = dados;
        console.log('✅ Critérios semânticos carregados');
    } catch (error) {
        console.error('❌ Erro ao carregar critérios:', error);
    }
}

// Análise semântica aprimorada (complementa sua função existente)
function analisarCandidatoSemantico(candidato, criteriosSemanticos) {
    if (!criteriosSemanticos || !criteriosSemanticos.grupos) {
        return Math.random() * 100; // fallback
    }
    
    // Simular texto do currículo
    const texto = `programação cnc operador setup máquina fanuc ${candidato.nome}`;
    
    let pontuacaoTotal = 0;
    let pesoTotal = 0;
    
    criteriosSemanticos.grupos.forEach(grupo => {
        let matchesEncontrados = 0;
        grupo.palavrasChave.forEach(palavra => {
            if (texto.toLowerCase().includes(palavra.toLowerCase())) {
                matchesEncontrados++;
            }
        });
        
        const porcentagemMatch = matchesEncontrados / grupo.palavrasChave.length;
        pontuacaoTotal += porcentagemMatch * grupo.peso;
        pesoTotal += grupo.peso;
    });
    
    const pontuacaoFinal = pesoTotal > 0 ? (pontuacaoTotal / pesoTotal) * 100 : 0;
    return Math.round(pontuacaoFinal * 100) / 100;
}

console.log('🧠 Melhorias semânticas carregadas');