const URL_FILMES = "https://rafaelescalfoni.github.io/desenv_web/filmes.json";

const catalogo = document.querySelector("#catalogo");
const modelo = document.querySelector("#modelo-ficha");


const filmeDeTeste = {
  id: 0,
  titulo: "Filme de Teste",
  resumo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris viverra ornare mauris sed convallis.",
  generos: ["Séries", "Séries americanas"],
  titulosSemelhantes: [],
  classificacao: 16,
  figura: "",
  elenco: ["John Smith", "Paul Kuman", "Sarah Conor"],
  opinioes: [
    { rating: 4, descricao: "Gostei bastante." },
    { rating: 5, descricao: "Excelente!" }
  ]
};


const corDaFaixa = (idade) => {
  if (idade <= 14) return "verde";
  if (idade < 18) return "amarelo";
  return "vermelho";
};


const mediaDasNotas = (opinioes) => {
  if (opinioes.length === 0) return 0;
  const soma = opinioes.reduce((total, opiniao) => total + opiniao.rating, 0);
  return soma / opinioes.length;
};


const criarEstrelas = (nota) => {
  const estrelas = document.createElement("span");
  estrelas.className = "estrelas";
  estrelas.title = nota > 0
    ? `Nota ${nota.toFixed(1).replace(".", ",")} de 5`
    : "Sem avaliações";

  const cheias = Math.round(nota);
  for (let i = 1; i <= 5; i++) {
    const estrela = document.createElement("span");
    estrela.className = i <= cheias ? "estrela cheia" : "estrela vazia";
    estrela.textContent = "★";
    estrelas.appendChild(estrela);
  }
  return estrelas;
};


const preencherFicha = (filme, todosOsFilmes = []) => {
  // Passo 6: recupera os dados do objeto
  const { titulo, resumo, figura, classificacao, generos, titulosSemelhantes, elenco, opinioes } = filme;

  const ficha = modelo.content.firstElementChild.cloneNode(true);

  ficha.querySelector(".ficha__titulo").textContent = titulo;
  ficha.querySelector(".ficha__resumo").textContent = resumo;

  const capa = ficha.querySelector(".ficha__capa");
  capa.alt = `Capa de ${titulo}`;
  if (figura) capa.src = figura;
  else capa.removeAttribute("src");

 
  const faixa = ficha.querySelector(".ficha__faixa");
  faixa.textContent = classificacao === 0 ? "Livre" : classificacao;
  faixa.classList.add(`faixa--${corDaFaixa(classificacao)}`);

  
  ficha.querySelector(".ficha__generos").textContent = generos.join(", ");
  ficha.querySelector(".ficha__elenco-nomes").textContent = elenco.join(", ");


  ficha.querySelector(".ficha__estrelas").replaceWith(criarEstrelas(mediaDasNotas(opinioes)));

  
  const blocoSimilares = ficha.querySelector(".ficha__similares-bloco");
  const listaSimilares = ficha.querySelector(".ficha__similares");
  const similares = titulosSemelhantes
    .map((id) => todosOsFilmes.find((outro) => outro.id === id))
    .filter((outro) => outro !== undefined);

  if (similares.length === 0) {
    blocoSimilares.hidden = true;
  } else {
    similares.forEach((similar) => {
      const item = document.createElement("li");
      const imagem = document.createElement("img");
      imagem.src = similar.figura;
      imagem.alt = similar.titulo;
      imagem.title = similar.titulo;
      item.appendChild(imagem);
      listaSimilares.appendChild(item);
    });
  }


  const blocoOpinioes = ficha.querySelector(".ficha__opinioes");
  const listaOpinioes = ficha.querySelector(".ficha__opinioes-lista");

  if (opinioes.length === 0) {
    blocoOpinioes.hidden = true;
  } else {
    opinioes.forEach((opiniao) => {
      const item = document.createElement("li");
      item.appendChild(criarEstrelas(opiniao.rating));
      item.append(` ${opiniao.descricao}`);
      listaOpinioes.appendChild(item);
    });
  }

  return ficha;
};


const carregarFilmes = async () => {
  const resposta = await fetch(URL_FILMES);
  if (!resposta.ok) {
    throw new Error(`Erro ao carregar os dados (código ${resposta.status})`);
  }
  const dados = await resposta.json();
  console.log(dados); 
  return dados;
};


const exibirCatalogo = (filmes) => {
  catalogo.innerHTML = "";
  filmes.forEach((filme) => {
    catalogo.appendChild(preencherFicha(filme, filmes));
  });
};

const mostrarMensagem = (texto) => {
  catalogo.innerHTML = "";
  const mensagem = document.createElement("p");
  mensagem.setAttribute("role", "status");
  mensagem.textContent = texto;
  catalogo.appendChild(mensagem);
};


if (new URLSearchParams(location.search).has("teste")) {
  exibirCatalogo([filmeDeTeste]);
} else {
  carregarFilmes()
    .then(exibirCatalogo)
    .catch((erro) => {
      console.error(erro);
      mostrarMensagem("Não foi possível carregar o catálogo. Tente novamente mais tarde.");
    });
}