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
    
    public partial class ITF_CARTERA_MOVIMIENTOS
    {
        public int ID_DETALLE { get; set; }
        public Nullable<System.DateTime> FECHA { get; set; }
        public string CODIGO_OPERACION { get; set; }
        public string DESCRIPCION { get; set; }
        public Nullable<bool> CARGO { get; set; }
        public Nullable<bool> ABONO { get; set; }
        public Nullable<int> SALDO { get; set; }
        public Nullable<int> COD_CARTERA { get; set; }
        public Nullable<int> SUBTOTAL { get; set; }
    }
}
