var bouncejsShow = function (promise) {
    var n = this;
    new Bounce()
        .translate({
            from: { x: 450, y: 0 }, to: { x: 0, y: 0 },
            easing: 'bounce',
            duration: 1000,
            bounces: 4,
            stiffness: 3
        })
        .scale({
            from: { x: 1.2, y: 1 }, to: { x: 1, y: 1 },
            easing: 'bounce',
            duration: 1000,
            delay: 100,
            bounces: 4,
            stiffness: 1
        })
        .scale({
            from: { x: 1, y: 1.2 }, to: { x: 1, y: 1 },
            easing: 'bounce',
            duration: 1000,
            delay: 100,
            bounces: 6,
            stiffness: 1
        })
        .applyTo(n.barDom, {
            onComplete: function () {
                promise(function (resolve) {
                    resolve();
                });
            }
        });
};
var bouncejsClose = function (promise) {
    var n = this;
    new Bounce()
        .translate({
            from: { x: 0, y: 0 }, to: { x: 450, y: 0 },
            easing: 'bounce',
            duration: 500,
            bounces: 4,
            stiffness: 1
        })
        .applyTo(n.barDom, {
            onComplete: function () {
                promise(function (resolve) {
                    resolve();
                });
            }
        });
};

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
    await ListarAlumnos();
});



const ListarAlumnos = async () => {
    let url = "../Alumno/MisProgresiones";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();
    let TbodyProgresiones = document.getElementById('TbodyProgresiones');
    TbodyProgresiones.innerHTML = "";
    if (Resultado.RESPUESTA) {

        let Data = Resultado.DATA;


        let contenido = "";
        Data.forEach(Item => {
            let fecha = moment(Item.FECHA_REALIZACION).format("DD-MM-YYYY");
            contenido += `<tr>
                            <td>${Item.ID_EXAMEN}</td>
                            <td>${Item.NOMBRE_COMPLETO}</td>
                            <td>${Item.NOMBRE_GRADO}</td>
                            <td>${Item.NOMBRE_FORMA}</td>
                            <td>${fecha}</td>
                            <td>${Item.DEFENSA_PERSONAL}</td>
                            <td>${Item.EJERCICIOS_F_F_F}</td>
                            <td>${Item.ROTURA}</td><td>${Item.TEORIA}</td>
                        </tr>`;
        });

        TbodyProgresiones.innerHTML = contenido;
    }
}; 