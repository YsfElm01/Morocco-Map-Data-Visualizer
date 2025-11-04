// Charger le dataset CSV
d3.csv("dataset_casa_clean1.csv").then(dataset => {
  d3.json("https://cdn.jsdelivr.net/npm/morocco-map/data/provinces.json")
    .then(data => {
      const provinces = topojson.feature(data, data.objects.provinces);
      const projection = d3.geoMercator().fitSize([width, height], provinces);
      const path = d3.geoPath().projection(projection);

      svg.selectAll("path")
        .data(provinces.features)
        .enter().append("path")
        .attr("class", "region")
        .attr("d", path)
        .attr("fill", d => {
          const count = dataByProvince.get(d.id);
          return count ? d3.interpolateBlues(count / 10) : "#eee"; // couleur selon le nombre
        })
        .on("mouseover", function (event, d) {
          const count = dataByProvince.get(d.id) || 0;
          text.text(`${d.properties.name}: ${count} centres`);
        })
        .on("mouseout", function () {
          text.text("");
        });
    });
});
