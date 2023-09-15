const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imgContainer = document.querySelector(`.images`);

const renderCountry2 = function (data, className = '') {
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

const getPosition2 = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = function () {
  getPosition2()
    .then(position => {
      console.log(`Show position`, position);

      const { latitude: lat, longitude: lng } = position.coords;
      //   console.log(`Show lat and lng`, latitude, longitude);
      // return fetch(
      //   `https://geocode.xyz/${lat},${lng}?geoit=json&auth=942234455201097948945x110190`
      // );
      return fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`);
    })

    .then(response => {
      console.log(`The response returned is this: `, response);
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    }) //response.json()
    .then(data => {
      console.log(`The collected json Data is this: `, data);

      console.log(`You are at ${data.address.state}, ${data.address.country}`);

      return fetch(
        `https://restcountries.com/v3.1/name/${data.address.country}`
      );

      //   renderCountry2(data.country);
      //   if ((data.distance.slice(` `)[0] = `Throttled!`))
      //     throw new Error(`This data has been throttled!`);
    })
    .then(data => {
      //   console.log(`Data from fetching country`, data.json());
      return data.json();
    })
    .then(dataRet => {
      console.log(dataRet);
      console.log(dataRet[0].name.common);
      renderCountry2(dataRet[0]);
    })
    .catch(err => console.log(err.message))
    .finally(() => (countriesContainer.style.opacity = 1));
};
// whereAmI();
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
// whereAmI(11.31755, -5.66654);
// whereAmI(46.71109, 1.7191036);
// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY

// Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
// § Coordinates 2: 19.037, 72.873
// § Coordinates 3: -33.933, 18.474

// const url =
//   'https://google-maps-geocoding.p.rapidapi.com/geocode/json?latlng=40.714224%2C-73.96145&language=en';
// const options = {
//   method: 'GET',
//   headers: {
//     'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
//     'X-RapidAPI-Host': 'google-maps-geocoding.p.rapidapi.com',
//   },
// };

// try {
//   const response = await fetch(url, options);
//   const result = await response.text();
//   console.log(result);
// } catch (error) {
//   console.error(error);
// }

const wait2 = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement(`img`);
    img.src = imgPath;
    img.addEventListener(`load`, function () {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener(`error`, function () {
      reject(new Error(`Image was not found`));
    });
  });
};
const path = `img/img-1.jpg`;
const path2 = `img/img-2.jpg`;

// let currentImg;
// createImage(path)
//   .then(img => {
//     currentImg = img;
//     console.log(`Image 1 loaded`);
//     return wait2(2);
//   })
//   .then(() => {
//     currentImg.style.display = `none`;
//     return createImage(path2);
//   })
//   .then(img => {
//     currentImg = img;
//     console.log(`Image 2 loaded`);
//     return wait2(2);
//   })
//   .then(() => (currentImg.style.display = `none`))
//   .catch(err => console.error(err));

// Reimplementing whereAmI function using async...await fxnality
const whereAmI_2 = async function () {
  try {
    // Geolocation
    const position = await getPosition2();
    // console.log(`Responded data first: ${position}`);
    const { latitude: lat, longitude: lng } = position.coords;
    // console.log(`Show lat and lng`, latitude, longitude);
    // Reverse geocoding
    const responseGeo = await fetch(
      // `https://geocode.xyz/${lat},${lng}?geoit=json&auth=942234455201097948945x110190`
      `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`
    );
    // const theResp = await responseGeo.json();
    // console.log(`New Responded data: `, theResp);
    if (!responseGeo.ok) throw new Error(`💥Error obtaining data`);
    const dataGeo = await responseGeo.json();
    // console.log(`ResponseGeo data:`, dataGeo);

    // console.log(`Reversed geocoded data`, dataGeo);

    // Country data
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.address.country}`
    );
    // const response = await fetch(
    //   `https://restcountries.com/v3.1/name/${dataGeo.country}?fullText=true`
    // );
    // console.log(`Responded this new: `, response);

    // console.log(`Responded data: ${response}`);
    if (!response.ok) throw new Error(`💥Error obtaining country data`);
    const data = await response.json();
    console.log(`The awaited data is: `, data[0]);
    renderCountry2(data[0]);

    return `You are in ${dataGeo.address.state} inside ${dataGeo.address.country} 🎉`;
  } catch (err) {
    console.error(err);
    renderError(err);

    // Reject promise returned from async function
    throw err;
  }
};
// whereAmI_2();
console.log(`1: FIRST STATEMENT EXECUTED`);

// Returning a value from the async function
// Converting the below script to async IIF
//(Immediately invoked functions)
// whereAmI_2()
//   .then(location => console.log(`2: ${location}`))
//   .catch(err => console.log(`2: ${err.message}`))
//   .finally(() => console.log(`4: Finished getting location`));
// (async function () {
//   try {
//     const city = await whereAmI_2();
//     console.log(`2: ${city}`);
//   } catch (err) {
//     console.log(`2: ${err.message}`);
//   }
//   console.log(`4: Finished getting location`);
// })();

console.log(`3: LAST STATEMENT EXECUTED`);

// Coding challenge 2
// Write an async function 'loadNPause' that recreates Challenge #2, this time
// using async/await (only the part where the promise is consumed, reuse the
// 'createImage' function from before)

let currentImg2;
const path3 = `img/img-1.jpg`;
const path4 = `img/img-2.jpg`;

const loadNPause = async function () {
  try {
    const image1 = await createImage(path3);
    currentImg2 = image1;
    console.log(`Image 3 loaded from loadNPause`);
    await wait2(2);
    currentImg2.style.display = `none`;

    const image2 = await createImage(path4);
    currentImg2 = image2;
    console.log(`Image 4 loaded from loadNPause`);
    await wait2(2);
    currentImg2.style.display = `none`;
  } catch (err) {
    console.error(`💥${err}`);
  }
};
// loadNPause();

// PART 2
// 1. Create an async function 'loadAll' that receives an array of image paths
// 'imgArr'
// 2. Use .map to loop over the array, to load all the images with the
// 'createImage' function (call the resulting array 'imgs')
// 3. Check out the 'imgs' array in the console! Is it like you expected?
// 4. Use a promise combinator function to actually get the images from the array 😉
// 5. Add the 'parallel' class to all the images (it has some CSS styles)
const imageArray = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];
const loadAll = async function (imgArr) {
  try {
    const imgs = imgArr.map(async img => await createImage(img));
    console.log(imgs);

    const imgEl = await Promise.all(imgs);
    imgEl.forEach(img => img.classList.add(`parallel`));
    console.log(imgEl);
  } catch (err) {
    console.error(err);
  }
};
loadAll(imageArray);
