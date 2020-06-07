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
        public ActionResult ProgresionAlumnos()
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
    }
}