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
    
    public partial class ITF_EXAMEN_REALIZADOS
    {
        public int ID_EXAMEN { get; set; }
        public string NOMBRE_EXAMEN { get; set; }
        public Nullable<int> COD_GRADO { get; set; }
        public Nullable<int> FORMA { get; set; }
        public string EJERCICIOS_F_F_F { get; set; }
        public string ATAQUE { get; set; }
        public string DEFENSA_PERSONAL { get; set; }
        public string ROTURA { get; set; }
        public string TEORIA { get; set; }
        public Nullable<System.DateTime> FECHA_REALIZACION { get; set; }
        public Nullable<int> COD_USUARIO { get; set; }
        public Nullable<System.DateTime> FECHA_SUBIDA_EXAMEN { get; set; }
    }
}
