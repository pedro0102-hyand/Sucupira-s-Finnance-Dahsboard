const ctx = document.getElementById('grafico').getContext('2d');
const grafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Preço de Fechamento',
            data: [],
            borderColor: 'green',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { display: true },
            y: { display: true }
        }
    }
});

const ctxComparacao = document.getElementById('graficoComparacao').getContext('2d');
const graficoComparacao = new Chart(ctxComparacao, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Preço de Fechamento (Comparação)',
            data: [],
            borderColor: 'blue',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { display: true },
            y: { display: true }
        }
    }
});

// NOVO gráfico para a previsão
const ctxPrevisao = document.getElementById('graficoPrevisao').getContext('2d');
const graficoPrevisao = new Chart(ctxPrevisao, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Preço Previsto',
            data: [],
            borderColor: 'orange',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { display: true },
            y: { display: true }
        }
    }
});

const ctxPrevisaoComparacao = document.getElementById('graficoPrevisaoComparacao').getContext('2d');
const graficoPrevisaoComparacao = new Chart(ctxPrevisaoComparacao, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Preço Previsto (Comparação)',
            data: [],
            borderColor: 'orange',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: { x: { display: true }, y: { display: true } }
    }
});


function buscarAcao() {
    const simbolo = document.getElementById('inputSimbolo').value || 'PETR4.SA';
    atualizarGrafico(simbolo);
    atualizarIndicadores(simbolo);
    atualizarPrevisao(simbolo);
}

function buscarComparacao() {
    const simbolo = document.getElementById('inputComparar').value;
    if (!simbolo) return;
    atualizarGraficoComparacao(simbolo);
    atualizarIndicadoresComparacao(simbolo);
}

function atualizarGrafico(simbolo) {
    fetch(`/dados?simbolo=${simbolo}`)
        .then(resp => resp.json())
        .then(dados => {
            if (dados.erro) {
                alert(dados.erro);
                return;
            }
            grafico.data.labels = dados.map(p => p.data);
            grafico.data.datasets[0].data = dados.map(p => p.preco);
            grafico.update();
        });
}

function atualizarGraficoComparacao(simbolo) {
    fetch(`/dados?simbolo=${simbolo}`)
        .then(resp => resp.json())
        .then(dados => {
            if (dados.erro) {
                alert(dados.erro);
                return;
            }
            graficoComparacao.data.labels = dados.map(p => p.data);
            graficoComparacao.data.datasets[0].data = dados.map(p => p.preco);
            graficoComparacao.update();
        });
}

function atualizarPrevisao(simbolo) {
    fetch(`/previsao?simbolo=${simbolo}`)
        .then(resp => resp.json())
        .then(previsao => {
            if (previsao.erro) {
                document.getElementById("previsaoCard").innerText = "Erro ao prever.";
                return;
            }

            document.getElementById("previsaoCard").innerText = previsao.precos.join(" → ");
            document.getElementById("previsaoCardResumo").innerText = previsao.resumo_preditivo;
            graficoPrevisao.data.labels = previsao.datas;
            graficoPrevisao.data.datasets[0].data = previsao.precos;
            graficoPrevisao.update();
        });
}

function atualizarIndicadores(simbolo) {
    fetch(`/analise?simbolo=${simbolo}`)
        .then(resp => resp.json())
        .then(dados => {
            if (dados.erro) {
                alert(dados.erro);
                return;
            }

            const container = document.getElementById("indicadores");
            container.innerHTML = `
                <div class="col-md-4"><div class="card border-success"><div class="card-body">
                    <h5 class="card-title">Retorno Acumulado</h5>
                    <p class="card-text text-success fw-bold">${dados.retorno_acumulado}%</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-danger"><div class="card-body">
                    <h5 class="card-title">Volatilidade Anual</h5>
                    <p class="card-text text-danger fw-bold">${dados.volatilidade_anual}%</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-primary"><div class="card-body">
                    <h5 class="card-title">Sharpe Ratio</h5>
                    <p class="card-text text-primary fw-bold">${dados.sharpe_ratio}</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                    <h5 class="card-title">Preço Médio</h5>
                    <p class="card-text">${dados.preco_medio}</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                    <h5 class="card-title">Máximo</h5>
                    <p class="card-text">${dados.preco_max}</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                    <h5 class="card-title">Mínimo</h5>
                    <p class="card-text">${dados.preco_min}</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-secondary"><div class="card-body">
                    <h5 class="card-title">Retorno Total</h5>
                    <p class="card-text fw-bold">${dados.retorno_total}%</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                    <h5 class="card-title">Preço Inicial</h5>
                    <p class="card-text">${dados.preco_inicio}</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                    <h5 class="card-title">Preço Final</h5>
                    <p class="card-text">${dados.preco_fim}</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-success"><div class="card-body">
                    <h5 class="card-title">Dias de Alta</h5>
                    <p class="card-text text-success">${dados.dias_alta}</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-danger"><div class="card-body">
                    <h5 class="card-title">Dias de Queda</h5>
                    <p class="card-text text-danger">${dados.dias_baixa}</p>
                </div></div></div>
                <div class="col-md-4"><div class="card border-warning"><div class="card-body">
                    <h5 class="card-title">Maior Retorno Diário</h5>
                    <p class="card-text">${dados.maior_retorno}% em ${dados.data_maior_retorno}</p>
                </div></div></div>
            `;

            document.getElementById('graficoMatplotlib').src = dados.grafico + '?v=' + new Date().getTime();
        });
}

