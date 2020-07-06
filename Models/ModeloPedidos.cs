using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;

namespace ITF.Models
{
    public class ModeloPedidos
    {

        public static object ListaPedidos()
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    string user_rut = HttpContext.Current.Session["RUT"].ToString();

                    ITF_USUARIOS _user = db.ITF_USUARIOS.Where(a => a.RUT == user_rut).FirstOrDefault();

                    object[] _data = (from p in db.ITF_PEDIDOS
                                      join u in db.ITF_USUARIOS
                                      on p.COD_USUARIO equals u.ID_USUARIO
                                      where
                                      u.COD_ADADEMIA_ACTUAL == _user.COD_ADADEMIA_ACTUAL
                                      && p.COD_ESTADO == 2
                                      select new
                                      {
                                          p.ID_PEDIDO,
                                          p.ORDEN_COMPRA,
                                          p.FECHA,
                                          NOMBRE_USUARIO = u.NOMBRE + " " + u.APELLIDO_PATERNO
                                      }).OrderByDescending(a => a.FECHA).ToArray();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _data };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object DetallePedido(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    object _list = (from dp in db.ITF_PEDIDOS_DETALLE
                                    join p in db.ITF_PRODUCTOS on dp.ID_PRODUCTO
                                    equals p.ID_PRODUCTO
                                    where dp.COD_PEDIDO == ID
                                    select new
                                    {
                                        dp.ID_DETALLE_PEDIDO,
                                        dp.CANTIDAD,
                                        dp.PRECIO,
                                        dp.SUBTOTAL,
                                        p.ID_PRODUCTO,
                                        p.URL_IMAGEN,
                                        p.NOMBRE_PRODUCTO,
                                        p.DESCRIPCION,
                                        p.COD_PRODUCTO
                                    }).ToArray();

                    return new { RESPUESTA = true, TIPO = 1, DATA = _list };
                }
            }
            catch (Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };
            }
        }

        public static object ProductoEntregado(int ID)
        {
            try
            {
                using (ITFEntities db = new ITFEntities())
                {
                    ITF_PEDIDOS _pedido = db.ITF_PEDIDOS.Where(a => a.ID_PEDIDO == ID).FirstOrDefault();
                    _pedido.COD_ESTADO = 3; //3 => Entregado;

                    db.SaveChanges();
                    return new { RESPUESTA = true, TIPO = 1, DATA = _pedido };
                }
            }
            catch(Exception Error)
            {
                return new { RESPUESTA = false, TIPO = 3, Error = Error.Message };

            }
        }
    }
}