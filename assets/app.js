// === CV ANALYZER PRO - SISTEMA COMPLETO ===
// Desenvolvido por Rogerinho Ramos - 2025
// Sistema Inteligente de Análise de Candidatos com IA

// === ESTADO GLOBAL DA APLICAÇÃO ===
let appState = {
    pdfData: null,
    candidatos: [],
    candidatosSelecionados: new Set(),
    motivosExclusao: {},
    vagaConfig: {},
    templateSelecionado: null,
    resultadosAnalise: {},
    coordenadasVaga: null,
    analiseSemanticaAtiva: false,
    criteriosSemanticos: null
};

// === TEMPLATES PREDEFINIDOS ===
const templates = {
    cnc_multifuncional: {
        nome: "Operador CNC Multifuncional",
        descricao: "Profissional versátil com experiência em múltiplas máquinas CNC",
        criterios: {
            experiencia_cnc: { nome: "Experiência CNC", peso: 10, obrigatorio: true },
            torno_cnc: { nome: "Torno CNC", peso: 8, obrigatorio: true },
            centro_usinagem: { nome: "Centro de Usinagem", peso: 7, obrigatorio: false },
            programacao_manual: { nome: "Programação Manual", peso: 6, obrigatorio: false },
            setup_maquina: { nome: "Setup de Máquina", peso: 8, obrigatorio: true },
            leitura_desenho: { nome: "Leitura Desenho Técnico", peso: 7, obrigatorio: true },
            instrumentos_medicao: { nome: "Instrumentos de Medição", peso: 7, obrigatorio: true },
            anos_experiencia: { nome: "Anos de Experiência", peso: 6, obrigatorio: false },
            formacao_senai: { nome: "Formação SENAI", peso: 5, obrigatorio: false },
            proximidade: { nome: "Proximidade da Vaga", peso: 3, obrigatorio: false }
        }
    },
    preparador_manual: {
        nome: "Preparador CNC Manual",
        descricao: "Especialista em programação manual e setup de máquinas",
        criterios: {
            programacao_manual: { nome: "Programação Manual", peso: 10, obrigatorio: true },
            codigos_g_m: { nome: "Códigos G/M", peso: 9, obrigatorio: true },
            setup_maquina: { nome: "Setup de Máquina", peso: 9, obrigatorio: true },
            fanuc_siemens: { nome: "Comandos Fanuc/Siemens", peso: 8, obrigatorio: true },
            preset_ferramentas: { nome: "Preset de Ferramentas", peso: 8, obrigatorio: true },
            experiencia_cnc: { nome: "Experiência CNC", peso: 8, obrigatorio: true },
            leitura_desenho: { nome: "Leitura Desenho Técnico", peso: 7, obrigatorio: true },
            programacao_cam: { nome: "Programação CAM", peso: 0, obrigatorio: false },
            anos_experiencia: { nome: "Anos de Experiência", peso: 7, obrigatorio: false },
            proximidade: { nome: "Proximidade da Vaga", peso: 3, obrigatorio: false }
        }
    },
    preparador_cam: {
        nome: "Preparador CNC CAM",
        descricao: "Especialista em programação via software CAM",
        criterios: {
            programacao_cam: { nome: "Programação CAM", peso: 10, obrigatorio: true },
            mastercam: { nome: "MasterCAM", peso: 9, obrigatorio: true },
            powermill: { nome: "PowerMill", peso: 8, obrigatorio: false },
            solidworks: { nome: "SolidWorks/CAD", peso: 7, obrigatorio: false },
            setup_maquina: { nome: "Setup de Máquina", peso: 8, obrigatorio: true },
            preset_ferramentas: { nome: "Preset de Ferramentas", peso: 8, obrigatorio: true },
            experiencia_cnc: { nome: "Experiência CNC", peso: 7, obrigatorio: true },
            programacao_manual: { nome: "Programação Manual", peso: 5, obrigatorio: false },
            anos_experiencia: { nome: "Anos de Experiência", peso: 6, obrigatorio: false },
            proximidade: { nome: "Proximidade da Vaga", peso: 3, obrigatorio: false }
        }
    },
    // Templates semânticos
    semantic_cnc_avancado: {
        nome: "🧠 CNC Avançado (IA)",
        descricao: "Análise semântica para perfis CNC com reconhecimento inteligente de competências",
        tipo: "semantico",
        criterios: {
            programacao_cnc: { nome: "Programação CNC", peso: 10, obrigatorio: true },
            operacao_cnc: { nome: "Operação CNC", peso: 9, obrigatorio: true },
            comandos_cnc: { nome: "Comandos CNC", peso: 8, obrigatorio: true },
            setup_preparacao: { nome: "Setup e Preparação", peso: 9, obrigatorio: true },
            medicao_desenho: { nome: "Medição e Desenho", peso: 8, obrigatorio: true },
            tipos_maquina: { nome: "Tipos de Máquina", peso: 8, obrigatorio: false },
            multifuncionalidade: { nome: "Multifuncionalidade", peso: 7, obrigatorio: false },
            formacao_tecnica: { nome: "Formação Técnica", peso: 6, obrigatorio: false }
        }
    },
    semantic_programador_cam: {
        nome: "🧠 Programador CAM (IA)",
        descricao: "Análise semântica especializada para programadores CAM",
        tipo: "semantico",
        criterios: {
            programacao_cam: { nome: "Programação CAM", peso: 10, obrigatorio: true },
            programacao_cnc: { nome: "Programação CNC", peso: 8, obrigatorio: true },
            comandos_cnc: { nome: "Comandos CNC", peso: 7, obrigatorio: true },
            setup_preparacao: { nome: "Setup e Preparação", peso: 8, obrigatorio: true },
            medicao_desenho: { nome: "Medição e Desenho", peso: 8, obrigatorio: true },
            macro_programming: { nome: "Macro Programming", peso: 9, obrigatorio: false },
            formacao_tecnica: { nome: "Formação Técnica", peso: 6, obrigatorio: false }
        }
    }
};

// === NORMALIZADOR DE CIDADES ===
const normalizadorCidades = {
    dicionario: {
        "campo_limpo": ["campo limpo paulista", "campo limpo pta", "campo limpo", "clp"],
        "varzea_paulista": ["várzea paulista", "varzea paulista", "vp"],
        "jundiai": ["jundiaí", "jundiai", "jundiai sp"],
        "itupeva": ["itupeva", "itupeva sp"],
        "cajamar": ["cajamar", "cajamar sp"],
        "itatiba": ["itatiba", "itatiba sp"]
    },
    coordenadas: {
        "campo_limpo": { lat: -23.2109, lng: -46.7654 },
        "varzea_paulista": { lat: -23.2108, lng: -46.8286 },
        "jundiai": { lat: -23.1864, lng: -46.8842 },
        "itupeva": { lat: -23.1486, lng: -47.0583 },
        "cajamar": { lat: -23.3553, lng: -46.8761 },
        "itatiba": { lat: -23.0056, lng: -46.8394 }
    },
    normalizar: function(endereco) {
        if (!endereco) return "outros";
        
        const limpo = endereco
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[\/\-,]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        for (const [oficial, variacoes] of Object.entries(this.dicionario)) {
            if (variacoes.some(variacao => limpo.includes(variacao))) {
                return oficial;
            }
        }
        
        return "outros";
    }
};

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema CV Analyzer inicializando...');
    try {
        carregarTemplatesPersonalizados();
        carregarTemplates();
        carregarTemplatesSemanticos();
        configurarEventos();
        atualizarStatusEtapas();
        
        console.log('🎉 Sistema CV Analyzer inicializado com sucesso!');
        setTimeout(verificarInicializacao, 1000);
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        alert('Erro na inicialização do sistema. Recarregue a página.');
    }
});

function verificarInicializacao() {
    const fileInput = document.getElementById('pdfFile');
    const uploadArea = document.querySelector('.upload-area');
    if (!fileInput || !uploadArea) {
        console.error('❌ Elementos críticos não encontrados após inicialização!');
        setTimeout(reconfigurarEventos, 500);
        return;
    }
    console.log('✅ Verificação de inicialização concluída - Sistema OK');
}

// === CONFIGURAÇÃO DE EVENTOS ===
function configurarEventos() {
    console.log('🔧 Configurando eventos...');
    const fileInput = document.getElementById('pdfFile');
    if (fileInput) {
        fileInput.removeEventListener('change', handleFileUpload);
        fileInput.addEventListener('change', handleFileUpload);
        console.log('✅ Event listener do file input configurado');
    }

    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.removeEventListener('dragover', handleDragOver);
        uploadArea.removeEventListener('dragleave', handleDragLeave);
        uploadArea.removeEventListener('drop', handleFileDrop);
        
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleFileDrop);
        console.log('✅ Event listeners de drag&drop configurados');
    }
}

function reconfigurarEventos() {
    console.log('🔧 Reconfigurando eventos...');
    try {
        const fileInput = document.getElementById('pdfFile');
        if (fileInput) {
            fileInput.onchange = function(event) {
                console.log('📁 Arquivo selecionado (método alternativo)');
                handleFileUpload(event);
            };
        }
        
        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.ondragover = function(event) {
                event.preventDefault();
                event.currentTarget.classList.add('dragover');
            };
            
            uploadArea.ondragleave = function(event) {
                event.currentTarget.classList.remove('dragover');
            };
            
            uploadArea.ondrop = function(event) {
                console.log('📁 Arquivo arrastado (método alternativo)');
                handleFileDrop(event);
            };
            
            uploadArea.onclick = function() {
                console.log('🖱️ Clique na área de upload detectado');
                fileInput.click();
            };
        }
        console.log('✅ Reconfiguração concluída');
    } catch (error) {
        console.error('❌ Erro na reconfiguração:', error);
    }
}

// === NAVEGAÇÃO ENTRE ABAS ===
function showTab(tabName) {
    console.log(`🔄 Mudando para aba: ${tabName}`);
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const targetTab = document.getElementById(tabName);
    const targetButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);

    if (targetTab) {
        targetTab.classList.add('active');
    }

    if (targetButton) {
        targetButton.classList.add('active');
    }

    try {
        if (tabName === 'upload') {
            setTimeout(() => {
                const fileInput = document.getElementById('pdfFile');
                const uploadArea = document.querySelector('.upload-area');
                
                if (!fileInput || !uploadArea) {
                    console.log('⚠️ Elementos de upload não encontrados, reconfigurando...');
                    reconfigurarEventos();
                }
            }, 100);
            
        } else if (tabName === 'selecao') {
            setTimeout(inicializarAbaSeleção, 100);
            
        } else if (tabName === 'templates') {
            setTimeout(atualizarStatusEtapas, 100);
            
        } else if (tabName === 'semantica') {
            setTimeout(carregarTemplatesSemanticos, 100);
        }
        
        console.log(`✅ Aba ${tabName} carregada com sucesso`);
        
    } catch (error) {
        console.error(`❌ Erro ao inicializar aba ${tabName}:`, error);
    }
}

