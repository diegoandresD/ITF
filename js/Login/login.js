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

window.addEventListener('load', () => {

    document.getElementById('btn_login').addEventListener('click', async function (e) {

        let usuario = document.getElementById('Username').value;
        let clave = document.getElementById('Password').value;
        let Errores = 0;

        if (usuario === "") {
            Errores += 1;
            new Noty({
                text: `<strong>Atención!</strong><br />Debe ingresar el nombre de usuario<br />Detalle error: ${Error}<br /> `,
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

        if (clave === "") {
            Errores += 1;
            new Noty({
                text: '<strong>Atención!</strong><br />Debe ingresar la contraseña de usuario<br /> ',
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
            let noty;
            let Tipo;
            if (document.getElementById('btn_login').classList.contains('alumno')) {
                Tipo = 1;
                noty = "success";
            }
            else if (document.getElementById('btn_login').classList.contains('directivo')) {
                Tipo = 3;
                noty = "error";
            }
            else if (document.getElementById('btn_login').classList.contains('maestro')) {
                Tipo = 2;
                noty = "info";
            }

            let url = "../Login/InicioSesion";
            let datos = { user: usuario, pass: clave, tipo: Number(Tipo) };

            const Fetchs = Fetch(url, datos);
            const Resultado = await Fetchs.FetchWithData();
            console.log(Resultado);

            if (Resultado.RESPUESTA) {

                if (Resultado.data.ACTIVO === false) {
                    new Noty({
                        text: '<strong>Usuario NO activo, contácte con su maestro</strong><br />--<br /> ',
                        type: 'error',
                        theme: 'sunset',
                        layout: 'topRight',
                        timeout: 4000,
                        animation: {
                            open: bouncejsShow,
                            close: bouncejsClose
                        }
                    }).show();

                    return false;
                }

                if (Resultado.data.PRIMERA_VEZ) {



                    await ListaPreguntas();
                    $("#ModalPreguntas").modal("show");
                    return false;


                }
                else {
                    //Preguntas de seguridad;

                    await ListaPreguntasIngreso();
                    return false;
                }


                new Noty({
                    text: '<strong>Ingresado correctamente</strong><br /> Redireccionando..<br /> ',
                    type: noty,
                    theme: 'sunset',
                    layout: 'topRight',
                    timeout: 4000,
                    animation: {
                        open: bouncejsShow,
                        close: bouncejsClose
                    }
                }).show();

                if (Resultado.data.COD_TIPO_USUARIO === 1) {
                    setTimeout(() => {
                        window.location.href = "../Alumno/Home";
                    }, 2000);
                }
                else if (Resultado.data.COD_TIPO_USUARIO === 2) {
                    setTimeout(() => {
                        window.location.href = "../Maestro/Home";
                    }, 2000);
                }
                else if (Resultado.data.COD_TIPO_USUARIO === 3) {
                    setTimeout(() => {
                        window.location.href = "../Funcionario/Home";
                    }, 2000);
                }

            }
            else {

                new Noty({
                    text: '<strong>Usuario o contraseña invalida</strong><br />--<br /> ',
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
        }

    });

});

document.getElementById('ButtonGuardarPreguntas').addEventListener('click', async () => {
    //registrar preguntas;
    let respuesta = document.getElementsByClassName('preguntas');
    let Username = document.getElementById('Username');
    let Password = document.getElementById('Password');


    let array = [];
    for (var i = 0; i < respuesta.length; i++) {
        array.push({ RESPUESTA: respuesta[i].value, COD_PREGUNTA: respuesta[i].id });
    }

    let url = "../Login/RespuestaPrimeraVez";
    let data = { RESPUESTAS: array, Username: Username.value, Password: Password.value };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();

    if (Resultado.RESPUESTA) {
        let noty;
        let Tipo;
        if (document.getElementById('btn_login').classList.contains('alumno')) {
            Tipo = 1;
            noty = "success";
        }
        else if (document.getElementById('btn_login').classList.contains('directivo')) {
            Tipo = 3;
            noty = "error";
        }
        else if (document.getElementById('btn_login').classList.contains('maestro')) {
            Tipo = 2;
            noty = "info";
        }

        new Noty({
            text: '<strong>Ingresado correctamente</strong><br /> Redireccionando..<br /> ',
            type: noty,
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();

        if (Resultado.data.COD_TIPO_USUARIO === 1) {
            setTimeout(() => {
                window.location.href = "../Alumno/Home";
            }, 2000);
        }
        else if (Resultado.data.COD_TIPO_USUARIO === 2) {
            setTimeout(() => {
                window.location.href = "../Maestro/Home";
            }, 2000);
        }
        else if (Resultado.data.COD_TIPO_USUARIO === 3) {
            setTimeout(() => {
                window.location.href = "../Funcionario/Home";
            }, 2000);
        }


    }



})

document.getElementById('CompararRespuestas').addEventListener('click', async () => {
    await compararRespuestaIngresadas();
});


const ListaPreguntas = async () => {
    let url = "../Login/ListaPreguntas";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();

    let ContenidoPreguntas = document.getElementById('ContenidoPreguntas');
    ContenidoPreguntas.innerHTML = "";
    let Contenedor = "";

    if (Resultado.RESPUESTA) {
        //Lista preguntas
        let data = Resultado.DATA;
        data.forEach(Item => {
            Contenedor += `<div class="container"><span class="col-lg-12">${Item.PREGUNTA}</span>
                        <input id="${Item.ID_PREGUNTAS}" class="col-lg-12 preguntas form-control" type="text" name="${Item.ID_PREGUNTAS}" placeholder="Ingrese su respuesta"></div>`;
        })

        ContenidoPreguntas.innerHTML = Contenedor;
    }


}




const ListaPreguntasIngreso = async () => {
    let Username = document.getElementById('Username');
    let Password = document.getElementById('Password');

    let url = "../Login/ListaRespuestaUsuario";
    let data = { usuario: Username.value, contrasena: Password.value };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();

    let ContenidoPreguntas = document.getElementById('ContenidoPreguntasIngreso');
    ContenidoPreguntas.innerHTML = "";
    let Contenedor = "";

    if (Resultado.RESPUESTA) {
        //Lista preguntas
        let data = Resultado.DATA;
        data.forEach(Item => {
            Contenedor += `<div class="container"><span class="col-lg-12">${Item.PREGUNTA}</span>
                        <input id="${Item.ID_PREGUNTAS}" class="col-lg-12 respuestas form-control" type="text" name="${Item.ID_PREGUNTAS}" placeholder="Ingrese su respuesta"></div>`;
        })

        ContenidoPreguntas.innerHTML = Contenedor;
    }


    $("#ModalPreguntasIngreso").modal("show");

}

const compararRespuestaIngresadas = async () => {
    let respuesta = document.getElementsByClassName('respuestas');
    let Username = document.getElementById('Username');
    let Password = document.getElementById('Password');


    let array = [];
    for (var i = 0; i < respuesta.length; i++) {
        array.push({ RESPUESTA: respuesta[i].value, COD_PREGUNTA: respuesta[i].id });
    }

    let url = "../Login/ValidarRespuestas";
    let data = { RESPUESTAS: array, usuario: Username.value, contrasena: Password.value };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();

    if (Resultado.RESPUESTA) {
        //Respuesta correctas;
        let noty;
        let Tipo;
        if (document.getElementById('btn_login').classList.contains('alumno')) {
            Tipo = 1;
            noty = "success";
        }
        else if (document.getElementById('btn_login').classList.contains('directivo')) {
            Tipo = 3;
            noty = "error";
        }
        else if (document.getElementById('btn_login').classList.contains('maestro')) {
            Tipo = 2;
            noty = "info";
        }

        new Noty({
            text: '<strong>Ingresado correctamente</strong><br /> Redireccionando..<br /> ',
            type: noty,
            theme: 'sunset',
            layout: 'topRight',
            timeout: 4000,
            animation: {
                open: bouncejsShow,
                close: bouncejsClose
            }
        }).show();

        if (Resultado.DATA.COD_TIPO_USUARIO === 1) {
            setTimeout(() => {
                window.location.href = "../Alumno/Home";
            }, 2000);
        }
        else if (Resultado.DATA.COD_TIPO_USUARIO === 2) {
            setTimeout(() => {
                window.location.href = "../Maestro/Home";
            }, 2000);
        }
        else if (Resultado.DATA.COD_TIPO_USUARIO === 3) {
            setTimeout(() => {
                window.location.href = "../Funcionario/Home";
            }, 2000);
        }
    }
    else {
        //Respuesta malas;
        new Noty({
            text: '<strong>Información</strong><br /> Algunas de sus respuestas es incorrecta, vuelva a intentarlo..<br /> ',
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
}


//const HacerPreguntasSeguridad = async () => {

//};