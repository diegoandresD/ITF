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

    const FetchWithFormData = () => {
        return new Promise(Resolve => {
            return Resolve(
                fetch(_Ruta, {
                    method: 'POST',
                    body: _Datos,
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
        FetchWithOutData: FetchWithOutData,
        FetchWithFormData: FetchWithFormData
    };
}

window.addEventListener('load', async () => {
    await ListaPedidos();
});

document.getElementById('ButtonEntregaPedido').addEventListener('click', async () => {
    let valor = document.getElementById('ButtonEntregaPedido').value;
    
    await ProductoEntregado(valor);
});


const ListaPedidos = async () => {
    let url = "../Maestro/ListaPedidos";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithData();

    let tbody = document.getElementById('TbodyPedidos');
    tbody.innerHTML = "";

    let contenido = "";
    if (Resultado.RESPUESTA) {
        //listo;
        let Data = Resultado.DATA;

        Data.forEach(Item => {
            let fecha_formato = moment(Item.FECHA).format("DD/MM/YYYY HH:MM:SS");
            contenido += `<tr>
                            <td>${Item.ID_PEDIDO}</td>
                            <td>${Item.NOMBRE_USUARIO} <img src="/img/foto.jpg" width="30" height="30" class="rounded-circle img-fluid" alt=""></td>
                            <td>${fecha_formato}</td>
                            <td>
                                <button onclick="Detalle(${Item.ID_PEDIDO})" class="btn btn-sm btn-primary" title="Ver"><i class="fa fa-eye"></i></button>
                            </td>
                        </tr>`;
        });
        tbody.innerHTML = contenido;
    }
}

const Detalle = async (id) => {

    let url = "../Maestro/DetallePedido";
    let data = { ID: Number(id) };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    if (Resultado.RESPUESTA) {
        let TbodyDetallePedido = document.getElementById('TbodyDetallePedido');
        TbodyDetallePedido.innerHTML = "";
        let contenido = "";

        let detalle = Resultado.DATA;
        detalle.forEach(Item => {
            contenido += `<tr>
                                <td>${Item.COD_PRODUCTO}</td>
                                <td>${Item.NOMBRE_PRODUCTO}</td>
                                <td><img src="${Item.URL_IMAGEN}" style="width: 100px;height: 100px;" class="rounded-circle img-fluid" alt=""></td>
                                
                                <td>${Item.CANTIDAD}</td>
                                <td>$${addCommas(Item.PRECIO)}</td>
                                <td>$${addCommas(Item.SUBTOTAL)}</td>                               
                          </tr>`;
        });
        TbodyDetallePedido.innerHTML = contenido;

        document.getElementById('ButtonEntregaPedido').value = id;
    }

    $("#DetallePedido").modal("show");


}

const ProductoEntregado = async (ID) => {

    Swal.fire({
        title: '¿Estas seguro(a)?',
        text: "Realizarás la entrega del producto!",
        icon: 'danger',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!'

    }).then(async (result) => {
        if (result.value) {
            let url = "../Maestro/ProductoEntregado";
            let data = { ID: Number(ID) };
            const Fetchs = Fetch(url, data);
            const Resultado = await Fetchs.FetchWithData();
            if (Resultado.RESPUESTA) {

                await ListaPedidos();

                Swal.fire(
                    `Pedido entregado registrado satisfactoriamente`,
                )

                $("#DetallePedido").modal("hide");

            }
            else {
                //Haga otra cosa;
            }
        }
    })

    
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