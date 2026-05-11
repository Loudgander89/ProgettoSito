/* Acquisizione dati meteo*/
const apiKey = "ba2c2097fcc0f00737c18a372c6fb411";
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function getMeteo(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`;
     const risposta1 = await fetch(url);
        const data = await risposta1.json();
    try {
        
        if (data.cod === "404") {
            alert("Città non trovata!");
            return;
        }
        document.getElementById('cityName').innerText = data.name;
        document.getElementById('temp').innerText = Math.round(data.main.temp) + "°";
        document.getElementById('description').innerText = data.weather[0].description;
        document.getElementById('humidity').innerText = data.main.humidity + "%";
        document.getElementById('wind').innerText = data.wind.speed + " km/h";
        document.getElementById('pressure').innerText = data.main.pressure + " hPa";
        document.getElementById('feelsLike').innerText = Math.round(data.main.feels_like) + "°";
        
        updateWeatherIcon(data.weather[0].main);
        
       

    } catch (error) {
        console.error("Errore nel recupero dati:", error);
    }
    const cond= data.weather[0].main;

    const orarioAttuale = Math.floor(Date.now() / 1000);
    const notte = orarioAttuale > data.sys.sunset || orarioAttuale < data.sys.sunrise;
    cambioSfondo(cond,notte);

    getPrevisioneOraria(city);
}
/*Dati previsioni meteo giorno successivo*/
async function getPrevisioneOraria(city){
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=it`;

    try {
        const risposta= await fetch(url);
        const data= await risposta.json();
        const slider = document.getElementById('SliderOrario')
        slider.innerHTML = "";
        const DatiOrari = data.list.slice(0,8);
        DatiOrari.forEach(item =>{
            const date= new Date(item.dt * 1000);
            const ora= date.getHours() + ":00";
            const temp= Math.round(item.main.temp) + "°";
            const iconCode = item.weather[0].main;
            const iconClass= getIconClass(iconCode);

            const html = `
                <div class="hourly-item">
                    <span>${ora}</span>
                    <i class="fas ${iconClass}"></i>
                    <span class="font-bold">${temp}</span>
                </div>
            `;
            slider.innerHTML += html;
        });
    } catch (error){
        console.error("Errore forecast:", error);
    }
}
/*Acquisizione icona*/
function getIconClass(condition) {
    const icons ={ 'Clear': 'fa-sun', 'Clouds': 'fa-cloud', 'Rain': 'fa-cloud-showers-heavy', 'Snow': 'fa-snowflake' };
    return icons[condition] || 'fa-cloud';
}

/*Cambio icona*/
function updateWeatherIcon(condition) {
    const iconElement = document.getElementById('weatherIcon');
    
    const icons = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-showers-heavy',
        'Drizzle': 'fa-cloud-rain',
        'Thunderstorm': 'fa-bolt',
        'Snow': 'fa-snowflake',
        'Mist': 'fa-smog',
        'Smoke': 'fa-smog',
        'Haze': 'fa-smog',
        'Fog': 'fa-smog'
    };
    const iconClass = icons[condition] || 'fa-cloud';
    iconElement.className = `fas ${iconClass}`;

}
/*acquisizione data corrente*/
function updateDate(){
const dateElement = document.getElementById('currentDate')
const oggi= new Date();

const opzioni= {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'

};

const dataFinale = oggi.toLocaleDateString('it-IT',opzioni);


dateElement.innerText= dataFinale;
}
searchBtn.addEventListener('click', () => getMeteo(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getMeteo(cityInput.value);
});

window.onload= ()=> {
    updateDate();
    getMeteo("Viareggio");
};

/*Cambio sfondo*/

function cambioSfondo(cond,notte){
    const body= document.body;
    const rainLayer = document.getElementById('rainLayer');
    
    body.classList.remove('bg-clear', 'bg-clouds', 'bg-rain', 'bg-night');

    rainLayer.style.display= 'none';

    if (notte){
        body.classList.add('bg-night');
        return;
    }

    switch (cond) {
        case 'Clear':
            body.classList.add('bg-clear');
            break;
        case 'Clouds':
            body.classList.add('bg-clouds');
            break;
        case 'Rain':
        case 'Drizzle':
        case 'Thunderstorm':
            body.classList.add('bg-rain');
            rainLayer.style.display= 'block';
            break;
        default:
            body.classList.add('bg-clouds'); 
    }
}
