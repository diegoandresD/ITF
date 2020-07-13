using ITF.Models;
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

        #region EVENTOS
        public ActionResult ListaEventos()
        {
            return Json(ModeloHome.ListaEventos(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ListaMisEventos()
        {
            return Json(ModeloHome.ListaMisEventos(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DetalleEvento(int ID)
        {
            return Json(ModeloHome.DetalleEvento(ID), JsonRequestBehavior.AllowGet);
        }

        
        #endregion

    }
}