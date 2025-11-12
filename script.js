// Cache de formatadores para otimização
const brlFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

const grid = document.getElementById('produtos-grid');
const searchInput = document.getElementById('barra-pesquisa');
const searchForm = document.getElementById('form-pesquisa');
const errorMsg = document.getElementById('error-msg');

let produtosCache = [];

// Inicializar
function init() {
    if (window.produtos && Array.isArray(window.produtos)) {
        produtosCache = window.produtos;
        renderizar(produtosCache);
    } else {
        mostrarErro('Nenhum produto disponível');
    }
}

// Renderizar produtos (otimizado com DocumentFragment)
function renderizar(produtos) {
    grid.innerHTML = '';
    
    if (produtos.length === 0) {
        grid.innerHTML = '<p class="no-results">Nenhum produto encontrado.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    
    produtos.forEach(produto => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-image">
                <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
                   <a href="${produto.link}" target="_blank" rel="noopener noreferrer" class="image-overlay-link">
                    <span>Ver no<br>Mercado Livre</span>
                </a>
            </div>
            <div class="card-content">
                <h2 class="product-name">${produto.nome}</h2>
                <p class="product-id">ID: ${produto.id}</p>
                <p class="product-desc">${produto.descricao}</p>
                <p class="product-brand"><strong>Fabricante:</strong> ${produto.fabricante}</p>
                   <a href="${produto.link}" target="_blank" rel="noopener noreferrer" class="btn-link">
                    Ver no Mercado Livre
                </a>
            </div>
        `;
        fragment.appendChild(card);
    });
    
    grid.appendChild(fragment);
}

// Buscar e filtrar (otimizado)
function buscar(termo) {
    if (!termo.trim()) {
        renderizar(produtosCache);
        return;
    }

    const termoLower = termo.toLowerCase();
    const filtrados = produtosCache.filter(p => {
        const id = String(p.id);
        const nome = p.nome.toLowerCase();
        const nomePersonalizado = (p.nome_personalizado || '').toLowerCase();
        const fabricante = (p.fabricante || '').toLowerCase();
        
        return id.includes(termoLower) ||
               nome.includes(termoLower) ||
               nomePersonalizado.includes(termoLower) ||
               fabricante.includes(termoLower);
    });

    renderizar(filtrados);
}

// Mostrar erro
function mostrarErro(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}

// Ocultar erro
function ocultarErro() {
    errorMsg.style.display = 'none';
}

// Event Listeners (delegação para eficiência)
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    buscar(searchInput.value);
    ocultarErro();
});

searchInput.addEventListener('input', (e) => {
    buscar(e.target.value);
    ocultarErro();
});

// Iniciar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}