import { addUser } from './querisFr.js';

document.getElementById('registerForm').addEventListener('submit', async function(event) {
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
    try{
        let tok = await generateSimpleToken({name: name, password: password}, password)
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashpsw = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        let user = await addUser({name: name, password: hashpsw, token: tok});
        localStorage.setItem('token', tok);
        localStorage.setItem('name', name);
        window.location.href = 'login.html';
    }
    catch(error){
        console.log(error);
        return;
    }
});

async function generateSimpleToken(payload, secret) {
    const base64Payload = btoa(JSON.stringify(payload));

    const encoder = new TextEncoder();
    const dataToSign = encoder.encode(base64Payload + secret);

    return crypto.subtle.digest("SHA-256", dataToSign).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        return `${base64Payload}.${hashHex}`;
    });
}