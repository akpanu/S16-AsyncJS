console.log(`Test start`);
Promise.resolve(`Resolved Promise 1`).then(response => console.log(response));
setTimeout(() => console.log(`0 sec timer `), 0);

Promise.resolve(`Resolved promise 2`).then(response => {
  for (let counter = 0; counter < 10000000; counter++) {}
  console.log(response);
});
console.log(`Test end`);

// Building our custom promise
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log(`Lottery coupon is in progress! 🥳🥳`);

  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve(`You won the lottery. 💰`);
    } else {
      reject(new Error(`You lost some money`));
    }
  }, 5000);
});
lotteryPromise
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Promisifying the setTimeout function
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};
wait(2)
  .then(() => {
    console.log(`I waited for 2 seconds`);
    return wait(3);
  })
  .then(() => console.log(`I waited for another 3 seconds`));

// Call back hell
// setTimeout(() => {
//   console.log(`1 second passed`);
//   setTimeout(() => {
//     console.log(`2 seconds passed`);
//     setTimeout(() => {
//       console.log(`3 seconds passed`);
//       setTimeout(() => {
//         console.log(`4 seconds passed`);
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);
// Refactoring the Call back hell code above using the wait function created
wait(1)
  .then(() => {
    console.log(`1 second passed`);
    return wait(1);
  })
  .then(() => {
    console.log(`2 second passed`);
    return wait(1);
  })
  .then(() => {
    console.log(`3 second passed`);
    return wait(1);
  })
  .then(() => {
    console.log(`4 second passed`);
    return wait(1);
  });

// Resolving and rejecting promises immediately
Promise.resolve(`I am a Software Engineer & a C.A`).then(response =>
  console.log(response)
);
Promise.reject(new Error(`I cannot fail again!`)).catch(error =>
  console.error(error)
);

// Promisifying the geolocation
console.log(`Promisifying the geolocation`);

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
getPosition().then(position =>
  console.log(`The returned position is`, position)
);
