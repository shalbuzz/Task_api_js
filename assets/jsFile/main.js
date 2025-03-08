const base_url = 'https://restcountries.com/v3.1/all';

document.addEventListener("DOMContentLoaded", () => {

  const page = window.location.pathname.split("/").pop();

  if (page === "main.html" && document.querySelector(".cards")) {
    mainPage();
  } else if (page === "details.html" && document.querySelector(".country")) {
    getDetails();
  }
});

let allCountries = []; 
let timeout; 

async function mainPage() {
    try {
       
        const spinner = document.querySelector('#spinner');
        spinner.style.display = 'block';

        let response = await fetch(base_url);
        let datas = await response.json();
        allCountries = datas.sort((a, b) => a.name.common.localeCompare(b.name.common)); 
        
        renderCountries(allCountries);
        
        spinner.style.display = 'none';
    } catch (error) {
        console.error(error);
        spinner.style.display = 'none';  
    }
}

function renderCountries(countries) {
    const cards = document.querySelector('.cards');
    cards.innerHTML = countries.map(data => `
        <div class="card">
            <a href="../detailsPage/details.html?name=${encodeURIComponent(data.name.common)}">
                <div class="card-flag">
                    <img src="${data.flags.png}" alt="${data.name.alt || data.name.common}" aria-label="${data.name.common}">
                </div>
                <div class="card-description">
                    <h3 class="cards-content-title">${data.name.common}</h3>
                    <div class="cards-content-details">
                        <p><span>Population: </span>${data.population.toLocaleString()}</p>
                        <p><span>Region: </span>${data.region}</p>
                        <p><span>Capital: </span>${data.capital ? data.capital.join(', ') : 'N/A'}</p>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}


document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname.split("/").pop();
    
    if (page === "main.html") {
        let searchInput = document.querySelector('.search-bar-form-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
               
                    let searchTerm = searchInput.value.trim().toLowerCase();
                    if (searchTerm === '') {
                        renderCountries(allCountries); 
                        return;
                    }
                    let filtered = allCountries.filter(country => 
                        country.name.common.toLowerCase().includes(searchTerm)
                    );
                    renderCountries(filtered);
                
            });
        } else {
            console.warn("search-bar-form-input not found in main.html!");
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split("/").pop();

    if (page === "main.html") {
        const filterIcon = document.querySelector('.filter-icon');
        const filterSelect = document.querySelector('.filter-select');

        if (filterIcon && filterSelect) {
            filterIcon.addEventListener('click', () => {
                filterSelect.classList.toggle('show');
            });

            const regionItems = document.querySelectorAll('.filter-select-region');
            regionItems.forEach(item => {
                item.addEventListener('click', () => {
                    const region = item.id;
                    
                    if (region === "All") {
                        renderCountries(allCountries); 
                    } else {
                        const filteredByRegion = allCountries.filter(country => country.region === region);
                        renderCountries(filteredByRegion); 
                    }

                    filterSelect.classList.remove('show');
                });
            });
        } else {
            console.warn("filter-icon or filter-select not found in main.html!");
        }
    }
});


function getDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  let name = urlParams.get('name');

  if (!name) {
      console.error("Name not found in URL!");
      document.querySelector('.country').innerHTML = '<p>Show name not found. Redirecting to the main page...</p>';
      window.location.href = "../mainPage/main.html";
      return;
  }

  let api_url = `https://restcountries.com/v3.1/name/${name}?fullText=true`;
  
  const country = document.querySelector('.country');
  const spinner = document.querySelector('#spinner');
  spinner.style.display = 'block';

  fetch(api_url)
      .then(response => response.json())
      .then(data => {

        spinner.style.display = 'none';
          if (!data || data.length === 0) {
              console.error("Country data not found!");
              country.innerHTML = '<p>Country data not found. Redirecting...</p>';
              setTimeout(() => window.location.href = "../mainPage/main.html", 3000);
              return;
          }

          const countryData = data[0];

          const nativeName = countryData.name.nativeName ? 
              Object.values(countryData.name.nativeName)[0].official : "N/A";

          const currency = countryData.currencies ? 
              Object.values(countryData.currencies)[0].name : "N/A";

          const languages = countryData.languages ? 
              Object.values(countryData.languages).join(', ') : "N/A";

          const borders = countryData.borders ? 
    Promise.all(countryData.borders.map(borderCode => {
        return fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
            .then(response => response.json())
            .then(data => {
                const borderCountry = data[0]; 
                return `
                    <a href="?name=${borderCountry.name.common}">
                        <button class="country-details-btn" data-name="${borderCountry.name.common}" type="button">
                            ${borderCountry.name.common}
                        </button>
                    </a>
                `;
            });
    }))
    .then(borderButtons => {
        return borderButtons.join('');
    })
    .catch(error => {
        console.error('Error fetching border countries:', error);
        return `${countryData.name.common}, No border countries`;
        
    })
: Promise.resolve(`<p class="no-border">${countryData.name.common},No border countries</p>`); 

borders.then(bordersSection => {
    country.innerHTML = `
        <a href="../mainPage/main.html">
            <button class="country-btn" type="button">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" class="country-button-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                </svg>
                <span>Back</span>
            </button>
        </a>
        <div class="country-section">
            <div class="country-flag">
                <img src='${countryData.flags.svg}' alt="${countryData.name.common}">
            </div>
            <div class="country-details">
                <h3 class="country-details-title">${countryData.name.common}</h3>
                <div class="country-details-elements">
                    <div>
                        <p><span>Native Name: </span>${nativeName}</p>
                        <p><span>Population: </span>${countryData.population.toLocaleString()}</p>
                        <p><span>Region: </span>${countryData.region}</p>
                        <p><span>Sub Region: </span>${countryData.subregion || "N/A"}</p>
                        <p><span>Capital: </span>${countryData.capital ? countryData.capital[0] : "N/A"}</p>
                    </div>
                    <div>
                        <p><span>Top Level Domain: </span>${countryData.tld ? countryData.tld[0] : "N/A"}</p>
                        <p><span>Currencies: </span>${currency}</p>
                        <p><span>Languages: </span>${languages}</p>
                    </div>
                </div>
                <div class="country-details-list">
                    <div>
                        <p><span>Border Countries: </span></p>
                    </div>
                    <div>${bordersSection}</div>
                </div>
            </div>
        </div>
    `;
});

          const detailBtns = document.querySelectorAll('.country-details-btn');
          detailBtns.forEach((btn) => {
              btn.addEventListener('click', (e) => {
                  const borderCountryName = e.target.getAttribute("data-name");

                  
                  if (borderCountryName) {
                      window.location.href = `../detailsPage/details.html?name=${encodeURIComponent(borderCountryName)}`;
                  } else {
                      console.error("No name found for the border country!");
                  }
              });
          });
      })
      .catch(error => {
        spinner.style.display = 'none';
          console.error("Error fetching country data:", error);
          country.innerHTML = '<p>Failed to load country details. Try again later.</p>';
      });
}
