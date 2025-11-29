# Morocco Map

Moroccan regions in TopoJSON format

### Usage

You can see the example in <a href="https://github.com/yousfiSaad/morocco-map/tree/main/examples" name="examples folder">examples folder</a> or live example <a href="http://yousfisaad.com/morocco-map/"> here</a> and <a href="http://yousfisaad.com/morocco-map/provinces"> here</a> (for provinces)

### File reference

<a href="#regions.json" name="regions.json">#</a> <b>regions.json</b> [Download](https://cdn.jsdelivr.net/npm/morocco-map/data/regions.json "Source")

A TopoJSON file containing the 12 moroccan regions, the id of each region respects the the ISO 3166 standard.

<img src="https://cdn.jsdelivr.net/npm/morocco-map/img/regions.png" width="480">

\
<a href="#provinces.json" name="provinces.json">#</a> <b>provinces.json</b> [Download](https://cdn.jsdelivr.net/npm/morocco-map/data/provinces.json "Source")

A TopoJSON file containing the provinces and prefectures, the ids of the items are **not yet** set to ISO 3166 standard.

<img src="https://cdn.jsdelivr.net/npm/morocco-map/img/provinces.png" width="480">


## 🗺️ Morocco Map — Visualisation interactive des régions et provinces du Maroc

Ce projet permet de visualiser les **régions** et **provinces** du Maroc à l’aide de données géographiques et d’un affichage interactif basé sur JavaScript.

---


## 📁 Structure du projet

```plaintext
morocco-map/
│
├── Data_Global_brute.xlsx   # Données brutes socio-sportives (Casablanca)
├── Notebook_clean_data.ipynb         # Notebook de traitement des données brutes
├── package-lock.json
├── package.json                       # Dépendances et scripts npm
├── readme.md
├── .npmignore
│
├── data/                              # Données géographiques (JSON)
│   ├── provinces.json
│   └── regions.json
│
├── examples/                          # Exemples interactifs (HTML/JS)
│   ├── data_centres_socio_sportifs.csv
│   ├── index.html                      # Interface utilisateur
│   ├── index.js                        # Logique de l'application
│   ├── provinces.html
│   └── provinces.js
│
└── img/                               # Images et cartes du projet
    ├── provinces.png
    └── regions.png
```

## ⚙️ Installation:
<pre> npm install </pre>

clone the repository:
<pre> 
   git clone https://github.com/YsfElm01/Morocco-Map-Data-Visualizer.git
   cd morocco-map

</pre> 

Pour lancer l’exemple interactif :
<pre> npm run example</pre> 


### If it works, don't ask why 😀 🗺️





