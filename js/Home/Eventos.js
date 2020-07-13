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



const ListarEventos = async () => {
    let url = "../Home/ListaEventos";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();
    let contenido = "";
    if (Resultado.RESPUESTA) {
        let ContenidoEventos = document.getElementById('ContenidoEventos');
        let Data = Resultado.DATA;
        Data.forEach(Item => {

            let formato = moment(Item.FECHA_SUBIDA).startOf('minute').fromNow();    
            let formato_fecha_evento = moment(Item.FECHA).format('ll');
            contenido += `<div class="col-sm-6 col-md-4 col-lg-4 mt-4">
                    <div class="card">
                        <img class="card-img-top" style="height: 200px;" src="${Item.URL_IMAGEN}" />
                        <div class="card-block">
                            <figure class="profile">
                                <img src="${Item.URL_IMAGEN}" class="profile-avatar" alt="">
                            </figure>
                            <h4 class="card-title mt-3">${Item.TITULO}</h4>
                            <div class="meta">
                                <a class="text-primary">${formato_fecha_evento}</a>
                            </div>
                            <div class="card-text">
                                ${Item.DESCRIPCION_CORTA}
                            </div>
                        </div>
                        <div class="card-footer">
                            <small class="text-primary">Evento subido ${formato}</small>
                            <button onclick="DetalleEvento(${Item.ID_EVENTO})" class="btn btn-primary float-right btn-sm">Más detalles</button>
                        </div>
                    </div>
                </div>`;
        });

        ContenidoEventos.innerHTML = contenido;
    }
};


const DetalleEvento = async (ID) => {
    let UrlImagenEvento = document.getElementById('UrlImagenEvento');
    let TituloEvento = document.getElementById('TituloEvento');
    let DescripcionCortaEvento = document.getElementById('DescripcionCortaEvento');
    let DescripcionDetalladaEvento = document.getElementById('DescripcionDetalladaEvento');
    let FechaEvento = document.getElementById('FechaEvento');
    let ValorEvento = document.getElementById('ValorEvento');
    let UbicaciónEvento = document.getElementById('UbicaciónEvento');
    let FechaSubidaEvento = document.getElementById('FechaSubidaEvento');



    let url = "../Home/DetalleEvento";
    let data = { ID: ID };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    if (Resultado.RESPUESTA) {
        let DATA = Resultado.DATA;

        UrlImagenEvento.src = DATA.URL_IMAGEN;
        TituloEvento.innerText = DATA.TITULO;
        DescripcionCortaEvento.innerText = DATA.DESCRIPCION_CORTA;
        DescripcionDetalladaEvento.innerText = DATA.DESCRIPCION_DETALLADA;
        FechaEvento.innerText = moment(DATA.FECHA).format('ll');
        ValorEvento.innerText = DATA.VALOR;
        UbicaciónEvento.innerText = DATA.UBICACION;
        FechaSubidaEvento.innerText = moment(DATA.FECHA_SUBIDA).startOf('minute').fromNow();;

    }

    $("#ModalInfoEvento").modal("show");
};