function Submit(){
	$(function(){
		var packs = new Array();
		var url = "http://stepmaniaonline.net/index.php?page=downloads";
		
		$("#mydiv").empty();
		$("#mydiv").append("<ol></ol>");
		
		// ドキュメント読み込みが完了してから処理開始
		$(document).ready(function(){
			$.ajax({
				url : url,
				type : "GET",
				success : function(data){
					packs = $(data.responseText).find("div.blocktitle:contains('Songs') + div.blockcontent a[style='color:#7DC94F']").each(function(){
						packs.push($(this));
					});
					
					$("#mydiv").prepend("<div align='center'><b>Keyboard Packs</b> [" + packs.length + " files]</div>");
					
					for(var i = 0; i < packs.length; i++){
						$("#mydiv ol").append("<li>" + packs[i].textContent + "</li>");
					}
					
					//$("#mydiv").append(data.responseText);
				}
			});
		});
	});
}