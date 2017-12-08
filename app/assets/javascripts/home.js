$(document).ready(function(){
	var lines = []
	var errors = 0;
	var verified = false;
	var totalCommentHeader = 2

	//Terminou
	function completeFn() {
		lines = arguments[0].data;
		lines.splice(-1, 1)
		lines.forEach(function(item, index){
			if (index < totalCommentHeader)
				return
			item['Index'] = index + totalCommentHeader;
			item = checkThisItem(item)
			if (item['Error']){
				html = buildHtml(item)
				$('#tbody_result_table').append(html);
			}
		});

		if (errors > 0) {
			html = '<div class="alert alert-danger">' +
				'<strong>' + errors + '</strong> Errors encontrados. Faça correção antes de prosseguir' +
				'</div>'

			$('#message_block').html(html);
			$('#table_body').fadeIn('slow');
		}else{

			html =  '<div class="alert alert-success">' +
							 '<strong>SUCESSO! </strong>'+lines.length+' registros encontrados' +
							'</div>'
			$('#submit-parse').removeClass('btn-primary')
			$('#submit-parse').addClass('btn-success')
			$('#submit-parse').val('Cadastrar '+lines.length+' usuários')
			verified = true;
			$('#message_block').html(html);
		}
	}

	//Valida os campos dos items preenchidos...
	function checkThisItem(item){
		console.log(item)
		var localError = errors;
		//cidade é obrigatorio
		if (item['Cidade'] == undefined || item['Cidade'] == '') {
			errors += 1;
			item['Cidade'] = '<b style="color:red">* Não informada *</b>'
		}

		cpf = item['Cpf'];
		if(cpf == undefined || cpf == ''){
			item['Cpf'] = '<b style="color:red">* Obrigatório *</b>'
		}else if (!validaCPF(cpf)){
			errors += 1;
			item['Cpf'] = '<b style="color:red">* '+ item['Cpf']+' *</b>'
		}

		//Checa se há mais que duas ocorrencias do identificador
		if (!checkIdentifier(item['Identificador'])){
			errors += 1;
			item['Identificador'] = "<b style=\"color: red\"> Duplicidade: "+item['Identificador']+"</b>"
		}

		if(localError != errors){
			item['Error'] = true;
		}
		return item
	}

	function buildHtml(item){
		var clas = item['Error'] ? 'danger' : ''

		return "<tr class='" + clas +"'>"+
							"<td class='"+clas+"'>"+item['Index']+" </td>" +
							"<td class='"+clas+"'>"+item['Nome']+" </td>"+
							"<td class='"+clas+"'>"+item['Cpf']+"</td>" +
							"<td class='"+clas+"'>"+item['E-mail']+"</td>"+
							"<td class='"+clas+"'>"+item['Cep']+"</td>"+
							"<td class='"+clas+"'>"+item['Cidade']+"</td>"+
							"<td class='"+clas+"'>"+item['Identificador']+"</td>"+
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