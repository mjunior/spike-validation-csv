$(document).ready(function(){
	var lines = []
	var errors = 0;
	var verified = false;

	//Terminou
	function completeFn() {
		lines = arguments[0].data;
		lines.splice(-1, 1)
		lines.forEach(function(item){
			item = checkThisItem(item)
			html = buildHtml(item)
			$('#tbody_result_table').append(html);
		});

		if(errors > 0){
			alert('*** Total de erros encontrados: '+errors+' ***\n *** Efetue a correção e envie planilha novamente**')
		}else{
			alert('Dados corretos, prossiga com envio')
			$('#submit-parse').val('Cadastrar '+lines.length+' usuários')
			verified = true;
			$('#sendbutton').fadeIn('slow');
		}
	}

	//Valida os campos dos items preenchidos...
	function checkThisItem(item){
		//cidade é obrigatorio
		if (item['Cidade'] == undefined || item['Cidade'] == '') {
			errors += 1;
			item['Cidade'] = '<b style="color:red">* Não informada *</b>'
		}

		//Estado também é obrigatorio
		if (item['Estado'] == undefined || item['Estado'] == '') {
			errors += 1;
			item['Estado'] = '<b style="color:red">* Não informada *</b>'
		}

		//Checa se há mais que duas ocorrencias do identificador
		if (!checkIdentifier(item['Identificador'])){
			errors += 1;
			item['Identificador'] = "<b style=\"color: red\"> Duplicidade: "+item['Identificador']+"</b>"
		}
		return item
	}

	function buildHtml(item){
		return "<tr>"+
							"<th>"+item['Nome']+" </th>"+
							"<th>"+item['E-mail']+"</th>"+
							"<th>"+item['Telefone']+"</th>"+
							"<th>"+item['Cidade']+"</th>"+
							"<th>"+item['Estado']+"</th>"+
							"<th>"+item['Bairro']+"</th>"+
							"<th>"+item['Complemento']+"</th>"+
							"<th>"+item['Telefone']+"</th>"+
							"<th>"+item['Celular']+"</th>"+
							"<th>"+item['Identificador']+"</th>"+
						"</tr>"
	}

	function checkIdentifier(id){
		count = 0;
		result = lines.find(function (x){ 
			if(x['Identificador'] == id){
				count += 1;
			}
		})
		console.log('Fim ID:', count)
		return count < 2
	}

	function errorFn(){
		console.log('!!!! error !!!!')
	}

	//Parse ao click
	$('#form_file').submit(function () {
		//Caso o form não tenha sido verificado
		erros = 0;
		if(!verified){
			//reseta HTML e os ERROS
			$('#tbody_result_table').empty();
			//Pega arquivo e faz parse
			var files = $('#files')[0].files;
			if (files.length > 0) {
				start = performance.now();
				$('#files').parse({
					config: {
						complete: completeFn,
						error: errorFn,
						header: true
					},
					before: function (file, inputElem) {
						console.log("Antes do parse do:", file);
					},
					complete: function () {
						console.log("Parse concluido com sucesso !!!");
					}
				});
			}
			return false;
		}
	});
})