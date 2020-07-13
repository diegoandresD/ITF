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
    await ListadoInicial();
    await ListarProductos();
    //Lista de categorias;
    //pruebas();
    await ListaCategorias();
    await ListaProveedores();
});

document.getElementById('AgregarProducto').addEventListener('click', async () => {
    AgregarProducto();
});

document.getElementById('ButonEditarProducto').addEventListener('click', async () => {
    //Editar el producto
    await EditarProducto();
});

document.getElementById('OpenAddCategoria').addEventListener('click', async () => {
    $("#ModalCategoria").modal("show");
});

document.getElementById('OpenAddProveedor').addEventListener('click', async () => {
    $("#ModalProveedor").modal("show");
});

document.getElementById('ButtonAgregarCategoria').addEventListener('click', async () => {

    await AgregarCategoria();
});

document.getElementById('ButtonAgregarProveedor').addEventListener('click', async () => {

    await AgregarProveedor();
});


const AgregarProducto = async () => {
    let CategoriaProductoAdd = document.getElementById('CategoriaProductoAdd');
    let CodigoProductoAdd = document.getElementById('CodigoProductoAdd');
    let NombreProductoAdd = document.getElementById('NombreProductoAdd');
    let PrecioTiendaAdd = document.getElementById('PrecioTiendaAdd');
    let PrecioInternetAdd = document.getElementById('PrecioInternetAdd');
    let MarcaAdd = document.getElementById('MarcaAdd');
    let StockAdd = document.getElementById('StockAdd');
    let ProveedorAdd = document.getElementById('ProveedorAdd');
    //let ResponsableEntregaAdd = document.getElementById('ResponsableEntregaAdd');
    let ImagenProductoAdd = document.getElementById('ImagenProductoAdd');
    let DescripcionProductoAdd = document.getElementById('DescripcionProductoAdd');


    let PRODUCTO = new Object();
    PRODUCTO.COD_PRODUCTO = CodigoProductoAdd.value;
    PRODUCTO.COD_CATEGORIA = CategoriaProductoAdd.value;
    PRODUCTO.NOMBRE_PRODUCTO = NombreProductoAdd.value;
    PRODUCTO.DESCRIPCION = DescripcionProductoAdd.value;
    PRODUCTO.PRECIO_TIENDA = PrecioTiendaAdd.value;
    PRODUCTO.PRECIO_INTERNET = PrecioInternetAdd.value;
    PRODUCTO.STOCK = StockAdd.value;
    PRODUCTO.COD_PROVEEDOR = ProveedorAdd.value;
    PRODUCTO.MARCA = MarcaAdd.value;
    //PRODUCTO.RESPONSABLE_ENTREGA = ResponsableEntregaAdd.value;
    PRODUCTO.ARCHIVO = ImagenProductoAdd.files[0];

    let data = { "PRODUCTO": PRODUCTO }
    let url = "../Maestro/AgregarProducto";

    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    console.log(Resultado);

    if (Resultado.RESPUESTA) {
        let DATA = Resultado.DATA;
        await AgregarImagen(DATA.ID_PRODUCTO, ImagenProductoAdd.files[0]);

        await ListarProductos();


        $("#exampleModal").modal("hide");
        swal.fire({
            title: "Agregado!",
            text: `El Código de producto ${DATA.COD_PRODUCTO} ha sido agregado correctamente`
        });
    }

}

