using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.SqlServer;

namespace ITF.Models
{
    public class ModeloHome
    {

        public static object ListaEventos()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string user_rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();

                    object[] _eventos = (from e in db.ITF_EVENTOS
                                              where e.ESTADO == true
                                              select new
                                              {
                                                  e.ID_EVENTO,
                                                  e.TITULO,
                                                  e.FECHA,
                                                  e.DESCRIPCION_CORTA,
                                                  e.DESCRIPCION_DETALLADA,
                                                  e.UBICACION,
                                                  e.URL_IMAGEN,
                                                  e.ESTADO,
                                                  e.COD_USUARIO_CREADOR,
                                                  e.VALOR,
                                                  e.FECHA_SUBIDA,
                                                  INSCRITO = e.VALOR.HasValue ? db.ITF_EVENTOS_INSCRIPCIONES.Where(a => a.COD_EVENTO == e.ID_EVENTO && a.COD_USUARIO == _user.ID_USUARIO).Select(a => a.COD_USUARIO).FirstOrDefault() : null
                                              }).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _eventos };
                }

            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object ListaMisEventos()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string user_rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();
                    object[] _eventos = (from e in db.ITF_EVENTOS
                                         where e.ESTADO == true && e.COD_USUARIO_CREADOR == _user.ID_USUARIO
                                         select new
                                         {
                                             e.ID_EVENTO,
                                             e.TITULO,
                                             e.FECHA,
                                             e.DESCRIPCION_CORTA,
                                             e.DESCRIPCION_DETALLADA,
                                             e.UBICACION,
                                             e.URL_IMAGEN,
                                             e.ESTADO,
                                             e.COD_USUARIO_CREADOR,
                                             e.VALOR,
                                             e.FECHA_SUBIDA,
                                             INSCRITO = e.VALOR.HasValue ? db.ITF_EVENTOS_INSCRIPCIONES.Where(a => a.COD_EVENTO == e.ID_EVENTO && a.COD_USUARIO == _user.ID_USUARIO).Select(a => a.COD_USUARIO).FirstOrDefault() : null
                                         }).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _eventos };
                }

            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object DetalleEvento(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_EVENTOS _evento = db.ITF_EVENTOS.Where(a => a.ID_EVENTO == ID).FirstOrDefault();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _evento };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        
    }
}