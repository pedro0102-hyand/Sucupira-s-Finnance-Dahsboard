import requests

API_KEY = "2QLB3UXOIICHA0YM"  

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


