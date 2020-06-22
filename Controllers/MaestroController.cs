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
        public ActionResult ListaMisAlumno()
        {
            //al modelo, para traer la información
            return Json(ModeloMaestro.ListaMisAlumno(), JsonRequestBehavior.AllowGet);
        }
    }
}