function atualizarIndicadoresComparacao(simbolo) {
  fetch(`/analise?simbolo=${simbolo}`)
      .then(resp => resp.json())
      .then(dados => {
          if (dados.erro) {
              alert(dados.erro);
              return;
          }

          document.getElementById('tituloComparacao').style.display = 'block';
          document.getElementById('tituloComparacao').innerText = `Comparando com: ${simbolo}`;

          const container = document.getElementById("indicadoresComparacao");
          container.innerHTML = `
              <div class="col-md-4"><div class="card border-success"><div class="card-body">
                  <h5 class="card-title">Retorno Acumulado</h5>
                  <p class="card-text text-success fw-bold">${dados.retorno_acumulado}%</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-danger"><div class="card-body">
                  <h5 class="card-title">Volatilidade Anual</h5>
                  <p class="card-text text-danger fw-bold">${dados.volatilidade_anual}%</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-primary"><div class="card-body">
                  <h5 class="card-title">Sharpe Ratio</h5>
                  <p class="card-text text-primary fw-bold">${dados.sharpe_ratio}</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                  <h5 class="card-title">Preço Médio</h5>
                  <p class="card-text">${dados.preco_medio}</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                  <h5 class="card-title">Máximo</h5>
                  <p class="card-text">${dados.preco_max}</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                  <h5 class="card-title">Mínimo</h5>
                  <p class="card-text">${dados.preco_min}</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-secondary"><div class="card-body">
                  <h5 class="card-title">Retorno Total</h5>
                  <p class="card-text fw-bold">${dados.retorno_total}%</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                  <h5 class="card-title">Preço Inicial</h5>
                  <p class="card-text">${dados.preco_inicio}</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-dark"><div class="card-body">
                  <h5 class="card-title">Preço Final</h5>
                  <p class="card-text">${dados.preco_fim}</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-success"><div class="card-body">
                  <h5 class="card-title">Dias de Alta</h5>
                  <p class="card-text text-success">${dados.dias_alta}</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-danger"><div class="card-body">
                  <h5 class="card-title">Dias de Queda</h5>
                  <p class="card-text text-danger">${dados.dias_baixa}</p>
              </div></div></div>
              <div class="col-md-4"><div class="card border-warning"><div class="card-body">
                  <h5 class="card-title">Maior Retorno Diário</h5>
                  <p class="card-text">${dados.maior_retorno}% em ${dados.data_maior_retorno}</p>
              </div></div></div>
          `;

          document.getElementById('graficoMatplotlibComparacao').src = dados.grafico + '?v=' + new Date().getTime();

          // Previsão para comparação
          fetch(`/previsao?simbolo=${simbolo}`)
              .then(resp => resp.json())
              .then(previsao => {
                  if (previsao.erro) {
                      document.getElementById("previsaoComparacaoCard").innerText = "Erro na previsão.";
                      return;
                  }
                  document.getElementById("previsaoComparacaoCard").innerText = previsao.precos.join(" → ");
                  graficoPrevisaoComparacao.data.labels = previsao.datas;
                  graficoPrevisaoComparacao.data.datasets[0].data = previsao.precos;
                  graficoPrevisaoComparacao.update();
                  document.getElementById("previsaoComparacaoResumo").innerText = previsao.resumo_preditivo;

              });
      });
}


// Inicialização
buscarAcao();