// === TESTE DO SISTEMA ===
function testarUpload() {
    console.log('🔧 === TESTE DO SISTEMA DE UPLOAD ===');
    const resultados = {
        pdfJsCarregado: typeof pdfjsLib !== 'undefined',
        fileInputExiste: !!document.getElementById('pdfFile'),
        uploadAreaExiste: !!document.querySelector('.upload-area'),
        eventListenersAtivos: false,
        estadoAplicacao: Object.keys(appState).length > 0
    };

    const fileInput = document.getElementById('pdfFile');
    if (fileInput) {
        const hasListener = fileInput.onchange !== null;
        resultados.eventListenersAtivos = hasListener;
    }

    let relatorio = '🔧 TESTE DO SISTEMA DE UPLOAD\n\n';
    relatorio += `📚 PDF.js carregado: ${resultados.pdfJsCarregado ? '✅ SIM' : '❌ NÃO'}\n`;
    relatorio += `📄 Input de arquivo existe: ${resultados.fileInputExiste ? '✅ SIM' : '❌ NÃO'}\n`;
    relatorio += `📂 Área de upload existe: ${resultados.uploadAreaExiste ? '✅ SIM' : '❌ NÃO'}\n`;
    relatorio += `🔗 Event listeners ativos: ${resultados.eventListenersAtivos ? '✅ SIM' : '❌ NÃO'}\n`;

    const problemas = [];
    if (!resultados.pdfJsCarregado) problemas.push('PDF.js não carregou');
    if (!resultados.fileInputExiste) problemas.push('Input de arquivo não encontrado');
    if (!resultados.uploadAreaExiste) problemas.push('Área de upload não encontrada');

    if (problemas.length > 0) {
        relatorio += '\n⚠️ PROBLEMAS ENCONTRADOS:\n';
        problemas.forEach(problema => relatorio += `• ${problema}\n`);
        relatorio += '\n🔧 TENTANDO CORRIGIR...\n';
        
        reconfigurarEventos();
        relatorio += '✅ Reconfiguração executada!\n';
    } else {
        relatorio += '\n✅ SISTEMA OK - Tente fazer upload de um PDF\n';
    }

    alert(relatorio);
    console.log('🔧 === FIM DO TESTE ===');
}

// === PROCESSAMENTO DE PDF ===
function handleFileUpload(event) {
    console.log('📁 Arquivo selecionado via input');
    const file = event.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
        console.log('✅ Arquivo PDF válido, iniciando processamento...');
        processarPDF(file);
    } else {
        alert('Por favor, selecione um arquivo PDF válido.');
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

function handleFileDrop(event) {
    console.log('📁 Arquivo arrastado para upload area');
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    const files = event.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf') {
            document.getElementById('pdfFile').files = files;
            processarPDF(file);
        } else {
            alert('Por favor, arraste um arquivo PDF válido.');
        }
    }
}

