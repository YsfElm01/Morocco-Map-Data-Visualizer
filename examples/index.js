const CONFIG = {
  map: { width: 800, height: 700 },
  chart: { width: 700, height: 350 },
  // margin: { top: 40, right: 30, bottom: 100, left: 70 },
  margin: { top: 40, right: 30, bottom: 140, left: 70 },

  colors: {
    mapDefault: "#cce5df",
    mapHover: "#4ecdc4",
    mapSelected: "#2c3e50",
    palette: d3.schemeTableau10
  },
  animation: {
    duration: 800,
    ease: d3.easeCubicOut
  }
};

// // ============================================================================
// // 🎨 INITIALISATION DE LA CARTE
// // ============================================================================

// const svg = d3.select("svg");
// const tooltip = d3.select("body")
//   .append("div")
//   .attr("class", "tooltip")
//   .style("position", "absolute")
//   .style("background", "rgba(0,0,0,0.8)")
//   .style("color", "white")
//   .style("padding", "8px 12px")
//   .style("border-radius", "6px")
//   .style("font-size", "13px")
//   .style("pointer-events", "none")
//   .style("opacity", 0);

// const regionLabel = svg.append("text")
//   .attr("x", 20)
//   .attr("y", 30)
//   .attr("font-size", "22px")
//   .attr("font-weight", "bold")
//   .attr("fill", "#2c3e50")
//   .attr("font-family", "Segoe UI, Arial, sans-serif");

// // ============================================================================
// // 📊 CHARGEMENT DES DONNÉES
// // ============================================================================

// Promise.all([
//   d3.json("../data/regions.json"),
//   d3.csv("data_clean_global_V3.csv", d => ({
//     region: d.region || "",
//     province: d.province || "",
//     milieu: d.milieu || "",
//     type_centre: d.type_centre || "",
//     propriete: d.propriete || "",
//     superficie_m2: +d.superficie_m2 || 0,
//     etat_centre: d.etat_centre || "",
//     province_id: d.province_id || ""
//   }))
// ]).then(([topoData, dataset]) => {

//   console.log("✅ Données chargées:", dataset.length, "enregistrements");
  
//   const regions = topojson.feature(topoData, topoData.objects.regions);
//   const projection = d3.geoMercator().fitSize([CONFIG.map.width, CONFIG.map.height], regions);
//   const path = d3.geoPath().projection(projection);

//   // ============================================================================
//   // 🗺️ RENDU DE LA CARTE INTERACTIVE
//   // ============================================================================

//   const mapGroup = svg.append("g");

//   mapGroup.selectAll("path")
//     .data(regions.features)
//     .enter()
//     .append("path")
//     .attr("d", path)
//     .attr("class", "region")
//     .attr("fill", CONFIG.colors.mapDefault)
//     .attr("stroke", "#2c3e50")
//     .attr("stroke-width", 1.2)
//     .attr("opacity", 0)
//     .on("mouseover", function(event, d) {
//       const regionName = d.properties["name:ar"] || d.properties.name;
//       const regionNameEN = d.properties["name:en"] || d.properties.name;
//       const count = dataset.filter(item => item.region === regionNameEN).length;
      
//       d3.select(this)
//         .transition()
//         .duration(200)
//         .attr("fill", CONFIG.colors.mapHover)
//         .attr("stroke-width", 2.5);
      
//       regionLabel.text(regionName);
      
//       tooltip
//         .style("opacity", 1)
//         .html(`<strong>${regionName}</strong><br/>Centres: ${count}`)
//         .style("left", (event.pageX + 15) + "px")
//         .style("top", (event.pageY - 30) + "px");
//     })
//     .on("mousemove", function(event) {
//       tooltip
//         .style("left", (event.pageX + 15) + "px")
//         .style("top", (event.pageY - 30) + "px");
//     })
//     .on("mouseout", function() {
//       d3.select(this)
//         .transition()
//         .duration(200)
//         .attr("fill", CONFIG.colors.mapDefault)
//         .attr("stroke-width", 1.2);
      
//       regionLabel.text("");
//       tooltip.style("opacity", 0);
//     })
//     .on("click", function(event, d) {
//       const regionNameEN = d.properties["name:en"] || d.properties.name;
//       showRegionPopup(regionNameEN, dataset);
//     })
//     .transition()
//     .duration(800)
//     .delay((d, i) => i * 30)
//     .attr("opacity", 0.95);

//   // ============================================================================
//   // 🎯 FONCTION PRINCIPALE DU POPUP
//   // ============================================================================

//   function showRegionPopup(regionName, fullDataset) {
//     const regionData = fullDataset.filter(d => d.region === regionName);
    
//     if (regionData.length === 0) {
//       alert("Aucune donnée disponible pour cette région.");
//       return;
//     }

