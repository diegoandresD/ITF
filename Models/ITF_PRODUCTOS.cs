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
    
    public partial class ITF_PRODUCTOS
    {
        public int ID_PRODUCTO { get; set; }
        public string COD_PRODUCTO { get; set; }
        public Nullable<int> COD_CATEGORIA { get; set; }
        public string NOMBRE_PRODUCTO { get; set; }
        public string DESCRIPCION { get; set; }
        public Nullable<int> PRECIO_TIENDA { get; set; }
        public Nullable<int> PRECIO_INTERNET { get; set; }
        public Nullable<int> STOCK { get; set; }
        public Nullable<bool> ESTADO { get; set; }
        public string URL_IMAGEN { get; set; }
        public Nullable<int> COD_PROVEEDOR { get; set; }
    }
}
