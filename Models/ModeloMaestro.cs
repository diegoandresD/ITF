using Microsoft.SqlServer.Server;
using Microsoft.Web.Services3.Addressing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;

namespace ITF.Models
{
    public class ModeloMaestro
    {
        #region Alumno
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

        public static object ListaGrados()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_GRADOS[] _grados = db.ITF_GRADOS.Where(a => a.ESTADO == true).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _grados };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };//mensaje del error };

            }
        }

        public static object ListaDatosConfirmacion(string RUT)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    object _INDICADORES = null;
                    object _datos_anteriores = null;

                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == RUT).FirstOrDefault();

                    if (_user != null)
                    {
                        _INDICADORES = (from i in db.ITF_INDICADORES
                                        join g in db.ITF_GRADOS on i.COD_GRADO equals g.ID_GRADO
                                        where i.COD_USUARIO == _user.ID_USUARIO
                                        select new
                                        {
                                            i.ID_INDICADOR,
                                            i.ESTATURA,
                                            i.PESO,
                                            g.NOMBRE
                                        }).FirstOrDefault();




                        _datos_anteriores = (from a in db.ITF_ACADEMIAS
                                             join u in db.ITF_USUARIOS
                                             on a.COD_MAESTRO equals u.ID_USUARIO
                                             where a.ID_ACADEMIA == _user.COD_ACADEMIA_ANTERIOR
                                             select new
                                             {
                                                 a.COD_MAESTRO,
                                                 a.NOMBRE_ACADEMIA,
                                                 NOMBRE_COMPLETO = u.NOMBRE + " " + u.APELLIDO_PATERNO + " " + u.APELLIDO_MATERNO,
                                             }).FirstOrDefault();
                    }


                    return new { RESPUESTA = true, TIPO = 1, DATA = new { INDI = _INDICADORES, ANTERIOR = _datos_anteriores, USER = _user } };

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
            catch (Exception Error)//obtengo la excepcion.
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

                    string Rut = HttpContext.Current.Session["RUT"].ToString();

                    ITF_USUARIOS _maestro = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();

                    List<int?> academias = new List<int?>();

                    ITF_ACADEMIAS[] _aca = db.ITF_ACADEMIAS.Where(a => a.COD_MAESTRO == _maestro.ID_USUARIO).ToArray();
                    foreach (var item in _aca)
                    {
                        academias.Add(item.ID_ACADEMIA);
                    }



                    ITF_USUARIOS[] _user = db.ITF_USUARIOS.Where(a => a.COD_TIPO_USUARIO == 1 && academias.Contains(a.COD_ADADEMIA_ACTUAL)).ToArray();
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


        public static object AnularAlumno(int ID)
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
                return new { RESULTADO = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object ActivarAlumno(int ID)
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
                return new { RESULTADO = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object AgregarDatosTecnicos(ITF_INDICADORES INDICADORES)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    db.ITF_INDICADORES.Add(INDICADORES);
                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = INDICADORES };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error.Message };
            }
        }

        public static object DatosTecnicosUsuario(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_INDICADORES _ind = db.ITF_INDICADORES.Where(a => a.COD_USUARIO == ID).FirstOrDefault();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _ind };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error.Message };
            }
        }
        #endregion

        #region Tienda
        public static object ListaInicial()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string Rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();

                    ITF_CATEGORIAS[] _listaCategorias = db.ITF_CATEGORIAS.Where(a => a.COD_MAESTRO == _user.ID_USUARIO).ToArray();
                    ITF_PROVEEDORES[] _listaProveedores = db.ITF_PROVEEDORES.Where(a => a.COD_MAESTRO == _user.ID_USUARIO).ToArray();

                    return new { RESPUESTA = true, TIPO = 1, DATA = new { CATEGORIAS = _listaCategorias, PROVEEDORES = _listaProveedores } };
                }
            }
            catch (Exception Error)
            {
                return new
                {
                    RESPUESTA = true,
                    TIPO = 3,
                    Error = Error.Message
                };
            }
        }

        public static object ListaProductos()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string Rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();

                    object[] items = (from p in db.ITF_PRODUCTOS
                                      join prov in db.ITF_PROVEEDORES
                                      on p.COD_PROVEEDOR equals prov.ID_PROVEEDOR
                                      join ct in db.ITF_CATEGORIAS
                                      on p.COD_CATEGORIA equals ct.ID_CATEGORIA
                                      where p.ESTADO == true && ct.COD_MAESTRO == _user.ID_USUARIO
                                      select new
                                      {
                                          p.ID_PRODUCTO,
                                          p.NOMBRE_PRODUCTO,
                                          p.DESCRIPCION,
                                          p.PRECIO_INTERNET,
                                          p.PRECIO_TIENDA,
                                          p.STOCK,
                                          p.MARCA,
                                          p.URL_IMAGEN,
                                          ct.ID_CATEGORIA,
                                          prov.ID_PROVEEDOR
                                      }).ToArray();

                    return new { RESPUESTA = true, TIPO = 1, DATA = items };


                }

            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };

            }

        }
        public static object ListaCategorias()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string Rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();
                    ITF_CATEGORIAS[] _categorias = db.ITF_CATEGORIAS.Where(a => a.COD_MAESTRO == _user.ID_USUARIO).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _categorias };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }
        public static object ListaProveedores()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string Rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();
                    ITF_PROVEEDORES[] _PROVEEDOR = db.ITF_PROVEEDORES.Where(a => a.ESTADO == true && a.COD_MAESTRO == _user.ID_USUARIO).ToArray();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _PROVEEDOR };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }

        public static object AgregarProducto(ITF_PRODUCTOS PRODUCTO)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    //url;
                    PRODUCTO.ESTADO = true;
                    db.ITF_PRODUCTOS.Add(PRODUCTO);
                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = PRODUCTO };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }

        public static object AgregarFotoAlProducto(HttpPostedFileBase ARCHIVO, int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_PRODUCTOS _pro = db.ITF_PRODUCTOS.Where(a => a.ID_PRODUCTO == ID).FirstOrDefault();
                    string Ruta = HttpContext.Current.Server.MapPath("~/img/Productos/");
                    string NombreArchivo = "Producto_" + _pro.COD_PRODUCTO + "_" + _pro.ID_PRODUCTO + Path.GetExtension(ARCHIVO.FileName);
                    ARCHIVO.SaveAs(Ruta + NombreArchivo);
                    _pro.URL_IMAGEN = "/img/Productos/" + NombreArchivo;
                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _pro };

                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }

        public static object ProductoID(int ID_PRODUCTO)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_PRODUCTOS _pro = db.ITF_PRODUCTOS.Where(a => a.ID_PRODUCTO == ID_PRODUCTO).FirstOrDefault();
                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _pro };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }

        public static object EditarProducto(ITF_PRODUCTOS PRODUCTO)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_PRODUCTOS _pro = db.ITF_PRODUCTOS.Where(a => a.ID_PRODUCTO == PRODUCTO.ID_PRODUCTO).FirstOrDefault();

                    _pro.NOMBRE_PRODUCTO = PRODUCTO.NOMBRE_PRODUCTO;
                    _pro.COD_CATEGORIA = PRODUCTO.COD_CATEGORIA;
                    _pro.DESCRIPCION = PRODUCTO.DESCRIPCION;
                    _pro.PRECIO_INTERNET = PRODUCTO.PRECIO_INTERNET;
                    _pro.PRECIO_TIENDA = PRODUCTO.PRECIO_INTERNET;
                    _pro.STOCK = PRODUCTO.STOCK;
                    _pro.COD_PROVEEDOR = PRODUCTO.COD_PROVEEDOR;
                    _pro.MARCA = PRODUCTO.MARCA;

                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _pro };

                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }

        public static object EliminarProducto(int ID_PRODUCTO)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_PRODUCTOS _pro = db.ITF_PRODUCTOS.Where(a => a.ID_PRODUCTO == ID_PRODUCTO).FirstOrDefault();
                    _pro.ESTADO = false;

                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _pro };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }

        public static object AgregarProveedor(ITF_PROVEEDORES PROVEEDOR)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string Rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();


                    PROVEEDOR.ESTADO = true;
                    PROVEEDOR.COD_MAESTRO = _user.ID_USUARIO;
                    db.ITF_PROVEEDORES.Add(PROVEEDOR);
                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = PROVEEDOR };
                }
            }
            catch(Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object AgregarCategorias(ITF_CATEGORIAS CATEGORIAS)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string Rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();


                    CATEGORIAS.ESTADO = true;
                    CATEGORIAS.COD_MAESTRO = _user.ID_USUARIO;
                    db.ITF_CATEGORIAS.Add(CATEGORIAS);
                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = CATEGORIAS };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }


        #endregion

        #region PAGO
        public static object ListaPagos()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string Rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == Rut).FirstOrDefault();

                    object[] _data = (from p in db.ITF_PAGOS
                                      join u in db.ITF_USUARIOS
                                      on p.COD_USUARIO equals u.ID_USUARIO
                                      where u.COD_ADADEMIA_ACTUAL == _user.COD_ADADEMIA_ACTUAL
                                      select new
                                      {
                                          NOMBRE_ALUMNO = u.NOMBRE + " " + u.APELLIDO_PATERNO + "( " + u.RUT + " )",
                                          p.FECHA_PAGO,
                                          p.ESTADO,
                                          PERIODO = p.ESTADO,
                                          p.DESCRIPCION
                                      }).ToArray();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _data };

                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }


        public static object RegistarMensualidad(string usuario, string ano_mes, string monto, string descripcion)
        {
            try
            {
                monto = monto.Replace(",", "");
                monto = monto.Replace(".", "");
                string[] Periodo = ano_mes.Split('/');
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => (a.NOMBRE + " " + a.APELLIDO_PATERNO + "(" + a.RUT + ")") == usuario).FirstOrDefault();
                    ITF_PAGOS _pago = new ITF_PAGOS();
                    _pago.MES = Periodo[0];
                    _pago.ANO = Periodo[1];
                    _pago.COD_USUARIO = _user.ID_USUARIO;
                    _pago.MONTO = Convert.ToInt32(monto);
                    _pago.ESTADO = "Mensualidad " + ano_mes;
                    _pago.DESCRIPCION = descripcion;
                    _pago.FECHA_PAGO = DateTime.Now;

                    db.ITF_PAGOS.Add(_pago);
                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _pago };
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