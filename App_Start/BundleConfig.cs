using System.Web;
using System.Web.Optimization;

namespace ITF
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.validate*"));

            //// Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información. De este modo, estará
            //// para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            //          "~/Scripts/bootstrap.js"));



            bundles.Add(new StyleBundle("~/bundles/js").Include(
                "~/js/bootstrap.min.js",
                "~/js/scripts.js",
                "~/js/popper.min.js",
                "~/plugins/moment.js"
                ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Css/bootstrap.min.css",
                      "~/fontawesome-free-5.13.0-web/css/fontawesome.css",
                      "~/fontawesome-free-5.13.0-web/css/brands.css",
                      "~/fontawesome-free-5.13.0-web/css/solid.css"
                      ));


            //js y css de la vista login
            bundles.Add(new StyleBundle("~/Content/cssLogin").Include(
                      "~/Login/vendor/bootstrap/css/bootstrap.min.css",
                      "~/Login/fonts/font-awesome-4.7.0/css/font-awesome.min.css",
                      "~/Login/fonts/iconic/css/material-design-iconic-font.min.css",
                      "~/Login/vendor/animate/animate.css",
                      "~/Login/vendor/css-hamburgers/hamburgers.min.css",
                      "~/Login/vendor/animsition/css/animsition.min.css",
                      "~/Login/vendor/select2/select2.min.css",
                      "~/Login/vendor/daterangepicker/daterangepicker.css",
                      "~/Login/css/util.css",
                      "~/Login/css/main.css",
                      "~/fontawesome-free-5.13.0-web/css/fontawesome.css",
                      "~/fontawesome-free-5.13.0-web/css/brands.css",
                      "~/fontawesome-free-5.13.0-web/css/solid.css"
                      ));

            bundles.Add(new StyleBundle("~/bundles/jsLogin").Include(
                "~/Login/vendor/jquery/jquery-3.2.1.min.js",
                "~/Login/vendor/animsition/js/animsition.min.js",
                "~/Login/vendor/bootstrap/js/popper.js",
                "~/Login/vendor/bootstrap/js/bootstrap.min.js",
                "~/Login/vendor/select2/select2.min.js",
                "~/Login/vendor/daterangepicker/moment.min.js",
                "~/Login/vendor/daterangepicker/daterangepicker.js",
                "~/Login/js/main.js"
                ));
        }
    }
}
