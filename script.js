const margem = { topo: 20, direita: 20, baixo: 30, esquerda: 40 };
const larguraTotal = 500;
const alturaTotal = 300;
const larguraConteudo = larguraTotal - margem.esquerda - margem.direita;
const alturaConteudo = alturaTotal - margem.topo - margem.baixo;

const svg = d3.select("#visualizacao")
  .append("svg")
    .attr("width", larguraTotal)
    .attr("height", alturaTotal)
  .append("g")
    .attr("transform", `translate(${margem.esquerda}, ${margem.topo})`);

const tooltip = d3.select("#tooltip");

d3.csv("data/dados.csv").then(dados => {
  dados.forEach(d => d.valor = +d.valor);

  const x = d3.scaleBand()
    .domain(dados.map(d => d.categoria))
    .range([0, larguraConteudo])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(dados, d => d.valor)])
    .range([alturaConteudo, 0]);

  svg.append("g")
    .attr("transform", `translate(0, ${alturaConteudo})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // 1. Definição das barras (Seleção e Atributos Estáticos)
  const barras = svg.selectAll("rect")
    .data(dados)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.categoria))
    .attr("width", x.bandwidth());

  // 2. Vinculação Manual de Eventos (Independente da Transição)
  barras
    .on("mouseover", function(event, d) {
      tooltip
        .style("opacity", 1)
        .html(`<strong>Categoria:</strong> ${d.categoria}<br><strong>Valor:</strong> ${d.valor}`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 15) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    });

  // 3. Aplicação da Animação (Transição)
  barras
    .attr("y", alturaConteudo)
    .attr("height", 0)
    .transition()
    .duration(800)
    .delay((d, i) => i * 100)
    .attr("y", d => y(d.valor))
    .attr("height", d => alturaConteudo - y(d.valor));

  // 4. Implementação de Rótulos de Dados com Transição Sincronizada
  svg.selectAll(".label")
    .data(dados)
    .enter()
    .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.categoria) + x.bandwidth() / 2) // Centralização horizontal
      .attr("y", alturaConteudo) // Posição inicial (base)
      .attr("text-anchor", "middle") // Ancoragem central do texto
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .style("fill", "#555")
      .text(d => d.valor) // Injeção do valor numérico
      .transition()
      .duration(800)
      .delay((d, i) => i * 100) // Sincronização com a animação das barras
      .attr("y", d => y(d.valor) - 8); // Posição final (margem de 8px acima da barra)

}).catch(erro => {
  console.error("Erro técnico no carregamento:", erro);
});