function Search(word){
	$(function(){
		// �_�E�����[�h�۔���
		if(typeof Blob == "undefined"){
			$("#download").val("���̃u���E�U�ɂ͑Ή����Ă��܂���B");
		}
		
		var lines = new Array();
		var items = new Array();
		var links = new Array();
		var url = "http://ja.wikipedia.org/wiki/" + word;
		
		$("#word").val(word);
		$("#mydiv").empty();
		
		// �h�L�������g�ǂݍ��݂��������Ă��珈���J�n
		$(document).ready(function(){
			$.ajax({
				url : url,
				type : "GET",
				success : function(data){
					$("#mydiv").append("<h3>" + $(data.responseText).find("#firstHeading").text() + "</h3>");
					
					// ���ږ��^�i��
					lines = $(data.responseText).find("#mw-content-text > p, #mw-content-text > h2, #mw-content-text > h3, #mw-content-text > h4").each(function(){
						lines.push($(this));
					});
					for(var i = 0; i < lines.length; i++){
						var str = lines[i].textContent.replace(/[\n\r]/g + "<a", "");
						if(str.indexOf("�ҏW") != -1){
							$("#mydiv").append("<h4>" + str.replace(/\[\s+�ҏW\s+\]/gi, "") + "</h4>");
						}else{
							$("#mydiv").append("<article>" + str + "</article>");
						}
					}
					
					$("#mydiv").append("<hr />");
					
					// �֘A����
					items = $(data.responseText).find("h2:contains('�֘A����') ~ ul:first > li > a").each(function(){
						items.push($(this));
					});
					$("#mydiv").append("<h4>�֘A����</h4>");
					for(var i = 0; i < items.length; i++){
						$("#mydiv").append("<a href=javascript:(Search('" + items[i].getAttribute("title") + "'));>" + items[i].getAttribute("title") + "</a>�A");
					}
					$("#mydiv").append("<br /><br />");
					
					// �֘A�p�� (�{�����̃����N����)
					links = $(data.responseText).find("#mw-content-text > p > a").each(function(){
						links.push($(this));
					});
					$("#mydiv").append("<h4>�֘A�p�� (�{�����̃����N����)</h4>");
					for(var i = 0; i < links.length; i++){
						$("#mydiv").append("<a href=javascript:(Search('" + links[i].getAttribute("title") + "'));>" + links[i].getAttribute("title") + "</a>�A");
					}
					
					// ���O�����ăt�@�C���ɕۑ�
					var content = data.responseText;
					var blob = new Blob([content], {"type" : "application/x-msdownload"});
					
					window.URL = window.URL || window.webkitURL;
					$("#download").attr("href", window.URL.createObjectURL(blob));
					$("#download").attr("download", "wiki.html");
					
					// $("#mydiv").append(content);
				}
			});
		});
	});
}