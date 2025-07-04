# Dashboard Financeiro com Previsão e Análise de Ações

## Descrição do Projeto

Este projeto é um **dashboard financeiro** interativo que permite aos usuários analisar ações de empresas, comparar diferentes ações e realizar previsões de preços usando **inteligência artificial (IA)**. A interface é projetada com **HTML**, **CSS** e **JavaScript** (Chart.js) para visualização gráfica, enquanto o **backend** é implementado com **Flask** em **Python**. O sistema utiliza a API da **Alpha Vantage** para obter dados históricos e realizar análises financeiras.

### Funcionalidades Principais:

- **Busca de Ações**: Permite aos usuários buscar dados históricos de ações com base no símbolo da ação (exemplo: PETR4.SA, AAPL).
- **Comparação de Ações**: Compara dois símbolos de ações e exibe gráficos e indicadores comparativos.
- **Previsão de Preços**: Utiliza IA para prever o preço de fechamento das ações nos próximos 5 dias.
- **Indicadores Financeiros**: Exibe indicadores como retorno acumulado, volatilidade, Sharpe ratio e mais.
- **Resumo Preditivo com IA**: Geração de resumos inteligentes das previsões financeiras com IA.

## IA Utilizada

Este projeto usa Inteligência Artificial (IA) para gerar previsões de preços de ações e resumos preditivos. Especificamente, o sistema utiliza **Modelos de Aprendizado de Máquina (ML)**, que foram treinados para analisar tendências passadas e prever preços futuros das ações.

As previsões de preços são feitas com **Modelos de Regressão** , enquanto o **Resumo Preditivo com IA** é gerado utilizando técnicas de **Processamento de Linguagem Natural (PLN)**.

## Tecnologias Utilizadas

- **Frontend**:
  - **HTML5**: Estrutura da página.
  - **CSS3** (Bootstrap, customizado com `style.css`): Estilos para tornar o site responsivo e agradável.
  - **JavaScript** (Chart.js): Visualização gráfica das ações e previsões.

- **Backend**:
  - **Python** (Flask): Framework para o servidor web.
  - **Alpha Vantage API**: API externa para obter dados históricos e atuais de ações.

- **Inteligência Artificial**:
  - **ML Models**: Usado para prever os preços das ações.
  - **NLP**: Para gerar resumos preditivos e resumos inteligentes de IA.


## Estrutura de Arquivos

- `app.py`: Servidor Flask e integração de rotas com frontend e backend.
- `analise.py`: Cálculo de indicadores financeiros.
- `alphavantage.py`: Coleta de dados financeiros da API.
- `index.html`: Interface do dashboard.
- `chart_config.js`: Lógica JS de gráficos e interações.
- `style.css`: Estilo visual do frontend.

## Como Funciona

1. O usuário busca ações → dados são obtidos via Alpha Vantage.
2. Indicadores financeiros e gráficos são gerados.
3. Um modelo de IA realiza previsão para os próximos 5 dias.
4. Um resumo preditivo é gerado com técnicas de NLP.
5. É possível comparar com outra ação.



## Agradecimentos

Agradecimentos à [Alpha Vantage](https://www.alphavantage.co/) por fornecer acesso gratuito a dados financeiros.