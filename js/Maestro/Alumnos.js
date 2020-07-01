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
    let url = "../Maestro/ListaMisAlumno";

    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithData();
    console.log(Resultado);

    let tbody = document.getElementById('TbodyAlumnos');

    let data_alumno = Resultado.DATA;

    let arreglo = "";
    data_alumno.forEach(item => {
        let fecha = moment(item.FECHA_NACIMIENTO).format('DD-MM-YYYY');
        let nombre = item.NOMBRE + " " + item.APELLIDO_PATERNO;


        //let button = document.createElement('button');
        //button.setAttribute("onclick", "eded");
        //button.setAttribute("title", "");
        //let icon = document.createElement('i');
        //icon.className = "fas fa-user-times";
        //button.appendChild(icon);
        //let texto = document.createTextNode(" Aceptar");
        //button.appendChild(texto);

        let buton_activo = "";
        if (item.ACTIVO) {
            buton_activo = `<button onclick='AnularAlumno(${item.ID_USUARIO},this)' title='Anular' class='btn btn-sm btn-danger'><i class="fas fa-user-minus"></i></button>`;
        }
        else {
            buton_activo = `<button onclick='ActivarAlumno(${item.ID_USUARIO},this)' title='Activar' class='btn btn-sm btn-success'><i class="fas fa-user-plus"></i></button>`
        }
        arreglo += `<tr>
                          <td>${item.RUT}</td>
                          <td>${nombre} </td>
                          <td>${fecha}</td>
                          <td>${item.CORREO_ELECTRONICO}</td>
                          <td>${item.DIRECCION}</td>
                          <td>
                              <button onclick='VerDetalle(${item.ID_USUARIO})' title='Ver' class='btn btn-sm btn-info'><i class="fas fa-eye"></i></button> 
                              <button onclick='TransferirAlumno(${item.ID_USUARIO})' title='Transferir' class='btn btn-sm btn-primary'><i class="fas fa-paper-plane"></i></button>
                              ${buton_activo}
                          </td>
                       </tr>`;
    });


    tbody.innerHTML = arreglo;


    await ListaAcademias();
    await ListaGeneros();

});

const VerDetalle = async (id) => {
    let url = '../Maestro/DetalleAlumno';
    let data = { ID: Number(id) };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();

    let RutVer = document.getElementById('RutVer');
    let NombresVer = document.getElementById('NombresVer');
    let PaternoVer = document.getElementById('PaternoVer');
    let MaternoVer = document.getElementById('MaternoVer');
    let FechaNacVer = document.getElementById('FechaNacVer');
    let GeneroVer = document.getElementById('GeneroVer');
    let CorreoVer = document.getElementById('CorreoVer');
    let TelefonoVer = document.getElementById('TelefonoVer');
    let TelefonoContactoVer = document.getElementById('TelefonoContactoVer');
    let DireccionVer = document.getElementById('DireccionVer');

    let GuardarAlumno = document.getElementById('GuardarAlumno');


    if (Resultado.RESPUESTA) {

        let titulo_nombre = document.getElementById('AlumnoNombre');
        let datos = Resultado.DATA;
        titulo_nombre.innerHTML = "";
        titulo_nombre.appendChild(document.createTextNode(datos.NOMBRE + ' ' + datos.APELLIDO_PATERNO));

        RutVer.value = datos.RUT;
        NombresVer.value = datos.NOMBRE;
        PaternoVer.value = datos.APELLIDO_PATERNO;
        MaternoVer.value = datos.APELLIDO_MATERNO;
        FechaNacVer.value = moment(datos.FECHA_NACIMIENTO).format("DD/MM/YYYY");
        CorreoVer.value = datos.CORREO_ELECTRONICO;
        TelefonoVer.value = datos.TELEFONO;
        TelefonoContactoVer.value = datos.TELEFONO_CONTACTO;
        DireccionVer.value = datos.DIRECCION;
        GeneroVer.value = datos.COD_GENERO;
        GuardarAlumno.value = datos.ID_USUARIO;

        $('#VerAlumno').modal('show');
    }

};

