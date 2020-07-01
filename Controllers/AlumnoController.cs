using ITF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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

        public ActionResult Searching(int? page)
        {
            return Json(ModeloAlumno.Searching(page), JsonRequestBehavior.AllowGet);
        }
    }
}