//     const modal = document.getElementById("regionModal");
//     modal.style.display = "flex";
    
//     document.getElementById("region-name").innerText = regionName;

//     // Calculs statistiques
//     const totalCentres = regionData.length;
//     const provinces = [...new Set(regionData.map(d => d.province))];
//     const operationnels = regionData.filter(d => d.etat_centre === "Opérationnel").length;
//     const tauxOperationnel = ((operationnels / totalCentres) * 100).toFixed(1);

//     document.getElementById("region-info").innerHTML = `
//       <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 10px; color: white; text-align: center;">
//           <div style="font-size: 32px; font-weight: bold;">${totalCentres}</div>
//           <div style="font-size: 14px; opacity: 0.9;">Centres Total</div>
//         </div>
//         <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 15px; border-radius: 10px; color: white; text-align: center;">
//           <div style="font-size: 32px; font-weight: bold;">${provinces.length}</div>
//           <div style="font-size: 14px; opacity: 0.9;">Provinces</div>
//         </div>
//         <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 15px; border-radius: 10px; color: white; text-align: center;">
//           <div style="font-size: 32px; font-weight: bold;">${operationnels}</div>
//           <div style="font-size: 14px; opacity: 0.9;">Opérationnels</div>
//         </div>
//         <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 15px; border-radius: 10px; color: white; text-align: center;">
//           <div style="font-size: 32px; font-weight: bold;">${tauxOperationnel}%</div>
//           <div style="font-size: 14px; opacity: 0.9;">Taux Opérationnel</div>
//         </div>
//       </div>
//     `;

//     // ============================================================================
//     // 📈 CONFIGURATION DES VISUALISATIONS (4 essentielles)
//     // ============================================================================

//     const visualizations = [
//       {
//         title: "🏛️ Distribution des Centres par Province",
//         subtitle: "Vue comparative du nombre de centres par province",
//         draw: drawProvinceBarChart
//       },
//       {
//         title: "⚙️ État Opérationnel des Centres",
//         subtitle: "Répartition selon l'état (Opérationnel, En aménagement, etc.)",
//         draw: drawEtatDonutChart
//       },
//       {
//         title: "🌍 Répartition Rural vs Urbain",
//         subtitle: "Distribution géographique par milieu",
//         draw: drawMilieuComparison
//       },
//       {
//         title: "🎯 Matrice Type × Propriété",
//         subtitle: "Analyse croisée des types de centres et propriétaires",
//         draw: drawTypeProprieteBubble
//       }
//     ];

//     let currentPage = 0;

//     function renderVisualization() {
//       const viz = visualizations[currentPage];
//       document.getElementById("chart-title").innerHTML = `
//         <div style="text-align: center; margin-bottom: 20px;">
//           <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${viz.title}</div>
//           <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">${viz.subtitle}</div>
//         </div>
//       `;
//       viz.draw(regionData);
//     }

//     document.getElementById("next").onclick = () => {
//       currentPage = (currentPage + 1) % visualizations.length;
//       renderVisualization();
//     };

//     document.getElementById("prev").onclick = () => {
//       currentPage = (currentPage - 1 + visualizations.length) % visualizations.length;
//       renderVisualization();
//     };

//     renderVisualization();

//     // Fermeture du modal
//     document.querySelector(".close").onclick = () => modal.style.display = "none";
//     window.onclick = e => { 
//       if (e.target === modal) modal.style.display = "none"; 
//     };
//   }

//   // ============================================================================
//   // 📊 VISUALISATION 1 : BAR CHART PAR PROVINCE
//   // ============================================================================

//   function drawProvinceBarChart(data) {
//     const chart = d3.select("#chart");
//     chart.selectAll("*").remove();

//     const provinceCounts = d3.rollup(data, v => v.length, d => d.province);
//     const sortedData = Array.from(provinceCounts, ([province, count]) => ({ province, count }))
//       .sort((a, b) => b.count - a.count);

//     const margin = CONFIG.margin;
//     const width = CONFIG.chart.width - margin.left - margin.right;
//     const height = CONFIG.chart.height - margin.top - margin.bottom;

//     const g = chart.append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     const x = d3.scaleBand()
//       .domain(sortedData.map(d => d.province))
//       .range([0, width])
//       .padding(0.3);

//     const y = d3.scaleLinear()
//       .domain([0, d3.max(sortedData, d => d.count) * 1.1])
//       .nice()
//       .range([height, 0]);

//     const colorScale = d3.scaleSequential(d3.interpolateViridis)
//       .domain([0, sortedData.length - 1]);

//     // Axes
//     g.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//       .attr("transform", "rotate(-45)")
//       .style("text-anchor", "end")
//       .style("font-size", "11px");

//     g.append("g")
//       .call(d3.axisLeft(y).ticks(8))
//       .style("font-size", "12px");

