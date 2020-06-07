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
                text: '<strong>Atención!</strong><br />Debe ingresar el nombre de usuario<br /> ',
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