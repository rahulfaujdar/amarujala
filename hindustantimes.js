let hindustantimesData = [];

async function loadHinduStanCities(date) {

    const params = new URLSearchParams({ EditionDate: date });

    const res = await fetch(`https://epaper.hindustantimes.com/Home/GetEditionSupplementHierarchy?${params}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    hindustantimesData = data;

    const citySelect = document.getElementById('hindustanTimesCity');
    data.forEach(city => {
        const option = document.createElement('option');
        option.value = city.EditionId;
        option.textContent = city.EditionName;
        citySelect.appendChild(option);
    });

    setDefaultHindustanTimesSelection();
}

function updateHinduStanTimesSubCities() {
    const selectedCity = document.getElementById("hindustanTimesCity").value;
    const subCitySelect = document.getElementById("hindustanTimesSubCity");
    subCitySelect.innerHTML = '';

    hindustantimesData
        .find(entry => entry.EditionId == selectedCity).Supplement
        .forEach(entry => {
            const option = document.createElement("option");
            option.value = entry.EditionId;
            option.textContent = entry.EditionDisplayName;
            subCitySelect.appendChild(option);
        });
}

async function downloadHinduStanTimes() {

    const date = document.getElementById('hindustanTimesDate').value;
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = dateObj.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const citySlug = document.getElementById('hindustanTimesSubCity').value;
    const downloadingMessage = document.createElement('p');
    downloadingMessage.classList.add('downloading-message');
    downloadingMessage.textContent = 'Downloading, please wait...';

    const downloadButton = document.querySelector('#hindustanTimesForm button');
    const mainContainer = document.getElementById('mainContainer');
    const previewElement = document.getElementById('preview');

    // Disable button and show downloading message
    downloadButton.disabled = true;
    mainContainer.appendChild(downloadingMessage);
    downloadingMessage.style.display = 'block';

    try {
        const response = await fetch(`https://d2pntrmx20f4jl.cloudfront.net/dev/v1/download?editionId=${citySlug}&editionDate=${formattedDate}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data && data.data.htmlContent) {
            mainContainer.style.display = 'none';
            document.getElementById('footer').style.display = 'none';
            previewElement.innerHTML = data.data.htmlContent;
        } else {
            throw new Error("No data returned from the API.");
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        downloadButton.disabled = false;
        downloadingMessage.style.display = 'none';
    }
}

function setDefaultHindustanTimesSelection() {
    const stateSelect = document.getElementById("hindustanTimesCity");
    const citySelect = document.getElementById("hindustanTimesSubCity");

    stateSelect.value = 1;
    updateHinduStanTimesSubCities();

    const subCity = hindustantimesData.find(entry => entry.EditionId == 1).Supplement.find(entry => entry.EditionId == 1);
    if (subCity) {
        citySelect.value = subCity.EditionId;
    }
}

const defaultHindustanTimesOption = () => {

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(`0${currentDate.getMonth() + 1}`).slice(-2)}-${(`0${currentDate.getDate()}`).slice(-2)}`;

    const date = `${(`0${currentDate.getDate()}`).slice(-2)}/${(`0${currentDate.getMonth() + 1}`).slice(-2)}/${currentDate.getFullYear()}`;

    document.getElementById('hindustanTimesDate').value = formattedDate;
    loadHinduStanCities(date);
    document.getElementById('hindustanTimesCity').addEventListener('change', updateHinduStanTimesSubCities);
}