//     // Barres animées
//     g.selectAll(".bar")
//       .data(sortedData)
//       .enter()
//       .append("rect")
//       .attr("class", "bar")
//       .attr("x", d => x(d.province))
//       .attr("y", height)
//       .attr("width", x.bandwidth())
//       .attr("height", 0)
//       .attr("fill", (d, i) => colorScale(i))
//       .attr("rx", 4)
//       .style("cursor", "pointer")
//       .on("mouseover", function(event, d) {
//         d3.select(this)
//           .transition()
//           .duration(200)
//           .attr("opacity", 0.7);
//       })
//       .on("mouseout", function() {
//         d3.select(this)
//           .transition()
//           .duration(200)
//           .attr("opacity", 1);
//       })
//       .transition()
//       .duration(CONFIG.animation.duration)
//       .delay((d, i) => i * 50)
//       .ease(CONFIG.animation.ease)
//       .attr("y", d => y(d.count))
//       .attr("height", d => height - y(d.count));

//     // Labels sur les barres
//     g.selectAll(".label")
//       .data(sortedData)
//       .enter()
//       .append("text")
//       .attr("class", "label")
//       .attr("x", d => x(d.province) + x.bandwidth() / 2)
//       .attr("y", d => y(d.count) - 5)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "12px")
//       .attr("font-weight", "bold")
//       .attr("fill", "#2c3e50")
//       .attr("opacity", 0)
//       .text(d => d.count)
//       .transition()
//       .duration(CONFIG.animation.duration)
//       .delay((d, i) => i * 50 + 400)
//       .attr("opacity", 1);

//     // Titre de l'axe Y
//     g.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -margin.left + 20)
//       .attr("x", -height / 2)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "13px")
//       .attr("fill", "#555")
//       .text("Nombre de centres");
//   }

//   // ============================================================================
//   // 📊 VISUALISATION 2 : DONUT CHART - ÉTAT DES CENTRES
//   // ============================================================================

//   function drawEtatDonutChart(data) {
//     const chart = d3.select("#chart");
//     chart.selectAll("*").remove();

//     const etatCounts = d3.rollup(data, v => v.length, d => d.etat_centre);
//     const pieData = Array.from(etatCounts, ([etat, count]) => ({ etat, count }));

//     const width = CONFIG.chart.width;
//     const height = CONFIG.chart.height;
//     const radius = Math.min(width, height) / 2 - 60;
//     const innerRadius = radius * 0.55;

//     const g = chart.append("g")
//       .attr("transform", `translate(${width / 2},${height / 2})`);

//     const color = d3.scaleOrdinal()
//       .domain(pieData.map(d => d.etat))
//       .range(["#2ecc71", "#f39c12", "#e74c3c", "#9b59b6", "#3498db"]);

//     const pie = d3.pie()
//       .value(d => d.count)
//       .sort(null);

//     const arc = d3.arc()
//       .innerRadius(innerRadius)
//       .outerRadius(radius);

//     const arcHover = d3.arc()
//       .innerRadius(innerRadius)
//       .outerRadius(radius + 10);

//     // Arcs
//     const arcs = g.selectAll(".arc")
//       .data(pie(pieData))
//       .enter()
//       .append("g")
//       .attr("class", "arc");

//     arcs.append("path")
//       .attr("d", arc)
//       .attr("fill", d => color(d.data.etat))
//       .attr("stroke", "white")
//       .attr("stroke-width", 3)
//       .style("cursor", "pointer")
//       .on("mouseover", function(event, d) {
//         d3.select(this)
//           .transition()
//           .duration(200)
//           .attr("d", arcHover);
        
//         centerText.text(`${d.data.count} (${((d.data.count / data.length) * 100).toFixed(1)}%)`);
//       })
//       .on("mouseout", function() {
//         d3.select(this)
//           .transition()
//           .duration(200)
//           .attr("d", arc);
        
//         centerText.text(data.length);
//       })
//       .transition()
//       .duration(CONFIG.animation.duration)
//       .ease(CONFIG.animation.ease)
//       .attrTween("d", function(d) {
//         const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//         return t => arc(i(t));
//       });

//     // Labels
//     arcs.append("text")
//       .attr("transform", d => `translate(${arc.centroid(d)})`)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "12px")
//       .attr("font-weight", "bold")
//       .attr("fill", "white")
//       .attr("opacity", 0)
//       .text(d => d.data.count)
//       .transition()
//       .duration(CONFIG.animation.duration)
//       .delay(400)
//       .attr("opacity", 1);

//     // Texte central
//     const centerText = g.append("text")
//       .attr("text-anchor", "middle")
//       .attr("font-size", "40px")
//       .attr("font-weight", "bold")
//       .attr("fill", "#2c3e50")
//       .attr("dy", "0.35em")
//       .text(data.length);

