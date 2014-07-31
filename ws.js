function Search(word){
	$(function(){
		// ダウンロード可否判定
		if(typeof Blob == "undefined"){
			$("#download").val("このブラウザには対応していません。");
		}
		
		var lines = new Array();
		var items = new Array();
		var links = new Array();
		var url = "http://ja.wikipedia.org/wiki/" + word;
		
		$("#word").val(word);
		$("#mydiv").empty();
		
		// ドキュメント読み込みが完了してから処理開始
		$(document).ready(function(){
			$.ajax({
				url : url,
				type : "GET",
				success : function(data){
					$("#mydiv").append("<h3>" + $(data.responseText).find("#firstHeading").text() + "</h3>");
					
					// 項目名／段落
					lines = $(data.responseText).find("#mw-content-text > p, #mw-content-text > h2").each(function(){
						lines.push($(this));
					});
					for(var i = 0; i < lines.length; i++){
						var str = lines[i].textContent.replace(/[\n\r]/g + "<a", "");
						if(str.indexOf("編集") != -1){
							$("#mydiv").append("<h4>" + str.replace(/\[\s+編集\s+\]/gi, "") + "</h4>");
						}else{
							$("#mydiv").append("<article>" + str + "</article>");
						}
					}
					
					$("#mydiv").append("<hr />");
					
					// 関連項目
					items = $(data.responseText).find("h2:contains('関連項目') ~ ul:first > li > a").each(function(){
						items.push($(this));
					});
					$("#mydiv").append("<h4>関連項目</h4>");
					for(var i = 0; i < items.length; i++){
						$("#mydiv").append("<a href=javascript:(Search('" + items[i].getAttribute("title") + "'));>" + items[i].getAttribute("title") + "</a>、");
					}
					$("#mydiv").append("<br /><br />");
					
					// 関連用語 (本文内のリンク項目)
					links = $(data.responseText).find("#mw-content-text > p > a").each(function(){
						links.push($(this));
					});
					$("#mydiv").append("<h4>関連用語 (本文内のリンク項目)</h4>");
					for(var i = 0; i < links.length; i++){
						$("#mydiv").append("<a href=javascript:(Search('" + links[i].getAttribute("title") + "'));>" + links[i].getAttribute("title") + "</a>、");
					}
					
					// 名前をつけてファイルに保存
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