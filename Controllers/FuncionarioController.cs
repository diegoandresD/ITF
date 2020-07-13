using ITF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ITF.Controllers
{
    public class FuncionarioController : Controller
    {
        // GET: Funcionario
        public ActionResult Home()
        {
            return View();
        }

        public ActionResult CrearEvento()
        {
            return View();
        }
        //Listado de academias + progresión de exámenes.
        public ActionResult Progresion()
        {
            return View();
        }
        //Listado de academias + progresión de torneos internos (Ranking). 
        public ActionResult RankingInterno()
        {
            return View();
        }
        //Listado de Maestros;
        public ActionResult Maestros()
        {
            return View();
        }

        #region EVENTOS

        public ActionResult ListaEventos()
        {
            return Json(ModeloFuncionarios.ListaEventos(), JsonRequestBehavior.AllowGet);

        }

        public ActionResult AgregarEvento(ITF_EVENTOS EVENTO)
        {
            return Json(ModeloFuncionarios.AgregarEvento(EVENTO), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AgregarFotoAlEvento(HttpPostedFileBase ARCHIVO, int ID)
        {
            return Json(ModeloFuncionarios.AgregarFotoAlEvento(ARCHIVO, ID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AnularEvento(int ID)
        {
            return Json(ModeloFuncionarios.AnularEvento(ID), JsonRequestBehavior.AllowGet);

        }
        #endregion

        #region ACADEMIAS Y MAESTROS
        public ActionResult ListaMaestros()
        {
            return Json(ModeloFuncionarios.ListaMaestros(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ListaAcademiasRestantes()
        {
            return Json(ModeloFuncionarios.ListaAcademiasRestantes(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CrearAcademia(ITF_ACADEMIAS ACADEMIA)
        {
            return Json(ModeloFuncionarios.CrearAcademia(ACADEMIA), JsonRequestBehavior.AllowGet);

        }
        public ActionResult CrearMaestro(ITF_USUARIOS MAESTRO)
        {
            return Json(ModeloFuncionarios.CrearMaestro(MAESTRO), JsonRequestBehavior.AllowGet);

        } 
        public ActionResult DesactivarUsuario(int ID)
        {
            return Json(ModeloFuncionarios.DesactivarUsuario(ID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ActivarUsuario(int ID)
        {
            return Json(ModeloFuncionarios.ActivarUsuario(ID), JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}