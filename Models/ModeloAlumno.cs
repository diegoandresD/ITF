using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ITF.Models
{
    public class ModeloAlumno
    {

        #region Tienda

        public static List<ITF_PRODUCTOS> GetHistoricos(int page, int PageSize)
        {
            using (ITFEntities db = new ITFEntities())
            {
                List<ITF_PRODUCTOS> _data = db.ITF_PRODUCTOS.OrderBy(a => a.ID_PRODUCTO).Take(10000).Skip(page).Take(PageSize).ToList();
                //List<MI_HISTORICOS> _data = db.MI_HISTORICOS.Where(a => a.RUT_PACIENTE == "10269379-5").OrderBy(a => a.ID_HISTORICO).Skip(page * PageSize).Take(PageSize).ToList();
                return _data;
            }
        }

        public static int GetTotalHistoricos()
        {
            using (ITFEntities db = new ITFEntities())
            {
                return db.ITF_PRODUCTOS.Take(10000).Count();

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
            List<ITF_PRODUCTOS> _data = GetHistoricos(valor, PageSize);

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
        #endregion

    }
}