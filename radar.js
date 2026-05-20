
const mappa=L.map('mappa-pioggia',{
    zoomControl:true,
    minZoom:4,
    maxZoom:12
}).setView([42.5041,12.6463],6);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' ,
    subdomains:'abcd',
    maxZoom:20
    }).addTo(mappa);

const livelloRadar = L.tileLayer('https://tilecache.rainviewer.com/v2/radar/nowcast_10/256/{z}/{x}/{y}/2/1_1.png', {
    opacity: 0.65,
    zIndex: 10
});

const livelloNuvole = L.tileLayer('https://tilecache.rainviewer.com/v2/coverage/0/256/{z}/{x}/{y}/0/0_0.png', {
    opacity: 0.50,
    zIndex: 10
});

// Attiviamo di base il radar meteo all'avvio della pagina
livelloRadar.addTo(mappa);
let livelloAttivo = 'radar';

// 4. Gestione dei Pulsanti e dei cambi di visualizzazione
const btnRadar = document.getElementById('btn-radar');
const btnNuvole = document.getElementById('btn-nuvole');

function mostraRadar() {
    if (livelloAttivo === 'radar') return;
    
    mappa.removeLayer(livelloNuvole);
    livelloRadar.addTo(mappa);
    
    btnRadar.classList.add('attivo');
    btnNuvole.classList.remove('attivo');
    livelloAttivo = 'radar';
}

function mostraNuvole() {
    if (livelloAttivo === 'nuvole') return;
    
    mappa.removeLayer(livelloRadar);
    livelloNuvole.addTo(mappa);
    
    btnNuvole.classList.add('attivo');
    btnRadar.classList.remove('attivo');
    livelloAttivo = 'nuvole';
}

// Collega le funzioni ai click sui rispettivi elementi HTML
btnRadar.addEventListener('click', mostraRadar);
btnNuvole.addEventListener('click', mostraNuvole);