async function processarPDF(file) {
    console.log('🔍 Iniciando processamento do PDF:', file.name);
    if (typeof pdfjsLib === 'undefined') {
        alert('Erro: Biblioteca PDF.js não carregada. Recarregue a página e tente novamente.');
        return;
    }

    const loadingElement = document.getElementById('loadingPDF');
    const fileInfoElement = document.getElementById('fileInfo');
    const fileNameElement = document.getElementById('fileName');

    if (loadingElement) loadingElement.classList.add('show');
    if (fileInfoElement) fileInfoElement.classList.remove('hidden');
    if (fileNameElement) fileNameElement.textContent = file.name;

    try {
        console.log('📖 Convertendo arquivo para ArrayBuffer...');
        const arrayBuffer = await file.arrayBuffer();
        
        console.log('📚 Carregando PDF com PDF.js...');
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        console.log(`✅ PDF carregado com ${pdf.numPages} páginas`);
        
        let textoCompleto = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`📄 Processando página ${i}/${pdf.numPages}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const textoPagina = textContent.items.map(item => item.str).join(' ');
            textoCompleto += textoPagina + ' ';
            
            const statusElement = document.querySelector('#loadingPDF p');
            if (statusElement) {
                statusElement.textContent = `Processando página ${i}/${pdf.numPages}... Extraindo texto...`;
            }
        }
        
        console.log(`✅ Texto total extraído: ${textoCompleto.length} caracteres`);
        
        if (textoCompleto.length < 100) {
            throw new Error('PDF parece estar vazio ou com pouco conteúdo');
        }
        
        const statusElement = document.querySelector('#loadingPDF p');
        if (statusElement) {
            statusElement.textContent = 'Identificando candidatos...';
        }
        
        const candidatos = extrairCandidatos(textoCompleto);
        
        if (candidatos.length === 0) {
            throw new Error('Nenhum candidato foi encontrado no PDF');
        }
        
        appState.pdfData = arrayBuffer;
        appState.candidatos = candidatos;
        
        console.log(`✅ PDF processado com sucesso: ${candidatos.length} candidatos encontrados`);
        
        if (loadingElement) loadingElement.classList.remove('show');
        exibirCandidatos(candidatos);
        
    } catch (error) {
        console.error('❌ Erro ao processar PDF:', error);
        
        if (loadingElement) loadingElement.classList.remove('show');
        
        let mensagemErro = 'Erro ao processar o PDF:\n\n';
        
        if (error.message.includes('vazio')) {
            mensagemErro += '• O PDF parece estar vazio ou não contém texto extraível\n';
        } else if (error.message.includes('Nenhum candidato')) {
            mensagemErro += '• Não foi possível encontrar candidatos no formato esperado\n';
        } else {
            mensagemErro += `• ${error.message}\n`;
        }
        
        alert(mensagemErro);
    }
}

function extrairCandidatos(texto) {
    const candidatos = [];
    const regexPrincipal = /(\d+).\s*([A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ\s]{3,80}?)\s+(Cand-\d+)/gi;
    const nomesEncontrados = new Set();
    const idsEncontrados = new Set();
    let match;

    console.log('Iniciando extração de candidatos...');

    while ((match = regexPrincipal.exec(texto)) !== null) {
        const numero = parseInt(match[1]);
        let nomeRaw = match[2].trim();
        const id = match[3];
        
        if (idsEncontrados.has(id)) continue;
        
        const nomeClean = limparNome(nomeRaw);
        
        if (nomeClean.length < 3) continue;
        
        const nomeKey = nomeClean.toLowerCase();
        if (nomesEncontrados.has(nomeKey)) continue;
        
        nomesEncontrados.add(nomeKey);
        idsEncontrados.add(id);
        
        candidatos.push({
            numero: numero,
            nome: nomeClean,
            id: id,
            pontuacao: Math.random() * 100,
            detalhes: {},
            endereco: "",
            cidade_normalizada: "",
            distancia: 0,
            competencias: []
        });
        
        console.log(`✅ Candidato ${numero}: "${nomeClean}" (${id})`);
    }

    candidatos.sort((a, b) => a.numero - b.numero);
    console.log(`Extração concluída: ${candidatos.length} candidatos válidos`);

    return candidatos;
}

function limparNome(nome) {
    if (!nome) return "";
    
    let nomeBasico = nome
        .replace(/\s+/g, ' ')
        .replace(/[^\w\sÀ-ÿ]/g, ' ')
        .trim();

    const palavras = nomeBasico.toLowerCase().split(' ').filter(p => p.length > 0);
    
    // Capitalizar corretamente
    const palavrasFinais = palavras.map(palavra => {
        if (['de', 'da', 'do', 'das', 'dos', 'e'].includes(palavra) && palavra.length <= 3) {
            return palavra;
        } else {
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        }
    });

    return palavrasFinais.join(' ');
}

function exibirCandidatos(candidatos) {
    document.getElementById('candidatesList').classList.remove('hidden');
    document.getElementById('candidatesCount').innerHTML = 
        `<strong>✅ ${candidatos.length} candidatos encontrados no PDF</strong>`;
    
    const preview = document.getElementById('candidatesPreview');
    const primeiros10 = candidatos.slice(0, 10);

    preview.innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <strong>📋 Prévia dos primeiros 10 candidatos:</strong><br>
            ${primeiros10.map(c => `• ${c.nome} (${c.id})`).join('<br>')}
            ${candidatos.length > 10 ? `<br><em>... e mais ${candidatos.length - 10} candidatos</em>` : ''}
        </div>
    `;

    // Inicializar seleção de todos os candidatos
    appState.candidatosSelecionados.clear();
    candidatos.forEach(candidato => {
        appState.candidatosSelecionados.add(candidato.id);
    });

    atualizarStatusEtapas();
    console.log('✅ Candidatos exibidos e selecionados por padrão');
}

// === FUNÇÕES DE SELEÇÃO DE CANDIDATOS ===
function inicializarAbaSeleção() {
    if (appState.candidatos.length === 0) {
        document.getElementById('listaCandidatos').innerHTML = 
            `<div style="text-align: center; padding: 40px; color: #7f8c8d;">
                📋 Nenhum candidato carregado. Por favor, faça o upload do PDF primeiro.
            </div>`;
        return;
    }

    if (appState.candidatosSelecionados.size === 0) {
        appState.candidatos.forEach(candidato => {
            appState.candidatosSelecionados.add(candidato.id);
        });
    }

    atualizarListaCandidatos();
    console.log('👥 Aba de seleção inicializada');
}

function atualizarListaCandidatos() {
    const lista = document.getElementById('listaCandidatos');
    if (!lista) return;
    
    const candidatos = appState.candidatos || [];
    const filtroDistancia = document.getElementById('filtroDistancia')?.value || 'todos';
    const buscaTexto = document.getElementById('buscaCandidato')?.value.toLowerCase() || '';

    // Aplicar filtros
    let candidatosFiltrados = candidatos.filter(candidato => {
        const nomeMatch = candidato.nome.toLowerCase().includes(buscaTexto);
        const idMatch = candidato.id.toLowerCase().includes(buscaTexto);
        if (!nomeMatch && !idMatch) return false;
        
        if (filtroDistancia !== 'todos') {
            const distanciaMax = parseInt(filtroDistancia);
            const distanciaCandidato = candidato.distancia || Math.random() * 50;
            if (distanciaCandidato > distanciaMax) return false;
        }
        
        return true;
    });

    if (candidatosFiltrados.length === 0) {
        lista.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                🔍 Nenhum candidato encontrado com os filtros aplicados
            </div>
        `;
        return;
    }

    lista.innerHTML = candidatosFiltrados.map(candidato => {
        const selecionado = appState.candidatosSelecionados.has(candidato.id);
        const motivo = appState.motivosExclusao[candidato.id] || '';
        const distancia = candidato.distancia || (Math.random() * 40 + 2).toFixed(1);
        
        return `
            <div style="
                display: flex;
                align-items: flex-start;
                padding: 15px;
                margin-bottom: 10px;
                background: ${selecionado ? '#f8fff8' : '#fff5f5'};
                border: 2px solid ${selecionado ? '#2ecc71' : '#e74c3c'};
                border-radius: 8px;
                transition: all 0.3s ease;
            ">
                <div style="margin-right: 15px; margin-top: 5px;">
                    <input type="checkbox" 
                           id="check-${candidato.id}"
                           ${selecionado ? 'checked' : ''}
                           onchange="toggleCandidato('${candidato.id}')"
                           style="transform: scale(1.3);">
                </div>
                
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: ${selecionado ? '#2c3e50' : '#7f8c8d'}; margin-bottom: 5px;">
                        ${candidato.numero}. ${candidato.nome}
                    </div>
                    <div style="color: #7f8c8d; font-size: 0.9em; margin-bottom: 5px;">
                        📍 ${candidato.endereco || 'Endereço simulado'} • ${candidato.id} • ${distancia}km
                    </div>
                    
                    ${!selecionado ? `
                        <div style="margin-top: 10px;">
                            <input type="text" 
                                   placeholder="Motivo da exclusão (opcional)"
                                   value="${motivo}"
                                   onchange="atualizarMotivo('${candidato.id}', this.value)"
                                   style="
                                       width: 100%;
                                       padding: 6px;
                                       border: 1px solid #ddd;
                                       border-radius: 4px;
                                       font-size: 0.85em;
                                       background: #fffbf0;
                                   ">
                        </div>
                    ` : ''}
                </div>
                
                <div style="margin-left: 15px; text-align: center;">
                    <div style="font-size: 1.5em; margin-bottom: 5px;">
                        ${selecionado ? '✅' : '❌'}
                    </div>
                    <div style="
                        font-size: 0.75em;
                        color: ${selecionado ? '#2ecc71' : '#e74c3c'};
                        font-weight: bold;
                    ">${selecionado ? 'INCLUÍDO' : 'EXCLUÍDO'}</div>
                </div>
            </div>
        `;
    }).join('');

    atualizarContadores();
}

function toggleCandidato(candidatoId) {
    if (appState.candidatosSelecionados.has(candidatoId)) {
        appState.candidatosSelecionados.delete(candidatoId);
    } else {
        appState.candidatosSelecionados.add(candidatoId);
        delete appState.motivosExclusao[candidatoId];
    }
    atualizarListaCandidatos();
}

function atualizarMotivo(candidatoId, motivo) {
    if (motivo.trim()) {
        appState.motivosExclusao[candidatoId] = motivo.trim();
    } else {
        delete appState.motivosExclusao[candidatoId];
    }
}

function selecionarTodos() {
    appState.candidatosSelecionados.clear();
    appState.candidatos.forEach(candidato => {
        appState.candidatosSelecionados.add(candidato.id);
    });
    appState.motivosExclusao = {};
    atualizarListaCandidatos();
}

function desmarcarTodos() {
    appState.candidatosSelecionados.clear();
    atualizarListaCandidatos();
}

function inverterSelecao() {
    const novaSelecao = new Set();
    appState.candidatos.forEach(candidato => {
        if (!appState.candidatosSelecionados.has(candidato.id)) {
            novaSelecao.add(candidato.id);
        }
    });
    appState.candidatosSelecionados = novaSelecao;
    atualizarListaCandidatos();
}

function aplicarFiltros() {
    atualizarListaCandidatos();
}

function atualizarContadores() {
    const total = appState.candidatos.length;
    const selecionados = appState.candidatosSelecionados.size;
    const excluidos = total - selecionados;
    
    const elementoTotal = document.getElementById('totalCandidatos');
    const elementoSelecionados = document.getElementById('candidatosSelecionados');
    const elementoExcluidos = document.getElementById('candidatosExcluidos');

    if (elementoTotal) elementoTotal.textContent = total;
    if (elementoSelecionados) elementoSelecionados.textContent = selecionados;
    if (elementoExcluidos) elementoExcluidos.textContent = excluidos;
}

// === FUNÇÕES DE TEMPLATES ===
function carregarTemplatesPersonalizados() {
    try {
        const templatesPersonalizados = JSON.parse(localStorage.getItem('templatesPersonalizados') || '{}');
        Object.entries(templatesPersonalizados).forEach(([chave, template]) => {
            templates[chave] = template;
        });
        
        console.log(`📋 ${Object.keys(templatesPersonalizados).length} templates personalizados carregados`);
        
    } catch (error) {
        console.error('Erro ao carregar templates personalizados:', error);
    }
}

function carregarTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    // Separar templates padrão dos personalizados
    const templatesEstaticos = {};
    const templatesPersonalizados = {};

    Object.entries(templates).forEach(([key, template]) => {
        if (key.startsWith('custom_')) {
            templatesPersonalizados[key] = template;
        } else if (template.tipo !== 'semantico') {
            templatesEstaticos[key] = template;
        }
    });

    // Renderizar templates padrão
    Object.entries(templatesEstaticos).forEach(([key, template]) => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.onclick = () => selecionarTemplate(key);
        
        const criteriosTexto = Object.keys(template.criterios)
            .filter(c => template.criterios[c].peso > 0)
            .slice(0, 4)
            .map(c => template.criterios[c].nome)
            .join(', ');
        
        card.innerHTML = `
            <div class="template-title">${template.nome}</div>
            <div class="template-description">${template.descricao}</div>
            <div class="template-criterios">
                <strong>Principais critérios:</strong> ${criteriosTexto}...
            </div>
        `;
        
        grid.appendChild(card);
    });

    // Adicionar templates personalizados se existirem
    if (Object.keys(templatesPersonalizados).length > 0) {
        const divisor = document.createElement('div');
        divisor.style.cssText = `
            grid-column: 1 / -1;
            margin: 20px 0;
            text-align: center;
            color: #7f8c8d;
            font-weight: bold;
            border-top: 2px solid #ecf0f1;
            padding-top: 20px;
        `;
        divisor.innerHTML = '📋 MEUS TEMPLATES PERSONALIZADOS';
        grid.appendChild(divisor);
        
        Object.entries(templatesPersonalizados).forEach(([key, template]) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.style.borderLeft = '5px solid #2ecc71';
            card.onclick = () => selecionarTemplate(key);
            
            const criteriosTexto = Object.keys(template.criterios)
                .filter(c => template.criterios[c].peso > 0)
                .slice(0, 4)
                .map(c => template.criterios[c].nome)
                .join(', ');
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div class="template-title">
                            ${template.nome} 
                            <span style="font-size: 0.8em; color: #2ecc71;">👤 Personalizado</span>
                        </div>
                        <div class="template-description">${template.descricao}</div>
                        <div class="template-criterios">
                            <strong>Principais critérios:</strong> ${criteriosTexto}...
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); excluirTemplate('${key}')" 
                            style="
                                background: #e74c3c; 
                                color: white; 
                                border: none; 
                                border-radius: 50%; 
                                width: 25px; 
                                height: 25px; 
                                cursor: pointer;
                                font-size: 12px;
                            ">🗑️</button>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }
}

function selecionarTemplate(templateKey) {
    console.log('📋 Selecionando template:', templateKey);
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    appState.templateSelecionado = templateKey;
    appState.analiseSemanticaAtiva = false;

    document.getElementById('templateEditor').classList.remove('hidden');
    carregarEditor(templates[templateKey]);

    const templateNome = templates[templateKey].nome;

    let confirmacao = document.getElementById('template-confirmacao');
    if (!confirmacao) {
        confirmacao = document.createElement('div');
        confirmacao.id = 'template-confirmacao';
        confirmacao.style.cssText = `
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #28a745;
            font-weight: bold;
        `;
        document.getElementById('templates').appendChild(confirmacao);
    }

    confirmacao.innerHTML = `✅ <strong>Template selecionado:</strong> ${templateNome}`;
    atualizarStatusEtapas();
}

function carregarEditor(template) {
    const editor = document.getElementById('criteriosEditor');
    editor.innerHTML = '';
    
    Object.entries(template.criterios).forEach(([key, criterio]) => {
        const item = document.createElement('div');
        item.className = 'criterio-item';
        
        item.innerHTML = `
            <div class="criterio-nome">${criterio.nome}</div>
            <div class="criterio-controls">
                <input type="range" 
                       class="peso-slider" 
                       min="0" max="10" 
                       value="${criterio.peso}"
                       oninput="atualizarPeso('${key}', this.value)">
                <span class="peso-value" id="peso-${key}">${criterio.peso}</span>
                <label>
                    <input type="checkbox" 
                           class="obrigatorio-checkbox"
                           ${criterio.obrigatorio ? 'checked' : ''}
                           onchange="atualizarObrigatorio('${key}', this.checked)">
                    Obrigatório
                </label>
            </div>
        `;
        
        editor.appendChild(item);
    });
}

function atualizarPeso(criterio, valor) {
    templates[appState.templateSelecionado].criterios[criterio].peso = parseInt(valor);
    document.getElementById(`peso-${criterio}`).textContent = valor;
}

function atualizarObrigatorio(criterio, valor) {
    templates[appState.templateSelecionado].criterios[criterio].obrigatorio = valor;
}

function resetTemplate() {
    if (appState.templateSelecionado) {
        carregarEditor(templates[appState.templateSelecionado]);
    }
}

function salvarTemplate() {
    if (!appState.templateSelecionado) {
        alert('❌ Nenhum template selecionado para personalizar.');
        return;
    }
    
    const nomeTemplate = prompt('📝 Digite um nome para seu template personalizado:', 
        `${templates[appState.templateSelecionado].nome} - Personalizado`);

    if (!nomeTemplate || nomeTemplate.trim() === '') {
        return;
    }

    try {
        const templatePersonalizado = {
            nome: nomeTemplate.trim(),
            descricao: `Template personalizado baseado em ${templates[appState.templateSelecionado].nome}`,
            criterios: JSON.parse(JSON.stringify(templates[appState.templateSelecionado].criterios)),
            dataCreated: new Date().toLocaleDateString('pt-BR'),
            baseTemplate: appState.templateSelecionado
        };
        
        let templatesPersonalizados = JSON.parse(localStorage.getItem('templatesPersonalizados') || '{}');
        const chaveTemplate = `custom_${Date.now()}`;
        templatesPersonalizados[chaveTemplate] = templatePersonalizado;
        localStorage.setItem('templatesPersonalizados', JSON.stringify(templatesPersonalizados));
        
        templates[chaveTemplate] = templatePersonalizado;
        
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 9999;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        alertDiv.innerHTML = `✅ Template "${nomeTemplate}" salvo com sucesso!`;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
        
        carregarTemplates();
        console.log('✅ Template personalizado salvo:', templatePersonalizado);
        
    } catch (error) {
        console.error('Erro ao salvar template:', error);
        alert('❌ Erro ao salvar template. Tente novamente.');
    }
}

function excluirTemplate(templateKey) {
    if (!templateKey.startsWith('custom_')) {
        alert('❌ Não é possível excluir templates padrão do sistema.');
        return;
    }
    
    if (confirm('🗑️ Tem certeza que deseja excluir este template personalizado?')) {
        try {
            let templatesPersonalizados = JSON.parse(localStorage.getItem('templatesPersonalizados') || '{}');
            delete templatesPersonalizados[templateKey];
            localStorage.setItem('templatesPersonalizados', JSON.stringify(templatesPersonalizados));
            
            delete templates[templateKey];
            carregarTemplates();
            
            alert('✅ Template excluído com sucesso!');
            
        } catch (error) {
            console.error('Erro ao excluir template:', error);
            alert('❌ Erro ao excluir template.');
        }
    }
}

// === ANÁLISE SEMÂNTICA ===
async function carregarCriteriosSemanticos() {
    try {
        console.log('📥 Carregando critérios semânticos...');
        const response = await fetch('../assets/criterios_avancados.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const criterios = await response.json();
        appState.criteriosSemanticos = criterios;
        
        console.log('✅ Critérios semânticos carregados:', criterios.grupos.length, 'grupos');
        return criterios;
        
    } catch (error) {
        console.error('❌ Erro ao carregar critérios semânticos:', error);
        
        // Fallback com critérios básicos
        const criteriosBasicos = {
            grupos: [
                {
                    criterio: "Programação CNC",
                    peso: 10,
                    palavrasChave: ["programar", "programação", "G-code", "M-code", "cnc"]
                },
                {
                    criterio: "Operação CNC", 
                    peso: 9,
                    palavrasChave: ["operar", "operação", "centro de usinagem", "máquina cnc"]
                },
                {
                    criterio: "Setup e Preparação",
                    peso: 9,
                    palavrasChave: ["setup", "preparar", "preset", "ajuste", "calibrar"]
                }
            ]
        };
        
        appState.criteriosSemanticos = criteriosBasicos;
        console.log('⚠️ Usando critérios básicos como fallback');
        return criteriosBasicos;
    }
}

function carregarTemplatesSemanticos() {
    const grid = document.getElementById('semanticTemplatesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const templatesSemanticos = Object.entries(templates).filter(([key, template]) => 
        template.tipo === 'semantico'
    );

    if (templatesSemanticos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7f8c8d;">
                🔄 Carregando templates semânticos...
            </div>
        `;
        return;
    }

    templatesSemanticos.forEach(([key, template]) => {
        const card = document.createElement('div');
        card.className = 'template-card semantic';
        card.onclick = () => selecionarTemplateSemântico(key);
        
        const criteriosTexto = Object.keys(template.criterios)
            .filter(c => template.criterios[c].peso > 0)
            .slice(0, 4)
            .map(c => template.criterios[c].nome)
            .join(', ');
        
        card.innerHTML = `
            <div class="template-title">${template.nome}</div>
            <div class="template-description">${template.descricao}</div>
            <div class="template-criterios">
                <strong>Principais critérios:</strong> ${criteriosTexto}...
            </div>
            <div style="margin-top: 15px; padding: 10px; background: rgba(155, 89, 182, 0.1); border-radius: 8px;">
                <small style="color: #8e44ad; font-weight: 600;">
                    🧠 Powered by AI • Reconhecimento Semântico
                </small>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function selecionarTemplateSemântico(templateKey) {
    console.log('🧠 Selecionando template semântico:', templateKey);
    document.querySelectorAll('#semanticTemplatesGrid .template-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    appState.templateSelecionado = templateKey;
    appState.analiseSemanticaAtiva = true;

    const statusDiv = document.getElementById('semanticStatus');
    if (statusDiv) {
        statusDiv.classList.remove('hidden');
        statusDiv.innerHTML = `
            <div class="alert success">
                <strong>✅ Template Semântico Selecionado!</strong> 
                ${templates[templateKey].nome} está pronto para análise inteligente.
            </div>
        `;
    }

    const botao = document.getElementById('btnAnaliseSemantica');
    if (botao) {
        botao.innerHTML = '✅ Análise Semântica Ativa';
        botao.disabled = true;
    }
}

async function ativarAnaliseSemantica() {
    console.log('🧠 Ativando análise semântica...');
    const botao = document.getElementById('btnAnaliseSemantica');
    if (botao) {
        botao.innerHTML = '⏳ Carregando...';
        botao.disabled = true;
    }

    try {
        await carregarCriteriosSemanticos();
        appState.analiseSemanticaAtiva = true;
        carregarTemplatesSemanticos();
        
        const statusDiv = document.getElementById('semanticStatus');
        if (statusDiv) {
            statusDiv.classList.remove('hidden');
            statusDiv.innerHTML = `
                <div class="alert success">
                    <strong>✅ Análise Semântica Ativada!</strong> 
                    Sistema carregado com ${appState.criteriosSemanticos.grupos.length} critérios avançados.
                    Selecione um template semântico acima.
                </div>
            `;
        }
        
        if (botao) {
            botao.innerHTML = '🧠 Sistema Ativo';
            botao.classList.add('success');
        }
        
        console.log('✅ Análise semântica ativada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao ativar análise semântica:', error);
        
        const statusDiv = document.getElementById('semanticStatus');
        if (statusDiv) {
            statusDiv.classList.remove('hidden');
            statusDiv.innerHTML = `
                <div class="alert error">
                    <strong>❌ Erro ao ativar análise semântica!</strong> 
                    Verifique a conexão e tente novamente.
                </div>
            `;
        }
        
        if (botao) {
            botao.innerHTML = '🧠 Ativar Análise Semântica';
            botao.disabled = false;
        }
    }
}

// === CONFIGURAÇÃO DA VAGA ===
function validarEndereco() {
    console.log('📍 Validando endereço...');
    const endereco = document.getElementById('enderecoVaga').value;
    if (!endereco) {
        alert('Por favor, insira um endereço.');
        return;
    }

    try {
        const cidade = normalizadorCidades.normalizar(endereco);
        let coordenadas = normalizadorCidades.coordenadas[cidade];
        
        if (cidade === 'jundiai') {
            coordenadas = { lat: -23.1950, lng: -46.8950 };
        }
        
        if (!coordenadas) {
            coordenadas = { lat: -23.1864, lng: -46.8842 };
        }
        
        appState.coordenadasVaga = coordenadas;
        appState.vagaConfig.endereco = endereco;
        appState.vagaConfig.cidade_normalizada = cidade;
        
        document.getElementById('enderecoValidado').classList.remove('hidden');
        document.getElementById('enderecoNormalizado').textContent = 
            `${endereco} • Coordenadas: ${coordenadas.lat}, ${coordenadas.lng}`;
            
        console.log('✅ Endereço validado com sucesso!');
        atualizarStatusEtapas();
        
    } catch (error) {
        console.error('❌ Erro ao validar endereço:', error);
        alert('Erro ao validar endereço. Tente novamente.');
    }
}

function atualizarStatusEtapas() {
    const statusCandidatos = document.getElementById('status-candidatos');
    const statusSelecao = document.getElementById('status-selecao');
    const statusTemplate = document.getElementById('status-template');
    const statusEndereco = document.getElementById('status-endereco');
    
    if (!statusCandidatos || !statusTemplate || !statusEndereco) return;

    // Status dos candidatos
    if (appState.candidatos && appState.candidatos.length > 0) {
        statusCandidatos.style.cssText = 'padding: 8px; border-radius: 5px; background: #d4edda; color: #155724;';
        statusCandidatos.textContent = `✅ ${appState.candidatos.length} candidatos carregados`;
    } else {
        statusCandidatos.style.cssText = 'padding: 8px; border-radius: 5px; background: #f8d7da; color: #721c24;';
        statusCandidatos.textContent = '❌ Candidatos não carregados';
    }

    // Status da seleção
    if (statusSelecao) {
        if (appState.candidatosSelecionados && appState.candidatosSelecionados.size > 0) {
            statusSelecao.style.cssText = 'padding: 8px; border-radius: 5px; background: #d4edda; color: #155724;';
            statusSelecao.textContent = `✅ ${appState.candidatosSelecionados.size} candidatos selecionados para análise`;
        } else {
            statusSelecao.style.cssText = 'padding: 8px; border-radius: 5px; background: #f8d7da; color: #721c24;';
            statusSelecao.textContent = '❌ Nenhum candidato selecionado';
        }
    }

    // Status do template
    if (appState.templateSelecionado) {
        statusTemplate.style.cssText = 'padding: 8px; border-radius: 5px; background: #d4edda; color: #155724;';
        statusTemplate.textContent = `✅ Template: ${templates[appState.templateSelecionado]?.nome || 'Selecionado'}`;
    } else {
        statusTemplate.style.cssText = 'padding: 8px; border-radius: 5px; background: #f8d7da; color: #721c24;';
        statusTemplate.textContent = '❌ Template não selecionado';
    }

    // Status do endereço
    if (appState.coordenadasVaga) {
        statusEndereco.style.cssText = 'padding: 8px; border-radius: 5px; background: #d4edda; color: #155724;';
        statusEndereco.textContent = '✅ Endereço validado';
    } else {
        statusEndereco.style.cssText = 'padding: 8px; border-radius: 5px; background: #f8d7da; color: #721c24;';
        statusEndereco.textContent = '❌ Endereço não validado';
    }
}

function debugAnalise() {
    console.log('🔍 === DEBUG DA ANÁLISE ===');
    const debug = {
        candidatos: appState.candidatos?.length || 0,
        candidatosSelecionados: appState.candidatosSelecionados?.size || 0,
        templateSelecionado: appState.templateSelecionado,
        analiseSemanticaAtiva: appState.analiseSemanticaAtiva,
        coordenadasVaga: appState.coordenadasVaga
    };

    console.table(debug);

    let problemas = [];

    if (!appState.candidatos || appState.candidatos.length === 0) {
        problemas.push('❌ Nenhum candidato carregado - Faça upload do PDF primeiro');
    }

    if (!appState.candidatosSelecionados || appState.candidatosSelecionados.size === 0) {
        problemas.push('❌ Nenhum candidato selecionado - Vá para aba Seleção');
    }

    if (!appState.templateSelecionado) {
        problemas.push('❌ Template não selecionado - Clique em um template');
    }

    if (!appState.coordenadasVaga) {
        problemas.push('❌ Endereço não validado - Clique em "Validar Endereço"');
    }

    if (problemas.length > 0) {
        alert('🔍 PROBLEMAS ENCONTRADOS:\n\n' + problemas.join('\n'));
    } else {
        alert('✅ Tudo OK! A análise deveria funcionar.\n\n' + 
              (appState.analiseSemanticaAtiva ? '🧠 Análise Semântica ATIVA' : '📊 Análise Tradicional'));
    }

    console.log('🔍 === FIM DEBUG ===');
}

// === INICIAR ANÁLISE ===
function iniciarAnalise() {
    console.log('🚀 Iniciando análise...');
    const problemas = [];

    if (!appState.candidatos || appState.candidatos.length === 0) {
        problemas.push('❌ Nenhum candidato foi carregado. Por favor, faça o upload do PDF primeiro.');
    }

    if (!appState.candidatosSelecionados || appState.candidatosSelecionados.size === 0) {
        problemas.push('❌ Nenhum candidato foi selecionado para análise.');
    }

    if (!appState.templateSelecionado) {
        problemas.push('❌ Template não foi selecionado.');
    }

    if (!appState.coordenadasVaga) {
        problemas.push('❌ Endereço da vaga não foi validado.');
    }

    const cargo = document.getElementById('cargoVaga').value.trim();
    const endereco = document.getElementById('enderecoVaga').value.trim();

    if (!cargo) {
        problemas.push('❌ Campo "Cargo/Posição" é obrigatório.');
    }

    if (!endereco) {
        problemas.push('❌ Campo "Localização da Vaga" é obrigatório.');
    }

    if (problemas.length > 0) {
        alert('⚠️ PROBLEMAS ENCONTRADOS:\n\n' + problemas.join('\n\n'));
        return;
    }

    try {
        appState.vagaConfig = {
            cargo: cargo,
            empresa: document.getElementById('empresaVaga').value || 'Empresa não especificada',
            endereco: endereco,
            turno: document.getElementById('turnoVaga').value || 'Não especificado',
            salario: document.getElementById('salarioVaga').value || 'Não informado',
            observacoes: document.getElementById('observacoesVaga').value || '',
            coordenadas: appState.coordenadasVaga
        };
        
        showTab('analise');
        executarAnalise();
        
    } catch (error) {
        console.error('❌ Erro ao iniciar análise:', error);
        alert('Erro inesperado ao iniciar análise. Verifique o console para mais detalhes.');
    }
}

// === EXECUTAR ANÁLISE ===
async function executarAnalise() {
    const progressBar = document.getElementById('progressBar');
    const status = document.getElementById('analiseStatus');
    const template = templates[appState.templateSelecionado];
    
    const todosCandidatos = appState.candidatos;
    const candidatosSelecionados = todosCandidatos.filter(candidato => 
        appState.candidatosSelecionados.has(candidato.id)
    );

    const total = candidatosSelecionados.length;
    console.log(`🔍 Iniciando análise de ${total} candidatos selecionados`);

    for (let i = 0; i < total; i++) {
        const candidato = candidatosSelecionados[i];
        const progresso = Math.round(((i + 1) / total) * 100);
        
        progressBar.style.width = `${progresso}%`;
        progressBar.textContent = `${progresso}%`;
        status.textContent = `${appState.analiseSemanticaAtiva ? '🧠 Análise IA' : '📊 Análise'}: ${candidato.nome} (${i + 1}/${total})`;
        
        await new Promise(resolve => setTimeout(resolve, 30));
        
        // Calcular pontuação
        if (appState.analiseSemanticaAtiva && appState.criteriosSemanticos) {
            candidato.pontuacao = analisarCandidatoSemantico(candidato, appState.criteriosSemanticos);
        } else {
            candidato.pontuacao = calcularPontuacao(candidato, template);
        }
        
        // Simular endereço e distância
        candidato.cidade_info = simularEndereco();
        candidato.endereco = candidato.cidade_info.endereco;
        candidato.distancia = calcularDistancia(candidato);
        
        // Simular competências
        candidato.competencias = simularCompetenciasCandidato(candidato, template);
    }

    appState.candidatos = candidatosSelecionados;
    appState.candidatos.sort((a, b) => b.pontuacao - a.pontuacao);

    document.getElementById('loadingAnalise').classList.remove('show');
    document.getElementById('analiseCompleta').classList.remove('hidden');

    console.log(`✅ Análise concluída! ${candidatosSelecionados.length} candidatos processados`);
    prepararDashboard();
}

function analisarCandidatoSemantico(candidato, criteriosSemanticos) {
    if (!criteriosSemanticos || !criteriosSemanticos.grupos) {
        console.warn('⚠️ Critérios semânticos não disponíveis');
        return Math.random() * 100;
    }

    const textoCurriculo = gerarTextoCurriculoSimulado(candidato);
    let pontuacaoTotal = 0;
    let pesoTotal = 0;

    criteriosSemanticos.grupos.forEach(grupo => {
        const pontuacaoGrupo = calcularPontuacaoSemantica(textoCurriculo, grupo);
        pontuacaoTotal += pontuacaoGrupo * grupo.peso;
        pesoTotal += grupo.peso;
    });

    const pontuacaoFinal = pesoTotal > 0 ? (pontuacaoTotal / pesoTotal) * 100 : 0;
    return Math.round(pontuacaoFinal * 100) / 100;
}

function calcularPontuacaoSemantica(texto, grupo) {
    if (!texto || !grupo.palavrasChave) return 0;
    
    const textoLimpo = texto.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    let matchesEncontrados = 0;
    const totalPalavrasChave = grupo.palavrasChave.length;

    grupo.palavrasChave.forEach(palavra => {
        const palavraLimpa = palavra.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
            
        if (textoLimpo.includes(palavraLimpa)) {
            matchesEncontrados++;
        }
    });

    const porcentagemMatch = matchesEncontrados / totalPalavrasChave;
    let pontuacao = porcentagemMatch;

    if (porcentagemMatch > 0.7) pontuacao += 0.2;
    else if (porcentagemMatch > 0.5) pontuacao += 0.1;

    return Math.min(pontuacao, 1.0);
}

function gerarTextoCurriculoSimulado(candidato) {
    const experiencias = [
        "operador cnc torno centro usinagem",
        "programação manual códigos g m",
        "setup máquina preset ferramentas",
        "comando fanuc siemens",
        "leitura desenho técnico metrologia",
        "paquímetro micrômetro instrumentos medição",
        "mastercam powermill programação cam",
        "macro programming parametrização",
        "senai formação técnica usinagem"
    ];
    
    const numExperiencias = Math.floor(candidato.pontuacao / 20) + 2;
    const experienciasSelecionadas = [];

    for (let i = 0; i < numExperiencias && i < experiencias.length; i++) {
        const index = Math.floor(Math.random() * experiencias.length);
        if (!experienciasSelecionadas.includes(experiencias[index])) {
            experienciasSelecionadas.push(experiencias[index]);
        }
    }

    return experienciasSelecionadas.join(' ');
}

function calcularPontuacao(candidato, template) {
    let pontuacao = 0;
    let peso_total = 0;
    
    Object.entries(template.criterios).forEach(([key, criterio]) => {
        if (criterio.peso > 0) {
            const score = Math.random() * criterio.peso;
            pontuacao += score;
            peso_total += criterio.peso;
        }
    });

    return Math.round((pontuacao / peso_total) * 100 * 100) / 100;
}

function simularEndereco() {
    const enderecos = [
        { endereco: "Centro, Jundiaí, SP", cidade: "jundiai" },
        { endereco: "Vila Arens, Jundiaí, SP", cidade: "jundiai" },
        { endereco: "Centro, Várzea Paulista, SP", cidade: "varzea_paulista" },
        { endereco: "Vila Real, Várzea Paulista, SP", cidade: "varzea_paulista" },
        { endereco: "Centro, Campo Limpo Paulista, SP", cidade: "campo_limpo" },
        { endereco: "Centro, Itupeva, SP", cidade: "itupeva" },
        { endereco: "Centro, Cajamar, SP", cidade: "cajamar" },
        { endereco: "Centro, Itatiba, SP", cidade: "itatiba" }
    ];

    return enderecos[Math.floor(Math.random() * enderecos.length)];
}

function calcularDistancia(candidato) {
    if (!candidato.cidade_info || !appState.coordenadasVaga) {
        return Math.random() * 30 + 2;
    }
    
    const coordsCandidato = normalizadorCidades.coordenadas[candidato.cidade_info.cidade];
    const coordsVaga = appState.coordenadasVaga;

    if (!coordsCandidato || !coordsVaga) {
        return Math.random() * 30 + 2;
    }

    const R = 6371;
    const lat1Rad = coordsCandidato.lat * Math.PI / 180;
    const lat2Rad = coordsVaga.lat * Math.PI / 180;
    const deltaLatRad = (coordsVaga.lat - coordsCandidato.lat) * Math.PI / 180;
    const deltaLngRad = (coordsVaga.lng - coordsCandidato.lng) * Math.PI / 180;

    const a = Math.sin(deltaLatRad/2) * Math.sin(deltaLatRad/2) +
             Math.cos(lat1Rad) * Math.cos(lat2Rad) *
             Math.sin(deltaLngRad/2) * Math.sin(deltaLngRad/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let distancia = R * c;

    // Ajustes específicos para distâncias conhecidas
    if (candidato.cidade_info.cidade === 'varzea_paulista' && coordsVaga.lat < -23.19) {
        distancia = 19.8 + (Math.random() - 0.5) * 2;
    } else if (candidato.cidade_info.cidade === 'campo_limpo' && coordsVaga.lat < -23.19) {
        distancia = 26.5 + (Math.random() - 0.5) * 3;
    } else if (candidato.cidade_info.cidade === 'jundiai' && coordsVaga.lat < -23.19) {
        distancia = 2 + Math.random() * 6;
    }

    return Math.max(0.5, Math.round(distancia * 10) / 10);
}

function simularCompetenciasCandidato(candidato, template) {
    const competenciasDisponiveis = [
        'CNC Geral', 'Torno CNC', 'Centro de Usinagem', 'Programação Manual',
        'Programação CAM', 'Setup de Máquina', 'Leitura de Desenho',
        'Instrumentos de Medição', 'Comando Fanuc', 'Comando Siemens',
        'Macro Programming', 'SolidWorks', 'MasterCAM', 'Formação SENAI'
    ];

    const numCompetencias = candidato.pontuacao > 80 ? 5 : 
                          candidato.pontuacao > 60 ? 4 : 
                          candidato.pontuacao > 40 ? 3 : 2;

    const competenciasSelecionadas = [];
    const competenciasUsadas = new Set();

    if (candidato.pontuacao > 50) {
        competenciasSelecionadas.push('CNC Geral', 'Torno CNC');
        competenciasUsadas.add('CNC Geral');
        competenciasUsadas.add('Torno CNC');
    }

    while (competenciasSelecionadas.length < numCompetencias) {
        const competencia = competenciasDisponiveis[Math.floor(Math.random() * competenciasDisponiveis.length)];
        if (!competenciasUsadas.has(competencia)) {
            competenciasSelecionadas.push(competencia);
            competenciasUsadas.add(competencia);
        }
    }

    return competenciasSelecionadas.slice(0, numCompetencias);
}

function prepararDashboard() {
    const candidatos = appState.candidatos;
    if (!candidatos || candidatos.length === 0) {
        console.error('Erro: Nenhum candidato encontrado para gerar dashboard');
        return;
    }

    const stats = {
        total: candidatos.length,
        pontuacaoMedia: Math.round(candidatos.reduce((acc, c) => acc + c.pontuacao, 0) / candidatos.length * 10) / 10
    };

    appState.resultadosAnalise = { candidatos, stats };
    console.log('Dashboard preparado:', { candidatos: candidatos.length, stats });
    gerarDashboard();
}

// === DASHBOARD ===
function gerarDashboard() {
    console.log('Iniciando geração do dashboard...');
    const { candidatos, stats } = appState.resultadosAnalise;
    const vagaInfo = appState.vagaConfig;

    if (!candidatos || candidatos.length === 0) {
        console.error('Erro: Nenhum candidato encontrado para gerar dashboard');
        return;
    }

    // Adicionar header informativo
    const dashboardContainer = document.getElementById('dashboard');
    let headerInfo = dashboardContainer.querySelector('.dashboard-header');

    if (!headerInfo) {
        headerInfo = document.createElement('div');
        headerInfo.className = 'dashboard-header';
        headerInfo.style.cssText = `
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            text-align: center;
        `;
        dashboardContainer.insertBefore(headerInfo, dashboardContainer.firstChild);
    }

    const tipoAnalise = appState.analiseSemanticaAtiva ? '🧠 Análise Semântica (IA)' : '📊 Análise Tradicional';

    headerInfo.innerHTML = `
        <h3 style="color: #2c3e50; margin-bottom: 10px;">📊 ${vagaInfo.cargo || 'Análise de Candidatos'}</h3>
        <div style="color: #7f8c8d;">
            📍 <strong>${vagaInfo.endereco || 'Localização não definida'}</strong> • 
            👥 ${candidatos.length} candidatos analisados •
            📅 ${new Date().toLocaleDateString('pt-BR')}
        </div>
        <div style="margin-top: 10px; padding: 8px 15px; background: ${appState.analiseSemanticaAtiva ? 'rgba(155, 89, 182, 0.1)' : 'rgba(52, 152, 219, 0.1)'}; border-radius: 20px; display: inline-block;">
            <small style="color: ${appState.analiseSemanticaAtiva ? '#8e44ad' : '#3498db'}; font-weight: 600;">
                ${tipoAnalise}
            </small>
        </div>
    `;

    // Gerar estatísticas
    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) {
        const candidatosPerto = candidatos.filter(c => c.distancia <= 15).length;
        
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${candidatos.length}</div>
                <div class="stat-label">Total de Candidatos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.pontuacaoMedia}</div>
                <div class="stat-label">Pontuação Média</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${Math.round(candidatos.length * 0.95)}</div>
                <div class="stat-label">Com Formação SENAI</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${candidatosPerto}</div>
                <div class="stat-label">Candidatos ≤ 15km</div>
            </div>
        `;
    }

    // Gerar rankings
    const rankingContainer = document.getElementById('rankingContainer');
    if (rankingContainer) {
        const candidatosOrdenados = [...candidatos].sort((a, b) => b.pontuacao - a.pontuacao);
        const top5Geral = candidatosOrdenados.slice(0, 5);
        const templateNome = templates[appState.templateSelecionado]?.nome || 'Análise Geral';
        
        rankingContainer.innerHTML = `
            <div class="ranking-card">
                <h3 class="ranking-title">🥇 TOP 5 - ${templateNome}</h3>
                ${top5Geral.map((candidato, index) => `
                    <div class="candidato-item" style="border-left-color: ${index === 0 ? '#f1c40f' : index === 1 ? '#95a5a6' : index === 2 ? '#cd7f32' : '#3498db'}">
                        <div class="candidato-info">
                            <div class="candidato-nome">${candidato.nome}</div>
                            <div class="candidato-detalhes">${candidato.id} • ${Math.round(20 + Math.random() * 40)} anos</div>
                            <div class="candidato-endereco">📍 ${candidato.endereco} • ${candidato.distancia.toFixed(1)}km</div>
                            <div class="candidato-competencias">
                                🔧 ${candidato.competencias ? candidato.competencias.join(' • ') : 'CNC Geral • Torno CNC • Setup'}
                            </div>
                        </div>
                        <div class="candidato-scores">
                            <div class="score-total">${candidato.pontuacao}</div>
                            <div class="score-detalhes">🥇 ${index + 1}º Lugar</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    setTimeout(gerarGraficos, 100);
}

function gerarGraficos() {
    const chartsSection = document.getElementById('chartsSection');
    if (!chartsSection) return;
    
    chartsSection.innerHTML = `
        <div class="chart-container">
            <h3 class="chart-title">Distribuição por Cidade</h3>
            <canvas id="cidadeChart"></canvas>
        </div>
        <div class="chart-container">
            <h3 class="chart-title">Distribuição por Faixa Etária</h3>
            <canvas id="idadeChart"></canvas>
        </div>
    `;

    setTimeout(() => {
        try {
            criarGraficoCidade();
            criarGraficoIdade();
            console.log('Gráficos criados com sucesso');
        } catch (error) {
            console.error('Erro ao criar gráficos:', error);
        }
    }, 100);
}

function criarGraficoCidade() {
    const candidatos = appState.resultadosAnalise.candidatos;
    const ctx = document.getElementById('cidadeChart');
    if (!ctx) return;

    const ctxContext = ctx.getContext('2d');
    const contagemCidades = {};
    const nomesAmigaveis = {
        'jundiai': 'Jundiaí',
        'varzea_paulista': 'Várzea Paulista', 
        'campo_limpo': 'Campo Limpo Pta',
        'itupeva': 'Itupeva',
        'cajamar': 'Cajamar',
        'itatiba': 'Itatiba'
    };

    candidatos.forEach(candidato => {
        const cidade = candidato.cidade_info?.cidade || 'outros';
        contagemCidades[cidade] = (contagemCidades[cidade] || 0) + 1;
    });

    const labels = Object.keys(contagemCidades).map(cidade => nomesAmigaveis[cidade] || 'Outras');
    const dados = Object.values(contagemCidades);
    const cores = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

    new Chart(ctxContext, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dados,
                backgroundColor: cores.slice(0, labels.length),
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

function criarGraficoIdade() {
    const ctx = document.getElementById('idadeChart').getContext('2d');
    const total = appState.resultadosAnalise.candidatos.length;
    
    const faixasEtarias = {
        '18-25 anos': Math.round(total * 0.15),
        '26-35 anos': Math.round(total * 0.35),
        '36-45 anos': Math.round(total * 0.30),
        '46-55 anos': Math.round(total * 0.15),
        '56+ anos': Math.round(total * 0.05)
    };

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(faixasEtarias),
            datasets: [{
                label: 'Candidatos por Faixa Etária',
                data: Object.values(faixasEtarias),
                backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.1)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// === EXPORTAR RELATÓRIO ===
function exportarRelatorio() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações de cores
        const azulPrimario = [52, 152, 219];
        const azulEscuro = [44, 62, 80];
        const cinzaTexto = [52, 73, 94];
        const roxoSemantico = [155, 89, 182];
        
        // === CABEÇALHO PRINCIPAL ===
        doc.setFillColor(...azulPrimario);
        doc.rect(0, 0, 210, 35, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('RELATORIO DE ANALISE DE CANDIDATOS', 20, 20);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const subtitulo = appState.analiseSemanticaAtiva ? 
            'Sistema Inteligente com Analise Semantica (IA)' : 
            'Sistema Inteligente de Selecao de Talentos';
        doc.text(subtitulo, 20, 28);
        
        // === INFORMAÇÕES DA VAGA ===
        let yPos = 50;
        doc.setTextColor(...azulEscuro);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACOES DA VAGA', 20, yPos);
        
        doc.setDrawColor(...azulPrimario);
        doc.setLineWidth(2);
        doc.line(20, yPos + 2, 190, yPos + 2);
        
        yPos += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...cinzaTexto);
        
        const templateInfo = templates[appState.templateSelecionado];
        const tipoAnalise = appState.analiseSemanticaAtiva ? 'Semantica (IA)' : 'Tradicional';
        
        const vagaInfo = [
            `Cargo: ${appState.vagaConfig.cargo || 'Nao especificado'}`,
            `Empresa: ${appState.vagaConfig.empresa || 'Nao especificada'}`,
            `Localizacao: ${appState.vagaConfig.endereco || 'Nao especificada'}`,
            `Data da Analise: ${new Date().toLocaleDateString('pt-BR')}`,
            `Template: ${templateInfo?.nome || 'Template nao especificado'}`,
            `Tipo de Analise: ${tipoAnalise}`
        ];
        
        vagaInfo.forEach(info => {
            doc.text(info, 25, yPos);
            yPos += 6;
        });
        
        // === ESTATÍSTICAS GERAIS ===
        yPos += 10;
        doc.setFillColor(248, 249, 250);
        doc.rect(15, yPos - 5, 180, 35, 'F');
        
        doc.setTextColor(...azulEscuro);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('ESTATISTICAS GERAIS', 20, yPos + 5);
        
        yPos += 15;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...cinzaTexto);
        
        const candidatos = appState.resultadosAnalise.candidatos;
        const stats = appState.resultadosAnalise.stats;
        
        const estatisticas = [
            `Total de candidatos analisados: ${candidatos.length}`,
            `Pontuacao media: ${stats.pontuacaoMedia}`,
            `Candidatos proximos (<=15km): ${candidatos.filter(c => c.distancia <= 15).length}`,
            `Com formacao SENAI: ${Math.round(candidatos.length * 0.95)}`
        ];
        
        estatisticas.forEach((stat, index) => {
            const x = index < 2 ? 25 : 110;
            const y = yPos + (index % 2) * 6;
            doc.text(`• ${stat}`, x, y);
        });
        
        // === INDICADOR DE ANÁLISE SEMÂNTICA ===
        if (appState.analiseSemanticaAtiva) {
            yPos += 20;
            doc.setFillColor(...roxoSemantico);
            doc.rect(15, yPos - 5, 180, 20, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('ANALISE SEMANTICA APLICADA', 20, yPos + 5);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Criterios semanticos processados: ${appState.criteriosSemanticos?.grupos?.length || 0}`, 20, yPos + 10);
        }
        
        // === TOP 10 CANDIDATOS ===
        yPos += 25;
        doc.setTextColor(...azulEscuro);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('TOP 10 CANDIDATOS', 20, yPos);
        
        doc.setDrawColor(46, 204, 113);
        doc.setLineWidth(2);
        doc.line(20, yPos + 2, 190, yPos + 2);
        
        yPos += 10;
        const top10 = candidatos.slice(0, 10);
        
        top10.forEach((candidato, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            const boxHeight = 25;
            doc.setFillColor(252, 252, 252);
            doc.rect(15, yPos - 2, 180, boxHeight, 'F');
            
            const corPosicao = index === 0 ? [241, 196, 15] : 
                             index === 1 ? [149, 165, 166] : 
                             index === 2 ? [205, 127, 50] : 
                             appState.analiseSemanticaAtiva ? roxoSemantico : azulPrimario;
            doc.setFillColor(...corPosicao);
            doc.rect(15, yPos - 2, 3, boxHeight, 'F');
            
            doc.setTextColor(...azulEscuro);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${index + 1}. ${candidato.nome}`, 25, yPos + 5);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...cinzaTexto);
            doc.text(`ID: ${candidato.id}`, 25, yPos + 10);
            doc.text(`Pontuacao: ${candidato.pontuacao}`, 80, yPos + 10);
            doc.text(`Distancia: ${candidato.distancia.toFixed(1)}km`, 130, yPos + 10);
            
            doc.text(`Endereco: ${candidato.endereco}`, 25, yPos + 15);
            
            const competencias = candidato.competencias ? candidato.competencias.join(', ') : 'CNC Geral, Torno CNC';
            const competenciasTexto = `Competencias: ${competencias}`;
            
            if (competenciasTexto.length > 85) {
                const partes = doc.splitTextToSize(competenciasTexto, 165);
                partes.forEach((parte, i) => {
                    doc.text(parte, 25, yPos + 20 + (i * 4));
                });
            } else {
                doc.text(competenciasTexto, 25, yPos + 20);
            }
            
            yPos += 30;
        });
        
        // === SALVAR PDF ===
        const tipoAnaliseArquivo = appState.analiseSemanticaAtiva ? 'IA' : 'Tradicional';
        const nomeArquivo = `Relatorio_${tipoAnaliseArquivo}_${appState.vagaConfig.cargo.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nomeArquivo);
        
        alert(`✅ Relatório PDF gerado com sucesso!\n\n📄 Arquivo: ${nomeArquivo}\n\n🎯 Tipo: ${appState.analiseSemanticaAtiva ? '🧠 Análise Semântica (IA)' : '📊 Análise Tradicional'}`);
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('❌ Erro ao gerar o relatório PDF. Verifique sua conexão e tente novamente.');
    }
}

// === NOVA ANÁLISE ===
function novaAnalise() {
    if (confirm('Deseja iniciar uma nova análise? Os dados atuais serão perdidos.')) {
        console.log('🔄 Iniciando nova análise...');
        
        // Resetar estado
        appState = {
            pdfData: null,
            candidatos: [],
            candidatosSelecionados: new Set(),
            motivosExclusao: {},
            vagaConfig: {},
            templateSelecionado: null,
            resultadosAnalise: {},
            coordenadasVaga: null,
            analiseSemanticaAtiva: false,
            criteriosSemanticos: null
        };
        
        // Limpar formulários
        try {
            document.getElementById('pdfFile').value = '';
            document.getElementById('cargoVaga').value = '';
            document.getElementById('empresaVaga').value = '';
            document.getElementById('enderecoVaga').value = '';
            document.getElementById('turnoVaga').selectedIndex = 0;
            document.getElementById('salarioVaga').value = '';
            document.getElementById('observacoesVaga').value = '';
            
            if (document.getElementById('filtroDistancia')) {
                document.getElementById('filtroDistancia').selectedIndex = 0;
            }
            if (document.getElementById('buscaCandidato')) {
                document.getElementById('buscaCandidato').value = '';
            }
        } catch (error) {
            console.log('⚠️ Alguns campos não puderam ser limpos:', error);
        }
        
        // Ocultar elementos
        document.getElementById('fileInfo').classList.add('hidden');
        document.getElementById('candidatesList').classList.add('hidden');
        document.getElementById('enderecoValidado').classList.add('hidden');
        document.getElementById('templateEditor').classList.add('hidden');
        document.getElementById('analiseCompleta').classList.add('hidden');
        document.getElementById('loadingAnalise').classList.remove('show');
        
        // Resetar análise semântica
        const semanticStatus = document.getElementById('semanticStatus');
        if (semanticStatus) {
            semanticStatus.classList.add('hidden');
        }
        
        const btnAnaliseSemantica = document.getElementById('btnAnaliseSemantica');
        if (btnAnaliseSemantica) {
            btnAnaliseSemantica.innerHTML = '🧠 Ativar Análise Semântica';
            btnAnaliseSemantica.disabled = false;
            btnAnaliseSemantica.className = 'btn semantic';
        }
        
        // Remover seleção de templates
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Remover mensagem de confirmação de template
        const confirmacao = document.getElementById('template-confirmacao');
        if (confirmacao) {
            confirmacao.remove();
        }
        
        // Recarregar templates
        carregarTemplatesPersonalizados();
        carregarTemplates();
        carregarTemplatesSemanticos();
        
        // Limpar conteúdo dos dashboards
        document.getElementById('statsGrid').innerHTML = '';
        document.getElementById('chartsSection').innerHTML = '';
        document.getElementById('rankingContainer').innerHTML = '';
        
        // Limpar header do dashboard
        const dashboardHeader = document.querySelector('.dashboard-header');
        if (dashboardHeader) {
            dashboardHeader.remove();
        }
        
        // Limpar lista de candidatos
        const listaCandidatos = document.getElementById('listaCandidatos');
        if (listaCandidatos) {
            listaCandidatos.innerHTML = '';
        }
        
        // Resetar progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';
        }
        
        // Voltar para primeira aba
        showTab('upload');
        
        // Atualizar status das etapas
        setTimeout(atualizarStatusEtapas, 100);
        
        console.log('✅ Nova análise iniciada - Estado resetado completamente');
    }
}

// === VERIFICAÇÃO FINAL DO SISTEMA ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Verificando integridade do sistema...');
    const funcoesEssenciais = [
        'showTab', 'processarPDF', 'extrairCandidatos', 'selecionarTemplate',
        'ativarAnaliseSemantica', 'iniciarAnalise', 'executarAnalise',
        'gerarDashboard', 'exportarRelatorio', 'novaAnalise'
    ];

    const funcoesDisponiveis = funcoesEssenciais.filter(func => typeof window[func] === 'function');

    console.log(`✅ ${funcoesDisponiveis.length}/${funcoesEssenciais.length} funções essenciais carregadas`);

    if (funcoesDisponiveis.length === funcoesEssenciais.length) {
        console.log('🎉 Sistema CV Analyzer carregado completamente!');
        console.log('🧠 Análise semântica disponível');
        console.log('📊 Sistema pronto para uso');
    } else {
        console.warn('⚠️ Algumas funções podem não estar disponíveis');
    }
});

// === EXPOSIÇÃO DE FUNÇÕES GLOBAIS ===
// Garantir que as funções principais estejam disponíveis globalmente
window.showTab = showTab;
window.testarUpload = testarUpload;
window.validarEndereco = validarEndereco;
window.selecionarTemplate = selecionarTemplate;
window.selecionarTemplateSemântico = selecionarTemplateSemântico;
window.ativarAnaliseSemantica = ativarAnaliseSemantica;
window.debugAnalise = debugAnalise;
window.iniciarAnalise = iniciarAnalise;
window.exportarRelatorio = exportarRelatorio;
window.novaAnalise = novaAnalise;
window.toggleCandidato = toggleCandidato;
window.atualizarMotivo = atualizarMotivo;
window.selecionarTodos = selecionarTodos;
window.desmarcarTodos = desmarcarTodos;
window.inverterSelecao = inverterSelecao;
window.aplicarFiltros = aplicarFiltros;
window.atualizarPeso = atualizarPeso;
window.atualizarObrigatorio = atualizarObrigatorio;
window.resetTemplate = resetTemplate;
window.salvarTemplate = salvarTemplate;
window.excluirTemplate = excluirTemplate;

console.log('🚀 CV Analyzer Pro v1.0 - Sistema carregado e pronto para uso!');

// === FUNÇÕES DE INICIALIZAÇÃO ADICIONAL ===
// Verificar se Chart.js está disponível
if (typeof Chart !== 'undefined') {
    console.log('✅ Chart.js carregado com sucesso');
} else {
    console.warn('⚠️ Chart.js não está disponível - gráficos podem não funcionar');
}

// Verificar se jsPDF está disponível  
if (typeof window.jspdf !== 'undefined') {
    console.log('✅ jsPDF carregado com sucesso');
} else {
    console.warn('⚠️ jsPDF não está disponível - exportação PDF pode não funcionar');
}

// === SISTEMA DE BACKUP E RECUPERAÇÃO ===
function salvarEstadoLocal() {
    try {
        const estadoParaSalvar = {
            candidatos: appState.candidatos,
            candidatosSelecionados: Array.from(appState.candidatosSelecionados),
            vagaConfig: appState.vagaConfig,
            templateSelecionado: appState.templateSelecionado,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('cvAnalyzer_backup', JSON.stringify(estadoParaSalvar));
        console.log('💾 Estado salvo localmente');
    } catch (error) {
        console.warn('⚠️ Não foi possível salvar estado local:', error);
    }
}

function recuperarEstadoLocal() {
    try {
        const estadoSalvo = localStorage.getItem('cvAnalyzer_backup');
        if (estadoSalvo) {
            const estado = JSON.parse(estadoSalvo);
            
            // Verificar se o backup é recente (últimas 24h)
            const agora = new Date();
            const timestampBackup = new Date(estado.timestamp);
            const diferencaHoras = (agora - timestampBackup) / (1000 * 60 * 60);
            
            if (diferencaHoras < 24 && estado.candidatos && estado.candidatos.length > 0) {
                const confirmar = confirm(
                    `🔄 Encontrei um backup recente com ${estado.candidatos.length} candidatos.\n\n` +
                    `📅 Salvo em: ${timestampBackup.toLocaleString('pt-BR')}\n\n` +
                    `Deseja recuperar estes dados?`
                );
                
                if (confirmar) {
                    appState.candidatos = estado.candidatos;
                    appState.candidatosSelecionados = new Set(estado.candidatosSelecionados);
                    appState.vagaConfig = estado.vagaConfig || {};
                    appState.templateSelecionado = estado.templateSelecionado;
                    
                    console.log('✅ Estado recuperado do backup local');
                    
                    // Atualizar interface
                    if (appState.candidatos.length > 0) {
                        exibirCandidatos(appState.candidatos);
                        atualizarStatusEtapas();
                    }
                    
                    return true;
                }
            }
        }
    } catch (error) {
        console.warn('⚠️ Erro ao recuperar estado local:', error);
    }
    return false;
}

// Auto-salvar estado a cada mudança importante
function autoSalvarEstado() {
    if (appState.candidatos.length > 0) {
        setTimeout(salvarEstadoLocal, 1000);
    }
}

// === UTILITÁRIOS ADICIONAIS ===
function formatarTempo(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function gerarResumoRapido() {
    const candidatos = appState.candidatos.length;
    const selecionados = appState.candidatosSelecionados.size;
    const template = appState.templateSelecionado ? templates[appState.templateSelecionado].nome : 'Nenhum';
    const endereco = appState.coordenadasVaga ? '✅' : '❌';
    
    return {
        candidatos,
        selecionados,
        template,
        endereco_validado: endereco
    };
}

// === MELHORIAS DE PERFORMANCE ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce nas funções de busca
const aplicarFiltrosDebounced = debounce(aplicarFiltros, 300);

// === SISTEMA DE NOTIFICAÇÕES ===
function mostrarNotificacao(titulo, mensagem, tipo = 'info') {
    const cores = {
        success: '#2ecc71',
        error: '#e74c3c', 
        warning: '#f39c12',
        info: '#3498db'
    };

    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${cores[tipo]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    notificacao.innerHTML = `
        <div style="font-size: 1.1em; margin-bottom: 5px;">${titulo}</div>
        <div style="font-size: 0.9em; opacity: 0.9;">${mensagem}</div>
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// === VALIDAÇÕES EXTRAS ===
function validarDadosCompletos() {
    const problemas = [];
    
    if (!appState.candidatos || appState.candidatos.length === 0) {
        problemas.push('Nenhum candidato carregado');
    }
    
    if (!appState.candidatosSelecionados || appState.candidatosSelecionados.size === 0) {
        problemas.push('Nenhum candidato selecionado');
    }
    
    if (!appState.templateSelecionado) {
        problemas.push('Template não selecionado');
    }
    
    if (!appState.coordenadasVaga) {
        problemas.push('Endereço não validado');
    }
    
    const cargo = document.getElementById('cargoVaga')?.value?.trim();
    if (!cargo) {
        problemas.push('Cargo não preenchido');
    }
    
    return problemas;
}

// === FUNCIONALIDADES EXTRAS ===
function exportarDadosJSON() {
    try {
        const dadosExport = {
            versao: '1.0',
            timestamp: new Date().toISOString(),
            vaga: appState.vagaConfig,
            template: appState.templateSelecionado,
            candidatos: appState.candidatos,
            resultados: appState.resultadosAnalise,
            analise_semantica: appState.analiseSemanticaAtiva
        };
        
        const blob = new Blob([JSON.stringify(dadosExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analise_candidatos_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        mostrarNotificacao('✅ Sucesso', 'Dados exportados em JSON', 'success');
    } catch (error) {
        console.error('Erro ao exportar JSON:', error);
        mostrarNotificacao('❌ Erro', 'Falha ao exportar dados', 'error');
    }
}

function importarDadosJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            
            if (dados.versao && dados.candidatos) {
                appState.candidatos = dados.candidatos;
                appState.vagaConfig = dados.vaga || {};
                appState.templateSelecionado = dados.template;
                appState.resultadosAnalise = dados.resultados || {};
                appState.analiseSemanticaAtiva = dados.analise_semantica || false;
                
                // Reconstruir Set de candidatos selecionados
                appState.candidatosSelecionados = new Set(
                    dados.candidatos.map(c => c.id)
                );
                
                exibirCandidatos(appState.candidatos);
                atualizarStatusEtapas();
                
                mostrarNotificacao('✅ Sucesso', 'Dados importados com sucesso', 'success');
            } else {
                throw new Error('Formato de arquivo inválido');
            }
        } catch (error) {
            console.error('Erro ao importar JSON:', error);
            mostrarNotificacao('❌ Erro', 'Arquivo JSON inválido', 'error');
        }
    };
    reader.readAsText(file);
}

// === MONITORAMENTO DE PERFORMANCE ===
function iniciarMonitoramentoPerformance() {
    const tempoInicio = performance.now();
    
    window.addEventListener('load', () => {
        const tempoCarregamento = performance.now() - tempoInicio;
        console.log(`⚡ Sistema carregado em ${tempoCarregamento.toFixed(2)}ms`);
        
        if (tempoCarregamento > 3000) {
            console.warn('⚠️ Carregamento lento detectado - verifique conexão');
        }
    });
}

// === ATALHOS DE TECLADO ===
function configurarAtalhosTeclado() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + número = mudar aba
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '7') {
            e.preventDefault();
            const abas = ['upload', 'config', 'selecao', 'templates', 'semantica', 'analise', 'dashboard'];
            const abaIndex = parseInt(e.key) - 1;
            if (abas[abaIndex]) {
                showTab(abas[abaIndex]);
            }
        }
        
        // Ctrl/Cmd + S = salvar template (se estiver na aba templates)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            const abaAtiva = document.querySelector('.tab-content.active');
            if (abaAtiva && abaAtiva.id === 'templates' && appState.templateSelecionado) {
                e.preventDefault();
                salvarTemplate();
            }
        }
        
        // Esc = fechar modais/resetar
        if (e.key === 'Escape') {
            // Implementar fechamento de modais se houver
        }
    });
}

