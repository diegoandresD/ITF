using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Pkcs;
using System.Web;
using System.Web.Mvc;

namespace ITF.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult SessionCaducada()
        {
            return View();
        }

        public ActionResult CerrarSession()
        {
            Session.RemoveAll();
            object envio = new { RESPUESTA = true};
            return Json(envio, JsonRequestBehavior.AllowGet);

        }
    }
}