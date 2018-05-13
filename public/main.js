$(document).ready( function(){
   
    $('#slider-res-label').text( $('#slider-res').val() + " dpi");
    
    $('#slider-res').on('input' ,function (){
	$('#slider-res-label').text( $('#slider-res').val() + " dpi");
    });

    $('#submit').click(function (){
	var settings = { res: $('#slider-res').val(),
		         mode: $("input[name='mode']:checked").val() };
	var string = '/submit'+'?' + $.param(settings);
	console.log(string);
	$.get(string );
    });
});