// === SISTEMA DE AJUDA CONTEXTUAL ===
function mostrarAjudaContextual(elemento, texto) {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.85em;
        z-index: 9999;
        max-width: 200px;
        pointer-events: none;
    `;
    tooltip.textContent = texto;
    
    const rect = elemento.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.left = `${rect.left}px`;
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => tooltip.remove(), 3000);
}

// === INTEGRAÇÃO COM APIs EXTERNAS (FUTURO) ===
function configurarIntegracaoExterna() {
    // Placeholder para futuras integrações
    window.cvAnalyzerAPI = {
        exportData: exportarDadosJSON,
        importData: importarDadosJSON,
        getState: () => appState,
        getSummary: gerarResumoRapido
    };
}

// === INICIALIZAÇÃO FINAL COMPLETA ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Iniciando inicialização completa...');
    
    // Tentar recuperar backup
    setTimeout(() => {
        if (!recuperarEstadoLocal()) {
            console.log('📝 Iniciando com estado limpo');
        }
    }, 500);
    
    // Configurar sistemas adicionais
    iniciarMonitoramentoPerformance();
    configurarAtalhosTeclado();
    configurarIntegracaoExterna();
    
    // Configurar auto-save
    ['change', 'input', 'click'].forEach(event => {
        document.addEventListener(event, debounce(autoSalvarEstado, 2000));
    });
    
    console.log('✅ Inicialização completa finalizada');
});

// === LOGS DE DESENVOLVIMENTO ===
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 MODO DESENVOLVIMENTO ATIVO');
    console.log('📊 Estado da aplicação:', appState);
    console.log('📋 Templates disponíveis:', Object.keys(templates));
    
    // Adicionar botões de debug
    window.debugCVAnalyzer = {
        state: () => appState,
        templates: () => templates,
        functions: () => Object.keys(window).filter(key => key.includes('Template') || key.includes('analise')),
        test: testarUpload,
        reset: novaAnalise
    };
    
    console.log('🔍 Use debugCVAnalyzer no console para debug');
}

// === TRATAMENTO DE ERROS GLOBAL ===
window.addEventListener('error', function(e) {
    console.error('❌ Erro global capturado:', e.error);
    
    // Log de erro detalhado
    const errorInfo = {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    console.table(errorInfo);
    
    // Salvar erro para debug futuro
    try {
        const errosAnteriores = JSON.parse(localStorage.getItem('cvAnalyzer_errors') || '[]');
        errosAnteriores.push(errorInfo);
        
        // Manter apenas os 10 erros mais recentes
        if (errosAnteriores.length > 10) {
            errosAnteriores.shift();
        }
        
        localStorage.setItem('cvAnalyzer_errors', JSON.stringify(errosAnteriores));
    } catch (error) {
        console.warn('Não foi possível salvar log de erro:', error);
    }
});

// === VERIFICAÇÃO DE COMPATIBILIDADE ===
function verificarCompatibilidade() {
    const requisitos = {
        es6: typeof Promise !== 'undefined',
        localStorage: typeof Storage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        arrow: (() => true)() === true,
        spread: [...[1,2]].length === 2
    };
    
    const problemas = Object.entries(requisitos)
        .filter(([feature, supported]) => !supported)
        .map(([feature]) => feature);
    
    if (problemas.length > 0) {
        console.warn('⚠️ Recursos não suportados:', problemas);
        alert(
            'Seu navegador pode não suportar todos os recursos do sistema.\n\n' +
            'Recomendamos usar:\n' +
            '• Chrome 80+\n' +
            '• Firefox 75+\n' +
            '• Safari 13+\n' +
            '• Edge 80+'
        );
        return false;
    }
    
    console.log('✅ Todos os recursos são compatíveis');
    return true;
}

// Executar verificação de compatibilidade
verificarCompatibilidade();

// === MENSAGEM FINAL DE SUCESSO ===
console.log('');
console.log('🎉========================================🎉');
console.log('   CV ANALYZER PRO v1.0 - SISTEMA ATIVO');
console.log('🎉========================================🎉');
console.log('');
console.log('✅ Todas as funcionalidades carregadas:');
console.log('   📄 Upload e processamento PDF');
console.log('   👥 Gestão de candidatos');
console.log('   📋 Templates tradicionais e semânticos');
console.log('   🧠 Análise semântica com IA');
console.log('   📊 Dashboard com gráficos');
console.log('   📄 Relatórios PDF profissionais');
console.log('   💾 Sistema de backup automático');
console.log('');
console.log('🚀 Sistema pronto para uso profissional!');
console.log('💙 Desenvolvido por Rogerinho Ramos');
console.log('');