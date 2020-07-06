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

    await ListaCarrito();


});

document.getElementById('EliminarElemCarrito').addEventListener('click', () => {
    VaciarCarrito();
});

document.getElementById('ButtonPagar').addEventListener('click', async () => {
    
    let array = localStorage.getItem('_cart');
    if (array != null) {

        array = JSON.parse(array);
        let cont = array.length;
        if (cont !== 0) {
            let url = "../Pagos/GenerarPedido";
            let data = { PEDIDOS: array };
            const Fetchs = Fetch(url, data);
            const Resultado = await Fetchs.FetchWithData();
            if (Resultado.RESPUESTA) {
                let buyOrder = Resultado.buyOrder;
                let TOTAL = Resultado.TOTAL;

                window.location.href = `../Pagos/GenerarPagoTotal?b=${buyOrder}&&t=${TOTAL}`;
            }
            debugger;
        }
        
    }
    

});

const ListaCarrito = async () => {

    let _list = document.getElementById('ListaCarrito');
    _list.innerHTML = "";

    let _items = "";
    let Subtotal_productos = document.getElementById('Subtotal_productos');
    let total_productos = document.getElementById('total_productos');

    let array = localStorage.getItem('_cart');


    if (array !== undefined && array !== null) {
        array = JSON.parse(array);

        let precio_total_producto = 0;
        let alog = array.length;

        array.forEach(Item => {
            let precio_total = Number(Item.PRICE) * Number(Item.QA);
            precio_total_producto += precio_total;

            _items += `<tr>
                            <td>
                                <div class="display-flex align-center">
                                    <div class="img-product">
                                        <img src="${Item.URL}" alt="" class="mCS_img_loaded">
                                    </div>
                                    <div class="name-product">
                                        ${Item.NAME}
                                        <br>${Item.ID}

                                    </div>
                                    <div class="price">
                                        $${Item.PRICE}
                                    </div>
                                </div>
                            </td>
                            <td class="product-count">
                                <form action="#" class="count-inlineflex">
                                    <div class="qtyminus">-</div>
                                    <input type="text" name="quantity" value="${Item.QA}" class="qty">
                                    <div class="qtyplus">+</div>
                                </form>
                            </td>
                            <td>
                                <div class="total">
                                    $${precio_total}
                                </div>
                            </td>
                            
                            <td>
                              
                                    <button class="btn btn-sm btn-danger" onclick="DeleteItem(${Item.ID})"><i class="fas fa-trash"></i></button>
                                
                            </td>
                        </tr>`;
        });
        if (alog === 0) {
            Clear();
        }
        else {
            Subtotal_productos.innerText = "$" + precio_total_producto;
            total_productos.innerText = "$" + precio_total_producto;
            _list.innerHTML = _items;
        }


    }
    else {
        Clear();
    }
}

const VaciarCarrito = async () => {
    localStorage.removeItem('_cart');
    await ListaCarrito();

}

const Clear = () => {
    let ListaCarrito = document.getElementById('ListaCarrito');
    document.getElementById('Subtotal_productos').innerText = "$0";
    document.getElementById('total_productos').innerText = "$0";

    ListaCarrito.innerHTML = `<tr>
                            <td colspan="4">No tiene productos en su carrito.</td>
                        </tr>`;

}

const DeleteItem = async (ID) => {
    //eliminar item del carrito

    let array = localStorage.getItem('_cart');

    array = JSON.parse(array);


    let elem = array.indexOf(array.find(item => item.ID === ID));
    array.splice(elem, 1);

    localStorage.setItem('_cart', JSON.stringify(array));

    await ListaCarrito();


}


const Pagar = async () => {

    let array = localStorage.getItem('_cart');
    debugger;
    array = JSON.parse(array);

    let url = "../Pagos/GenerarPagoTotal";
    let data = { PEDIDOS: array };
    const Fetchs = Fetch(url, data);
    const Resultado = await Fetchs.FetchWithData();
} 