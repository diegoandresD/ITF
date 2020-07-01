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
    let url = "../Alumno/Searching";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithData();
    console.log(Resultado);
    document.getElementById('UlContent').innerHTML = "";
    document.getElementById('UlContent').innerHTML = Resultado.Primero + Resultado.Enlaces + Resultado.Ultimo;

    let ItemsTienda = document.getElementById('ItemsTienda');
    let tbody = "";
    tbody = "<div class='row'>";

    Resultado.DATA.forEach(Item => {

        tbody += `<div class="col-sm-4">
                <article class="col-item">
                    <div class="photo">
                        <a href="#"> <img src="${Item.URL_IMAGEN}" height='150' class="img-responsive" alt="Product Image"> </a>
                    </div>
                    <div class="info">
                        <div class="row">
                            <div class="price-details col-md-12">
                                <p class="details">
                                    Lorem ipsum dolor sit amet, consectetur..
                                </p>
                                <h1>${Item.NOMBRE_PRODUCTO}</h1>
                                <span class="price-new">$${Item.PRECIO_INTERNET}</span>
                            </div>
                        </div>
                        <div class="separator clear-left">
                            <p class="btn-add">
                                <a href="#" class="btn btn-outline-info" data-toggle="tooltip" data-placement="top" title="Add to wish list"><i class="fa fa-shopping-cart"></i></a>

                            </p>
                            <p class="btn-details">
                                <a href="#" class="btn btn-outline-success" data-toggle="tooltip" data-placement="top" title="Add to wish list"><i class="fa fa-heart"></i></a>
                            </p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </article>
            </div>`;

    });

    tbody += "</div>"
    ItemsTienda.innerHTML = tbody;


    document.getElementById('NextFilter').addEventListener('click', () => {
        let activo;
        let siguiente;

        let ClassListElements = document.getElementsByClassName('algo');
        for (let i = 0; i < ClassListElements.length; i++) {
            if (ClassListElements[i].classList.contains('item-activo')) {
                activo = ClassListElements[i];
                siguiente = ClassListElements[i + 1];
                if (siguiente !== undefined) {
                    

                    activo.firstChild.classList.remove('activo');
                    siguiente.firstChild.classList.add('activo');
                    siguiente.firstChild.click();
                    break;
                }
            }
        }

    });

    document.getElementById('PreviusFilter').addEventListener('click', () => {
        let activo;
        let siguiente;


        let ClassListElements = document.getElementsByClassName('algo');
        for (let i = 0; i < ClassListElements.length; i++) {
            if (ClassListElements[i].classList.contains('active')) {
                activo = ClassListElements[i];
                siguiente = ClassListElements[i - 1];
                if (siguiente !== undefined) {
                    activo.firstChild.classList.remove('activo');
                    siguiente.firstChild.classList.add('activo');
                    siguiente.click();
                    break;
                }
            }
        }

    });

});


const search = async (numer, element) => {
    event.preventDefault();

    let Ruta = "../Alumno/Searching";

    let data = { page: numer };
    const Fetchs = Fetch(Ruta, data);
    const Resultado = await Fetchs.FetchWithData();

    console.log(Resultado);

    let tbody = "";
    tbody = "<div class='row'>";
    
    Resultado.DATA.forEach(Item => {

        tbody += `<div class="col-sm-4">
                <article class="col-item">
                    <div class="photo">
                        <a href="#"> <img src="${Item.URL_IMAGEN}" class="img-responsive" alt="Product Image"> </a>
                    </div>
                    <div class="info">
                        <div class="row">
                            <div class="price-details col-md-12">
                                <p class="details">
                                    Lorem ipsum dolor sit amet, consectetur..
                                </p>
                                <h1>Sample Product</h1>
                                <span class="price-new">$110.00</span>
                            </div>
                        </div>
                        <div class="separator clear-left">
                            <p class="btn-add">
                                <a href="#" class="btn btn-outline-info" data-toggle="tooltip" data-placement="top" title="Add to wish list"><i class="fa fa-shopping-cart"></i></a>
                            </p>
                            <p class="btn-details">
                                <a href="#" class="btn btn-outline-success" data-toggle="tooltip" data-placement="top" title="Add to wish list"><i class="fa fa-heart"></i></a>
                            </p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </article>
            </div>`;

    });
    tbody += "</div>";

    document.getElementById('ItemsTienda').innerHTML = tbody;
    let posicion_ = $("#Inicio").offset().top;

    $('html, body').animate({
        scrollTop: posicion_
    }, 'fast');


    DefaultSearch(element);
};


const DefaultSearch = (element) => {

    let ClassListElements = document.getElementsByClassName('algo');
    console.log(ClassListElements);
    for (var i = 0; i < ClassListElements.length; i++) {
        if (ClassListElements[i].classList.contains('active')) {
            ClassListElements[i].classList.remove('active');

        }
    }
    element.classList.add('active');

};
