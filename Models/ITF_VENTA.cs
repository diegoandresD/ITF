//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ITF.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class ITF_VENTA
    {
        public int ID_VENTA { get; set; }
        public Nullable<int> CANTIDAD { get; set; }
        public Nullable<int> MONTO_TOTAL { get; set; }
        public Nullable<System.DateTime> FECHA { get; set; }
        public Nullable<int> COD_USUARIO_CLIENTE { get; set; }
        public string MEDIO_PAGO { get; set; }
        public string ESTADO { get; set; }
    }
}