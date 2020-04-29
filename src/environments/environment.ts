// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBvhirpICwYGLTWj8ytjv7Kd6u3XurZS8M",
    authDomain: "encontreaki-509b5.firebaseapp.com",
    databaseURL: "https://encontreaki-509b5.firebaseio.com",
    projectId: "encontreaki-509b5",
    storageBucket: "encontreaki-509b5.appspot.com",
    messagingSenderId: "375280335786",
    appId: "1:375280335786:web:d0d62fcacfc2b9d69549d3",
    measurementId: "G-DYJL90M858"
  },  
  SERVER_URL_ACCOUNT: 'http://localhost:8080/',
  SERVER_URL_USER: 'http://localhost:8088/',
  //SERVER_URL_ACCOUNT: 'https://green-pay-v1.uc.r.appspot.com/',
  //SERVER_URL_USER: 'https://gp-security-jwt-authentication.uc.r.appspot.com/',

};
