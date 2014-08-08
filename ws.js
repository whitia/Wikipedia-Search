function Search(word){
	var url = "http://ja.wikipedia.org/wiki/" + word;

	$("#word").val(word);
	$("#history").append("<a href=javascript:Search('" + word + "')>" + word + "</a> > ");
	
	$("#title").empty();
	$("#contents").empty();
	$("#image").empty();
	$("#body").empty();
	$("#links").empty();

	$("input[type='checkbox']").each(function(){
		switch($(this).val()){
			case "title":		// 項目名
				if($(this).prop("checked")){
					Get_title(url);
				}
				break;
			case "contents":	// 目次
				if($(this).prop("checked")){
					Get_contents(url);
				}
				break;
			case "image":		// 画像
				if($(this).prop("checked")){
					Get_image(url);
				}
				break;
			case "body":		// 本文(見出し/段落/リスト)
				if($(this).prop("checked")){
					Get_body(url);
				}
				break;
			case "links":		// 本文内のリンク項目
				if($(this).prop("checked")){
					Get_links(url);
				}
				break;
		}
	});
	
	// ダウンロード可否判定
	if(typeof Blob == "undefined"){
		$("#download").val("このブラウザには対応していません。");
	}

	// 名前をつけて保存
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

function Get_contents(url){
	var contents = "";

	$.ajax({
		url : url,
		type : "GET",
		success : function(data){
			contents = $(data.responseText).find("#toc").html();

			$("#contents").append(contents);
		}
	})
}

function Get_image(url){
	var image = "";

	$.ajax({
		url : url,
		type : "GET",
		success : function(data){
			image = $(data.responseText).find(".infobox .image img").attr("src");

			if(image){
				image = "http:" + image;

				$("#image").append("<img src='" + image + "' />");
			}
		}
	});
}

function Get_body(url){
	var body = new Array();

	$.ajax({
		url : url,
		type : "GET",
		success : function(data){
			// 本文(見出し/段落/リスト)のセレクター列挙
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

				switch(bodyTagName){
					case "H2" || "H3" || "H4":
						$("#body").append("<h4>" + bodyTextContent.replace(/\[\s+編集\s+\]/gi, "") + "</h4>");
						break;
					case "P":
						$("#body").append(bodyTextContent.replace(/\s/gi, ""));
						break;
					case "DT":
						$("#body").append("<h4>" + bodyTextContent.replace(/\s/gi, "") + "</h4>");
						break;
					case "DD":
						$("#body").append(bodyTextContent.replace(/\s/gi, ""));
						break;
					case "LI":
						$("#body").append("<li>" + bodyTextContent.replace(/\s/gi, "") + "</li>");
						break;
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
			// 本文内のリンク項目のセレクター列挙
			var selector = "#mw-content-text > p > a, \
				#mw-content-text li > a";
			
			links = $(data.responseText).find(selector).each(function(){
				links.push($(this));
			});

			$("#links").append("<h4>本文内のリンク項目</h4>");

			for(var i = 0; i < links.length; i++){
				var link = links[i].getAttribute("title");
				
				if(link && link.indexOf("存在しないページ") == -1){
					$("#links").append("<a href=javascript:Search('" + link.replace(/\s/gi, "_") + "')>" + link + "</a> ");
				}
			}
		}
	});
}
