const desafios = [
  // Etapa 1: formar R$ 1,00 usando um tipo de moeda por desafio.
  { etapa: 1, alvo: 100, moeda: 5, extras: 2 },
  { etapa: 1, alvo: 100, moeda: 10, extras: 2 },
  { etapa: 1, alvo: 100, moeda: 25, extras: 2 },
  { etapa: 1, alvo: 100, moeda: 50, extras: 2 },

  // Etapa 2: formar R$ 2,00 usando moedas.
  { etapa: 2, alvo: 200, moeda: 10, extras: 2 },
  { etapa: 2, alvo: 200, moeda: 25, extras: 2 },
  { etapa: 2, alvo: 200, moeda: 50, extras: 2 },

  // Etapa 3: combinações de moedas.
  {
    etapa: 3,
    alvo: 400,
    solucao: [50,50,50,50,50,50,50,50],
    extras: [25,25,50],
    dica: "Use moedas de R$ 0,25 e R$ 0,50."
  },
  {
    etapa: 3,
    alvo: 500,
    solucao: [50,50,50,50,50,50,50,50,50,50],
    extras: [25,50],
    dica: "Use moedas de R$ 0,25 e R$ 0,50."
  },
  {
    etapa: 3,
    alvo: 600,
    solucao: [50,50,50,50,50,50,50,50,50,50,50,50],
    extras: [25,25],
    dica: "Use moedas de R$ 0,25 e R$ 0,50."
  },

  // Etapa 3: desafios com cédulas ilustradas e moedas.
  {
    etapa: 3,
    alvo: 800,
    solucao: [500,200,100],
    extras: [50,25],
    dica: "Combine cédulas e moedas para formar o valor."
  },
  {
    etapa: 3,
    alvo: 1000,
    solucao: [1000],
    extras: [500,200,100],
    dica: "Escolha a cédula ou combine outras peças."
  },
  {
    etapa: 3,
    alvo: 400,
    solucao: [200,200],
    extras: [100,50,25],
    dica: "Combine cédulas e moedas para formar o valor."
  },
  {
    etapa: 3,
    alvo: 500,
    solucao: [500],
    extras: [200,100,50,25],
    dica: "Escolha a cédula ou combine outras peças."
  },
  {
    etapa: 3,
    alvo: 1000,
    solucao: [500,500],
    extras: [200,100,50],
    dica: "Combine cédulas e moedas para formar o valor."
  }
];

const perguntas = [
  {
    texto: "Quantas moedas de R$ 0,50 precisamos para formar R$ 2,00?",
    alternativas: ["2 moedas", "4 moedas", "5 moedas"],
    correta: 1
  },
  {
    texto: "Quantas moedas de R$ 0,25 precisamos para formar R$ 1,00?",
    alternativas: ["4 moedas", "3 moedas", "5 moedas"],
    correta: 0
  },
  {
    texto: "Quantas moedas de R$ 0,10 precisamos para formar R$ 1,00?",
    alternativas: ["5 moedas", "8 moedas", "10 moedas"],
    correta: 2
  },
  {
    texto: "Quantas cédulas de R$ 2,00 formam R$ 10,00?",
    alternativas: ["4 cédulas", "5 cédulas", "6 cédulas"],
    correta: 1
  },
  {
    texto: "Quantas cédulas de R$ 5,00 formam R$ 10,00?",
    alternativas: ["2 cédulas", "3 cédulas", "5 cédulas"],
    correta: 0
  }
];

// ELEMENTOS DO JOGO

const inicio = document.getElementById("inicio");
const jogo = document.getElementById("jogo");
const telaPerguntas = document.getElementById("perguntas");
const telaFinal = document.getElementById("final");

const banco = document.getElementById("banco-moedas");
const areaSoltar = document.getElementById("area-soltar");
const escolhidas = document.getElementById("moedas-escolhidas");

const placeholder = document.getElementById("placeholder");
const totalEl = document.getElementById("total");
const mensagem = document.getElementById("mensagem");

let indice = 0;
let pontos = 0;
let soma = 0;
let arrastando = null;
let proximoId = 1;

let perguntaAtual = 0;
let acertos = 0;
let perguntaRespondida = false;


// FORMATAÇÃO DO DINHEIRO

