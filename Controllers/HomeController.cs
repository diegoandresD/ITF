using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ITF.Controllers
{
    public class HomeController : Controller
    {
        //Menú
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult Academias()
        {
            return View();
        }

        //Contácto
        public ActionResult Contacto()
        {
            return View();
        }

        public ActionResult Galeria()
        {
            return View();
        }

        public ActionResult Reglamento()
        {
            return View();
        }
        public ActionResult Eventos()
        {
            return View();
        }

    }
}