//Es Editar alumno me aweone;
document.getElementById('GuardarAlumno').addEventListener('click', async () => {
    let RutVer = document.getElementById('RutVer');
    let NombresVer = document.getElementById('NombresVer');
    let PaternoVer = document.getElementById('PaternoVer');
    let MaternoVer = document.getElementById('MaternoVer');
    let FechaNacVer = document.getElementById('FechaNacVer');
    let GeneroVer = document.getElementById('GeneroVer');
    let CorreoVer = document.getElementById('CorreoVer');
    let TelefonoVer = document.getElementById('TelefonoVer');
    let TelefonoContactoVer = document.getElementById('TelefonoContactoVer');
    let DireccionVer = document.getElementById('DireccionVer');
    let GuardarAlumno = document.getElementById('GuardarAlumno');

    let Errores = 0;

    let ALUMNO = new Object();
    ALUMNO.RUT = RutVer.value;
    ALUMNO.NOMBRE = NombresVer.value;
    ALUMNO.APELLIDO_PATERNO = PaternoVer.value;
    ALUMNO.APELLIDO_MATERNO = MaternoVer.value;
    ALUMNO.FECHA_NACIMIENTO = FechaNacVer.value;
    ALUMNO.COD_GENERO = GeneroVer.value;
    ALUMNO.CORREO_ELECTRONICO = CorreoVer.value;
    ALUMNO.TELEFONO = TelefonoVer.value;
    ALUMNO.TELEFONO_CONTACTO = TelefonoContactoVer.value;
    ALUMNO.DIRECCION = DireccionVer.value;
    ALUMNO.ID_USUARIO = GuardarAlumno.value;
    let url = '../Maestro/EditarAlumno';
    let data = { _user: ALUMNO };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();

    console.log(Resultado);
    if (Resultado.RESPUESTA) {

        $('#VerAlumno').modal('hide');

        new Noty({
            text: '<strong>Información</strong><br />Alumno modificado correctamente.<br /> ',
            type: 'info',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }
    else {
        new Noty({
            text: `<strong>Información</strong><br />Alumno No pudo se modificado.<br /> Detalle error: ${Error}<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

});

//Este si es agregar alumno;
document.getElementById('AgregarAlumno').addEventListener('click', async () => {

    let Rut = document.getElementById('AddRut');
    let Nombres = document.getElementById('AddNombres');
    let NombreUsuario = document.getElementById('AddNombreUsuario');
    let Paterno = document.getElementById('AddPaterno');
    let Materno = document.getElementById('AddMaterno');
    let FechaNac = document.getElementById('AddFechaNac');
    let Genero = document.getElementById('AddGenero');
    let Correo = document.getElementById('AddCorreo');
    let Telefono = document.getElementById('AddTelefono');
    let TelefonoContacto = document.getElementById('AddTelefonoContacto');
    let Direccion = document.getElementById('AddDireccion');
    let Academia = document.getElementById('AddAcademia');

    let Errores = 0;
    if (Rut.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar el Rut.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Nombres.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar el Nombre.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (NombreUsuario.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar el Nombre usuario.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Paterno.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar el Apellido paterno.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Materno.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar el Apellido materno.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (FechaNac.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar la Fecha de nacimiento.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Genero.value === "0") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes seleccionar el Genero.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Correo.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar el Correo electrónico.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Telefono.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar el Telefono.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (TelefonoContacto.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar el Telefono de contácto.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Direccion.value === "") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar la Dirección.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Academia.value === "0") {
        Errores += 1;
        new Noty({
            text: `<strong>Información</strong><br />Debes ingresar la Academia.<br />`,
            type: 'error',
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();
    }

    if (Errores === 0) {
        let ALUMNO = new Object();
        ALUMNO.RUT = Rut.value;
        ALUMNO.NOMBRE = Nombres.value;
        ALUMNO.APELLIDO_PATERNO = Paterno.value;
        ALUMNO.APELLIDO_MATERNO = Materno.value;
        ALUMNO.FECHA_NACIMIENTO = FechaNac.value;
        ALUMNO.COD_GENERO = Genero.value;
        ALUMNO.CORREO_ELECTRONICO = Correo.value;
        ALUMNO.TELEFONO = Telefono.value;
        ALUMNO.TELEFONO_CONTACTO = TelefonoContacto.value;
        ALUMNO.DIRECCION = Direccion.value;
        ALUMNO.COD_ADADEMIA_ACTUAL = Academia.value;
        ALUMNO.NOMBRE_USUARIO = NombreUsuario.value;
        let url = '../Maestro/AgregarAlumno';
        let data = { _user: ALUMNO };
        const Fetchs = Fetch(url, data);
        const Resultado = await Fetchs.FetchWithData();
    }






});
//Fin editar alumno;


async function ListaAcademias() {
    let url = '../Maestro/ListaAcademias';
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();

    console.log(Resultado);

    if (Resultado.RESPUESTA) {
        let padre = document.getElementById('AddAcademia');
        let padre2 = document.getElementById('AcademiaTrasferencia');

        let datos = Resultado.DATA;

        for (var i = 0; i < datos.length; i++) {
            let option = document.createElement('option');
            option.value = datos[i].COD_ACADEMIA;
            option.appendChild(document.createTextNode(datos[i].NOMBRE_ACADEMIA));
            padre.appendChild(option);
            padre2.appendChild(option.cloneNode(true));
        }
        
    }

}

async function ListaGeneros() {
    let url = '../Maestro/ListaGeneros';
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();
    if (Resultado.RESPUESTA) {
        let padre = document.getElementById('AddGenero');

        let datos = Resultado.DATA;

        for (var i = 0; i < datos.length; i++) {

            let option = document.createElement('option');
            option.value = datos[i].ID_GENERO;
            option.appendChild(document.createTextNode(datos[i].NOMBRE_GENERO));

            padre.appendChild(option);

        }
    }


}

const AnularAlumno = async (id, button) => {

    Swal.fire({
        title: '¿Estas seguro(a)?',
        text: "Desactivarás al usuario!",
        icon: 'danger',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Anular!'

    }).then(async (result) => {
        if (result.value) {
            let url = "../Maestro/AnularAlumno";
            let data = { ID: Number(id) };
            const Fetchs = Fetch(url, data);
            const Resultado = await Fetchs.FetchWithData();
            if (Resultado.RESPUESTA) {
                let icon = button.firstChild;

                button.classList.remove('btn-danger');
                button.classList.add('btn-success');
                button.setAttribute("onclick", `ActivarAlumno(${id},this)`);
                button.setAttribute("title", "Activar");

                icon.classList.remove("fa-user-minus");
                icon.classList.add("fa-user-plus");

                Swal.fire(
                    `Alumno ${Resultado.DATA.NOMBRE} Anulado`,
                )
            }
            else {
                //Haga otra cosa;
            }
        }
    })
}

const ActivarAlumno = async (id, button) => {

    Swal.fire({
        title: '¿Estas seguro(a)?',
        text: "Activarás al usuario!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Activar!'

    }).then(async (result) => {
        if (result.value) {
            let url = "../Maestro/ActivarAlumno";
            let data = { ID: Number(id) };
            const Fetchs = Fetch(url, data);
            const Resultado = await Fetchs.FetchWithData();
            if (Resultado.RESPUESTA) {
                let icon = button.firstChild;

                button.classList.remove('btn-success');
                button.classList.add('btn-danger');
                button.setAttribute("onclick", `AnularAlumno(${id},this)`);
                button.setAttribute("title", "Anular");

                icon.classList.remove("fa-user-plus");
                icon.classList.add("fa-user-minus");

                Swal.fire(
                    `Alumno ${Resultado.DATA.NOMBRE} Activado`,
                )
            }
            else {
                //Haga otra cosa;
            }
        }
    })
}

const TransferirAlumno = async (id) => {
    $("#TransferirAlumno").modal("show");
};


const EditarProducto = async (ID) =>
{

}