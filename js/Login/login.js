function Fetch(Ruta, Data) {
    let _Ruta = Ruta;
    let _Datos = Data;

    const FetchWithData = () => {
        return new Promise(Resolve => {
            return Resolve(
                fetch(_Ruta, {
                    method: 'POST',
                    body: JSON.stringify(_Datos),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                    .then(response => response)
            );
        });
    };

    const FetchWithOutData = () => {
        return new Promise(Resolve => {
            return Resolve(
                fetch(_Ruta, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                    .then(response => response)
            );
        });
    };

    return {
        FetchWithData: FetchWithData,
        FetchWithOutData: FetchWithOutData
    };
}

window.addEventListener('load', async () => {

    document.getElementById('btn_login').addEventListener('click', async (e) => {

        e.preventDefault();

        let usuario = document.getElementById('Username').value;
        let contrasena = document.getElementById('Password').value;

        const url = "../Login/InicioSesion";
        let data = { user: usuario, pass: contrasena };
        let Fecths = Fetch(url, data);
        let Resultado = await Fecths.FetchWithData();

        if (Resultado.RESPUESTA) {
            alert('usuario logeado correctamente');
            window.location.href = "../Home/Index";
        }
        else {
            alert('Usuario y/o contraseña invalida');
        }

        document.getElementById('Username').value = "";
        document.getElementById('Password').value = "";
        

    });

});