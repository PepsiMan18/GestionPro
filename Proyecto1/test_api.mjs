async function run() {
    try {
        const login = await fetch('https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({Usuario: 'admin', Contrasena: 'admin123'})
        });
        const token = await login.text();
        console.log('Token length:', token.length);

        const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
        
        const resInms = await fetch('https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/inmuebles', {headers});
        const inmsRaw = await resInms.text();
        console.log('Inmuebles Raw:', inmsRaw.substring(0, 100));
        
        const inms = JSON.parse(inmsRaw);
        const inqs = await (await fetch('https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/inquilinos', {headers})).json();
        
        const idInmueble = inms.length > 0 ? inms[0].idInmueble : null;
        const idInquilino = inqs.length > 0 ? inqs[inqs.length - 1].idInquilino : null;
        
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
