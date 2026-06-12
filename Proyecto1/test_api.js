const fs = require('fs');
async function run() {
    try {
        const login = await fetch('https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({Usuario: 'admin', Contrasena: 'admin123'})
        });
        const token = await login.text();
        console.log('Token:', token.substring(0, 20) + '...');

        const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
        
        const inms = await (await fetch('https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/inmuebles', {headers})).json();
        const inqs = await (await fetch('https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/inquilinos', {headers})).json();
        
        const idInmueble = inms[inms.length - 1].idInmueble;
        const idInquilino = inqs[inqs.length - 1].idInquilino;
        
        console.log('Testing with Inmueble:', idInmueble, 'Inquilino:', idInquilino);
        
        const dto = {
            IdInquilino: idInquilino,
            IdInmueble: idInmueble,
            FechaInicio: '2026-06-01',
            FechaVcmto: '2027-06-01',
            RentaMensual: 1000,
            NroMeses: 12,
            NroMesPPago: 12
        };
        console.log('DTO:', dto);
        
        const post = await fetch('https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/contratos', {
            method: 'POST',
            headers,
            body: JSON.stringify(dto)
        });
        
        if (!post.ok) {
            console.log('ERROR:', post.status, await post.text());
        } else {
            console.log('SUCCESS:', await post.text());
        }
    } catch (e) {
        console.error(e);
    }
}
run();
