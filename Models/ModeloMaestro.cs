using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ITF.Models
{
    public class ModeloMaestro
    {

        public static object ListaMisAlumno()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS[] _user = db.ITF_USUARIOS.Where(a => a.COD_TIPO_USUARIO == 1).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _user };
                }
            }
            catch(Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }
    }
}