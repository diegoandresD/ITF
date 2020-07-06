﻿using Microsoft.Ajax.Utilities;
using Microsoft.Web.Services3.Addressing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.DynamicData;

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

                                      }).OrderBy(a=> a.ID_PRODUCTO).Take(1000).Skip(page).Take(PageSize).ToList();

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

    }
}