function dinheiro(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


// EMBARALHAR PEÇAS

function embaralhar(lista) {
  const copia = [...lista];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}


// NOMES DAS MOEDAS E CÉDULAS

function nomePeca(valor) {
  const nomes = {
    5: "moeda de 5 centavos",
    10: "moeda de 10 centavos",
    25: "moeda de 25 centavos",
    50: "moeda de 50 centavos",
    100: "moeda de 1 real",
    200: "cédula educativa de 2 reais",
    500: "cédula educativa de 5 reais",
    1000: "cédula educativa de 10 reais",
    2000: "cédula educativa de 20 reais",
    5000: "cédula educativa de 50 reais"
  };

  return nomes[valor] || dinheiro(valor);
}


// IDENTIFICAR A CLASSE VISUAL DA PEÇA

function classePeca(valor) {
  if (valor < 200) {
    return `moeda moeda-${valor}`;
  }

  return `cedula cedula-${valor / 100}`;
}


// ESCREVER O VALOR DAS MOEDAS

function textoValorMoeda(valor) {
  if (valor === 100) {
    return "R$<br>1,00";
  }

  return `R$<br>0,${String(valor).padStart(2, "0")}`;
}


// CRIAR MOEDAS E CÉDULAS

function criarPeca(valor, destino) {
  const peca = document.createElement("div");
  const ehMoeda = valor < 200;

  peca.className = `peca ${classePeca(valor)}`;
  peca.draggable = true;

  peca.dataset.centavos = String(valor);
  peca.dataset.id = String(proximoId++);

  peca.setAttribute("role", "button");
  peca.setAttribute("tabindex", "0");
  peca.setAttribute("aria-label", nomePeca(valor));

  if (ehMoeda) {
    peca.innerHTML = `
      <span class="tipo">MOEDA</span>
      <span class="valor">${textoValorMoeda(valor)}</span>
    `;
  } else {
    peca.innerHTML = `
      <span class="valor">R$ ${valor / 100}</span>
      <small>DINHEIRO EDUCATIVO</small>
    `;
  }

  // ARRASTAR A PEÇA

  peca.addEventListener("dragstart", (e) => {
    arrastando = peca;

    e.dataTransfer.setData(
      "text/plain",
      peca.dataset.id
    );

    e.dataTransfer.effectAllowed = "move";

    setTimeout(() => {
      peca.classList.add("arrastando");
    }, 0);
  });

  peca.addEventListener("dragend", () => {
    peca.classList.remove("arrastando");
    arrastando = null;
    areaSoltar.classList.remove("destacada");
  });

  // CLICAR PARA ADICIONAR OU DEVOLVER

  peca.addEventListener("click", () => {
    if (peca.parentElement === escolhidas) {
      devolverPeca(peca);
    } else if (peca.parentElement === banco) {
      adicionarPeca(peca);
    }
  });

  // ACESSIBILIDADE PELO TECLADO

  peca.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      if (peca.parentElement === escolhidas) {
        devolverPeca(peca);
      } else if (peca.parentElement === banco) {
        adicionarPeca(peca);
      }
    }
  });

  destino.appendChild(peca);

  return peca;
}


// GERAR AS PEÇAS DE CADA DESAFIO

function gerarPecas(desafio) {
  let valores = [];

  if (desafio.etapa < 3) {
    const quantidade = desafio.alvo / desafio.moeda;

    valores = Array(
      quantidade + desafio.extras
    ).fill(desafio.moeda);

  } else {
    valores = [
      ...desafio.solucao,
      ...desafio.extras
    ];
  }

  return embaralhar(valores);
}


// CRIAR O OBJETIVO DO DESAFIO

function criarAlvo(desafio) {
  const alvo = document.getElementById("alvo");

  alvo.innerHTML = "";

  if (desafio.etapa === 1) {
    const moeda = document.createElement("div");

    moeda.className = "peca moeda moeda-100 alvo-peca";

    moeda.innerHTML = `
      <span class="tipo">MOEDA</span>
      <span class="valor">R$<br>1,00</span>
    `;

    alvo.appendChild(moeda);

  } else if (desafio.etapa === 2) {
    const nota = document.createElement("div");

    nota.className = "peca cedula cedula-2 alvo-peca";

    nota.innerHTML = `
      <span class="valor">R$ 2</span>
      <small>VALOR DESEJADO</small>
    `;

    alvo.appendChild(nota);

  } else {
    const cartao = document.createElement("div");

    cartao.className = "cartao-valor";

    cartao.innerHTML = `
      <span>VALOR A FORMAR</span>
      <strong>${dinheiro(desafio.alvo)}</strong>
      <small>${desafio.dica || "Combine moedas e cédulas."}</small>
    `;

    alvo.appendChild(cartao);
  }
}


// INICIAR CADA DESAFIO

