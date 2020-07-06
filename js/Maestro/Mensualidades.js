
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
    await ListaPagos();
});

$(function () {
    $("#RutCompletar").autocomplete({
        source: "/Maestro/BuscarAlumno", minLength: 2

    });
});

document.getElementById('Agregar_pago').addEventListener('click', async () => {
    await RegistrarPago();
});

function format(input) {
    var num = input.value.replace(/\./g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
        input.value = num;
    }

    else {
        alert('Solo se permiten numeros');
        input.value = input.value.replace(/[^\d\.]*/g, '');
    }
}

const ListaPagos = async () => {
    let url = "../Maestro/ListaPagos";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();
    if (Resultado.RESPUESTA) {
        let tbodyPagos = document.getElementById('tbodyPagos');
        tbodyPagos.innerHTML = "";
        let contenido = "";

        let Pagos = Resultado.DATA;
        Pagos.forEach(Item => {
            let fecha_pago = moment(Item.FECHA_PAGO).format("DD/MM/YYYY HH:MM:SS");
            contenido += `<tr>
                            <td>${Item.NOMBRE_ALUMNO}</td>
                            <td>${fecha_pago}</td>
                            <td>${Item.ESTADO}</td>
                            <td>${Item.DESCRIPCION}</td>
                         </tr>`;
        });
        tbodyPagos.innerHTML = contenido;
    }
}

const RegistrarPago = async () => {


    let usuario = document.getElementById('RutCompletar');
    let Calendar = document.getElementById('Calendar');
    let Monto = document.getElementById('Monto');
    let Descripcion = document.getElementById('Descripcion');

    let url = "../Maestro/RegistarMensualidad";

    let data = { usuario: usuario.value, ano_mes: Calendar.value, monto: Monto.value, descripcion: Descripcion.value };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    console.log(Resultado);

    if (Resultado.RESPUESTA) {
        //muestro mensaje
        $("#exampleModal").modal("hide");
        await ListaPagos();
        Swal.fire(
            `Pago registrado!`,
            'El pago se ha registrado exitosamente!',
            'success'
        )
        await Clear();
    }

}

const Clear = async () => {

    document.getElementById('RutCompletar').value = "";
    document.getElementById('Calendar').value = "";
    document.getElementById('Monto').value = "";
    document.getElementById('Descripcion').value = "";
}