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

function buscarAcao() {
    const simbolo = document.getElementById('inputSimbolo').value || 'PETR4.SA';
    atualizarGrafico(simbolo);
    atualizarIndicadores(simbolo);
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
                <div class="col-md-4">
                  <div class="card border-success">
                    <div class="card-body">
                      <h5 class="card-title">Retorno Acumulado</h5>
                      <p class="card-text text-success fw-bold">${dados.retorno_acumulado}%</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="card border-danger">
                    <div class="card-body">
                      <h5 class="card-title">Volatilidade Anual</h5>
                      <p class="card-text text-danger fw-bold">${dados.volatilidade_anual}%</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="card border-primary">
                    <div class="card-body">
                      <h5 class="card-title">Sharpe Ratio</h5>
                      <p class="card-text text-primary fw-bold">${dados.sharpe_ratio}</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="card border-dark">
                    <div class="card-body">
                      <h5 class="card-title">Preço Médio</h5>
                      <p class="card-text">${dados.preco_medio}</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="card border-dark">
                    <div class="card-body">
                      <h5 class="card-title">Máximo</h5>
                      <p class="card-text">${dados.preco_max}</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="card border-dark">
                    <div class="card-body">
                      <h5 class="card-title">Mínimo</h5>
                      <p class="card-text">${dados.preco_min}</p>
                    </div>
                  </div>
                </div>
            `;

            // Atualiza imagem gerada
            document.getElementById('graficoMatplotlib').src = dados.grafico + '?v=' + new Date().getTime();
        });
}

// Carga inicial com PETR4.SA
buscarAcao();






