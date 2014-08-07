function Search(word, properties){
	var url = "http://ja.wikipedia.org/wiki/" + word;

	$("#word").val(word);
	$("#history").append("<a href=javascript:Search('" + word + "',['title','body','links'])>" + word + "</a> > ");
	
	$("#title").empty();
	$("#body").empty();
	$("#links").empty();

	// ���ږ�
	if($.inArray("title", properties) != -1){
		Get_title(url);
	}
	
	// �{��(���o��/�i��/���X�g)
	if($.inArray("body", properties) != -1){
		Get_body(url);
	}
	
	// �{�����̃����N����
	if($.inArray("links", properties) != -1){
		Get_links(url);
	}
	
	// �_�E�����[�h�۔���
	if(typeof Blob == "undefined"){
		$("#download").val("���̃u���E�U�ɂ͑Ή����Ă��܂���B");
	}

	// ���O�����ăt�@�C���ɕۑ�(���܂�)
	$.ajax({
		url : url,
		type : "GET",
		success : function(data){
			var content = data.responseText;
			var blob = new Blob([content], {"type" : "application/x-msdownload"});
			
			window.URL = window.URL || window.webkitURL;
			$("#download").attr("href", window.URL.createObjectURL(blob));
			$("#download").attr("download", "wiki.html");

			// $("#links").append(content);
		}
	});
}

function Get_title(url){
	var title = "";

	$.ajax({
		url : url,
		type : "GET",
		success : function(data){
			title = $(data.responseText).find("#firstHeading").text();

			$("#title").append("<h3>" + title + "</h3>");
		}
	});
}

function Get_body(url){
	var body = new Array();

	$.ajax({
		url : url,
		type : "GET",
		success : function(data){
			// �{��(���o��/�i��/���X�g)�̃Z���N�^�[���
			var body_selector = "#mw-content-text > :header, \
				#mw-content-text > p, \
				#mw-content-text > dl > dt, \
				#mw-content-text > dl > dd, \
				#mw-content-text > ul > li";
			
			body = $(data.responseText).find(body_selector).each(function(){
				body.push($(this));
			});

			for(var i = 0; i < body.length; i++){
				if(body[i].tagName === "H2" || body[i].tagName === "H3" || body[i].tagName === "H4"){
					$("#body").append("<h4>" + body[i].textContent.replace(/\[\s+�ҏW\s+\]/gi, "") + "</h4>");
				}else if(body[i].tagName === "P"){
					$("#body").append("<article>" + body[i].textContent.replace(/\s/gi, "") + "</article>");
				}else if(body[i].tagName === "DT"){
					$("#body").append("<h4>" + body[i].textContent.replace(/\s/gi, "") + "</h4>");
				}else if(body[i].tagName === "DD"){
					$("#body").append("<article>" + body[i].textContent.replace(/\s/gi, "") + "</article>");
				}else if(body[i].tagName === "LI"){
					$("#body").append("<li>" + body[i].textContent.replace(/\s/gi, "") + "</li>");
				}
			}
		}
	});
}

function Get_links(url){
	var links = new Array();
	$.ajax({
		url : url,
		type : "GET",
		success : function(data){
			// �{�����̃����N���ڂ̃Z���N�^�[���
			var link_selector = "#mw-content-text > p > a, \
				#mw-content-text li > a";
			
			links = $(data.responseText).find(link_selector).each(function(){
				links.push($(this));
			});

			$("#links").append("<h4>�{�����̃����N����</h4>");
			for(var i = 0; i < links.length; i++){
				var link = links[i].getAttribute("title");
				if(link && link.indexOf("���݂��Ȃ��y�[�W") == -1){

					$("#links").append("<a href=javascript:Search('" + link.replace(/\s/gi, "_") + "',['title','body','links'])>" + link + "</a>�A");
				}
			}
		}
	});
}