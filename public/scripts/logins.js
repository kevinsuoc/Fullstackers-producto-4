import { addUser, login } from './querisFr.js';

async function addusers(names, passwords){
    let tok = generateSimpleToken({name: names, password: passwords}, passwords)
    try{
        const response = await addUser({
            name: names,
            password: passwords,
            token: tok
        });
        console.log(response);
        // if(response.data.addUser){

        // }

    }catch(error){
        console.log(error);
        return;
    }
}

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    const rptpassword = document.getElementById('rptpassword').value;
    if(password !== rptpassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    let hashpsw = '';
    //no es muy seguro sha-256
    window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        hashpsw = hashHex;
    });
    console.log("contra "+hashpsw);

    let user = addusers(name, hashpsw);
    console.log(user);
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('user').value;
    const password = document.getElementById('password').value;
});

function generateSimpleToken(payload, secret) {
    const base64Payload = btoa(JSON.stringify(payload));
  
    const encoder = new TextEncoder();
    const dataToSign = encoder.encode(base64Payload + secret);
  
    return crypto.subtle.digest("SHA-256", dataToSign).then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
      console.log(`${base64Payload}.${hashHex}`);   
      return `${base64Payload}.${hashHex}`;
    });
  }