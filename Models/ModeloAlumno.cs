using Microsoft.Ajax.Utilities;
using Microsoft.Web.Services3.Addressing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.DynamicData;
using System.Web.Mvc;

namespace ITF.Models
{
    public class ModeloAlumno
    {

        #region Tienda

        public static object GetHistoricos(int page, int PageSize)
        {
            using (ITFEntities db = new ITFEntities())
            {
                string user_rut = HttpContext.Current.Session["RUT"].ToString();

                ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();
                ITF_ACADEMIAS _aca = db.ITF_ACADEMIAS.Where(a => a.ID_ACADEMIA == _user.COD_ADADEMIA_ACTUAL).FirstOrDefault();
                object _data = (from p in db.ITF_PRODUCTOS
                                join c in db.ITF_CATEGORIAS on p.COD_CATEGORIA equals c.ID_CATEGORIA
                                where c.COD_MAESTRO == _aca.COD_MAESTRO && p.ESTADO == true
                                select new
                                {
                                    p.ID_PRODUCTO,
                                    p.COD_PRODUCTO,
                                    p.COD_CATEGORIA,
                                    p.NOMBRE_PRODUCTO,
                                    p.DESCRIPCION,
                                    p.PRECIO_TIENDA,
                                    p.PRECIO_INTERNET,
                                    p.STOCK,
                                    p.ESTADO,
                                    p.URL_IMAGEN,
                                    p.COD_PROVEEDOR,
                                    p.MARCA,
                                    p.COD_ENTREGA,
                                    p.RESPONSABLE_ENTREGA,
                                    p.COD_SUCURSAL

                                }).OrderBy(a => a.ID_PRODUCTO).Take(1000).Skip(page).Take(PageSize).ToList();

                //List<ITF_PRODUCTOS> _data = db.ITF_PRODUCTOS.OrderBy(a => a.ID_PRODUCTO).Take(10000).Skip(page).Take(PageSize).ToList();
                //List<MI_HISTORICOS> _data = db.MI_HISTORICOS.Where(a => a.RUT_PACIENTE == "10269379-5").OrderBy(a => a.ID_HISTORICO).Skip(page * PageSize).Take(PageSize).ToList();
                return _data;
            }
        }

        public static int GetTotalHistoricos()
        {
            using (ITFEntities db = new ITFEntities())
            {
                string user_rut = HttpContext.Current.Session["RUT"].ToString();

                ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();
                ITF_ACADEMIAS _aca = db.ITF_ACADEMIAS.Where(a => a.ID_ACADEMIA == _user.COD_ADADEMIA_ACTUAL).FirstOrDefault();



                return (from p in db.ITF_PRODUCTOS
                        join c in db.ITF_CATEGORIAS on p.COD_CATEGORIA equals c.ID_CATEGORIA
                        where c.COD_MAESTRO == _aca.COD_MAESTRO && p.ESTADO == true
                        select new { p.NOMBRE_PRODUCTO }).Take(10000).Count();

                //return db.ITF_PRODUCTOS.Take(10000).Count();

            }
        }

        public static object Searching(int? page)
        {


            int valor = 0;
            if (page != null)
            {
                valor = Convert.ToInt32(page);
            }

            const int PageSize = 6; // you can always do something more elegant to set this
            int count = GetTotalHistoricos();
            //var count = this.dataSource.Count();
            object _data = GetHistoricos(valor, PageSize);

            string html = "";
            int numeropagina = 1;
            int numeroultimo = 0;
            for (int i = 1; i <= count; i += PageSize)
            {
                if (i == 1)
                {
                    html += "<li onclick='search(" + (i - 1).ToString() + ",this)' class='page-item algo item-activo'><a class='page-link activo' role='button' value='" + (i - 1).ToString() + "' >";
                    html += "<span>" + numeropagina + "</span>";
                    html += "</a></li>";

                    numeropagina += 1;
                    numeroultimo = i;
                }
                else
                {
                    html += "<li onclick='search(" + (i - 1).ToString() + ",this)' class='page-item algo'><a class='page-link' role='button' value='" + (i - 1).ToString() + "' >";
                    html += "<span>" + numeropagina + "</span>";
                    html += "</a></li>";

                    numeropagina += 1;
                    numeroultimo = i;
                }


            }

            string Fist = "<li id='NextFilter' class='page-item'><a class='page-link'  aria-label = 'Previus'><span  aria-hidden = 'true'>&raquo;</span></a></li>";
            string Last = "<li id='PreviusFilter' class='page-item'><a class='page-link' aria-label = 'Previus'><span aria-hidden = 'true'>&laquo;</span></a></li>";

            return new { RESPUESTA = true, Enlaces = html, Primero = Fist, Ultimo = Last, DATA = _data };

        }

        public static object DetalleProducto(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_PRODUCTOS _pro = db.ITF_PRODUCTOS.Where(a => a.ID_PRODUCTO == ID).FirstOrDefault();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _pro };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }
        #endregion

        #region CARTERA
        public static object ListaMovimientoCartera()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string user_rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();

                    ITF_CARTERA _cart = db.ITF_CARTERA.Where(a => a.COD_USUARIO == _user.ID_USUARIO).FirstOrDefault();

                    object[] _mov = (from cm in db.ITF_CARTERA_MOVIMIENTOS
                                     join c in db.ITF_CARTERA
                                     on cm.COD_CARTERA equals c.ID_CARTERA
                                     where c.COD_USUARIO == _user.ID_USUARIO
                                     select new
                                     {
                                         cm.ID_DETALLE,
                                         cm.FECHA,
                                         cm.CODIGO_OPERACION,
                                         cm.DESCRIPCION,
                                         cm.CARGO,
                                         cm.ABONO,
                                         cm.SALDO,
                                         cm.COD_CARTERA,
                                         cm.SUBTOTAL
                                     }).OrderByDescending(a => a.FECHA).ToArray();

                    return new { RESPUESTA = true, TIPO = 1, DATA = new { Movimiento = _mov, Cartera = _cart } };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }
        #endregion

        #region AutoLogin
        public static object AutoLogin(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.ID_USUARIO == ID).FirstOrDefault();
                    if (_user != null)
                    {
                        HttpContext.Current.Session["USER"] = _user.NOMBRE_USUARIO;
                        HttpContext.Current.Session["NAME"] = _user.NOMBRE + " " + _user.APELLIDO_PATERNO;
                        HttpContext.Current.Session["TIPO"] = _user.COD_TIPO_USUARIO;
                        HttpContext.Current.Session["RUT"] = _user.RUT;
                        return new { RESPUESTA = true, data = _user };
                    }
                    else
                    {
                        return new { RESPUESTA = false, TIPO = 2 };

                    }
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error.Message };

            }
        }
        #endregion

        #region EVENTOS
        public static object InscribirseEvento(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string user_rut = HttpContext.Current.Session["RUT"].ToString();
                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();
                    ITF_EVENTOS _evento = db.ITF_EVENTOS.Where(a => a.ID_EVENTO == ID).FirstOrDefault();

                    ITF_EVENTOS_INSCRIPCIONES _insc = new ITF_EVENTOS_INSCRIPCIONES();
                    _insc.COD_USUARIO = _user.ID_USUARIO;
                    _insc.COD_EVENTO = _evento.ID_EVENTO;
                    _insc.ESTADO = "Inscrito por Internet";
                    db.ITF_EVENTOS_INSCRIPCIONES.Add(_insc);
                    db.SaveChanges();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _insc };
                }
            }
            catch(Exception Error)
            {
                return new { RESPUESTA = true, TIPO = 3, Error = Error.Message };
            }
        }

        #endregion

    }
}