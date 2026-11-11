const desafios = [
  // ETAPA 1 – Formar R$ 1,00

  { etapa: 1, alvo: 100, tipo: "moeda", moeda: 5, extras: 2 },
  { etapa: 1, alvo: 100, tipo: "moeda", moeda: 10, extras: 2 },
  { etapa: 1, alvo: 100, tipo: "moeda", moeda: 25, extras: 2 },
  { etapa: 1, alvo: 100, tipo: "moeda", moeda: 50, extras: 2 },

  // ETAPA 2 – Formar R$ 2,00

  { etapa: 2, alvo: 200, tipo: "nota", moeda: 10, extras: 2 },
  { etapa: 2, alvo: 200, tipo: "nota", moeda: 25, extras: 2 },
  { etapa: 2, alvo: 200, tipo: "nota", moeda: 50, extras: 2 },

  // ETAPA 3 – Combinar moedas de R$ 0,25 e R$ 0,50

  { etapa: 3, alvo: 400, tipo: "nota", mistura: [50, 25], extras: 2 },
  { etapa: 3, alvo: 500, tipo: "nota", mistura: [50, 25], extras: 2 },
  { etapa: 3, alvo: 600, tipo: "nota", mistura: [50, 25], extras: 2 },
  { etapa: 3, alvo: 800, tipo: "nota", mistura: [50, 25], extras: 2 },
  { etapa: 3, alvo: 1000, tipo: "nota", mistura: [50, 25], extras: 2 },
  { etapa: 3, alvo: 400, tipo: "nota", mistura: [25, 50], extras: 3 },
  { etapa: 3, alvo: 500, tipo: "nota", mistura: [25, 50], extras: 3 },
  { etapa: 3, alvo: 1000, tipo: "nota", mistura: [50, 25], extras: 2 }
];

const inicio = document.getElementById("inicio");
const jogo = document.getElementById("jogo");
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


// FORMATAÇÃO DO DINHEIRO

function dinheiro(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


// EMBARALHAR MOEDAS

function embaralhar(lista) {
  const copia = [...lista];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}


// NOMES DAS MOEDAS

function nomeMoeda(valor) {
  return {
    5: "5 centavos",
    10: "10 centavos",
    25: "25 centavos",
    50: "50 centavos",
    100: "1 real"
  }[valor];
}


// CRIAR MOEDAS

function criarMoeda(valor, destino) {

  const moeda = document.createElement("div");

  moeda.className =
    "moeda" + (valor === 100 ? " um-real" : "");

  moeda.draggable = true;

  moeda.dataset.centavos = String(valor);
  moeda.dataset.id = String(proximoId++);

  moeda.setAttribute("role", "button");

  moeda.setAttribute(
    "aria-label",
    `Moeda de ${nomeMoeda(valor)}`
  );

  moeda.innerHTML = `
  <span class="simbolo">R$</span>
  <span class="valor">
    ${
      valor === 100
        ? "1,00"
        : "0," + String(valor).padStart(2, "0")
    }
  </span>
`;

  moeda.addEventListener("dragstart", (e) => {

    arrastando = moeda;

    e.dataTransfer.setData(
      "text/plain",
      moeda.dataset.id
    );

    e.dataTransfer.effectAllowed = "move";

    setTimeout(() => {
      moeda.classList.add("arrastando");
    }, 0);

  });

  moeda.addEventListener("dragend", () => {

    moeda.classList.remove("arrastando");

    arrastando = null;

    areaSoltar.classList.remove("destacada");

  });

  moeda.addEventListener("click", () => {

    if (moeda.parentElement === escolhidas) {
      devolverMoeda(moeda);
    }

  });

  destino.appendChild(moeda);

  return moeda;
}


// GERAR AS MOEDAS DE CADA DESAFIO

function gerarMoedas(desafio) {

  let valores = [];

  if (desafio.etapa < 3) {

    const quantidade =
      desafio.alvo / desafio.moeda;

    valores = Array(
      quantidade + desafio.extras
    ).fill(desafio.moeda);

  } else {

    const alvo = desafio.alvo;

    let qtd25 =
      desafio.mistura[0] === 25 ? 4 : 2;

    let qtd50 =
      (alvo - qtd25 * 25) / 50;

    if (!Number.isInteger(qtd50) || qtd50 < 0) {

      qtd25 = 0;

      qtd50 = alvo / 50;

    }

    valores = [
      ...Array(qtd50).fill(50),
      ...Array(qtd25).fill(25)
    ];

    // Moedas extras para o aluno escolher

    valores.push(
      ...(desafio.extras === 3
        ? [25, 50, 25]
        : [25, 50])
    );

  }

  return embaralhar(valores);
}


// CRIAR O OBJETIVO DO DESAFIO

function criarAlvo(desafio) {

  const alvo = document.getElementById("alvo");

  alvo.innerHTML = "";

  if (desafio.tipo === "moeda") {

    const moeda = criarMoedaVisualAlvo(100);

    alvo.appendChild(moeda);

  } else if (desafio.etapa === 2) {

    // Cédula brasileira de R$ 2,00

    const nota = document.createElement("div");

    nota.className = "nota nota-2";

    nota.innerHTML = `
      <span class="nome-nota">
        REPÚBLICA FEDERATIVA DO BRASIL
      </span>

      <span class="valor-nota">R$ 2</span>

      <span class="nome-nota">DOIS REAIS</span>
    `;

    alvo.appendChild(nota);

  } else {

    // Valores maiores: cartão de objetivo

    const cartao = document.createElement("div");

    cartao.className = "cartao-valor";

    cartao.innerHTML = `
      <span>VALOR A FORMAR</span>

      <strong>${dinheiro(desafio.alvo)}</strong>

      <small>
        Use moedas de R$ 0,25 e R$ 0,50
      </small>
    `;

    alvo.appendChild(cartao);

  }

}


// REPRESENTAÇÃO DA MOEDA DE R$ 1,00

function criarMoedaVisualAlvo(valor) {

  const moeda = document.createElement("div");

  moeda.className = "moeda um-real alvo-moeda";

  moeda.innerHTML = `
    <span class="simbolo">BRASIL</span>
    <span class="valor">R$ 1</span>
  `;

  moeda.setAttribute(
    "aria-label",
    "Moeda de um real"
  );

  return moeda;
}


// INICIAR CADA DESAFIO

function iniciarDesafio() {

  const d = desafios[indice];

  soma = 0;

  escolhidas.innerHTML = "";
  banco.innerHTML = "";

  mensagem.textContent =
    "Arraste as moedas até a área de troca.";

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

    3: "ETAPA 3 – COMBINAÇÃO DE MOEDAS"

  };

  document.getElementById("nome-etapa").textContent =
    nomes[d.etapa];

  document.getElementById("instrucao").textContent =

    d.etapa === 1
      ? "Junte moedas para conseguir uma moeda de R$ 1,00!"

      : d.etapa === 2
        ? "Junte moedas para trocar por uma cédula de R$ 2,00!"

        : `Forme ${dinheiro(d.alvo)} usando moedas de R$ 0,25 e R$ 0,50!`;

  criarAlvo(d);

  gerarMoedas(d).forEach(valor => {
    criarMoeda(valor, banco);
  });

}