const AgregarImagen = async (ID, ARCHIVO) => {

    var formData = new FormData();
    formData.append("ARCHIVO", ARCHIVO)
    formData.append("ID", ID)

    await fetch('../Maestro/AgregarFotoAlProducto', {
        method: "POST",
        body: formData,
        headers: {
        }
    }).then(response => response.text())
        .then(response => {
            var d = JSON.parse(response);
            if (d.RESPUESTA) {

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


const ListaProveedores = async () => {
    let url = "../Maestro/ListaProveedores";

    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithData();
    console.log(Resultado);
    if (Resultado.RESPUESTA) {
        let provedores = Resultado.DATA;
        let Contenedor_provedores = document.getElementById('ProveedorAdd');

        for (var i = 0; i < provedores.length; i++) {
            let option = document.createElement('option');
            option.value = provedores[i].ID_PROVEEDOR;
            option.appendChild(document.createTextNode(provedores[i].NOMBRE_PROVEEDOR));
            Contenedor_provedores.appendChild(option);
        }


    }
}

const ListaCategorias = async () => {
    let url = "../Maestro/ListaCategorias";

    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithData();
    console.log(Resultado);
    if (Resultado.RESPUESTA) {
        let categorias = Resultado.DATA;
        let Contenedor_categorias = document.getElementById('CategoriaProductoAdd');


        for (var i = 0; i < categorias.length; i++) {
            let option = document.createElement('option');
            option.value = categorias[i].ID_CATEGORIA;
            option.appendChild(document.createTextNode(categorias[i].NOMBRE_CATEGORIA));
            Contenedor_categorias.appendChild(option);
        }


    }
}


const ListarProductos = async () => {

    let url = "../Maestro/ListaProductos";
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithData();
    if (Resultado.RESPUESTA) {
        let elementos = Resultado.DATA;
        let DivContenedor = document.getElementById('ElementosTienda');
        DivContenedor.innerHTML = "";
        let items = "<div class='row'>"
        for (var i = 0; i < elementos.length; i++) {
            let data = elementos[i];

            items += `<div class="col-md-3" style="margin-bottom:1%">
                <div class="card">
                    <img class="card-img-top" style='height: 173px;' src="${data.URL_IMAGEN}" alt="${data.NOMBRE_PRODUCTO}">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6" style="font-size:12px">
                                <button onclick="DetalleProducto(${data.ID_PRODUCTO})" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#exampleModal1" href="#">
                                    <i class="fas fa-edit"></i>Editar
                                </button>

                            </div>
                            <div class="col-6" style="font-size:12px">
                                <button onclick="EliminarProducto(${data.ID_PRODUCTO})" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#exampleModal1" href="#">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>

                    </div>
                    <div class="card-footer">
                        <div style="text-align:center">
                            <h4 class="text-info text-center" style="font-weight:bold">$${data.PRECIO_INTERNET}</h4>
                        </div>

                    </div>
                </div>

            </div>`;
        }
        items += "</div>"
        DivContenedor.innerHTML = items;
    }


}

const DetalleProducto = async (ID) => {
    let url = "../Maestro/ProductoID";
    let data = { ID_PRODUCTO: ID };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();

    let ImagenProductoEdit = document.getElementById('ImagenProductoEdit');
    let DescripcionEdit = document.getElementById('DescripcionEdit');
    let NombreProductoEdit = document.getElementById('NombreProductoEdit');
    let PrecioTiendaEdit = document.getElementById('PrecioTiendaEdit');
    let PrecioInternetEdit = document.getElementById('PrecioInternetEdit');
    let StockEdit = document.getElementById('StockEdit');
    let MarcaEdit = document.getElementById('MarcaEdit');
    let ButonEditarProducto = document.getElementById('ButonEditarProducto');
    let ProveedorEdit = document.getElementById('ProveedorEdit');
    let CategoriaEdit = document.getElementById('CategoriaEdit');


    if (Resultado.RESPUESTA) {
        let data = Resultado.DATA;
        //algo;
        $("#ModalEditar").modal("show");
        ImagenProductoEdit.setAttribute("src", data.URL_IMAGEN);
        ImagenProductoEdit.setAttribute("alt", data.NOMBRE_PRODUCTO);
        DescripcionEdit.value = data.DESCRIPCION;
        NombreProductoEdit.value = data.NOMBRE_PRODUCTO;
        PrecioTiendaEdit.value = data.PRECIO_TIENDA;
        PrecioInternetEdit.value = data.PRECIO_INTERNET;
        StockEdit.value = data.STOCK;
        MarcaEdit.value = data.MARCA;
        ButonEditarProducto.value = data.ID_PRODUCTO;
        ProveedorEdit.value = data.COD_PROVEEDOR;
        CategoriaEdit.value = data.COD_CATEGORIA;
    }
}

const EditarProducto = async (id) => {

    let CategoriaEdit = document.getElementById('CategoriaEdit');
    let ProveedorEdit = document.getElementById('ProveedorEdit');
    let FileProductEdit = document.getElementById('FileProductEdit');
    let ImagenProductoEdit = document.getElementById('ImagenProductoEdit');
    //let DescripcionEdit = document.getElementById('DescripcionEdit');
    let NombreProductoEdit = document.getElementById('NombreProductoEdit');
    let PrecioTiendaEdit = document.getElementById('PrecioTiendaEdit');
    let PrecioInternetEdit = document.getElementById('PrecioInternetEdit');
    let StockEdit = document.getElementById('StockEdit');
    let MarcaEdit = document.getElementById('MarcaEdit');
    let ButonEditarProducto = document.getElementById('ButonEditarProducto');
    let AgregoImagen = false;


    let PRODUCTO = new Object();
    PRODUCTO.ID_PRODUCTO = Number(ButonEditarProducto.value);
    PRODUCTO.NOMBRE_PRODUCTO = NombreProductoEdit.value;
    PRODUCTO.DESCRIPCION = DescripcionEdit.value;
    PRODUCTO.COD_CATEGORIA = Number(CategoriaEdit.value);
    PRODUCTO.PRECIO_TIENDA = PrecioTiendaEdit.value;
    PRODUCTO.PRECIO_INTERNET = PrecioInternetEdit.value;
    PRODUCTO.STOCK = StockEdit.value;
    PRODUCTO.COD_PROVEEDOR = Number(ProveedorEdit.value);
    PRODUCTO.MARCA = MarcaEdit.value;

    if (FileProductEdit.files[0] != undefined) {
        AgregoImagen = true;
    }

    let url = "../Maestro/EditarProducto";
    let data = { PRODUCTO: PRODUCTO };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();

    if (Resultado.RESPUESTA) {
        if (AgregoImagen) {
            await AgregarImagen(Number(ButonEditarProducto.value), FileProductEdit.files[0]);
        }
        //MENSAJE;
        $("#ModalEditar").modal("hide");
        await ListarProductos();
    }




}

const pruebas = () => {
    swal.fire({
        title: "Sweet!",
        text: "Here's a custom image."
    });
}


const ListadoInicial = async () => {

    //Lista de datos de categorias y proveedores.
    let url = '../Maestro/ListaInicial';
    const Fetchs = Fetch(url, null);
    const Resultado = await Fetchs.FetchWithOutData();
    if (Resultado.RESPUESTA) {
        console.log(Resultado);

        let Categorias = Resultado.DATA.CATEGORIAS;
        let ContenedorCategorias = document.getElementById('CategoriaEdit');
        let Proveedores = Resultado.DATA.PROVEEDORES;
        let ContenedorProveedores = document.getElementById('ProveedorEdit');


        for (var i = 0; i < Categorias.length; i++) {
            let data = Categorias[i];
            let option = document.createElement('option');
            option.value = data.ID_CATEGORIA;
            option.appendChild(document.createTextNode(data.NOMBRE_CATEGORIA));
            ContenedorCategorias.appendChild(option)
        }

        for (var i = 0; i < Proveedores.length; i++) {
            let data = Proveedores[i];
            let option = document.createElement('option');
            option.value = data.ID_PROVEEDOR;
            option.appendChild(document.createTextNode(data.NOMBRE_PROVEEDOR));
            ContenedorProveedores.appendChild(option)
        }
    }


}

const EliminarProducto = async (ID) => {

    Swal.fire({
        title: '¿Estas seguro(a)?',
        text: "Eliminará el producto!",
        icon: 'danger',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!'

    }).then(async (result) => {
        if (result.value) {

            let url = '../Maestro/EliminarProducto';
            let data = { ID_PRODUCTO: ID };
            const Fetchs = Fetch(url, data);
            const Resultado = await Fetchs.FetchWithData();
            if (Resultado.RESPUESTA) {

                await ListarProductos();

                Swal.fire(
                    `Código de producto ${Resultado.DATA.COD_PRODUCTO} Eliminado`,
                )



            }


        }
    })





}

const AgregarCategoria = async () => {

    let NombreCategoriaAdd = document.getElementById('NombreCategoriaAdd');

    let url = '../Maestro/AgregarCategorias';
    let CATEGORIAS = new Object();
    CATEGORIAS.NOMBRE_CATEGORIA = NombreCategoriaAdd.value;
    let data = { CATEGORIAS: CATEGORIAS };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    if (Resultado.RESPUESTA) {

        $("#ModalCategoria").modal("hide");

        await ListaCategorias();
        await ListaProveedores();

        swal.fire({
            title: "Agregado!",
            text: `Categoria Agregada correctamente`
        });
    }
};

const AgregarProveedor = async () => {

    let NombreProveedorAdd = document.getElementById('NombreProveedorAdd');

    let url = '../Maestro/AgregarProveedor';
    let PROVEEDOR = new Object();
    PROVEEDOR.NOMBRE_PROVEEDOR = NombreProveedorAdd.value;
    let data = { PROVEEDOR: PROVEEDOR };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
    if (Resultado.RESPUESTA) {

        $("#ModalProveedor").modal("hide");

        await ListaCategorias();
        await ListaProveedores();

        swal.fire({
            title: "Agregado!",
            text: `Proveedor agregado correctamente`
        });
    }
};