function iniciarDesafio() {
  const d = desafios[indice];

  soma = 0;

  escolhidas.innerHTML = "";
  banco.innerHTML = "";

  mensagem.textContent =
    "Arraste o dinheiro até a área de troca.";

  mensagem.className = "";

  totalEl.textContent = dinheiro(0);

  placeholder.style.display = "block";

  document.getElementById("etapa-atual").textContent =
    d.etapa;

  document.getElementById("desafio-atual").textContent =
    indice + 1;

  document.getElementById("pontos").textContent =
    pontos;

  const nomes = {
    1: "ETAPA 1 – TROCA POR UMA MOEDA DE R$ 1,00",
    2: "ETAPA 2 – TROCA POR UMA CÉDULA DE R$ 2,00",
    3: "ETAPA 3 – COMBINAÇÃO DE MOEDAS E CÉDULAS"
  };

  document.getElementById("nome-etapa").textContent =
    nomes[d.etapa];

  document.getElementById("instrucao").textContent =
    d.etapa === 1
      ? "Junte moedas para conseguir R$ 1,00!"
      : d.etapa === 2
        ? "Junte moedas para conseguir R$ 2,00!"
        : `Forme ${dinheiro(d.alvo)} usando o dinheiro disponível!`;

  criarAlvo(d);

  gerarPecas(d).forEach(valor => {
    criarPeca(valor, banco);
  });

  document.getElementById("btn-conferir").disabled = false;

  document.getElementById("btn-conferir").textContent =
    "Conferir troca";
}


// ATUALIZAR O TOTAL

function atualizarTotal() {
  soma = [
    ...escolhidas.querySelectorAll(".peca")
  ].reduce((acc, peca) => {
    return acc + Number(peca.dataset.centavos);
  }, 0);

  totalEl.textContent = dinheiro(soma);

  placeholder.style.display =
    escolhidas.children.length ? "none" : "block";
}


// VERIFICAR SE A PEÇA PODE SER ADICIONADA

function podeAdicionar(peca) {
  const valor =
    Number(peca.dataset.centavos);

  const alvo =
    desafios[indice].alvo;

  if (soma + valor > alvo) {
    mensagem.textContent =
      "Essa peça faria o total passar do valor pedido. Tente outra!";

    mensagem.className = "mensagem-erro";

    return false;
  }

  return true;
}


// ADICIONAR PEÇA NA ÁREA DE TROCA

function adicionarPeca(peca) {
  if (
    !peca ||
    peca.parentElement === escolhidas ||
    !podeAdicionar(peca)
  ) {
    return;
  }

  escolhidas.appendChild(peca);

  mensagem.textContent =
    "Muito bem! Continue até completar o valor.";

  mensagem.className = "";

  atualizarTotal();
}


// DEVOLVER UMA PEÇA

function devolverPeca(peca) {
  banco.appendChild(peca);

  atualizarTotal();

  mensagem.textContent =
    "Peça devolvida. Você pode tentar outra combinação!";

  mensagem.className = "";
}


// ARRASTAR PEÇAS PARA A ÁREA DE TROCA

areaSoltar.addEventListener("dragover", (e) => {
  e.preventDefault();

  areaSoltar.classList.add("destacada");
});

areaSoltar.addEventListener("dragleave", (e) => {
  if (!areaSoltar.contains(e.relatedTarget)) {
    areaSoltar.classList.remove("destacada");
  }
});

areaSoltar.addEventListener("drop", (e) => {
  e.preventDefault();

  areaSoltar.classList.remove("destacada");

  const id =
    e.dataTransfer.getData("text/plain");

  const peca = [
    ...banco.children
  ].find(item => item.dataset.id === id) || arrastando;

  adicionarPeca(peca);
});


// ARRASTAR PEÇAS DE VOLTA

banco.addEventListener("dragover", e => {
  e.preventDefault();
});

banco.addEventListener("drop", (e) => {
  e.preventDefault();

  const id =
    e.dataTransfer.getData("text/plain");

  const peca = [
    ...escolhidas.children
  ].find(item => item.dataset.id === id) || arrastando;

  if (
    peca &&
    peca.parentElement === escolhidas
  ) {
    devolverPeca(peca);
  }
});


// DEVOLVER TODAS AS PEÇAS

document
  .getElementById("btn-limpar")
  .addEventListener("click", () => {

    [
      ...escolhidas.children
    ].forEach(peca => {
      banco.appendChild(peca);
    });

    atualizarTotal();

    mensagem.textContent =
      "Todas as peças foram devolvidas.";

    mensagem.className = "";
  });


// CONFERIR A TROCA

