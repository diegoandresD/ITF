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
    await ListaInicial();
});

document.getElementById('ButtonTransferirAhorro').addEventListener('click', () => {
    RealizarPago();
});

const ListaInicial = async () => {
    let url = "../Alumno/ListaMovimientoCartera";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithData();

    console.log(Resultado);
    if (Resultado.RESPUESTA) {

        let data_resumen = Resultado.DATA.Cartera;
        await LlenarResumen(data_resumen);

        let data_movimientos = Resultado.DATA.Movimiento;
        await LlenarMovimientos(data_movimientos);

    }

}; 

const LlenarResumen = async (data) => {
    let tbodyCartera = document.getElementById('tbodyCartera');
    tbodyCartera.innerHTML = "";
    let contenedor = "";

        contenedor += `<tr>
                        <td>${data.TIPO_CUENTA}</td>
                        <td>${data.NRO_CUENTA}</td>
                        <td>${data.MONEDA}</td>
                        <td>${addCommas(data.SALDO)}</td>
                        <td><button onclick="AddSaldo(${data.ID_CARTERA})" class="btn btn-sm btn-success"><i class="fas fa-arrow-right"></i> Transferir</button></td>
                       </tr>`;
    tbodyCartera.innerHTML = contenedor;

};

const LlenarMovimientos = async (data) => {
    let TbodyMovimientos = document.getElementById('TbodyMovimientos');
    let contenido = "";
    data.forEach(Item => {
        let abono = "";
        let cargo = "";
        let fecha = moment(Item.FECHA).format("DD/MM/YYYY HH:MM:SS")
        if (Item.CARGO) {
            abono = "0";
            cargo = Item.SALDO;
        }
        else {
            abono = Item.SALDO;
            cargo = "0";
        }
        contenido += `<tr>
                        <td>${fecha}</td>
                        <td>${Item.CODIGO_OPERACION}</td>
                        <td>${Item.DESCRIPCION}</td>
                        <td>${addCommas(cargo)}</td>   
                        <td>${addCommas(abono)}</td>
                        <td>${addCommas(Item.SUBTOTAL)}</td>
                      </tr>`;
    });

    TbodyMovimientos.innerHTML = contenido;
}

const AddSaldo = (ID) => {
    $("#ModalAddSaldo").modal("show");
    //alert(ID);
};


const RealizarPago = () => {
    let Monto_transferir = document.getElementById('Monto_transferir');

    location.href = `../Alumno/GenerarPagoTotal?t=${Monto_transferir.value}`;
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}