from flask import Flask, render_template
from flask import Flask, render_template, request, jsonify
from services.alphavantage import buscar_dados_acao
from services.alphavantage import obter_dados_acao
from services.analise import analisar_acao
import numpy as np 
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dados')
def dados():
    simbolo = request.args.get('simbolo', 'PETR4.SA')
    resultado = buscar_dados_acao(simbolo)

    if not resultado:
        return jsonify({"erro": "Dados indisponíveis para este símbolo."}), 404

    return jsonify(resultado)

@app.route('/analise')
def analise():
    simbolo = request.args.get('simbolo', 'PETR4.SA')
    dados = buscar_dados_acao(simbolo)
    if not dados:
        return jsonify({"erro": "Dados indisponíveis para este símbolo."}), 404

    resultado = analisar_acao(dados, simbolo)
    return jsonify(resultado)

@app.route('/previsao')
def previsao():
    simbolo = request.args.get('simbolo', 'PETR4.SA')
    try:
        df = obter_dados_acao(simbolo)  
        df = df.sort_values('data')

        # Conversão de datas em dias inteiros 
        df['dias'] = (df['data'] - df['data'].min()).dt.days
        X = df['dias'].values.reshape(-1, 1)
        y = df['preco'].values

       
    
        model = LinearRegression()
        model.fit(X, y)

        # Prever para os próximos 5 dias
        ult_dia = df['dias'].max()
        X_futuro = np.array([ult_dia + i for i in range(1, 6)]).reshape(-1, 1)
        datas_futuras = [(df['data'].max() + pd.Timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, 6)]
        y_pred = model.predict(X_futuro).round(2).tolist()

        return jsonify({'datas': datas_futuras, 'precos': y_pred})
    except Exception as e:
        return jsonify({'erro': f'Erro na previsão: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)






