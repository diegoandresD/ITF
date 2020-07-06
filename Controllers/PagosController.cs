using ITF.Models;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Transbank.Webpay;



namespace ITF.Controllers
{
    public class PagosController : Controller
    {
        // GET: Pagos
        public ActionResult GenerarPedido(PEDIDO[] PEDIDOS)
        {
            int TOTAL = 0;
            using (ITFEntities db = new ITFEntities())
            {
                string nombre_usuario = Session["USER"].ToString();
                ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.NOMBRE_USUARIO == nombre_usuario).FirstOrDefault();

                foreach (PEDIDO item in PEDIDOS)
                {
                    TOTAL += (item.QA * item.PRICE);
                }
                var buyOrder = new Random().Next(100000, 999999999).ToString();
                ITF_PEDIDOS _ped = new ITF_PEDIDOS();
                _ped.ORDEN_COMPRA = buyOrder;
                _ped.FECHA = DateTime.Now;
                _ped.COD_USUARIO = _user.ID_USUARIO;
                _ped.COD_ESTADO = 1;//Pedido Pendiente;
                db.ITF_PEDIDOS.Add(_ped);
                db.SaveChanges();
                foreach (PEDIDO item in PEDIDOS)
                {
                    ITF_PEDIDOS_DETALLE _det = new ITF_PEDIDOS_DETALLE();
                    _det.ID_PRODUCTO = item.ID;
                    _det.CANTIDAD = item.QA;
                    _det.PRECIO = item.PRICE;
                    _det.SUBTOTAL = item.QA * item.PRICE;
                    _det.COD_PEDIDO = _ped.ID_PEDIDO;
                    db.ITF_PEDIDOS_DETALLE.Add(_det);
                    db.SaveChanges();
                }

                object DATA =  new { RESPUESTA = true, buyOrder = buyOrder, TOTAL = TOTAL };
                return Json(DATA, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GenerarPagoTotal(string b, int t)
        {
            using (ITFEntities db = new ITFEntities())
            {

                string nombre_usuario = Session["USER"].ToString();
                ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.NOMBRE_USUARIO == nombre_usuario).FirstOrDefault();

                var transaction = new Webpay(Configuration.ForTestingWebpayPlusNormal()).NormalTransaction;
                var amount = t;

                var sessionId = _user.ID_USUARIO.ToString();
                var returnUrl = "https://localhost:44351/Pagos/RespuestaPago";
                var finalUrl = "https://localhost:44351/Pagos/ComprobanteCliente";
                var initResult = transaction.initTransaction(
                        amount, b, sessionId, returnUrl, finalUrl);

                var formAction = initResult.url;
                var tokenWs = initResult.token;
                ViewBag.formAction = formAction;
                ViewBag.tokenWs = tokenWs;
                ViewBag.amount = amount;

                return View();
            }

        }


        public ActionResult RespuestaPago(string token_ws)
        {
            using (ITFEntities db = new ITFEntities())
            {
                var transaction = new Webpay(Configuration.ForTestingWebpayPlusNormal()).NormalTransaction;
                var result = transaction.getTransactionResult(token_ws);
                var output = result.detailOutput[0];


                int id = Convert.ToInt32(result.sessionId);

                ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.ID_USUARIO == id).FirstOrDefault();
                if (_user != null)
                {
                    Session["USER"] = _user.NOMBRE_USUARIO;
                    Session["NAME"] = _user.NOMBRE + " " + _user.APELLIDO_PATERNO;
                    Session["TIPO"] = _user.COD_TIPO_USUARIO;
                    Session["RUT"] = _user.RUT;
                }

                ViewBag.RESPONSE_CODE = output.responseCode;
                if (output.responseCode == 0)
                {
                    ViewBag.BUY_ORDEN = result.buyOrder;
                    ViewBag.AUTHORIZATION_CODE = output.authorizationCode;
                    ViewBag.FECHA_TRANSACCION = result.transactionDate;
                    ViewBag.FORMA_PAGO = Forma_Pago(output.paymentTypeCode);
                    ViewBag.Url = result.urlRedirection;
                    ViewBag.Token = token_ws;
                    ViewBag.SESSION_ID = result.sessionId;

                    ITF_PEDIDOS _ped = db.ITF_PEDIDOS.Where(a => a.ORDEN_COMPRA == result.buyOrder).FirstOrDefault();
                    _ped.COD_ESTADO = 2;

                    ITF_BOLETAS _boleta = new ITF_BOLETAS();
                    _boleta.TOTAL = Convert.ToInt32(output.amount);
                    _boleta.COD_PEDIDO = _ped.ID_PEDIDO;
                    _boleta.FECHA = DateTime.Now;
                    _boleta.COD_USUARIO = _user.ID_USUARIO;
                    _boleta.MEDIO_PAGO = Forma_Pago(output.paymentTypeCode);
                    _boleta.NUMERO_TARJETA = Convert.ToInt32(result.cardDetail.cardNumber);
                    _boleta.ORDEN_COMPRA = Convert.ToInt32(result.buyOrder);
                    _boleta.CODIGO_AUTORIZACION = Convert.ToInt32(output.authorizationCode);

                    db.ITF_BOLETAS.Add(_boleta);
                    db.SaveChanges();

                }
                else
                {
                    ViewBag.BUY_ORDEN = result.buyOrder;
                    ViewBag.Url = result.urlRedirection;
                    ViewBag.Token = token_ws;
                    ViewBag.ERROR_MESSAGE = ERROR_MESSAGE(output.responseCode);
                }
                return View();
            }

        }


