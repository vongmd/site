// Definição das dimensões do contentor SVG
const largura = 500;
const altura = 300;

const svg = d3.select("#visualizacao")
  .append("svg")
  .attr("width", largura)
  .attr("height", altura);

// Carregamento do ficheiro CSV utilizando a API de Promessas do D3
d3.csv("data/dados.csv").then(dados => {
  
  // Conversão explícita da coluna "valor" de string para número
  dados.forEach(d => {
    d.valor = +d.valor;
  });

  // Criação de barras baseadas no array de dados
  svg.selectAll("rect")
    .data(dados)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 70 + 30) // Posicionamento horizontal com espaçamento
    .attr("y", d => altura - d.valor * 2) // Inversão do eixo Y (D3 começa no topo)
    .attr("width", 50)
    .attr("height", d => d.valor * 2)
    .style("fill", "steelblue");

}).catch(erro => {
  console.error("Erro ao carregar o ficheiro CSV:", erro);
});