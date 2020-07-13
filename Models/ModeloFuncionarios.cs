using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace ITF.Models
{
    public class ModeloFuncionarios
    {


        #region EVENTOS
        public static object ListaEventos()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string user_rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _USER = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();
                    ITF_EVENTOS[] _eventos = db.ITF_EVENTOS.Where(a => a.COD_USUARIO_CREADOR == _USER.ID_USUARIO && a.ESTADO == true).ToArray();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _eventos };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object AgregarEvento(ITF_EVENTOS EVENTOS)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string user_rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _USER = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();
                    EVENTOS.FECHA_SUBIDA = DateTime.Now;
                    EVENTOS.ESTADO = true;
                    EVENTOS.COD_USUARIO_CREADOR = _USER.ID_USUARIO;
                    db.ITF_EVENTOS.Add(EVENTOS);
                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = EVENTOS };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, DATA = Error.Message };
            }
        }

        public static object AgregarFotoAlEvento(HttpPostedFileBase ARCHIVO, int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_EVENTOS _pro = db.ITF_EVENTOS.Where(a => a.ID_EVENTO == ID).FirstOrDefault();


                    string Ruta = HttpContext.Current.Server.MapPath("~/img/Eventos/");
                    string NombreArchivo = "Evento_" + _pro.ID_EVENTO + "_" + Path.GetExtension(ARCHIVO.FileName);
                    ARCHIVO.SaveAs(Ruta + NombreArchivo);
                    _pro.URL_IMAGEN = "/img/Eventos/" + NombreArchivo;
                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _pro };

                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }

        public static object AnularEvento(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_EVENTOS _evento = db.ITF_EVENTOS.Where(a => a.ID_EVENTO == ID).FirstOrDefault();
                    _evento.ESTADO = false;
                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _evento };
                }

            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }
        #endregion


        #region MAESTROS Y ACADEMIAS
        public static object CrearAcademia(ITF_ACADEMIAS ACADEMIA)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    db.ITF_ACADEMIAS.Add(ACADEMIA);
                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = ACADEMIA };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object ListaAcademiasRestantes()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_ACADEMIAS[] _academias = db.ITF_ACADEMIAS.Where(a => a.COD_MAESTRO == null).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _academias };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object CrearMaestro(ITF_USUARIOS MAESTRO)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    MAESTRO.ACTIVO = true;
                    MAESTRO.COD_TIPO_USUARIO = 2;
                    MAESTRO.PRIMERA_VEZ = true;
                    MAESTRO.CONTRASENA = MAESTRO.NOMBRE_USUARIO;
                    db.ITF_USUARIOS.Add(MAESTRO);
                    db.SaveChanges();

                    ITF_ACADEMIAS _academia = db.ITF_ACADEMIAS.Where(a => a.ID_ACADEMIA == MAESTRO.COD_ADADEMIA_ACTUAL).FirstOrDefault();
                    _academia.COD_MAESTRO = MAESTRO.ID_USUARIO;

                    ITF_ACADEMIAS_MAESTRO _new = new ITF_ACADEMIAS_MAESTRO();
                    _new.COD_ACADEMIA = _academia.ID_ACADEMIA;
                    _new.COD_MAESTRO = MAESTRO.ID_USUARIO;
                    db.ITF_ACADEMIAS_MAESTRO.Add(_new);

                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = MAESTRO };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object ListaMaestros()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS[] _maestros = db.ITF_USUARIOS.Where(a => a.COD_TIPO_USUARIO == 2).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _maestros };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }


        public static object ActivarUsuario(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.ID_USUARIO == ID).FirstOrDefault();
                    _user.ACTIVO = true;
                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _user };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object DesactivarUsuario(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.ID_USUARIO == ID).FirstOrDefault();
                    _user.ACTIVO = false;
                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _user };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }
        #endregion
    }
}