        public ActionResult ComprobanteCliente(string token_ws)
        {
            return View();
        }

        [HttpPost]
        public ActionResult DetalleComprobante(int cod)
        {
            using (ITFEntities db = new ITFEntities())
            {
                ITF_BOLETAS _boleta = db.ITF_BOLETAS.Where(a => a.ORDEN_COMPRA == cod).FirstOrDefault();

                object data = new { RESPUESTA = true, TIPO = 1, DATA = _boleta };

                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }


        public string Forma_Pago(string tipo)
        {
            string result = "";
            switch (tipo)
            {
                case "VD":
                    result = "Venta Débito";
                    break;
                case "VN":
                    result = "Venta Normal";
                    break;
                case "VC":
                    result = "Venta en cuotas";
                    break;
                case "SI":
                    result = "3 cuotas sin interés";
                    break;
                case "S2":
                    result = "2 cuotas sin interés";
                    break;
                case "NC":
                    result = "N Cuotas sin interés";
                    break;
                case "VP":
                    result = "Venta Prepago";
                    break;

            }
            return result;
        }

        public string VCI(string tipo)
        {
            string result = "";
            switch (tipo)
            {
                case "TSY":
                    result = "Autenticación exitosa";
                    break;
                case "TSN":
                    result = "Autenticación fallida";
                    break;
                case "TO":
                    result = "Tiempo máximo excedido para autenticación";
                    break;
                case "ABO":
                    result = "Autenticación abortada por tarjetahabiente";
                    break;
                case "U3":
                    result = "Error interno en la autenticación";
                    break;
                case "NP":
                    result = "No Participa, probablemente por ser una tarjeta extranjera que no participa en el programa 3DSecure";
                    break;
                case "ACS2":
                    result = "Autenticación fallida extranjera";
                    break;
                case "A":
                    result = "Intento de autenticación";
                    break;
                case "INV":
                    result = "Autenticación inválida";
                    break;
                case "EOP":
                    result = "Error Operativo";
                    break;

            }
            return result;
        }

        public string ERROR_MESSAGE(int tipo)
        {
            string result = "";
            switch (tipo)
            {
                case 0:
                    result = "Transacción aprobada";
                    break;
                case -1:
                    result = @"Rechazo de transacción - Reintente (Posible error en el ingreso 
                    de datos de la transacción)";
                    break;
                case -2:
                    result = @"Rechazo de transacción (Se produjo fallo al procesar la transacción. 
                    Este mensaje de rechazo está relacionado a parámetros de la tarjeta y/o su cuenta asociada)";
                    break;
                case -3:
                    result = "Error en transacción (Interno Transbank)";
                    break;
                case -4:
                    result = "Rechazo emisor (Rechazada por parte del emisor)";
                    break;
                case -5:
                    result = "Rechazo - Posible Fraude (Transacción con riesgo de posible fraude)";
                    break;
            }
            return result;
        }
    }

    public class PEDIDO
    {
        public int ID { get; set; }
        public string NAME { get; set; }
        public int PRICE { get; set; }
        public int QA { get; set; }
        public string URL { get; set; }
    }
}