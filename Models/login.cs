using Microsoft.Web.Services3.Addressing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ITF.Models
{
    public class login
    {
        public static object InicioSesion(string user, string pass, int tipo)
        {
            using (ITFEntities db = new ITFEntities())
            {
                ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.NOMBRE_USUARIO == user && a.CONTRASENA == pass && a.COD_TIPO_USUARIO == tipo).FirstOrDefault();

                if (_user != null)
                {
                    if (_user.ACTIVO == false)
                    {
                        return new { RESPUESTA = true, TIPO = 2, data = _user };
                    }
                    HttpContext.Current.Session["USER"] = _user.NOMBRE_USUARIO;
                    HttpContext.Current.Session["NAME"] = _user.NOMBRE + " " + _user.APELLIDO_PATERNO;
                    HttpContext.Current.Session["TIPO"] = _user.COD_TIPO_USUARIO;
                    HttpContext.Current.Session["RUT"] = _user.RUT;
                    return new { RESPUESTA = true, data = _user };
                }
                else
                {
                    return new { RESPUESTA = false, TIPO = 3 };
                }
            }
        }


        public static object ListaPreguntas()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_PREGUNTAS_SEGURIDAD[] _preguntas = db.ITF_PREGUNTAS_SEGURIDAD.ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _preguntas };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object RespuestaPrimeraVez(RESPUESTAS[] RESPUESTAS, string Username, string Password)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.NOMBRE_USUARIO == Username && a.CONTRASENA == Password).FirstOrDefault();

                    foreach (RESPUESTAS item in RESPUESTAS)
                    {
                        ITF_RESPUESTAS_SEGURIDAD _resp = new ITF_RESPUESTAS_SEGURIDAD();
                        _resp.RESPUESTA = item.RESPUESTA;
                        _resp.COD_USUARIO = _user.ID_USUARIO;
                        _resp.COD_PREGUNTA = item.COD_PREGUNTA;
                        db.ITF_RESPUESTAS_SEGURIDAD.Add(_resp);
                        db.SaveChanges();



                    }

                    db.Database.ExecuteSqlCommand($"UPDATE ITF_USUARIOS SET PRIMERA_VEZ = 0 where ID_USUARIO = " + _user.ID_USUARIO + "");

                    return new { RESPUESTA = true, TIPO = 1, data = _user };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }


        public static object ListaRespuestaUsuario(string usuario, string contrasena)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.NOMBRE_USUARIO == usuario && a.CONTRASENA == contrasena).FirstOrDefault();

                    object _data = (from r in db.ITF_RESPUESTAS_SEGURIDAD
                                    join p in db.ITF_PREGUNTAS_SEGURIDAD
                                    on r.COD_PREGUNTA equals p.ID_PREGUNTAS
                                    where r.COD_USUARIO == _user.ID_USUARIO
                                    select new
                                    {
                                        p.ID_PREGUNTAS,
                                        p.PREGUNTA
                                    }).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _data };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object ValidarRespuestas(RESPUESTAS[] RESPUESTAS, string usuario, string contrasena)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.NOMBRE_USUARIO == usuario && a.CONTRASENA == contrasena).FirstOrDefault();

                    bool respuesta = false;

                    foreach (RESPUESTAS item in RESPUESTAS)
                    {
                        ITF_RESPUESTAS_SEGURIDAD _resp = db.ITF_RESPUESTAS_SEGURIDAD.Where(a => a.COD_PREGUNTA == item.COD_PREGUNTA && a.COD_USUARIO == _user.ID_USUARIO).FirstOrDefault();

                        if(_resp.RESPUESTA.ToUpper() == item.RESPUESTA.ToUpper())
                        {
                            respuesta = true;
                        }
                        else
                        {
                            respuesta = false;
                            break;
                        }
                    }

                    return new { RESPUESTA = respuesta, TIPO = 1, DATA = _user };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }
    }


    public class RESPUESTAS
    {
        public string RESPUESTA { get; set; }
        public int COD_PREGUNTA { get; set; }
    }


}