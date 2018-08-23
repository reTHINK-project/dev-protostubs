/*import {IdpProxy} from "./GoogleIdP"

export function getAssertion() {
  console.log('get assertion');
  var contents = "NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTg0LDE5MCwyMjgsMjQ5LDgwLDM1LDMyLDE4LDE0OCwyMDAsMTM0LDcsMjUxLDQ0LDE1NywxMDgsMTk3LDk0LDg5LDg2LDIyNCwxMCwxNjYsNjksNDgsMTIwLDI3LDIwLDIwNyw5MywxMDEsMjExLDE2Miw5MywxMTgsMiwyNDksOTksMTQ3LDgzLDMsMzQsNjksMTI0LDE0MywxMDcsMTk2LDE2Myw1Myw5NywyMTgsMTg2LDEzNywyNTEsMTI3LDE5NywyMDgsMTc2LDgzLDE1NCwxMTQsMjIsMTIxLDExMiwxODYsMTQsOTIsMTQsMTM0LDgzLDEwMCwxNDYsMjQ1LDE4Niw0Nyw5MiwzMiwyMTcsMjEyLDIxLDI5LDE4MywxMjMsMTExLDQ0LDE4MywxNjIsOTUsMTkzLDE3MCwxNDksODUsMTMsNzIsODAsNjYsNzQsMTgwLDI1MywyNDYsMTczLDE1NywyMjksMjI5LDIwNCw4NCwxMDgsMTQ0LDE2MSw2MiwyNiwxODEsMTgzLDQ5LDEyNiwxNTQsMzgsMTk3LDE4Niw4OCwxMzEsOTcsMjIzLDE1MSw2Niw2Niw0MywxOSwzMCw5MSwyNTMsMjM4LDE3NSwyMTksMTYyLDgyLDIwMywxMTUsMTg2LDE4LDU2LDI1MSwyMSwxMTksMjUyLDk5LDc2LDEwOCwyMTMsMjA5LDMwLDIwNCw5Miw2Miw3OSwxMjMsMTYwLDQ5LDEzOCwyNDEsMTg2LDEyLDc1LDQ1LDE4OSw0NCwyMzksNTAsMjAsMzYsMTU0LDEyNSwyNDgsMjI5LDE1MCw0NywyMTUsMjI5LDYzLDk2LDIzOSwxNjAsMTg2LDIzNCwxMjYsNTMsMTUxLDIxNSwxODEsOTksNTYsMzksMzEsMjI4LDYxLDIzMSwxOTUsNywyMjcsMTQwLDEyNSwxNjYsMjA4LDI0NSwyNDAsNywzOSw4Miw5OCw4OSw3Miw4MCwxMjYsMTE2LDExMiwxOTEsMTkyLDEyNiwxMzgsMjA1LDE2NywyMCwyOCwyMzUsMTU0LDEyNiwyMDEsNzgsNDAsODIsMjAyLDEzNSw0NSwyNDcsMjAzLDE5OCwxMTgsMjM1LDIwNCwyMDMsMjIyLDkyLDE3MiwyNDYsOTQsMjI5LDI1MSwxMjQsMjcsMjE2LDU5LDgzLDIzMiwyNDgsMTQsNzksMiwzLDEsMCwx";
  var origin = undefined;
//  var requestUrl = "https://accounts.google.com/o/oauth2/auth?scope=openid%20email%20profile&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com&redirect_uri=https://localhost&response_type=code&state=state&prompt=consent&access_type=offline&nonce=NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTg0LDE5MCwyMjgsMjQ5LDgwLDM1LDMyLDE4LDE0OCwyMDAsMTM0LDcsMjUxLDQ0LDE1NywxMDgsMTk3LDk0LDg5LDg2LDIyNCwxMCwxNjYsNjksNDgsMTIwLDI3LDIwLDIwNyw5MywxMDEsMjExLDE2Miw5MywxMTgsMiwyNDksOTksMTQ3LDgzLDMsMzQsNjksMTI0LDE0MywxMDcsMTk2LDE2Myw1Myw5NywyMTgsMTg2LDEzNywyNTEsMTI3LDE5NywyMDgsMTc2LDgzLDE1NCwxMTQsMjIsMTIxLDExMiwxODYsMTQsOTIsMTQsMTM0LDgzLDEwMCwxNDYsMjQ1LDE4Niw0Nyw5MiwzMiwyMTcsMjEyLDIxLDI5LDE4MywxMjMsMTExLDQ0LDE4MywxNjIsOTUsMTkzLDE3MCwxNDksODUsMTMsNzIsODAsNjYsNzQsMTgwLDI1MywyNDYsMTczLDE1NywyMjksMjI5LDIwNCw4NCwxMDgsMTQ0LDE2MSw2MiwyNiwxODEsMTgzLDQ5LDEyNiwxNTQsMzgsMTk3LDE4Niw4OCwxMzEsOTcsMjIzLDE1MSw2Niw2Niw0MywxOSwzMCw5MSwyNTMsMjM4LDE3NSwyMTksMTYyLDgyLDIwMywxMTUsMTg2LDE4LDU2LDI1MSwyMSwxMTksMjUyLDk5LDc2LDEwOCwyMTMsMjA5LDMwLDIwNCw5Miw2Miw3OSwxMjMsMTYwLDQ5LDEzOCwyNDEsMTg2LDEyLDc1LDQ1LDE4OSw0NCwyMzksNTAsMjAsMzYsMTU0LDEyNSwyNDgsMjI5LDE1MCw0NywyMTUsMjI5LDYzLDk2LDIzOSwxNjAsMTg2LDIzNCwxMjYsNTMsMTUxLDIxNSwxODEsOTksNTYsMzksMzEsMjI4LDYxLDIzMSwxOTUsNywyMjcsMTQwLDEyNSwxNjYsMjA4LDI0NSwyNDAsNywzOSw4Miw5OCw4OSw3Miw4MCwxMjYsMTE2LDExMiwxOTEsMTkyLDEyNiwxMzgsMjA1LDE2NywyMCwyOCwyMzUsMTU0LDEyNiwyMDEsNzgsNDAsODIsMjAyLDEzNSw0NSwyNDcsMjAzLDE5OCwxMTgsMjM1LDIwNCwyMDMsMjIyLDkyLDE3MiwyNDYsOTQsMjI5LDI1MSwxMjQsMjcsMjE2LDU5LDgzLDIzMiwyNDgsMTQsNzksMiwzLDEsMCwx";
  var hint;

 return new Promise( (resolve) => {
   IdpProxy.generateAssertion(contents,origin)
  .then( function (assertion) {console.log(assertion)},
      function (error) {
         openPopup(error.loginUrl).then( function (value) {
           console.log('getAssertion: result from popup ', value);
           IdpProxy.generateAssertion(contents, origin, value)
            .then( function (assertion) {
              console.log(assertion);
              resolve(assertion);
            });
        })    
     });    
  });
}

export function validateAssertion(assertion) {
  console.log('validate assertion: ', assertion);

  return new Promise( (resolve) => {
    
    IdpProxy.validateAssertion(assertion)
    .then( function (result) {
      console.log(result);
      resolve(result);
    },
        function (error) {
          console.error(error);
    });    
  });
}*/