//     g.append("text")
//       .attr("text-anchor", "middle")
//       .attr("font-size", "14px")
//       .attr("fill", "#7f8c8d")
//       .attr("dy", "2.5em")
//       .text("Total Centres");

//     // Légende
//     const legend = chart.append("g")
//       .attr("transform", `translate(20, 50)`);

//     pieData.forEach((d, i) => {
//       const lg = legend.append("g")
//         .attr("transform", `translate(0, ${i * 30})`);

//       lg.append("rect")
//         .attr("width", 20)
//         .attr("height", 20)
//         .attr("rx", 4)
//         .attr("fill", color(d.etat));

//       lg.append("text")
//         .attr("x", 30)
//         .attr("y", 15)
//         .attr("font-size", "13px")
//         .attr("fill", "#333")
//         .text(`${d.etat} (${d.count})`);
//     });
//   }

//   // ============================================================================
//   // 📊 VISUALISATION 3 : COMPARAISON RURAL VS URBAIN
//   // ============================================================================

//   function drawMilieuComparison(data) {
//     const chart = d3.select("#chart");
//     chart.selectAll("*").remove();

//     const milieuData = d3.rollup(data, v => v.length, d => d.province, d => d.milieu);
//     const provinces = Array.from(milieuData.keys());

//     const dataFormatted = provinces.map(province => {
//       const milieuMap = milieuData.get(province);
//       return {
//         province,
//         Rural: milieuMap.get("Rural") || 0,
//         Urbain: milieuMap.get("Urbain") || 0
//       };
//     }).sort((a, b) => (b.Rural + b.Urbain) - (a.Rural + a.Urbain));

//     const margin = CONFIG.margin;
//     const width = CONFIG.chart.width - margin.left - margin.right;
//     const height = CONFIG.chart.height - margin.top - margin.bottom;

//     const g = chart.append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     const x = d3.scaleBand()
//       .domain(dataFormatted.map(d => d.province))
//       .range([0, width])
//       .padding(0.25);

//     const y = d3.scaleLinear()
//       .domain([0, d3.max(dataFormatted, d => d.Rural + d.Urbain) * 1.1])
//       .nice()
//       .range([height, 0]);

//     const color = d3.scaleOrdinal()
//       .domain(["Rural", "Urbain"])
//       .range(["#e67e22", "#3498db"]);

//     // Stack data
//     const stack = d3.stack()
//       .keys(["Rural", "Urbain"]);

//     const series = stack(dataFormatted);

//     // Axes
//     g.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//       .attr("transform", "rotate(-45)")
//       .style("text-anchor", "end")
//       .style("font-size", "11px");

//     g.append("g")
//       .call(d3.axisLeft(y).ticks(8))
//       .style("font-size", "12px");

//     // Barres empilées
//     g.selectAll("g.layer")
//       .data(series)
//       .enter()
//       .append("g")
//       .attr("class", "layer")
//       .attr("fill", d => color(d.key))
//       .selectAll("rect")
//       .data(d => d)
//       .enter()
//       .append("rect")
//       .attr("x", d => x(d.data.province))
//       .attr("y", height)
//       .attr("height", 0)
//       .attr("width", x.bandwidth())
//       .attr("rx", 3)
//       .style("cursor", "pointer")
//       .on("mouseover", function() {
//         d3.select(this).attr("opacity", 0.7);
//       })
//       .on("mouseout", function() {
//         d3.select(this).attr("opacity", 1);
//       })
//       .transition()
//       .duration(CONFIG.animation.duration)
//       .delay((d, i) => i * 40)
//       .ease(CONFIG.animation.ease)
//       .attr("y", d => y(d[1]))
//       .attr("height", d => y(d[0]) - y(d[1]));

//     // Légende
//     const legend = g.append("g")
//       .attr("transform", `translate(${width - 120}, 0)`);

//     ["Rural", "Urbain"].forEach((key, i) => {
//       const lg = legend.append("g")
//         .attr("transform", `translate(0, ${i * 25})`);

//       lg.append("rect")
//         .attr("width", 18)
//         .attr("height", 18)
//         .attr("rx", 3)
//         .attr("fill", color(key));

//       lg.append("text")
//         .attr("x", 25)
//         .attr("y", 14)
//         .attr("font-size", "13px")
//         .attr("fill", "#333")
//         .text(key);
//     });

//     // Titre axe Y
//     g.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -margin.left + 20)
//       .attr("x", -height / 2)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "13px")
//       .attr("fill", "#555")
//       .text("Nombre de centres");
//   }

//   // ============================================================================
//   // 📊 VISUALISATION 4 : BUBBLE CHART - TYPE × PROPRIÉTÉ
//   // ============================================================================

//   function drawTypeProprieteBubble(data) {
//     const chart = d3.select("#chart");
//     chart.selectAll("*").remove();

