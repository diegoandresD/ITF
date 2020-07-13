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
    await ListarEventos();
});

document.getElementById('ButtonAddEvento').addEventListener('click', () => {
    $("#ModalAddEvento").modal("show");
});

document.getElementById('GuardarEvento').addEventListener('click', async () => {
    await CrearEvento();
});

jQuery(document).ready(function ($) {
    if (window.jQuery().datetimepicker) {
        $('#FechaEvento').datetimepicker({
            //locale: 'es',
            // Formats
            // follow MomentJS docs: https://momentjs.com/docs/#/displaying/format/
            format: 'DD-MM-YYYY HH:mm',
            icons: {
                time: 'fas fa-clock',
                date: 'fas fa-calendar',
                up: 'fas fa-chevron-up',
                down: 'fas fa-chevron-down',
                previous: 'fas fa-chevron-left',
                next: 'fas fa-chevron-right',
                today: 'fas fa-check',
                clear: 'fas fa-trash',
                close: 'fas fa-times',

            }
        });
    }
});

const ListarEventos = async () => {
    let tbody = document.getElementById('TbodyEventos');
    let url = "../Funcionario/ListaEventos";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();
    if (Resultado.RESPUESTA) {
        let DATA = Resultado.DATA;
        let contenido = ""; 
        DATA.forEach(Item => {
            let fecha = moment(Item.FECHA).locale('es').format('LLL');
            contenido += `<tr><td>${Item.ID_EVENTO}</td>
                                <td>${Item.TITULO}</td>
                                <td>${fecha}</td>
                                <td>${Item.DESCRIPCION_CORTA}</td>
                                <td>${Item.UBICACION}</td>
                                <td><button class="btn btn-danger btn-sm" onclick="EliminarEvento(${Item.ID_EVENTO})">Eliminar <i class="fas fa-trash-alt"></i></button></td>
                            </tr>`;
        });

        tbody.innerHTML = contenido;

    }



};

const CrearEvento = async () => {
    let TituloAdd = document.getElementById('TituloAdd');
    let FechaEvento = document.getElementById('FechaEvento').value;
    let ValorEvento = document.getElementById('ValorEvento');
    let UbicacionEventoAdd = document.getElementById('UbicacionEventoAdd');
    let FileEventoAdd = document.getElementById('FileEventoAdd');
    let DescripcionCortaAdd = document.getElementById('DescripcionCortaAdd');
    let DescripcionDetalladaAdd = document.getElementById('DescripcionDetalladaAdd');

    let fechaa = FechaEvento.substring(6, 10) + "-" + FechaEvento.substring(3, 5) + "-" + FechaEvento.substring(0, 2);
    let horaa = FechaEvento.substring(11, 16) + ":00";
    let fechaa_horaa = fechaa + " " + horaa;

    //let formato_fecha = Date.parse(FechaEvento.value);

    let EVENTO = new Object();
    EVENTO.TITULO = TituloAdd.value;
    EVENTO.FECHA = fechaa_horaa;
    EVENTO.DESCRIPCION_CORTA = DescripcionCortaAdd.value;
    EVENTO.DESCRIPCION_DETALLADA = DescripcionDetalladaAdd.value;
    EVENTO.UBICACION = UbicacionEventoAdd.value;
    EVENTO.VALOR = Number(ValorEvento.value);

    let data = { EVENTO: EVENTO };

    let url = "../Funcionario/AgregarEvento";
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    if (Resultado.RESPUESTA) {
        let DATA = Resultado.DATA;
        await AgregarImagen(DATA.ID_EVENTO, FileEventoAdd.files[0]);

        await ListarEventos();

    }
};

const AgregarImagen = async (ID, ARCHIVO) => {

    var formData = new FormData();
    formData.append("ARCHIVO", ARCHIVO)
    formData.append("ID", ID)

    await fetch('../Funcionario/AgregarFotoAlEvento', {
        method: "POST",
        body: formData,
        headers: {
        }
    }).then(response => response.text())
        .then(response => {
            var d = JSON.parse(response);
            if (d.RESPUESTA) {
                $("#ModalAddEvento").modal("hide");
                swal.fire({
                    title: "Agregado!",
                    text: `El evento ha sido agregado correctamente`
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salio mal..!'
                })
            }
            //document.getElementById('FileFotoProfesional').value = "";
        })
};

const EliminarEvento = async (ID) => {

    Swal.fire({
        title: '¿Estas seguro(a)?',
        text: "el evento se eliminará",
        icon: 'danger',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'

    }).then(async (result) => {
        if (result.value) {
            let url = "../Funcionario/AnularEvento";
            let data = { ID: ID };
            const Fetchs = Fetch(url, data);
            const Resultado = await Fetchs.FetchWithData();

            if (Resultado.RESPUESTA) {
                Swal.fire(
                    `Evento eliminado correctamente`,
                )

                await ListarEventos();
            }
        }
        else {
        }
    })


    
};