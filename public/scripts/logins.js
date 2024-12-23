import { login, existUser } from './querisFr.js';

//     let hashpsw = '';
//     //no es muy seguro sha-256
//     try{
//         let tok = await generateSimpleToken({name: name, password: password}, password)
//         const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
//         const hashArray = Array.from(new Uint8Array(hashBuffer));
//         hashpsw = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//         let user = await addUser({name: name, password: hashpsw, token: tok});
//         localStorage.setItem('token', tok);
//         window.location.href = 'login.html';
//     }
//     catch(error){
//         console.log(error);
//         return;
//     }
// });


window.onload = async function(){
    if(localStorage.getItem('token')){
        if(await existUser(localStorage.getItem('token'))){
            window.location.href = 'index.html';
        }
    }
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    let hashpsw = '';
    try{
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashpsw = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        let user = await login({name: nombre, password: hashpsw});
        console.log(user);
        localStorage.setItem('token', user.data.login.token);
        localStorage.setItem('name', user.data.login.name);
        window.location.href = 'index.html';
    }
    catch(error){
        console.log(error);
        return;
    }
});

