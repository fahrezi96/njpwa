if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/njpwa/sw.js')
    .then((reg) => console.log('sw registered!', reg))
    .catch((err) => console.log('sw NOT registered! Error: ', err));
}