let isOpen = false;
let win = null;
let pollTimer;
export function login(urlreceived) {

  console.log('[openPopup] url ', urlreceived );
  
  return new Promise((resolve, reject) => {

    if (!win) {
      win = window.open(urlreceived, 'openIDrequest', 'width=800, height=600');
    }

    if (window.cordova) {
      win.addEventListener('loadstart', function(e) {
        let url = e.url;
        let code = /\&code=(.+)$/.exec(url);
        let error = /\&error=(.+)$/.exec(url);

        if (code || error) {
          win.close();
          return resolve(url);
        } else {
          return reject('openPopup error 1 - should not happen');
        }
      });
    } else {

      if (!pollTimer) {

        pollTimer = setInterval(function() {

          try {
            if (win.closed) {
              clearInterval(pollTimer);
              return reject('Some error occured when trying to get identity.');
            }

            console.log('openPopup url: ', win.document.URL);
            console.log('openPopup origin: ', location.origin);

            if ((win.document.URL.indexOf('access_token') !== -1 || win.document.URL.indexOf('code') !== -1 || win.document.URL.indexOf('consent') !== -1) && win.document.URL.indexOf(location.origin) !== -1) {
              clearInterval(pollTimer);
              let url =   win.document.URL;

              win.close();
              return resolve(url);
            }
          } catch (e) {
            //return reject('openPopup error 2 - should not happen');
            console.log(e);
          }
        }, 500);
      }

    }
  });
}
