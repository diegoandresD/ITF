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

window.addEventListener('load', async () => {
    await ListarMaestros();
    await ListarAcademiasSinMaestro();
});

document.getElementById('ButtonAgregarMaestro').addEventListener('click', async () => {
    $("#ModalAddMaestro").modal("show");

});

document.getElementById('ButtonAgregarAcademia').addEventListener('click', async () => {
    $("#ModalAddAcademia").modal("show");
});


document.getElementById('Agregar_maestro').addEventListener('click', async () => {
    await AgregarMaestro();
});

document.getElementById('Agregar_academia').addEventListener('click', async () => {
    await AgregarAcademia();
});

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


const ListarMaestros = async () => {
    let url = "../Funcionario/ListaMaestros";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();
    let TbodyMaestro = document.getElementById('TbodyMaestro');
    if (Resultado.RESPUESTA) {
        let contenido = "";
        let DATA = Resultado.DATA;
        DATA.forEach(Item => {
            let Acciones = "";

            if (Item.ACTIVO) {
                Acciones = `<button class="btn btn-sm btn-danger" onclick="DesactivarUsuario(${Item.ID_USUARIO})">Desactivar</button>`
            }
            else {
                Acciones = `<button class="btn btn-sm btn-success" onclick="ActivarUsuario(${Item.ID_USUARIO})">Activar</button>`
            }
            let Formato_fecha = moment(Item.FECHA_NACIMIENTO).format("DD-MM-YYYY")
            contenido += `<tr>
                            <td>${Item.RUT}</td>
                            <td>${Item.NOMBRE}</td>
                            <td>${Item.APELLIDO_PATERNO} ${Item.APELLIDO_MATERNO}</td>
                            <td>${Formato_fecha}</td>
                            <td>${Item.CORREO_ELECTRONICO}</td>
                            <td>${Item.TELEFONO}</td>
                            <td>${Acciones}</td>
                         </tr>`;
        });
        TbodyMaestro.innerHTML = contenido;
    }
};

const ListarAcademiasSinMaestro = async () => {
    let url = "../Funcionario/ListaAcademiasRestantes";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();
    if (Resultado.RESPUESTA) {
        let AcademiaAddMaestro = document.getElementById('AcademiaAddMaestro');
        AcademiaAddMaestro.innerHTML = "";
        let DATA = Resultado.DATA;

        for (var i = 0; i < DATA.length; i++) {
            let datoss = DATA[i];
            let option = document.createElement('option');
            option.value = datoss.ID_ACADEMIA;
            option.appendChild(document.createTextNode(datoss.NOMBRE_ACADEMIA));

            AcademiaAddMaestro.appendChild(option);
        }

    }
}

const DesactivarUsuario = async (ID) => {

    Swal.fire({
        title: '¿Estas seguro(a)?',
        text: "Desactivarás al usuario!",
        icon: 'danger',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, desactivar!'

    }).then(async (result) => {
        if (result.value) {
            let url = "../Funcionario/DesactivarUsuario";
            let data = { ID: ID };
            const Fetchs = Fetch(url, data);
            const Resultado = await Fetchs.FetchWithData();
            if (Resultado.RESPUESTA) {
                Swal.fire(
                    `Usuario Anulado`,
                )

                await ListarMaestros();
            }



        }
    })



}

const ActivarUsuario = async (ID) => {

    Swal.fire({
        title: '¿Estas seguro(a)?',
        text: "Activarás al usuario!",
        icon: 'danger',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Activar!'

    }).then(async (result) => {
        if (result.value) {

            let url = "../Funcionario/ActivarUsuario";
            let data = { ID: ID };
            const Fetchs = Fetch(url, data);
            const Resultado = await Fetchs.FetchWithData();
            if (Resultado.RESPUESTA) {
                Swal.fire(
                    `Usuario Activado`,
                )

                await ListarMaestros();
            }



        }
    })



}

const AgregarAcademia = async () => {
    let NombreAddAcademia = document.getElementById('NombreAddAcademia');
    let TelefonoAddAcademia = document.getElementById('TelefonoAddAcademia');
    let CorreoAddAcademia = document.getElementById('CorreoAddAcademia');
    let DireccionAddAcademia = document.getElementById('DireccionAddAcademia');
    let HorariosAddAcademia = document.getElementById('HorariosAddAcademia');

    let ACADEMIA = new Object();
    ACADEMIA.NOMBRE_ACADEMIA = NombreAddAcademia.value;
    ACADEMIA.TELEFONO = TelefonoAddAcademia.value;
    ACADEMIA.CORREO_ELECTRONICO = CorreoAddAcademia.value;
    ACADEMIA.DIRECCION = DireccionAddAcademia.value;
    ACADEMIA.HORARIOS = HorariosAddAcademia.value;

    let url = "../Funcionario/CrearAcademia";
    let data = { ACADEMIA: ACADEMIA };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    if (Resultado.RESPUESTA) {
        Swal.fire(
            `Academia creada correctamente`,
        )
        $("#ModalAddAcademia").modal("hide");
        await ListarMaestros();
        await ListarAcademiasSinMaestro();
    }


};

const AgregarMaestro = async () => {
    let RutAddMaestro = document.getElementById('RutAddMaestro');
    let NombreAddMaestro = document.getElementById('NombreAddMaestro');
    let ApaternoAddMaestro = document.getElementById('ApaternoAddMaestro');
    let AmaternoAddMaestro = document.getElementById('AmaternoAddMaestro')
    let FechaNacAddMaestro = document.getElementById('FechaNacAddMaestro');
    let GeneroAddMaestro = document.getElementById('GeneroAddMaestro');
    let UsuarioAddMaestro = document.getElementById('UsuarioAddMaestro');
    let CorreoAddMaestro = document.getElementById('CorreoAddMaestro');
    let TelefonoAddMaestro = document.getElementById('TelefonoAddMaestro');
    let DireccionAddMaestro = document.getElementById('DireccionAddMaestro');
    let AcademiaAddMaestro = document.getElementById('AcademiaAddMaestro');

    let MAESTRO = new Object();
    MAESTRO.RUT = RutAddMaestro.value;
    MAESTRO.NOMBRE = NombreAddMaestro.value;
    MAESTRO.APELLIDO_PATERNO = ApaternoAddMaestro.value;
    MAESTRO.APELLIDO_MATERNO = AmaternoAddMaestro.value;

    //FECHA NACIMIENTO;
    MAESTRO.FECHA_NACIMIENTO = FechaNacAddMaestro.value;

    MAESTRO.COD_GENERO = GeneroAddMaestro.value;
    MAESTRO.NOMBRE_USUARIO = UsuarioAddMaestro.value;
    MAESTRO.CORREO_ELECTRONICO = CorreoAddMaestro.value;
    MAESTRO.TELEFONO = TelefonoAddMaestro.value;
    MAESTRO.DIRECCION = DireccionAddMaestro.value;
    MAESTRO.COD_ADADEMIA_ACTUAL = Number(AcademiaAddMaestro.value);


    let url = "../Funcionario/CrearMaestro";
    let data = { MAESTRO: MAESTRO };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    if (Resultado.RESPUESTA) {
        Swal.fire(
            `Maestro creado correctamente`,
        )
        $("#ModalAddMaestro").modal("hide");
        await ListarMaestros();
        await ListarAcademiasSinMaestro();
    }
};
