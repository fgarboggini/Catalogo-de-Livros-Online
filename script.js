let livros = JSON.parse(localStorage.getItem('livros')) || [];

document.getElementById('limpar-busca').style.display = 'none';

document.getElementById('formulario-livro').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const genero = document.getElementById('genero').value;
    const ano = document.getElementById('ano').value;
    
    const novoLivro = { titulo, autor, genero, ano, avaliacao: 0, comentarios: '' };
    livros.push(novoLivro);
    salvarLivros();
    listarLivros();
    document.getElementById('formulario-livro').reset();
});

function salvarLivros() {
    localStorage.setItem('livros', JSON.stringify(livros));
}

function listarLivros() {
    const listaLivros = document.getElementById('lista-livros');
    listaLivros.innerHTML = '';
    
    livros.forEach((livro, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${livro.titulo}</strong> - ${livro.autor} (${livro.ano}) <br>
            Gênero: ${livro.genero} | Avaliação: ${livro.avaliacao} <br>
            <button onclick="avaliarLivro(${index})">Avaliar Livro</button>
            <button onclick="removerLivro(${index})">Remover</button>
            <button onclick="editarLivro(${index})">Editar</button>
            <button onclick="adicionarComentario(${index})">Adicionar Comentário</button>
            <p>${livro.comentarios}</p>
        `;
        listaLivros.appendChild(li);
    });
}

function removerLivro(index) {
    const confirmarRemocao = confirm("Tem certeza que deseja remover este livro? Essa ação é definitiva.");
    if (confirmarRemocao) {
        livros.splice(index, 1);
        salvarLivros();
        listarLivros();
    }
}

function editarLivro(index) {
    const livro = livros[index];
    document.getElementById('titulo').value = livro.titulo;
    document.getElementById('autor').value = livro.autor;
    document.getElementById('genero').value = livro.genero;
    document.getElementById('ano').value = livro.ano;

    document.getElementById('formulario-livro').addEventListener('submit', function updateBook(event) {
        event.preventDefault();
        livros[index] = {
            titulo: document.getElementById('titulo').value,
            autor: document.getElementById('autor').value,
            genero: document.getElementById('genero').value,
            ano: document.getElementById('ano').value,
            avaliacao: livro.avaliacao, 
            comentarios: livro.comentarios  
        };
        salvarLivros();
        listarLivros();
        document.getElementById('formulario-livro').reset();
        this.removeEventListener('submit', updateBook);  
    });
}

function avaliarLivro(index) {
    let avaliacao = parseInt(prompt("Dê sua avaliação de 1 a 5 para o livro:"));
    if (!isNaN(avaliacao) && avaliacao >= 1 && avaliacao <= 5) {
        livros[index].avaliacao = avaliacao;
        salvarLivros();
        listarLivros();
    } else {
        alert("Por favor, insira um valor válido entre 1 e 5.");
    }
}

function adicionarComentario(index) {
    const comentario = prompt("Escreva um comentário sobre o livro:");
    if (comentario) {
        livros[index].comentarios = comentario;
        salvarLivros();
        listarLivros();
    }
}

document.getElementById('formulario-busca').addEventListener('submit', function(event) {
    event.preventDefault();
    const termoBusca = document.getElementById('termo-busca').value.toLowerCase();
    const resultadoBusca = livros.filter(livro => 
        livro.titulo.toLowerCase().includes(termoBusca) ||
        livro.autor.toLowerCase().includes(termoBusca) ||
        livro.genero.toLowerCase().includes(termoBusca)
    );
    
    exibirResultadoBusca(resultadoBusca);

    if (resultadoBusca.length > 0) {
        document.getElementById('limpar-busca').style.display = 'inline-block';
    }
});

function exibirResultadoBusca(resultadoBusca) {
    const resultadoDiv = document.getElementById('resultado-busca');
    resultadoDiv.innerHTML = '';
    resultadoBusca.forEach(livro => {
        const p = document.createElement('p');
        p.innerHTML = `${livro.titulo} - ${livro.autor} (${livro.ano}) - Gênero: ${livro.genero}`;
        resultadoDiv.appendChild(p);
    });
}

document.getElementById('limpar-busca').addEventListener('click', function() {
    document.getElementById('resultado-busca').innerHTML = '';
    document.getElementById('termo-busca').value = '';
    document.getElementById('limpar-busca').style.display = 'none';
});

document.getElementById('filtrar-genero').addEventListener('click', () => {
    exibirOpcoesFiltro('genero');
});

document.getElementById('filtrar-autor').addEventListener('click', () => {
    exibirOpcoesFiltro('autor');
});

document.getElementById('filtrar-ano').addEventListener('click', () => {
    exibirOpcoesFiltro('ano');
});

function exibirOpcoesFiltro(categoria) {
    const categoriasUnicas = [...new Set(livros.map(livro => livro[categoria]))];
    const resultadoDiv = document.getElementById('resultado-busca');
    resultadoDiv.innerHTML = '';

    categoriasUnicas.forEach(opcao => {
        const botao = document.createElement('button');
        botao.textContent = opcao;
        botao.classList.add('botao-opcao');
        botao.onclick = () => filtrarLivrosPorCategoria(categoria, opcao);
        resultadoDiv.appendChild(botao);
    });
}

function filtrarLivrosPorCategoria(categoria, valor) {
    const resultadoBusca = livros.filter(livro => livro[categoria] === valor);
    exibirResultadoBusca(resultadoBusca);
}

document.getElementById('classificar-titulo').addEventListener('click', function() {
    livros.sort((a, b) => a.titulo.localeCompare(b.titulo));
    listarLivros();
});

document.getElementById('classificar-avaliacao').addEventListener('click', function() {
    livros.sort((a, b) => b.avaliacao - a.avaliacao);
    listarLivros();
});

listarLivros();