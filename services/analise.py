import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import os

def analisar_acao(dados_json, simbolo):
    # Converte o JSON em DataFrame
    df = pd.DataFrame(dados_json)

    # Verificações defensivas
    if df.empty or 'preco' not in df.columns:
        return {
            "erro": "Dados insuficientes para análise."
        }

    # Conversão e ordenação por data
    df['data'] = pd.to_datetime(df['data'])
    df = df.sort_values('data')
    df.set_index('data', inplace=True)

    # Cálculos principais
    df['retorno_diario'] = df['preco'].pct_change()

    # Verifica se foi possível calcular o retorno
    if df['retorno_diario'].isnull().all():
        return {
            "erro": "Não foi possível calcular o retorno diário."
        }

    df['retorno_acumulado'] = (1 + df['retorno_diario']).cumprod() - 1
    df['media_movel_5'] = df['preco'].rolling(window=5).mean()

    # Indicadores estatísticos
    media_retorno = df['retorno_diario'].mean()
    desvio_padrao = df['retorno_diario'].std()
    volatilidade = desvio_padrao * np.sqrt(252) if desvio_padrao > 0 else 0
    sharpe = (media_retorno * 252) / volatilidade if volatilidade > 0 else 0

    preco_medio = df['preco'].mean()
    preco_min = df['preco'].min()
    preco_max = df['preco'].max()

    # Criar pasta para salvar os gráficos
    os.makedirs('static/graficos', exist_ok=True)
    caminho_img = f'static/graficos/media_movel_{simbolo}.png'

    # Geração do gráfico
    plt.figure(figsize=(10, 4))
    plt.plot(df.index, df['preco'], label='Preço')
    plt.plot(df.index, df['media_movel_5'], label='Média Móvel (5 dias)')
    plt.title(f'{simbolo} - Preço com Média Móvel')
    plt.xlabel('Data')
    plt.ylabel('Preço (R$)')
    plt.legend()
    plt.tight_layout()
    plt.savefig(caminho_img)
    plt.close()

    # Resumo a ser retornado
    return {
        "simbolo": simbolo,
        "media_movel_5_hoje": round(df['media_movel_5'].iloc[-1], 2) if not df['media_movel_5'].isnull().all() else None,
        "retorno_acumulado": round(df['retorno_acumulado'].iloc[-1] * 100, 2),
        "variacao_ultimo_dia": round(df['retorno_diario'].iloc[-1] * 100, 2),
        "volatilidade_anual": round(volatilidade * 100, 2),
        "sharpe_ratio": round(sharpe, 2),
        "preco_medio": round(preco_medio, 2),
        "preco_min": round(preco_min, 2),
        "preco_max": round(preco_max, 2),
        "grafico": "/" + caminho_img
    }







