const TOIDATA = [
    { "slug": "ahmedabad", "city": "Ahmedabad" },
    { "slug": "bangalore", "city": "Bangalore" },
    { "slug": "bhopal", "city": "Bhopal" },
    { "slug": "chandigarh", "city": "Chandigarh" },
    { "slug": "chennai", "city": "Chennai" },
    { "slug": "delhi", "city": "Delhi" },
    { "slug": "goa", "city": "Goa" },
    { "slug": "hyderabad", "city": "Hyderabad" },
    { "slug": "jaipur", "city": "Jaipur" },
    { "slug": "kochi", "city": "Kochi" },
    { "slug": "kolkata", "city": "Kolkata" },
    { "slug": "lucknow", "city": "Lucknow" },
    { "slug": "mumbai", "city": "Mumbai" },
    { "slug": "pune", "city": "Pune" }
]


function loadTOICities() {
    const citySelect = document.getElementById("TOICity");
    TOIDATA.forEach(city => {
        const option = document.createElement("option");
        option.value = city.slug;
        option.textContent = city.city;
        citySelect.appendChild(option);
    });
}

function setDefaultTOISelection() {
    const citySelect = document.getElementById("TOICity");

    citySelect.value = "delhi";
}


async function downloadTOI() {
    const date = document.getElementById('TOIDate').value;
    const citySlug = document.getElementById('TOICity').value;

    const downloadingMessage = document.createElement('p');
    downloadingMessage.classList.add('downloading-message');
    downloadingMessage.textContent = 'Downloading, please wait...';

    const downloadButton = document.querySelector('#TOIForm button');
    const mainContainer = document.getElementById('mainContainer');
    const previewElement = document.getElementById('preview');
    const toiContainer = document.getElementById('TOIForm');

    downloadButton.disabled = true;
    toiContainer.appendChild(downloadingMessage);
    downloadingMessage.style.display = 'block';

    let [year, month, day] = date.split("-");

    try {
        const firstResponse = await fetch(`https://d3a2dhpjvvj5q1.cloudfront.net/dev/v1/download?citySlug=${citySlug}&day=${day}&month=${month}&year=${year}&page=1`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const firstData = await firstResponse.json();
        if (!firstData.data || !firstData.data.totalPage) throw new Error("Invalid response");

        const totalPage = parseInt(firstData.data.totalPage);
        const images = [firstData.data.htmlContent];

        for (let i = 2; i <= totalPage; i++) {
            const pageResponse = await fetch(`https://d3a2dhpjvvj5q1.cloudfront.net/dev/v1/download?citySlug=${citySlug}&day=${day}&month=${month}&year=${year}&page=${i}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const pageData = await pageResponse.json();
            if (pageData.data && pageData.data.htmlContent) {
                images.push(pageData.data.htmlContent);
            }
        }

        mainContainer.style.display = 'none';
        document.getElementById('footer').style.display = 'none';
        previewElement.innerHTML = images.map(img => `<div>${img}</div>`).join('');

    } catch (error) {
        console.error('Error:', error);
        downloadButton.style.display = 'block';
        downloadingMessage.style.display = 'none';
    }
}


const defaultTOIOption = () => {

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(`0${currentDate.getMonth() + 1}`).slice(-2)}-${(`0${currentDate.getDate()}`).slice(-2)}`;

    document.getElementById('TOIDate').value = formattedDate;
    loadTOICities();
    setDefaultTOISelection();
};