//     // Agrégation Type × Propriété
//     const grouped = d3.rollup(
//       data,
//       v => v.length,
//       d => d.type_centre,
//       d => d.propriete
//     );

//     const bubbleData = [];
//     grouped.forEach((propMap, type) => {
//       propMap.forEach((count, prop) => {
//         bubbleData.push({ type, propriete: prop, count });
//       });
//     });

//     const width = CONFIG.chart.width;
//     const height = CONFIG.chart.height;

//     const g = chart.append("g");

//     // Échelle de taille
//     const radiusScale = d3.scaleSqrt()
//       .domain([0, d3.max(bubbleData, d => d.count)])
//       .range([15, 60]);

//     const colorScale = d3.scaleOrdinal(d3.schemeSet3)
//       .domain([...new Set(bubbleData.map(d => d.type))]);

//     // Simulation de force
//     const simulation = d3.forceSimulation(bubbleData)
//       .force("x", d3.forceX(width / 2).strength(0.05))
//       .force("y", d3.forceY(height / 2).strength(0.05))
//       .force("collide", d3.forceCollide(d => radiusScale(d.count) + 2))
//       .on("tick", ticked);

//     // Bulles
//     const bubbles = g.selectAll(".bubble")
//       .data(bubbleData)
//       .enter()
//       .append("g")
//       .attr("class", "bubble")
//       .style("cursor", "pointer");

//     bubbles.append("circle")
//       .attr("r", 0)
//       .attr("fill", d => colorScale(d.type))
//       .attr("stroke", "white")
//       .attr("stroke-width", 2.5)
//       .attr("opacity", 0.85)
//       .on("mouseover", function(event, d) {
//         d3.select(this)
//           .transition()
//           .duration(200)
//           .attr("opacity", 1)
//           .attr("stroke-width", 4);
        
//         tooltip
//           .style("opacity", 1)
//           .html(`
//             <strong>Type:</strong> ${d.type}<br/>
//             <strong>Propriété:</strong> ${d.propriete}<br/>
//             <strong>Centres:</strong> ${d.count}
//           `)
//           .style("left", (event.pageX + 15) + "px")
//           .style("top", (event.pageY - 30) + "px");
//       })
//       .on("mouseout", function() {
//         d3.select(this)
//           .transition()
//           .duration(200)
//           .attr("opacity", 0.85)
//           .attr("stroke-width", 2.5);
        
//         tooltip.style("opacity", 0);
//       })
//       .transition()
//       .duration(800)
//       .delay((d, i) => i * 30)
//       .attr("r", d => radiusScale(d.count));

//     // Texte sur les bulles
//     bubbles.append("text")
//       .attr("text-anchor", "middle")
//       .attr("dy", "0.3em")
//       .attr("font-size", d => Math.min(radiusScale(d.count) / 3, 14) + "px")
//       .attr("font-weight", "bold")
//       .attr("fill", "white")
//       .attr("pointer-events", "none")
//       .attr("opacity", 0)
//       .text(d => d.count)
//       .transition()
//       .duration(800)
//       .delay((d, i) => i * 30 + 400)
//       .attr("opacity", 1);

//     function ticked() {
//       bubbles.attr("transform", d => `translate(${d.x},${d.y})`);
//     }

//     // Légende des types
//     const legend = chart.append("g")
//       .attr("transform", `translate(20, 20)`);

//     const types = [...new Set(bubbleData.map(d => d.type))];
//     types.forEach((type, i) => {
//       const lg = legend.append("g")
//         .attr("transform", `translate(0, ${i * 25})`);

//       lg.append("circle")
//         .attr("r", 8)
//         .attr("fill", colorScale(type));

//       lg.append("text")
//         .attr("x", 15)
//         .attr("y", 5)
//         .attr("font-size", "12px")
//         .attr("fill", "#333")
//         .text(type);
//     });
//   }

// }).catch(error => {
//   console.error("❌ Erreur de chargement:", error);
//   alert("Erreur lors du chargement des données. Vérifiez les fichiers.");
// });

// ============================================================================
// 🎨 INITIALISATION DE LA CARTE
// ============================================================================

const svg = d3.select("svg");
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background", "rgba(0,0,0,0.8)")
  .style("color", "white")
  .style("padding", "8px 12px")
  .style("border-radius", "6px")
  .style("font-size", "13px")
  .style("pointer-events", "none")
  .style("opacity", 0);

const regionLabel = svg.append("text")
  .attr("x", 20)
  .attr("y", 30)
  .attr("font-size", "22px")
  .attr("font-weight", "bold")
  .attr("fill", "#2c3e50")
  .attr("font-family", "Segoe UI, Arial, sans-serif");

// ============================================================================
// 📊 CHARGEMENT DES DONNÉES
// ============================================================================

