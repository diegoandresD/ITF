using ITF.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ITF.Controllers
{
    public class MaestroController : Controller
    {
        // GET: Maestro
        //ROUTES.

        #region ALUMNO
        public ActionResult Home()
        {
            return View();
        }

        public ActionResult Alumnos()
        {
            return View();
        }

        public ActionResult MisProductos()
        {
            return View();
        }

        public ActionResult Mensualidades()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ListaGrados()
        {
            return Json(ModeloMaestro.ListaGrados(), JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public ActionResult ListaDatosConfirmacion(string RUT)
        {
            return Json(ModeloMaestro.ListaDatosConfirmacion(RUT), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult ListaAcademias()
        {
            return Json(ModeloMaestro.ListaAcademias(), JsonRequestBehavior.AllowGet);

        }

        [HttpPost]

        public ActionResult ListaGeneros()
        {
            return Json(ModeloMaestro.ListaGeneros(), JsonRequestBehavior.AllowGet);

        }


        [HttpPost]
        public ActionResult ListaMisAlumno()
        {
            //al modelo, para traer la información
            return Json(ModeloMaestro.ListaMisAlumno(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult DetalleAlumno(int id)
        {
            //al modelo, para traer la información
            return Json(ModeloMaestro.DetalleAlumno(id), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult EditarAlumno(ITF_USUARIOS _user)
        {
            //al modelo, para traer la información
            return Json(ModeloMaestro.EditarAlumno(_user), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult AgregarAlumno(ITF_USUARIOS _user)
        {
            //al modelo, para traer la información
            return Json(ModeloMaestro.AgregarAlumno(_user), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AnularAlumno(int ID)
        {
            //modelo;
            return Json(ModeloMaestro.AnularAlumno(ID), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult ActivarAlumno(int ID)
        {
            return Json(ModeloMaestro.ActivarAlumno(ID), JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public ActionResult DatosTecnicosUsuario(int ID)
        {
            return Json(ModeloMaestro.DatosTecnicosUsuario(ID), JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public ActionResult AgregarDatosTecnicos(ITF_INDICADORES INDICADORES)
        {
            return Json(ModeloMaestro.AgregarDatosTecnicos(INDICADORES), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region TIENDA

        public ActionResult ListaInicial()
        {
            return Json(ModeloMaestro.ListaInicial(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ListaProductos()
        {
            return Json(ModeloMaestro.ListaProductos(), JsonRequestBehavior.AllowGet);

        }
        public ActionResult ProductoID(int ID_PRODUCTO)
        {
            return Json(ModeloMaestro.ProductoID(ID_PRODUCTO), JsonRequestBehavior.AllowGet);
        }
        public ActionResult ListaCategorias()
        {
            return Json(ModeloMaestro.ListaCategorias(), JsonRequestBehavior.AllowGet);

        }
        public ActionResult ListaProveedores()
        {
            return Json(ModeloMaestro.ListaProveedores(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult AgregarProducto(ITF_PRODUCTOS PRODUCTO)
        {
            return Json(ModeloMaestro.AgregarProducto(PRODUCTO), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AgregarFotoAlProducto(HttpPostedFileBase ARCHIVO, int ID)
        {
            return Json(ModeloMaestro.AgregarFotoAlProducto(ARCHIVO, ID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult EditarProducto(ITF_PRODUCTOS PRODUCTO)
        {
            return Json(ModeloMaestro.EditarProducto(PRODUCTO), JsonRequestBehavior.AllowGet);
        }

        public ActionResult EliminarProducto(int ID_PRODUCTO)
        {
            return Json(ModeloMaestro.EliminarProducto(ID_PRODUCTO), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AgregarProveedor(ITF_PROVEEDORES PROVEEDOR)
        {
            return Json(ModeloMaestro.AgregarProveedor(PROVEEDOR), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AgregarCategorias(ITF_CATEGORIAS CATEGORIAS)
        {
            return Json(ModeloMaestro.AgregarCategorias(CATEGORIAS), JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region PEDIDOS
        public ActionResult Pedidos()
        {
            return View();
        }

        public ActionResult ListaPedidos()
        {
            return Json(ModeloPedidos.ListaPedidos(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DetallePedido(int ID)
        {
            return Json(ModeloPedidos.DetallePedido(ID), JsonRequestBehavior.AllowGet);
        }
        public ActionResult ProductoEntregado(int ID)
        {
            return Json(ModeloPedidos.ProductoEntregado(ID), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region MENSUALIDADES
        public JsonResult BuscarAlumno(string term)
        {
            using (ITFEntities db = new ITFEntities())
            {
                var resultado = db.ITF_USUARIOS.Where(a => (a.NOMBRE+ " " + a.APELLIDO_PATERNO + "(" + a.RUT + ")").Contains(term))
                    .Select(x => (x.NOMBRE + " " + x.APELLIDO_PATERNO+ "(" + x.RUT + ")")).Distinct().Take(5).ToList();

                return Json(resultado, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region PAGOS

        public ActionResult ListaPagos()
        {
            return Json(ModeloMaestro.ListaPagos(), JsonRequestBehavior.AllowGet);

        }
        public ActionResult RegistarMensualidad(string usuario, string ano_mes, string monto, string descripcion)
        {
            return Json(ModeloMaestro.RegistarMensualidad(usuario, ano_mes, monto, descripcion), JsonRequestBehavior.AllowGet);
        }
        #endregion





    }
}
