using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;

namespace ITF.Models
{
    public class ModeloMaestro
    {

        public static object ListaAcademias()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string Rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();

                    object[] _academias = (from am in db.ITF_ACADEMIAS_MAESTRO
                                           join a in db.ITF_ACADEMIAS
                                           on am.COD_ACADEMIA equals a.ID_ACADEMIA
                                           where am.COD_MAESTRO == _user.ID_USUARIO
                                           select new
                                           {
                                               am.COD_ACADEMIA,
                                               a.NOMBRE_ACADEMIA
                                           }).ToArray();
                    
                    return new { RESPUESTA = true, TIPO = 1, DATA = _academias };

                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }


        public static object ListaGeneros()
        {
            try
            {
                //Instanciamos la conexion que se encuentra en el webconfig;
                using (ITFEntities db = new ITFEntities())
                {
                    //necesitamos los generos (como lista);
                    ITF_GENEROS[] _generos = db.ITF_GENEROS.ToArray();
                    //Le mando la data al controlador;
                    return new { RESPUESTA = true, TIPO = 1, DATA = _generos };
                }
            }
            catch(Exception Error)//obtengo la excepcion.
            {
                //se me callo la wea ctm.
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };//mensaje del error };
            }
        }

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
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object DetalleAlumno(int id)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.COD_TIPO_USUARIO == 1 && a.ID_USUARIO == id).FirstOrDefault();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _user };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };

            }
        }

        public static object EditarAlumno(ITF_USUARIOS _user)
        {
            try
            {
                string fecha = Convert.ToDateTime(_user.FECHA_NACIMIENTO).ToString("yyyyMMdd");
                using (ITFEntities db = new ITFEntities())
                {
                    string query = @"UPDATE ITF_USUARIOS
                           SET [RUT] = '" + _user.RUT + @"'
                              ,[NOMBRE] = '" + _user.NOMBRE + @"'
                              ,[APELLIDO_PATERNO] = '" + _user.APELLIDO_PATERNO + @"'
                              ,[APELLIDO_MATERNO] = '" + _user.APELLIDO_MATERNO + @"'
                              ,[FECHA_NACIMIENTO] = '" + Convert.ToDateTime(_user.FECHA_NACIMIENTO).ToString("yyyyMMdd") + @"'
                              ,[COD_GENERO] = " + _user.COD_GENERO + @"
                              ,[CORREO_ELECTRONICO] = '" + _user.CORREO_ELECTRONICO + @"'
                              ,[TELEFONO] = '" + _user.TELEFONO + @"'
                              ,[TELEFONO_CONTACTO] = '" + _user.TELEFONO_CONTACTO + @"'
                              ,[DIRECCION] = '" + _user.DIRECCION + @"'
                         WHERE ID_USUARIO = " + _user.ID_USUARIO + "";

                    db.Database.ExecuteSqlCommand(query);
                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _user };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object AgregarAlumno(ITF_USUARIOS _user)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    _user.CONTRASENA = _user.NOMBRE_USUARIO;
                    _user.COD_TIPO_USUARIO = 1;
                    _user.PRIMERA_VEZ = true;
                    db.ITF_USUARIOS.Add(_user);
                    db.SaveChanges();
                    return new { RESULTADO = true, TIPO = 1, DATA = _user };
                }
            }
            catch (Exception Error)
            {
                return new { RESULTADO = false, TIPO = 3, Error = Error.Message };

            }

        }
    }


}