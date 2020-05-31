using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ITF.Models
{
    public class login
    {
        public static object InicioSesion(string user, string pass)
        {
            using (ITFEntities db = new ITFEntities())
            {
                ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.NOMBRE_USUARIO == user && a.CONTRASENA == pass).FirstOrDefault();

                if(_user != null)
                {
                    HttpContext.Current.Session["USER"] = _user.NOMBRE_USUARIO;
                    HttpContext.Current.Session["NAME"] = _user.NOMBRE + " " + _user.APELLIDO_PATERNO;
                    HttpContext.Current.Session["TIPO"] = _user.COD_TIPO_USUARIO;
                    HttpContext.Current.Session["RUT"] = _user.RUT;
                    
                    return new { RESPUESTA = true, _user };
                }
                else
                {
                    return new { RESPUESTA = false };

                }
            }
        }
    }
}