document
  .getElementById("btn-conferir")
  .addEventListener("click", () => {

    const alvo =
      desafios[indice].alvo;

    if (soma !== alvo) {
      mensagem.textContent =
        soma < alvo
          ? `Ainda faltam ${dinheiro(alvo - soma)}. Continue!`
          : "O valor passou do solicitado. Tente novamente.";

      mensagem.className = "mensagem-erro";

      return;
    }

    pontos += 10;

    document.getElementById("pontos").textContent =
      pontos;

    mensagem.textContent =
      "🎉 Muito bem! Você completou a troca!";

    mensagem.className = "mensagem-ok";

    const botao =
      document.getElementById("btn-conferir");

    botao.disabled = true;
    botao.textContent = "Troca concluída!";

    setTimeout(() => {
      indice++;

      if (indice >= desafios.length) {
        iniciarPerguntas();
      } else {
        iniciarDesafio();
      }
    }, 1100);
  });


// INICIAR AS PERGUNTAS FINAIS

function iniciarPerguntas() {
  jogo.classList.add("escondido");

  telaPerguntas.classList.remove("escondido");

  perguntaAtual = 0;
  acertos = 0;

  mostrarPergunta();
}


// MOSTRAR UMA PERGUNTA

function mostrarPergunta() {
  perguntaRespondida = false;

  const p = perguntas[perguntaAtual];

  document.getElementById("numero-pergunta").textContent =
    perguntaAtual + 1;

  document.getElementById("texto-pergunta").textContent =
    p.texto;

  document.getElementById("feedback-pergunta").textContent =
    "";

  document.getElementById("feedback-pergunta").className =
    "";

  document.getElementById("btn-proxima-pergunta")
    .classList.add("escondido");

  const alternativas =
    document.getElementById("alternativas");

  alternativas.innerHTML = "";

  p.alternativas.forEach((texto, i) => {
    const botao = document.createElement("button");

    botao.className = "alternativa";
    botao.type = "button";
    botao.textContent = texto;

    botao.addEventListener("click", () => {
      responderPergunta(i);
    });

    alternativas.appendChild(botao);
  });
}


// CONFERIR A RESPOSTA

function responderPergunta(escolha) {
  if (perguntaRespondida) return;

  perguntaRespondida = true;

  const p = perguntas[perguntaAtual];

  const botoes = [
    ...document.querySelectorAll(".alternativa")
  ];

  botoes.forEach((botao, i) => {
    botao.disabled = true;

    if (i === p.correta) {
      botao.classList.add("correta");
    } else if (i === escolha) {
      botao.classList.add("incorreta");
    }
  });

  const feedback =
    document.getElementById("feedback-pergunta");

  if (escolha === p.correta) {
    acertos++;

    feedback.textContent =
      "Muito bem! Você acertou! +10 pontos";

    feedback.className = "feedback-ok";

  } else {
    feedback.textContent =
      `Quase! A resposta correta é: ${p.alternativas[p.correta]}.`;

    feedback.className = "feedback-erro";
  }

  const proxima =
    document.getElementById("btn-proxima-pergunta");

  proxima.textContent =
    perguntaAtual === perguntas.length - 1
      ? "Ver resultado final"
      : "Próxima pergunta";

  proxima.classList.remove("escondido");
}


// AVANÇAR PARA A PRÓXIMA PERGUNTA

document
  .getElementById("btn-proxima-pergunta")
  .addEventListener("click", () => {

    perguntaAtual++;

    if (perguntaAtual >= perguntas.length) {
      finalizar();
    } else {
      mostrarPergunta();
    }
  });


// TELA FINAL

function finalizar() {
  telaPerguntas.classList.add("escondido");
  jogo.classList.add("escondido");

  telaFinal.classList.remove("escondido");

  const pontosPerguntas = acertos * 10;
  const totalPontos = pontos + pontosPerguntas;

  document.getElementById("resultado-final").textContent =
    `Nas trocas, você conquistou ${pontos} de 150 pontos. Nas perguntas, acertou ${acertos} de 5 e ganhou ${pontosPerguntas} pontos. Sua pontuação total foi ${totalPontos} de 200 pontos!`;
}


// COMEÇAR OU REINICIAR O JOGO

function comecarJogo() {
  indice = 0;
  pontos = 0;
  acertos = 0;
  perguntaAtual = 0;
  proximoId = 1;

  inicio.classList.add("escondido");
  telaPerguntas.classList.add("escondido");
  telaFinal.classList.add("escondido");

  jogo.classList.remove("escondido");

  iniciarDesafio();
}

document
  .getElementById("btn-iniciar")
  .addEventListener("click", comecarJogo);

document
  .getElementById("btn-reiniciar")
  .addEventListener("click", comecarJogo);
