$(function(){
	$('.galeria .contenedor-imagen').on('click', function(){
		$('#modal').modal;
		var ruta_imagen = ($(this).find('img').attr('src'));
		$('#imagen-modal').attr('src', ruta_imagen);
	});

	// Buscamos la clase galeria el contenedor imagen si hacemos click busca el objeto clickeado en img src y almacena la ruta en ruta_imagen la reemplaza por la #imagen-modal
	// actualiza la nueva ruta y carga la nueva imagen.

	$('#modal').on('click', function(){  
		$('#modal').modal('hide');
	});
})

// Codigo para que si doy click afuera de la imagen se salga del modal