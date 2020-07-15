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
    await ListarAcademias();

});

document.getElementById('Academias').addEventListener('change', async () => {
    await ListaAlumno();

});

document.getElementById('AlumnoSelect').addEventListener('change', async () => {
    await ListaExamenes();

});

document.getElementById('ButtonBuscarRut').addEventListener('click', async () => {
    await ListaExamenesPorRut();
});



const ListarAcademias = async () => {
    let url = "../Funcionario/ListaAcademias";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();

    if (Resultado.RESPUESTA) {
        let DATA = Resultado.DATA;
        let Academias = document.getElementById('Academias');
        DATA.forEach(Item => {
            let option = document.createElement('option');
            option.value = Item.ID_ACADEMIA;

            option.appendChild(document.createTextNode(Item.NOMBRE_ACADEMIA));
            Academias.appendChild(option);
        });
    }

}

const ListaAlumno = async () => {
    let id = document.getElementById('Academias').value;
    if (id !== "0") {

        let url = "../Funcionario/ListaAlumnoAcademia";
        let data = { ID: Number(id) };
        const Fetchs = Fetch(url, data);


        let AlumnoSelect = document.getElementById('AlumnoSelect');
        AlumnoSelect.innerHTML = "<option value'0'>--Seleccione--</option>";

        const Resultado = await Fetchs.FetchWithData();
        if (Resultado.RESPUESTA) {

            let DATA = Resultado.DATA;

            DATA.forEach(Item => {
                let nombre = Item.NOMBRE + " " + Item.APELLIDO_PATERNO + " " + Item.APELLIDO_MATERNO;
                let option = document.createElement('option');
                option.value = Item.ID_USUARIO;
                option.appendChild(document.createTextNode(nombre))

                AlumnoSelect.appendChild(option);

            });
        }

    }
};

const ListaAlumnoRut = async () => {
    let rut = document.getElementById('RutBusqueda').value;
    if (rut !== "0") {

        let url = "../Funcionario/BusquedaRutAlumno";
        let data = { RUT: rut };
        const Fetchs = Fetch(url, data);


        let AlumnoSelect = document.getElementById('AlumnoSelect');
        AlumnoSelect.innerHTML = "<option value'0'>--Seleccione--</option>";

        const Resultado = await Fetchs.FetchWithData();
        if (Resultado.RESPUESTA) {

            let DATA = Resultado.DATA;

            DATA.forEach(Item => {
                let nombre = Item.NOMBRE + " " + Item.APELLIDO_PATERNO + " " + Item.APELLIDO_MATERNO;
                let option = document.createElement('option');
                option.value = Item.ID_USUARIO;
                option.appendChild(document.createTextNode(nombre))

                AlumnoSelect.appendChild(option);

            });
        }

    }
};


const ListaExamenes = async () => {

    let AlumnoSelect = document.getElementById('AlumnoSelect');
    if (AlumnoSelect.value !== "0") {
        let url = "../Funcionario/BusquedaIdAlumno";
        let data = { ID: Number(AlumnoSelect.value) };
        const Fetchs = Fetch(url, data);
        const Resultado = await Fetchs.FetchWithData();
        if (Resultado.RESPUESTA) {
            let DATA = Resultado.DATA;
            await LlenarExamenes(DATA);
        }

    }

};

const ListaExamenesPorRut = async () => {
    let rut = document.getElementById('RutBusqueda').value;

    if (rut.value !== "") {
        let url = "../Funcionario/BusquedaRutAlumno";
        let data = { RUT: rut };
        const Fetchs = Fetch(url, data);
        const Resultado = await Fetchs.FetchWithData();
        if (Resultado.RESPUESTA) {
            let DATA = Resultado.DATA;
            await LlenarExamenes(DATA);
        }

    }

};

const LlenarExamenes = (data) => {

    let TbodyExamenes = document.getElementById('TbodyExamenes');
    if (data.length > 0) {
        let contenido = "";
        data.forEach(Item => {
            let fecha = moment(Item.FECHA_REALIZACION).format("DD-MM-YYYY");
            contenido += `<tr>
                            <td>${Item.COD_USUARIO}</td>
                            <td>${Item.NOMBRE_ALUMNO}</td>
                            <td>${Item.NOMBRE_GRADO}</td>
                            <td>${Item.NOMBRE_FORMA}</td>
                            <td>${fecha}</td>
                            <td>${Item.EJERCICIOS_F_F_F}</td>
                            <td>${Item.ROTURA}</td>

                          </tr>`;
        });

        TbodyExamenes.innerHTML = contenido;
    }
    else {
        TbodyExamenes.innerHTML = "<tr><td colspan='11'>Alumno no presenta historial de exámenes</td></tr>"
    }
}