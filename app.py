from flask import Flask, render_template
from flask import Flask, render_template, request, jsonify
from services.alphavantage import buscar_dados_acao
from services.analise import analisar_acao

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

if __name__ == '__main__':
    app.run(debug=True)
