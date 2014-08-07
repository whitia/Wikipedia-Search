function Search(word, properties){
	var url = "http://ja.wikipedia.org/wiki/" + word;

	$("#word").val(word);
	$("#history").append("<a href=javascript:Search('" + word + "',['title','body','links'])>" + word + "</a> > ");
	
	$("#title").empty();
	$("#body").empty();
	$("#links").empty();

	// 項目名
	if($.inArray("title", properties) != -1){
		Get_title(url);
	}
	
	// 本文(見出し/段落/リスト)
	if($.inArray("body", properties) != -1){
		Get_body(url);
	}
	
	// 本文内のリンク項目
	if($.inArray("links", properties) != -1){
		Get_links(url);
	}
	
	// ダウンロード可否判定
	if(typeof Blob == "undefined"){
		$("#download").val("このブラウザには対応していません。");
	}

	// 名前をつけてファイルに保存(おまけ)
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

			$("#title").append(title);
		}
	});
}

function Get_body(url){
	var body = new Array();

	$.ajax({
		url : url,
		type : "GET",
		success : function(data){
			// 本文(見出し/段落/リスト)のセレクターを列挙
			var selector = "#mw-content-text > :header, \
				#mw-content-text > p, \
				#mw-content-text > dl > dt, \
				#mw-content-text > dl > dd, \
				#mw-content-text > ul > li";
			
			body = $(data.responseText).find(selector).each(function(){
				body.push($(this));
			});

			for(var i = 0; i < body.length; i++){
				var bodyTagName = body[i].tagName;
				var bodyTextContent = body[i].textContent;

				if(bodyTagName === "H2" || bodyTagName === "H3" || bodyTagName === "H4"){
					$("#body").append("<h4>" + bodyTextContent.replace(/\[\s+編集\s+\]/gi, "") + "</h4>");
				}else if(bodyTagName === "P"){
					$("#body").append(bodyTextContent.replace(/\s/gi, ""));
				}else if(bodyTagName === "DT"){
					$("#body").append("<h4>" + bodyTextContent.replace(/\s/gi, "") + "</h4>");
				}else if(bodyTagName === "DD"){
					$("#body").append(bodyTextContent.replace(/\s/gi, ""));
				}else if(bodyTtagName === "LI"){
					$("#body").append("<li>" + bodyTextContent.replace(/\s/gi, "") + "</li>");
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
			// 本文内のリンク項目のセレクターを列挙
			var selector = "#mw-content-text > p > a, \
				#mw-content-text li > a";
			
			links = $(data.responseText).find(selector).each(function(){
				links.push($(this));
			});

			$("#links").append("<h4>本文内のリンク項目</h4>");

			for(var i = 0; i < links.length; i++){
				var link = links[i].getAttribute("title");
				
				if(link && link.indexOf("存在しないページ") == -1){
					$("#links").append("<a href=javascript:Search('" + link.replace(/\s/gi, "_") + "',['title','body','links'])>" + link + "</a>、");
				}
			}
		}
	});
}