Promise.all([
  d3.json("../data/regions.json"),
  d3.csv("data_clean_global_V3.csv", d => ({
    region: d.region || "",
    province: d.province || "",
    milieu: d.milieu || "",
    type_centre: d.type_centre || "",
    propriete: d.propriete || "",
    superficie_m2: +d.superficie_m2 || 0,
    etat_centre: d.etat_centre || "",
    province_id: d.province_id || ""
  }))
]).then(([topoData, dataset]) => {

  console.log("✅ Données chargées:", dataset.length, "enregistrements");
  
  const regions = topojson.feature(topoData, topoData.objects.regions);
  const projection = d3.geoMercator().fitSize([CONFIG.map.width, CONFIG.map.height], regions);
  const path = d3.geoPath().projection(projection);

  // ============================================================================
  // 🗺️ RENDU DE LA CARTE INTERACTIVE
  // ============================================================================

  const mapGroup = svg.append("g");

  mapGroup.selectAll("path")
    .data(regions.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "region")
    .attr("fill", CONFIG.colors.mapDefault)
    .attr("stroke", "#2c3e50")
    .attr("stroke-width", 1.2)
    .attr("opacity", 0)
    .on("mouseover", function(event, d) {
      const regionName = d.properties["name:ar"] || d.properties.name;
      const regionNameEN = d.properties["name:en"] || d.properties.name;
      const count = dataset.filter(item => item.region === regionNameEN).length;
      
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", CONFIG.colors.mapHover)
        .attr("stroke-width", 2.5);
      
      regionLabel.text(regionName);
      
      tooltip
        .style("opacity", 1)
        .html(`<strong>${regionName}</strong><br/>Centres: ${count}`)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", CONFIG.colors.mapDefault)
        .attr("stroke-width", 1.2);
      
      regionLabel.text("");
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      const regionNameEN = d.properties["name:en"] || d.properties.name;
      showRegionPopup(regionNameEN, dataset);
    })
    .transition()
    .duration(800)
    .delay((d, i) => i * 30)
    .attr("opacity", 0.95);

  // ============================================================================
  // 🎯 FONCTION PRINCIPALE DU POPUP
  // ============================================================================

  function showRegionPopup(regionName, fullDataset) {
    const regionData = fullDataset.filter(d => d.region === regionName);
    
    if (regionData.length === 0) {
      alert("Aucune donnée disponible pour cette région.");
      return;
    }

    const modal = document.getElementById("regionModal");
    modal.style.display = "flex";
    
    document.getElementById("region-name").innerText = regionName;

    // Calculs statistiques
    const totalCentres = regionData.length;
    const provinces = [...new Set(regionData.map(d => d.province))];
    const operationnels = regionData.filter(d => d.etat_centre === "Opérationnel").length;
    const tauxOperationnel = ((operationnels / totalCentres) * 100).toFixed(1);

    document.getElementById("region-info").innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 10px; color: white; text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">${totalCentres}</div>
          <div style="font-size: 14px; opacity: 0.9;">Centres Total</div>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 15px; border-radius: 10px; color: white; text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">${provinces.length}</div>
          <div style="font-size: 14px; opacity: 0.9;">Provinces</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 15px; border-radius: 10px; color: white; text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">${operationnels}</div>
          <div style="font-size: 14px; opacity: 0.9;">Opérationnels</div>
        </div>
        <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 15px; border-radius: 10px; color: white; text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">${tauxOperationnel}%</div>
          <div style="font-size: 14px; opacity: 0.9;">Taux Opérationnel</div>
        </div>
      </div>
    `;

    // ============================================================================
    // 📈 CONFIGURATION DES VISUALISATIONS (4 essentielles)
    // ============================================================================

    const visualizations = [
      {
        title: "🏛️ Distribution des Centres par Province",
        subtitle: "Vue comparative du nombre de centres par province",
        draw: drawProvinceBarChart
      },
      {
        title: "⚙️ État Opérationnel des Centres",
        subtitle: "Répartition selon l'état (Opérationnel, En aménagement, etc.)",
        draw: drawEtatDonutChart
      },
      {
        title: "🌍 Répartition Rural vs Urbain",
        subtitle: "Distribution géographique par milieu",
        draw: drawMilieuComparison
      },
      {
        title: "🎯 Matrice Type × Propriété",
        subtitle: "Analyse croisée des types de centres et propriétaires",
        draw: drawTypeProprieteBubble
      }
    ];

    let currentPage = 0;

    function renderVisualization() {
      const viz = visualizations[currentPage];
      document.getElementById("chart-title").innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50;">${viz.title}</div>
          <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">${viz.subtitle}</div>
        </div>
      `;
      viz.draw(regionData);
    }

    document.getElementById("next").onclick = () => {
      currentPage = (currentPage + 1) % visualizations.length;
      renderVisualization();
    };

    document.getElementById("prev").onclick = () => {
      currentPage = (currentPage - 1 + visualizations.length) % visualizations.length;
      renderVisualization();
    };

    renderVisualization();

    // Fermeture du modal
    document.querySelector(".close").onclick = () => modal.style.display = "none";
    window.onclick = e => { 
      if (e.target === modal) modal.style.display = "none"; 
    };
  }

  // ============================================================================
  // 📊 VISUALISATION 1 : BAR CHART PAR PROVINCE
  // ============================================================================

  function drawProvinceBarChart(data) {
    const chart = d3.select("#chart");
    chart.selectAll("*").remove();

    const provinceCounts = d3.rollup(data, v => v.length, d => d.province);
    const sortedData = Array.from(provinceCounts, ([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count);

    const margin = CONFIG.margin;
    const width = CONFIG.chart.width - margin.left - margin.right;
    const height = CONFIG.chart.height - margin.top - margin.bottom;

    const g = chart.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.province))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.count) * 1.1])
      .nice()
      .range([height, 0]);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, sortedData.length - 1]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "11px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(8))
      .style("font-size", "12px");

    // Barres animées
    g.selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.province))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d, i) => colorScale(i))
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.7);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1);
      })
      .transition()
      .duration(CONFIG.animation.duration)
      .delay((d, i) => i * 50)
      .ease(CONFIG.animation.ease)
      .attr("y", d => y(d.count))
      .attr("height", d => height - y(d.count));

    // Labels sur les barres
    g.selectAll(".label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.province) + x.bandwidth() / 2)
      .attr("y", d => y(d.count) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#2c3e50")
      .attr("opacity", 0)
      .text(d => d.count)
      .transition()
      .duration(CONFIG.animation.duration)
      .delay((d, i) => i * 50 + 400)
      .attr("opacity", 1);

    // Titre de l'axe Y
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("fill", "#555")
      .text("Nombre de centres");
  }

  // ============================================================================
  // 📊 VISUALISATION 2 : DONUT CHART - ÉTAT DES CENTRES
  // ============================================================================

  function drawEtatDonutChart(data) {
    const chart = d3.select("#chart");
    chart.selectAll("*").remove();

    const etatCounts = d3.rollup(data, v => v.length, d => d.etat_centre);
    const pieData = Array.from(etatCounts, ([etat, count]) => ({ etat, count }));

    const width = CONFIG.chart.width;
    const height = CONFIG.chart.height;
    const radius = Math.min(width, height) / 2 - 60;
    const innerRadius = radius * 0.55;

    const g = chart.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(pieData.map(d => d.etat))
      .range(["#2ecc71", "#f39c12", "#e74c3c", "#9b59b6", "#3498db"]);

    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcHover = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius + 10);

    // Arcs
    const arcs = g.selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.etat))
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arcHover);
        
        centerText.text(`${d.data.count} (${((d.data.count / data.length) * 100).toFixed(1)}%)`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arc);
        
        centerText.text(data.length);
      })
      .transition()
      .duration(CONFIG.animation.duration)
      .ease(CONFIG.animation.ease)
      .attrTween("d", function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t));
      });

    // Labels
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("opacity", 0)
      .text(d => d.data.count)
      .transition()
      .duration(CONFIG.animation.duration)
      .delay(400)
      .attr("opacity", 1);

    // Texte central
    const centerText = g.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "40px")
      .attr("font-weight", "bold")
      .attr("fill", "#2c3e50")
      .attr("dy", "0.35em")
      .text(data.length);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#7f8c8d")
      .attr("dy", "2.5em")
      .text("Total Centres");

    // Légende
    const legend = chart.append("g")
      .attr("transform", `translate(20, 50)`);

    pieData.forEach((d, i) => {
      const lg = legend.append("g")
        .attr("transform", `translate(0, ${i * 30})`);

      lg.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("rx", 4)
        .attr("fill", color(d.etat));

      lg.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .attr("font-size", "13px")
        .attr("fill", "#333")
        .text(`${d.etat} (${d.count})`);
    });
  }

  // ============================================================================
  // 📊 VISUALISATION 3 : COMPARAISON RURAL VS URBAIN
  // ============================================================================

  function drawMilieuComparison(data) {
    const chart = d3.select("#chart");
    chart.selectAll("*").remove();

    const milieuData = d3.rollup(data, v => v.length, d => d.province, d => d.milieu);
    const provinces = Array.from(milieuData.keys());

    const dataFormatted = provinces.map(province => {
      const milieuMap = milieuData.get(province);
      return {
        province,
        Rural: milieuMap.get("Rural") || 0,
        Urbain: milieuMap.get("Urbain") || 0
      };
    }).sort((a, b) => (b.Rural + b.Urbain) - (a.Rural + a.Urbain));

    const margin = CONFIG.margin;
    const width = CONFIG.chart.width - margin.left - margin.right;
    const height = CONFIG.chart.height - margin.top - margin.bottom;

    const g = chart.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(dataFormatted.map(d => d.province))
      .range([0, width])
      .padding(0.25);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataFormatted, d => d.Rural + d.Urbain) * 1.1])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(["Rural", "Urbain"])
      .range(["#e67e22", "#3498db"]);

    // Stack data
    const stack = d3.stack()
      .keys(["Rural", "Urbain"]);

    const series = stack(dataFormatted);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "11px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(8))
      .style("font-size", "12px");

    // Barres empilées
    g.selectAll("g.layer")
      .data(series)
      .enter()
      .append("g")
      .attr("class", "layer")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => x(d.data.province))
      .attr("y", height)
      .attr("height", 0)
      .attr("width", x.bandwidth())
      .attr("rx", 3)
      .style("cursor", "pointer")
      .on("mouseover", function() {
        d3.select(this).attr("opacity", 0.7);
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
      })
      .transition()
      .duration(CONFIG.animation.duration)
      .delay((d, i) => i * 40)
      .ease(CONFIG.animation.ease)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]));

    // Légende
    const legend = g.append("g")
      .attr("transform", `translate(${width - 120}, 0)`);

    ["Rural", "Urbain"].forEach((key, i) => {
      const lg = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      lg.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("rx", 3)
        .attr("fill", color(key));

      lg.append("text")
        .attr("x", 25)
        .attr("y", 14)
        .attr("font-size", "13px")
        .attr("fill", "#333")
        .text(key);
    });

    // Titre axe Y
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("fill", "#555")
      .text("Nombre de centres");
  }

  // ============================================================================
  // 📊 VISUALISATION 4 : BUBBLE CHART - TYPE × PROPRIÉTÉ
  // ============================================================================

  function drawTypeProprieteBubble(data) {
    const chart = d3.select("#chart");
    chart.selectAll("*").remove();

    // Agrégation Type × Propriété
    const grouped = d3.rollup(
      data,
      v => v.length,
      d => d.type_centre,
      d => d.propriete
    );

    const bubbleData = [];
    grouped.forEach((propMap, type) => {
      propMap.forEach((count, prop) => {
        bubbleData.push({ type, propriete: prop, count });
      });
    });

    const width = CONFIG.chart.width;
    const height = CONFIG.chart.height;

    const g = chart.append("g");

    // Échelle de taille
    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(bubbleData, d => d.count)])
      .range([15, 60]);

    const colorScale = d3.scaleOrdinal(d3.schemeSet3)
      .domain([...new Set(bubbleData.map(d => d.type))]);

    // Simulation de force
    const simulation = d3.forceSimulation(bubbleData)
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collide", d3.forceCollide(d => radiusScale(d.count) + 2))
      .on("tick", ticked);

    // Bulles
    const bubbles = g.selectAll(".bubble")
      .data(bubbleData)
      .enter()
      .append("g")
      .attr("class", "bubble")
      .style("cursor", "pointer");

    bubbles.append("circle")
      .attr("r", 0)
      .attr("fill", d => colorScale(d.type))
      .attr("stroke", "#EEEEEE")
      .attr("stroke-width", 2.5)
      .attr("opacity", 0.85)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("stroke-width", 4);
        
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>Type:</strong> ${d.type}<br/>
            <strong>Propriété:</strong> ${d.propriete}<br/>
            <strong>Centres:</strong> ${d.count}
          `)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.85)
          .attr("stroke-width", 2.5);
        
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 30)
      .attr("r", d => radiusScale(d.count));

    // Texte sur les bulles
    bubbles.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("font-size", d => Math.min(radiusScale(d.count) / 3, 14) + "px")
      .attr("font-weight", "bold")
      .attr("fill", "#000")
      .attr("pointer-events", "none")
      .attr("opacity", 0)
      .text(d => d.count)
      .transition()
      .duration(800)
      .delay((d, i) => i * 30 + 400)
      .attr("opacity", 1);

    function ticked() {
      bubbles.attr("transform", d => `translate(${d.x},${d.y})`);
    }

    // Légende des types
    const legend = chart.append("g")
      .attr("transform", `translate(20, 20)`);

    const types = [...new Set(bubbleData.map(d => d.type))];
    types.forEach((type, i) => {
      const lg = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      lg.append("circle")
        .attr("r", 8)
        .attr("fill", colorScale(type));

      lg.append("text")
        .attr("x", 15)
        .attr("y", 5)
        .attr("font-size", "12px")
        .attr("fill", "#333")
        .text(type);
    });
  }

}).catch(error => {
  console.error("❌ Erreur de chargement:", error);
  alert("Erreur lors du chargement des données. Vérifiez les fichiers.");
});