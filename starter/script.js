'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// rendering error for a rejected promise
const renderError = function (msg) {
  countriesContainer.insertAdjacentText(`beforeend`, msg);
  // countriesContainer.style.opacity = 1;
};

// Making AJAX calls to third party APIs
const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
        <img class="country__img" src="${
          data.flags[Object.keys(data.flags)[0]]
        }" />
        <div class="country__data">
        <h3 class="country__name">${data.name['common']}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} million people</p>
        <p class="country__row"><span>🗣️</span>${
          data.languages[Object.keys(data.languages)[0]]
        }</p>
        <p class="country__row"><span>💰</span>${
          data.currencies[Object.keys(data.currencies)[0]].name
        }  |  ${data.currencies[Object.keys(data.currencies)[0]].symbol} </p>
    </div>
    </article>`;
  countriesContainer.insertAdjacentHTML(`beforeend`, html);
  // countriesContainer.style.opacity = 1;
};

const getCountryDataAndNeighbour = function (country) {
  // AJAX Call Country 1
  const request = new XMLHttpRequest();
  request.open(`GET`, `https://restcountries.com/v3.1/name/${country}`);
  request.send();
  console.log(request.responseText);

  request.addEventListener(`load`, function () {
    // convert the JSON string to an object
    const [data] = JSON.parse(this.responseText);
    // Render Country 1
    renderCountry(data);
    console.log(data);

    // Get neighbour country 2
    const [neighbour] = data.borders;

    if (!neighbour) return; // Guard condition

    // AJAX Call Country 2
    const request2 = new XMLHttpRequest();
    request2.open(`GET`, `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();
    request2.addEventListener(`load`, function () {
      const [data2] = JSON.parse(this.responseText);
      renderCountry(data2, `neighbour`);

      console.log(data2);
    });
  });
};

// getCountryDataAndNeighbour(`nigeria`);
// getCountryDataAndNeighbour(`portugal`);
getCountryDataAndNeighbour(`usa`);
// getCountryDataAndNeighbour(`nigeria`);
// getCountryDataAndNeighbour(`korea`);
// getCountryDataAndNeighbour(`japan`);
// getCountryDataAndNeighbour(`germany`);
// getCountryDataAndNeighbour(`egypt`);
// getCountryDataAndNeighbour(`iran`);

// Call back hell
setTimeout(() => {
  console.log(`1 second passed`);
  setTimeout(() => {
    console.log(`2 seconds passed`);
    setTimeout(() => {
      console.log(`3 seconds passed`);
      setTimeout(() => {
        console.log(`4 seconds passed`);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

const request3 = fetch(`https://restcountries.com/v3.1/name/nigeria`);
console.log(request3);

// Demonstrating AJAX calls using a Promise
const getCountryDataPromise = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry(data[0]);
    });
};
console.log(`-----AJAX calls using promises------`);
getCountryDataPromise(`nigeria`);

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
    return response.json();
  });
};

// simplified version of getCountryDataPromise
const getCountryDataPromise2 = function (country) {
  // Country 1
  getJSON(`https://restcountries.com/v3.1/name/${country}`, `Country not found`)
    .then(data => {
      renderCountry(data[0]);

      function throwErr(msg) {
        throw new Error(msg);
      }
      const neighbour =
        'borders' in data[0]
          ? data[0].borders[0]
          : throwErr(`No neighbour found`);

      // Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        `Boundary not available`
      );
      //   console.log(`Fetched data`, data[0]);
    })
    .then(data => {
      // console.log(`check this data`, data[0]);
      renderCountry(data[0], `neighbour`);
    })
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      // console.log(err);
      renderError(`Something went wrong 💥💥💥 ${err.message}. Try again`);
      console.log(`Displayed error`, err);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

const get3countries = async function (c1, c2, c3) {
  try {
    const country1 = await getJSON(
      // `https://restcountries.eu/rest/v2/name/${c1}`
      `https://restcountries.com/v3.1/name/${c1}`
    );
    const country2 = await getJSON(
      // `https://restcountries.eu/rest/v2/name/${c2}`
      `https://restcountries.com/v3.1/name/${c2}`
    );
    const country3 = await getJSON(
      // `https://restcountries.eu/rest/v2/name/${c3}`

      `https://restcountries.com/v3.1/name/${c3}`
    );

    console.log(`The returned country data from the three countries are: `);
    console.log([country1, country2, country3]);
  } catch (err) {
    console.error(err);
  }
};
get3countries(`nigeira`, `ghana`, `portugal`);
btn.addEventListener(`click`, function () {
  getCountryDataPromise2(`czech`);
});
