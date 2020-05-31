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
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult InicioSesion(string user, string pass)
        {
            return Json(login.InicioSesion(user, pass), JsonRequestBehavior.AllowGet);
        }
    }
}