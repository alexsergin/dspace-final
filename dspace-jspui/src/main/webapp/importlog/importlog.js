var pages;
$(function() {
	$('#import_date').datepicker({
		dateFormat: 'dd.mm.yy'
	});
	
	$('#import_date').change(function() {
		$('#errorLogLink').attr('href', contextPath + '/import-log?date=' + $('#import_date').val() + '&area=errors');
		$('#logLink').attr('href', contextPath + '/import-log?date=' + $('#import_date').val());
	});
	
	$('#import_date').trigger('change');
	
	$('#importlog_form').submit(function(e) {
		e.preventDefault();
		$('#empty-container, #result-container').hide();
		$('#importlog_form button').prop('disabled', true);
		loadImportLog({
			date: $('#import_date').val()
		});
	});
	
	$('#importerrorlog_form').submit(function(e) {
		e.preventDefault();
		$('#empty-container, #result-container').hide();
		$('#importerrorlog_form button').prop('disabled', true);
		loadImportErrorLog({
			date: $('#import_date').val()
		});
	});
	
	$('#prevLink, #nextLink').click(function(e) {
		e.preventDefault();
		var params = {
			id: $(this).data('id')
		};
		if ($('#importerrorlog_form').length > 0) {
			loadImportErrorLog(params);
		} else {
			loadImportLog(params);
		}
	});
	$('#loadMore').click(function(e) {
		e.preventDefault();
		var params = {
			id: $(this).data('id'),
			page: $(this).data('page')
		};
		if ($('#importerrorlog_form').length > 0) {
			loadImportErrorLog(params);
		} else {
			loadImportLog(params);
		}
	});
	
	//Submit form on load
	var form = $('#importlog_form');
	if (form.length == 0) {
		form = $('#importerrorlog_form');
	}
	form.submit();
});

function loadImportLog(params) {
	$.ajax({
		url: contextPath + '/import-log?action=load',
		type: 'GET',
		dataType: 'json',
		data: params,
		cache: false
	}).done(function(response) {
		if (response.items.length > 0) {
			if (response.count != undefined) {
				$('#total').text(response.count);
			}
			if (response.firstDate != undefined) {
				$('#start_date').text(response.firstDate);
			}
			if (response.page == 1) {
				pages = response.pages;
				$('#results tbody').empty();
			}
			for (var i = 0; i < response.items.length; i++) {
				var item = $('<tr><td class="year"></td><td class="name"></td><td class="authors"></td><td class="link"></td><td class="duplicate"></td></tr>');
				item.find('.year').text(response.items[i].year);
				item.find('.name').text(response.items[i].name);
				item.find('.authors').text(response.items[i].authors);
				if (response.items[i].link != null) {
					var a = $('<a href=""></a>');
					a.text(response.items[i].link);
					a.attr('href', response.items[i].link);
					item.find('.link').append(a);
				} else {
					item.find('.link').text('Ресурс удален');
				}
				item.find('.duplicate').text(response.items[i].duplicate ? '+' : '-');
				
				$('#results tbody').append(item);
			}
			//Prev link
			if (response.prevId != null) {
				$('#prevLink').data('id', response.prevId);
				$('#prevLink').show();
			} else {
				$('#prevLink').hide();
			}
			//Next link
			if (response.nextId != null) {
				$('#nextLink').data('id', response.nextId);
				$('#nextLink').show();
			} else {
				$('#nextLink').hide();
			}
			//More link
			if (response.page < pages) {
				$('#loadMore').data('id', response.id);
				$('#loadMore').data('page', response.page + 1);
				$('#loadMore').show();
			} else {
				$('#loadMore').hide();
			}
			$('#result-container').show();
		} else {
			$('#empty-container').show();
		}
	}).always(function() {
		$('#importlog_form button').prop('disabled', false);
	});
}

function loadImportErrorLog(params) {
	$.ajax({
		url: contextPath + '/import-log?action=load&area=errors',
		type: 'GET',
		dataType: 'json',
		data: params,
		cache: false
	}).done(function(response) {
		if (response.items.length > 0) {
			if (response.count != undefined) {
				$('#total').text(response.count);
			}
			if (response.firstDate != undefined) {
				$('#start_date').text(response.firstDate);
			}
			if (response.page == 1) {
				pages = response.pages;
				$('#files').empty();
			}
			for (var i = 0; i < response.items.length; i++) {
				var item = $('<li></li>');
				item.text(response.items[i]);
				$('#files').append(item);
			}
			//Prev link
			if (response.prevId != null) {
				$('#prevLink').data('id', response.prevId);
				$('#prevLink').show();
			} else {
				$('#prevLink').hide();
			}
			//Next link
			if (response.nextId != null) {
				$('#nextLink').data('id', response.nextId);
				$('#nextLink').show();
			} else {
				$('#nextLink').hide();
			}
			//More link
			if (response.page < pages) {
				$('#loadMore').data('id', response.id);
				$('#loadMore').data('page', response.page + 1);
				$('#loadMore').show();
			} else {
				$('#loadMore').hide();
			}
			$('#result-container').show();
		} else {
			$('#empty-container').show();
		}
	}).always(function() {
		$('#importerrorlog_form button').prop('disabled', false);
	});
}