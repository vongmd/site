const themeSlider = document.getElementById('theme-slider');

// Gestão de Tema e Redesenho do Gráfico
themeSlider.addEventListener('change', () => {
    const theme = themeSlider.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    render(); // Garante que as cores dos eixos do gráfico atualizam
});

function render() {
    const container = d3.select("#visualizacao");
    
    // Se o elemento não existir no DOM (ex: na hero), a função ignora
    if (container.empty()) return;

    container.selectAll("*").remove();

    const w = container.node().getBoundingClientRect().width;
    const h = 250;
    const margin = { t: 20, r: 10, b: 40, l: 40 };

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${w} ${h}`)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const data = [
        { c: "Sistemas", v: 95 },
        { c: "Redes", v: 90 },
        { c: "UAS", v: 99 },
        { c: "Ciberseg.", v: 85 },
        { c: "Web", v: 80 }
    ];

    const x = d3.scaleBand()
        .domain(data.map(d => d.c))
        .range([0, w - margin.l - margin.r])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([h - margin.t - margin.b, 0]);

    svg.append("g").attr("transform", `translate(0, ${h - margin.t - margin.b})`)
       .call(d3.axisBottom(x)).attr("class", "axis");

    svg.append("g").call(d3.axisLeft(y).ticks(5)).attr("class", "axis");

    svg.selectAll(".bar")
        .data(data).enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.c))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.v))
        .attr("height", d => (h - margin.t - margin.b) - y(d.v));
}

// Inicialização
render();
window.addEventListener('resize', render);