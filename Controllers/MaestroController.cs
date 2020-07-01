using ITF.Models;
using System;
using System.Collections.Generic;
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

        public ActionResult Pedidos()
        {
            return View();
        }

        public ActionResult Mensualidades()
        {
            return View();
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

        #endregion






    }
}