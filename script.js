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

d3.csv("data/dados.csv").then(dados => {
  dados.forEach(d => d.valor = +d.valor);

  const x = d3.scaleBand()
    .domain(dados.map(d => d.categoria))
    .range([0, larguraConteudo])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(dados, d => d.valor)])
    .range([alturaConteudo, 0]);

  // --- Implementação dos Eixos ---

  // Eixo X (Posicionado no fundo)
  svg.append("g")
    .attr("transform", `translate(0, ${alturaConteudo})`)
    .call(d3.axisBottom(x));

  // Eixo Y (Posicionado à esquerda)
  svg.append("g")
    .call(d3.axisLeft(y));

  // Seleção do elemento de tooltip
  const tooltip = d3.select("#tooltip");

  // --- Renderização das Barras com Eventos de Interação ---
  svg.selectAll("rect")
    .data(dados)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.categoria))
      .attr("y", d => y(d.valor))
      .attr("width", x.bandwidth())
      .attr("height", d => alturaConteudo - y(d.valor))
      // Evento: O rato entra na barra
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`Categoria: ${d.categoria}<br>Valor: ${d.valor}`);
      })
      // Evento: O rato move-se dentro da barra (ajusta a posição da etiqueta)
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      // Evento: O rato sai da barra
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

}).catch(erro => {
  console.error("Erro no processamento de dados:", erro);
});