// ATUALIZAR O TOTAL

function atualizarTotal() {

  soma = [
    ...escolhidas.querySelectorAll(".moeda")
  ].reduce((acc, moeda) => {

    return acc + Number(moeda.dataset.centavos);

  }, 0);

  totalEl.textContent = dinheiro(soma);

  placeholder.style.display =
    escolhidas.children.length ? "none" : "block";

}


// VERIFICAR SE A MOEDA PODE SER ADICIONADA

function podeAdicionar(moeda) {

  const valor =
    Number(moeda.dataset.centavos);

  const alvo =
    desafios[indice].alvo;

  if (soma + valor > alvo) {

    mensagem.textContent =
      "Essa moeda faria o total passar do valor pedido. Tente outra!";

    mensagem.className = "mensagem-erro";

    return false;

  }

  return true;

}


// ADICIONAR MOEDA NA ÁREA DE TROCA

function adicionarMoeda(moeda) {

  if (
    !moeda ||
    moeda.parentElement === escolhidas ||
    !podeAdicionar(moeda)
  ) {
    return;
  }

  escolhidas.appendChild(moeda);

  mensagem.textContent =
    "Muito bem! Continue até completar o valor.";

  mensagem.className = "";

  atualizarTotal();

}


// DEVOLVER UMA MOEDA

function devolverMoeda(moeda) {

  banco.appendChild(moeda);

  atualizarTotal();

  mensagem.textContent =
    "Moeda devolvida. Você pode tentar outra combinação!";

  mensagem.className = "";

}


// ARRASTAR MOEDAS PARA A ÁREA DE TROCA

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

  const moeda = [
    ...banco.children
  ].find(m => m.dataset.id === id) || arrastando;

  adicionarMoeda(moeda);

});


// ARRASTAR MOEDAS DE VOLTA

banco.addEventListener("dragover", e => {

  e.preventDefault();

});


banco.addEventListener("drop", (e) => {

  e.preventDefault();

  const id =
    e.dataTransfer.getData("text/plain");

  const moeda = [
    ...escolhidas.children
  ].find(m => m.dataset.id === id) || arrastando;

  if (
    moeda &&
    moeda.parentElement === escolhidas
  ) {

    devolverMoeda(moeda);

  }

});


// DEVOLVER TODAS AS MOEDAS

document
  .getElementById("btn-limpar")
  .addEventListener("click", () => {

    [
      ...escolhidas.children
    ].forEach(moeda => {

      banco.appendChild(moeda);

    });

    atualizarTotal();

    mensagem.textContent =
      "Todas as moedas foram devolvidas.";

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

    document.getElementById("btn-conferir").disabled =
      true;

    document.getElementById("btn-conferir").textContent =
      "Troca concluída!";

    setTimeout(() => {

      document.getElementById("btn-conferir").disabled =
        false;

      document.getElementById("btn-conferir").textContent =
        "Conferir troca";

      indice++;

      if (indice >= desafios.length) {

        finalizar();

      } else {

        iniciarDesafio();

      }

    }, 1300);

  });


// TELA FINAL

function finalizar() {

  jogo.classList.add("escondido");

  telaFinal.classList.remove("escondido");

  document.getElementById("resultado-final").textContent =

    `Você concluiu os 15 desafios e conquistou ${pontos} de ${desafios.length * 10} pontos!`;

}


// COMEÇAR O JOGO

document
  .getElementById("btn-iniciar")
  .addEventListener("click", () => {

    indice = 0;
    pontos = 0;

    inicio.classList.add("escondido");

    telaFinal.classList.add("escondido");

    jogo.classList.remove("escondido");

    iniciarDesafio();

  });


// JOGAR NOVAMENTE

document
  .getElementById("btn-reiniciar")
  .addEventListener("click", () => {

    indice = 0;
    pontos = 0;

    telaFinal.classList.add("escondido");

    jogo.classList.remove("escondido");

    iniciarDesafio();

  });
