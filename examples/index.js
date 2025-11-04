const width = 800, height = 700;
const svg = d3.select("svg");

// Ajouter un élément text pour le nom de la région
const regionLabel = svg.append("text")
  .attr("x", 20)   // position horizontale
  .attr("y", 30)   // position verticale
  .attr("font-size", "18px")
  .attr("font-weight", "bold")
  .attr("fill", "#333");

Promise.all([
  d3.json("../data/regions.json"),
  d3.csv("dataset_casa_clean1.csv", d => ({
    ...d,
    effectif: +d.effectif || 0,
  }))
]).then(([topoData, dataset]) => {
  const regions = topojson.feature(topoData, topoData.objects.regions);
  const projection = d3.geoMercator().fitSize([width, height], regions);
  const path = d3.geoPath().projection(projection);

  // === 🌍 Carte interactive ===
  svg.selectAll("path")
    .data(regions.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "region")
    .attr("fill", "#cce5df")
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5)
    .on("mouseover", function (event, d) {
      d3.select(this).transition().duration(200).attr("fill", "#86d1b0");

      // Afficher le nom de la région
      regionLabel.text(d.properties["name:ar"] || d.properties.name);
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(300).attr("fill", "#cce5df");

      // Cacher le nom
      regionLabel.text("");
    })
    .on("click", (event, d) => {
      const regionName = d.properties["name:en"] || d.properties.name;
      showPopup(regionName);
    });


  // === 🪟 Fonction Popup ===
  function showPopup(regionName) {
    const regionData = dataset.filter(d => d.region === regionName);
    if (regionData.length === 0) return;

    const modal = document.getElementById("regionModal");
    modal.style.display = "flex";
    document.getElementById("region-name").innerText = regionName;

    const totalCentres = regionData.length;
    const effectifTotal = d3.sum(regionData, d => d.effectif);
    document.getElementById("region-info").innerHTML = `
      <strong>Nombre de centres :</strong> ${totalCentres}<br>
      <strong>Effectif total :</strong> ${effectifTotal}
    `;

    let page = 0;
    const charts = [
      { title: "📊 Répartition des centres par province", draw: drawProvinceChart },
      { title: "🏢 État du bâtiment", draw: drawEtatChart.bind(null, "etat_batiment") },
      { title: "⚙️ État des équipements", draw: drawEtatChart.bind(null, "etat_equipements") }
    ];

    function renderPage() {
      const { title, draw } = charts[page];
      document.getElementById("chart-title").innerText = title;
      draw(regionData);
    }

    document.getElementById("next").onclick = () => {
      page = (page + 1) % charts.length;
      renderPage();
    };
    document.getElementById("prev").onclick = () => {
      page = (page - 1 + charts.length) % charts.length;
      renderPage();
    };

    renderPage();

    document.querySelector(".close").onclick = () => modal.style.display = "none";
    window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
  }

  
  
  function drawProvinceChart(data) {
  const chart = d3.select("#chart");
  chart.selectAll("*").remove();

  const svgWidth = 700;
  const svgHeight = 300;
  const margin = { top: 30, right: 30, bottom: 80, left: 60 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  // Regrouper par province
  const grouped = Array.from(
    d3.rollup(data, v => v.length, d => d.province),
    ([province, count]) => ({ province, count })
  );

  grouped.sort((a, b) => d3.descending(a.count, b.count));

  const g = chart.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Échelles
  const x = d3.scaleBand()
    .domain(grouped.map(d => d.province))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(grouped, d => d.count)])
    .nice()
    .range([height, 0]);

  // Palette de couleurs distinctes pour chaque barre
  const colors = d3.schemeTableau10.concat(d3.schemeSet3).concat(d3.schemePastel1);
  
  // Axe X
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-35)")
    .style("text-anchor", "end")
    .style("font-size", "11px");

  // Axe Y
  g.append("g")
    .call(d3.axisLeft(y).ticks(5))
    .selectAll("text")
    .style("font-size", "11px");

  // Barres avec couleur unique chacune
  g.selectAll("rect")
    .data(grouped)
    .enter()
    .append("rect")
    .attr("x", d => x(d.province))
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("fill", (d, i) => colors[i % colors.length])
    .attr("rx", 4)
    .transition()
    .duration(800)
    .delay((d, i) => i * 70)
    .attr("y", d => y(d.count))
    .attr("height", d => height - y(d.count));

  // Labels au-dessus des barres
  g.selectAll(".bar-label")
    .data(grouped)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", d => x(d.province) + x.bandwidth() / 2)
    .attr("y", d => y(d.count) - 5)
    .attr("text-anchor", "middle")
    .style("fill", "#333")
    .style("font-size", "11px")
    .style("opacity", 0)
    .transition()
    .delay((d, i) => 700 + i * 70)
    .style("opacity", 1)
    .text(d => d.count);

  // Grille horizontale discrète
  g.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y)
      .tickSize(-width)
      .tickFormat(''))
    .selectAll("line")
    .attr("stroke", "#ddd")
    .attr("stroke-dasharray", "2,2");

  chart.transition()
    .duration(500)
    .style("opacity", 1);
}



  // // === 🥧 Graphique 2 & 3 : Donut chart élégant ===
  
  function drawEtatChart(field, data) {
  const chart = d3.select("#chart");
  chart.selectAll("*").remove();

  const grouped = Array.from(
    d3.rollup(data, v => v.length, d => d[field]),
    ([etat, count]) => ({ etat, count })
  );

  const total = d3.sum(grouped, d => d.count);

  // Dimensions adaptées à ton <svg id="chart" width="700" height="300">
  const widthC = 700;
  const heightC = 300;
  const radius = 100; // taille ajustée pour bien tenir dans la popup

  const color = d3.scaleOrdinal([
    "#a1dffb", "#b5ead7", "#ffdac1", "#ffb7b2", "#e2f0cb", "#c7ceea"
  ]);

  const pie = d3.pie()
    .sort(null)
    .value(d => d.count);

  const arc = d3.arc()
    .innerRadius(radius * 0.55)
    .outerRadius(radius * 0.9);

  const outerArc = d3.arc()
    .innerRadius(radius * 1.1)
    .outerRadius(radius * 1.1);

  // Centrer le donut dans le SVG du popup
  const g = chart.append("g")
    .attr("transform", `translate(${widthC / 2}, ${heightC / 1.9})`);

  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.75)")
    .style("color", "white")
    .style("padding", "6px 10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("font-size", "13px");

  // === SECTEURS ===
  g.selectAll("path.slice")
    .data(pie(grouped))
    .enter()
    .append("path")
    .attr("class", "slice")
    .attr("fill", (d, i) => color(i))
    .attr("stroke", "#fff")
    .attr("stroke-width", "2px")
    .each(function (d) { this._current = d; })
    .transition()
    .duration(1000)
    .attrTween("d", function (d) {
      const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return t => arc(i(t));
    });

  // === LIGNES (flèches guides) ===
  g.selectAll("polyline")
    .data(pie(grouped))
    .enter()
    .append("polyline")
    .attr("stroke", "#666")
    .attr("stroke-width", 1.2)
    .attr("fill", "none")
    .attr("points", d => {
      const posA = arc.centroid(d);
      const posB = outerArc.centroid(d);
      const posC = outerArc.centroid(d);
      const midAngle = (d.startAngle + d.endAngle) / 2;
      posC[0] = radius * 1.45 * (midAngle < Math.PI ? 1 : -1);
      return [posA, posB, posC];
    })
    .style("opacity", 0)
    .transition()
    .delay(700)
    .duration(500)
    .style("opacity", 0.7);

  // === LABELS AVEC POURCENTAGES ===
  g.selectAll("text")
    .data(pie(grouped))
    .enter()
    .append("text")
    .text(d => {
      const percent = ((d.data.count / total) * 100).toFixed(1);
      return `${d.data.etat} (${percent}%)`;
    })
    .attr("transform", d => {
      const pos = outerArc.centroid(d);
      const midAngle = (d.startAngle + d.endAngle) / 2;
      pos[0] = radius * 1.6 * (midAngle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .style("text-anchor", d => {
      const midAngle = (d.startAngle + d.endAngle) / 2;
      return midAngle < Math.PI ? "start" : "end";
    })
    .style("font-size", "12px")
    .style("fill", "#333")
    .style("opacity", 0)
    .transition()
    .delay(900)
    .duration(700)
    .style("opacity", 1);

  // === INTERACTIONS (hover + tooltip) ===
  g.selectAll("path.slice")
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition().duration(200)
        .attr("transform", "scale(1.05)");
      const percent = ((d.data.count / total) * 100).toFixed(1);
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.data.etat}</strong><br>${d.data.count} centres<br>${percent}%`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition().duration(200)
        .attr("transform", "scale(1)");
      tooltip.style("opacity", 0);
    });
}


  // === 🧭 Tooltip global ===
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.7)")
    .style("color", "white")
    .style("padding", "6px 10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("font-size", "13px");
});


