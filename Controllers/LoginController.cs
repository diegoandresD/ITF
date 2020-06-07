using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ITF.Models;

namespace ITF.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index(string id)
        {
            ViewBag.TIPO = id;
            if(id == "Alumno")
            {
                ViewBag.CLASE = "btn-success alumno";
                ViewBag.TITULO = "text-success";
            }
            else if(id == "Directivo")
            {
                ViewBag.CLASE = "btn-danger directivo";
                ViewBag.TITULO = "text-danger";
            }
            else if(id == "Maestro")
            {
                ViewBag.CLASE = "btn-primary maestro";
                ViewBag.TITULO = "text-primary";
            }
            return View();
        }

        public ActionResult InicioSesion(string user, string pass, int tipo) => Json(login.InicioSesion(user, pass, tipo), JsonRequestBehavior.AllowGet);
    }
}