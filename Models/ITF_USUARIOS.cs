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
    
    public partial class ITF_USUARIOS
    {
        public int ID_USUARIO { get; set; }
        public string RUT { get; set; }
        public string NOMBRE { get; set; }
        public string APELLIDO_PATERNO { get; set; }
        public string APELLIDO_MATERNO { get; set; }
        public string NOMBRE_SOCIAL { get; set; }
        public Nullable<System.DateTime> FECHA_NACIMIENTO { get; set; }
        public Nullable<int> COD_GENERO { get; set; }
        public string NOMBRE_USUARIO { get; set; }
        public string CONTRASENA { get; set; }
        public string CORREO_ELECTRONICO { get; set; }
        public string TELEFONO { get; set; }
        public string TELEFONO_CONTACTO { get; set; }
        public string DIRECCION { get; set; }
        public Nullable<int> COD_ACADEMIA_ANTERIOR { get; set; }
        public Nullable<int> COD_ADADEMIA_ACTUAL { get; set; }
        public Nullable<int> COD_TIPO_USUARIO { get; set; }
    }
}
