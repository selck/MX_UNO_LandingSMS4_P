function insertPatrocinado(index){
	 if($("#checkbox"+index+"").is(':checked')) {  
            arrayMagazine [ index ].fiBanPatrocinio=1;
        } else {  
            arrayMagazine [ index ].fiBanPatrocinio=0;
        } 
}

function validarLinks(){
	var flag=false;
	for ( var i = 0; i < arrayMagazine.length; i++) {
		if(arrayMagazine[i].fcNombre == ""){
			flag =true;
			break;
		}
	}
	return flag;
}
	function guardarLink(index){
		var indexArray=index;
		var i=index+1;
		var nuevoLink=$("#linkNoticia"+i).val();
		if(nuevoLink == ""){
			confirm("Favor de validar link");
		}else{
			arrayMagazine [ indexArray ].fcNombre=nuevoLink;
			$("#linkNoticia"+i).prop("disabled", true);
			$("#tdLinkNoticia"+index).empty();
			$("#tdLinkNoticia"+index).html('<a href="javascript:editarLink('+index+')">Editar Link</a>');
		}
	}
	function cancelarLink(index){
		var i=index+1;
		$("#linkNoticia"+i).val(arrayMagazine [ index ].fcNombre);
		$("#linkNoticia"+i).prop("disabled", true);
		$("#tdLinkNoticia"+index).empty();
		$("#tdLinkNoticia"+index).html('<a href="javascript:editarLink('+index+')">Editar Link</a>');
	}
	function editarLink(index){
		var i=index+1;
		 $("#linkNoticia"+i).prop("disabled", false); 
		 $("#tdLinkNoticia"+index).empty();
		 $("#tdLinkNoticia"+index).html('<a href="javascript:guardarLink('+index+')">Guardar</a> <a href="javascript:cancelarLink('+index+')">Cancelar</a>');	
	}

function cortarURL(url){
	
		   var login = "unotv";
		   var api_key = "R_ce44f9b4e40b724699669b1807009ffc";
		   var longUrl = url;	
		   console.log("Esta veda: "+longUrl);	
		   $.ajax({
		   url:"http://api.bit.ly/v3/shorten?",        
		   data:{longUrl:longUrl, apiKey:api_key, login:login },
		   dataType:"jsonp",         
		   success:function(respuesta) {
		   console.log(respuesta.status_txt);
		   console.log(respuesta.data.url); 
			   if(respuesta.status_code == 200 ){
					document.getElementById("url-mobile").value = longUrl;
					document.getElementById("url-mobile-recortada").value = respuesta.data.url;
					$("#allContent").hide();
					$("#muestraUrlMobile").show();
			   }else{
					document.getElementById("url-mobile").value = longUrl;
					document.getElementById("url-mobile-recortada").value = respuesta.status_code + ' : ' + respuesta.status_txt;
					$("#allContent").hide();
					$("#muestraUrlMobile").show();
			   }
			   $("#div_generar_html").show();
			   $("#loading").hide();
		   }
		}); 
	}

	function createHTML(){
		var estadoSeleccionado = $("#estado option:selected").text();
		var paramEstadoSeleccionado = $("#estado").val();
		var numLanding =$("#numLanding").val();
		var landingSeleccionado = $("#numLanding").val();
		
		if (!validarLinks()) {
			if(paramEstadoSeleccionado !="-1"){
				if(numLanding !="-1"){
					$("#div_generar_html").hide();
					$("#loading").show();
					$.ajax({
						type: "post",
						dataType: "text",			
						url: generaHtml,
						data: {listNotas : JSON.stringify(arrayMagazine),estadoSeleccionado:estadoSeleccionado,paramEstadoSeleccionado:paramEstadoSeleccionado,landingSeleccionado:landingSeleccionado},
				        async:false,
				        
						success: function(data) {
							if(data != "error"){
								$("#previa").html("");
								document.getElementById("url-mobile").value = data;
								$("#allContent").hide();
								$("#muestraUrlMobile").show();
								
							}else{
								confirm("Error al recortar url");
								$("#div_generar_html").show();
								$("#loading").hide();
							}
						}
					});	
				}else{
					confirm("Favor de Seleccionar N\u00famero de landing");
				}
			}else{
				confirm("Favor de Seleccionar un estado");
			}
		}else {
			confirm("Favor de verificar que los links no esten vacios");
		}
	}
	
	function finCreateHTML(formaFC){
		formaFC.submit();
	}
	
	function showVistaPrevia() {
		if (!validarLinks()) {
			$.ajax({
				type: "post",		
				dataType : "html",
				url: vistaPrevia,
				data: {listNotas : JSON.stringify(arrayMagazine)},
				async:false,
				beforeSend: function() {
					$("#wait").css("display", "block");
			    },
				success: function(data) {
			    	console.debug("success showVistaPrevia");
					if(data != "error"){
						console.debug(data);
						$("#previa").html(data);
					}else{
						alert("Error al crear Vista Previa");
					}
					$("#wait").css("display", "none");
				},error: function (xhr, ajaxOptions, thrownError) {
					console.debug("Error showVistaPrevia");
					console.debug(xhr.status);
					console.debug(thrownError);
			    },complete: function() {
			    	$("#wait").css("display", "block");
			    	console.debug("Complete veda");
			    	var _window = window.open("", "");
					_window.document.write($("#previa").html());
			    }
			});	
		}else{
			confirm("Favor de verificar que los links no esten vacios");
		}
	}