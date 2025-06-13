import requests
import pandas as pd 

API_KEY = "9DD1E9MZAMN8E04Z."  

def buscar_dados_acao(simbolo):
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": simbolo,
        "apikey": API_KEY,
        "outputsize": "compact"  # últimos ~100 dias
    }

    resposta = requests.get(url, params=params)
    dados = resposta.json()

    if "Time Series (Daily)" not in dados:
        return None

    serie = dados["Time Series (Daily)"]
    datas = sorted(serie.keys())[-30:]  # últimos 30 dias

    historico = []
    for data in datas:
        preco = float(serie[data]["4. close"])
        historico.append({"data": data, "preco": preco})

    return historico

def obter_dados_acao(simbolo) :
    historico =  buscar_dados_acao(simbolo)
    if not historico:
        raise Exception(f"Erro ao obter dados para {simbolo}")
    
    df =  pd.DataFrame(historico)
    df['data'] = pd.to_datetime(df["data"])
    return df.sort_values("data")


