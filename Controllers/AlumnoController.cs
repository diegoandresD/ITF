using ITF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Transbank.Webpay;

namespace ITF.Controllers
{
    public class AlumnoController : Controller
    {
        // GET: Alumno
        public ActionResult Home()
        {
            return View();
        }

        public ActionResult MiProgresion()
        {
            return View();
        }

        public ActionResult Tienda()
        {
            return View();
        }

        public ActionResult Examenes()
        {
            return View();
        }

        public ActionResult Eventos()
        {
            return View();
        }

        public ActionResult Ahorros()
        {
            return View();
        }
        public ActionResult Carro()
        {
            return View();
        }

        #region TIENDA
        public ActionResult Searching(int? page)
        {
            return Json(ModeloAlumno.Searching(page), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DetalleProducto(int ID)
        {
            return Json(ModeloAlumno.DetalleProducto(ID), JsonRequestBehavior.AllowGet);
        }

        #endregion TIENDA

        #region CARTERA

        [HttpPost]
        public ActionResult ListaMovimientoCartera()
        {
            return Json(ModeloAlumno.ListaMovimientoCartera(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GenerarPagoTotal(int t)
        {

            using (ITFEntities db = new ITFEntities())
            {


                string nombre_usuario = Session["USER"].ToString();
                ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.NOMBRE_USUARIO == nombre_usuario).FirstOrDefault();

                var buyOrder = new Random().Next(100000, 999999999).ToString();

                var transaction = new Webpay(Configuration.ForTestingWebpayPlusNormal()).NormalTransaction;
                var amount = t;



                var sessionId = _user.ID_USUARIO.ToString();
                var returnUrl = "https://localhost:44351/Alumno/RespuestaPago";
                var finalUrl = "https://localhost:44351/Alumno/ComprobanteCliente";
                var initResult = transaction.initTransaction(
                        amount, buyOrder, sessionId, returnUrl, finalUrl);

                var formAction = initResult.url;
                var tokenWs = initResult.token;
                ViewBag.formAction = formAction;
                ViewBag.tokenWs = tokenWs;
                ViewBag.amount = amount;

                return View();
            }
        }

        [HttpPost]
        public ActionResult RespuestaPago(string token_ws)
        {
            using (ITFEntities db = new ITFEntities())
            {
                var transaction = new Webpay(Configuration.ForTestingWebpayPlusNormal()).NormalTransaction;
                var result = transaction.getTransactionResult(token_ws);
                var output = result.detailOutput[0];
                if (output.responseCode == 0)
                {
                    ViewBag.buyOrder = result.buyOrder;
                    ViewBag.cardDetail = result.cardDetail.cardNumber;
                    ViewBag.accountingDate = result.accountingDate;
                    ViewBag.amount = output.amount;
                    ViewBag.Url = result.urlRedirection;
                    ViewBag.Token = token_ws;
                    ViewBag.Status = output.responseCode;
                    ViewBag.authorizationCode = output.authorizationCode;
                    ViewBag.ID = result.sessionId;

                    int id = Convert.ToInt32(result.sessionId);

                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.ID_USUARIO == id).FirstOrDefault();
                    if (_user != null)
                    {
                        Session["USER"] = _user.NOMBRE_USUARIO;
                        Session["NAME"] = _user.NOMBRE + " " + _user.APELLIDO_PATERNO;
                        Session["TIPO"] = _user.COD_TIPO_USUARIO;
                        Session["RUT"] = _user.RUT;
                    }



                    string Cod_Operacion = new Random().Next(100000, 999999999).ToString();


                    ITF_CARTERA _cart = db.ITF_CARTERA.Where(a => a.COD_USUARIO == _user.ID_USUARIO).FirstOrDefault();
                    _cart.SALDO = _cart.SALDO + Convert.ToInt32(output.amount);
                    db.SaveChanges();

                    ITF_CARTERA_MOVIMIENTOS _mov = new ITF_CARTERA_MOVIMIENTOS();
                    _mov.FECHA = DateTime.Now;
                    _mov.CODIGO_OPERACION = Cod_Operacion;
                    _mov.DESCRIPCION = "Abono cartera";
                    _mov.CARGO = false;
                    _mov.ABONO = true;
                    _mov.SALDO = Convert.ToInt32(output.amount);
                    _mov.COD_CARTERA = _cart.ID_CARTERA;
                    _mov.SUBTOTAL = _cart.SALDO;

                    db.ITF_CARTERA_MOVIMIENTOS.Add(_mov);
                    db.SaveChanges();
                }
                else
                {
                    //ViewBag.buyOrder = result.buyOrder;
                    //ViewBag.cardDetail = result.cardDetail;
                    //ViewBag.accountingDate = result.accountingDate;
                    //ViewBag.amount = output.amount;
                    ViewBag.Url = result.urlRedirection;
                    ViewBag.Token = token_ws;
                }
                return View();


            }

        }

        public ActionResult ComprobanteCliente()
        {
            return View();
        }

        #endregion

        #region AUTOLOGIN
        public ActionResult AutoLogin(int ID)
        {
            return Json(ModeloAlumno.AutoLogin(ID), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region EVENTOS
        public ActionResult InscribirseEvento(int ID)
        {
            return Json(ModeloAlumno.InscribirseEvento(ID), JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}