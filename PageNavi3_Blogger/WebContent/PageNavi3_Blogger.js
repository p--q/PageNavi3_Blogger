// PageNavi3_Bloggerモジュール
var PageNavi3_Blogger = PageNavi3_Blogger || function() {
    var pg = {  // グローバルスコープに出すオブジェクト。グローバルスコープから呼び出すときはPageNavi3_Bloggerになる。
        defaults : {  // 既定値。
            "perPage" : 7, //1ページあたりの投稿数。1ページの容量が1MBを超えないように設定する。最大150まで。
            "numPages" : 5  // ページナビに表示する通常ページボタンの数。スタートページからエンドページまで。
        },
        callback : {  // フィードを受け取るコールバック関数。
            loadFeed : function(json){  // 引数にフィードを受け取る関数。 
            	var posts = [];
            	Array.prototype.push.apply(posts, json.feed.entry);// 投稿のフィードデータを配列に追加。
            	createIndex(posts);
            }
        },
        all: function(elementID) {  // ここから開始する。引数にページナビを置換する要素のidを入れる。
        	g.elem = document.getElementById(elementID);
        	if (g.elem) {fd.createURL(1);}  // 置換する要素が存在するときページナビを作成する。引数はstart-index
        }
    }; // end of pg
    var g = {  // PageNavi3_Bloggerモジュール内の"グローバル"変数。
        perPage : pg.defaults.perPage,  // デフォルト値の取得。
        numPages : pg.defaults.numPages,  // デフォルト値の取得。
        jumpPages : pg.defaults.numPages, // ジャンプボタンでページ番号が総入れ替えになる設定値。
        // postLabel : null,  // ラベル名。
        //pageNo : null,  // ページ番号。
        // currentPageNo : null,  // 現在のページ番号。
        elem : null  // ページナビを挿入するdiv要素。
    };
    function createIndex(posts) {  // 投稿のフィードデータからインデックスページを作成する。
    	var postouter;
    	var dateouter = nd.divClass(["date-outer"]);
    	var h3 = nd.h3Class(["mobile-index-title","entry-title"]);
    	h3.itemprop = "name"; 
    	var stack = [nd.divClass(["date-posts"]),nd.divClass(["post-outer"]),nd.divClass(["mobile-date-outer","date-outer"]),nd.divClass(["mobile-post-outer"]),nd.createElem("a"),h3];
    	var p = nd.stackNodes(stack);
    	var postheader = nd.divClass(["post-header"]);
    	postheader.setAttribute("style","font-size:0.9em;text-align:right;padding-bottom:5px;padding-right:30px");
    	p.firstChild.firstChild.firstChild.firstChild.appendChild(postheader);
    	var mobileindexarrow = nd.divClass(["mobile-index-arrow"]);
    	mobileindexarrow.appendChild(nd.createTxt("›"));
    	p.firstChild.firstChild.firstChild.firstChild.appendChild(mobileindexarrow);
    	stack = [nd.divClass(["mobile-index-contents"]),nd.divClass(["mobile-index-thumbnail"]),nd.divClass(["Image"]),nd.imgClass([])];
    	p.firstChild.firstChild.firstChild.firstChild.appendChild(nd.stackNodes(stack));
    	p.firstChild.firstChild.firstChild.firstChild.firstChild.appendChild(nd.divClass(["post-body"]));
    	p.firstChild.firstChild.firstChild.firstChild.firstChild.appendChild(nd.divClass([]));
    	p.firstChild.firstChild.firstChild.firstChild.firstChild.lastChild.style.clear = "both";
    	p.firstChild.firstChild.firstChild.appendChild(nd.divClass([]));
    	posts.forEach(function(e){  // 投稿のフィードデータについて
    		postouter = p.cloneNode(true);
    		postouter.firstChild.firstChild.firstChild.firstChild.firstChild.appendChild(nd.createTxt(e.link[4].title));
    		postouter.firstChild.firstChild.firstChild.firstChild.href = e.link[4].href;
    		
    		
    		postouter.firstChild.firstChild.firstChild.lastChild.appendChild(nd.createTxt("ラベル:"));
    		
    		dateouter.appendChild(postouter);
    	});
    	g.elem.appendChild(dateouter);
    }
    var nd = {
		divClass: function(classNames) {  // クラス付きdivを返す。引数はクラス名の配列。
			return nd._tagClass("div", classNames);
		},
		h3Class: function(classNames) {
			return nd._tagClass("h3", classNames);
		},
		imgClass: function(classNames) {
			return nd._tagClass("img", classNames);
		},
		_tagClass: function(tag,classNames) {
			var node = nd.createElem(tag); 
			if (classNames.length){
				classNames.forEach(function(e) {
					node.classList.add(e);
				});
			}
			return node;				
		},
		createElem: function(tag) {  // tagの要素を作成して返す。
			return document.createElement(tag); 
		},
		createTxt: function(txt) {
			return document.createTextNode(txt);
		},
		stackNodes: function(stack) {
	    	var c = stack.pop();
	    	while (stack.length) {  // 配列の要素の有無でfalseは判断できない。
	    		p = stack.pop();
	    		p.appendChild(c);
	    		c = p;
	    	}
	    	return p;
		}
    };  // end of nd
    var fd = {
		createURL: function (idx) {  // URLから情報を得てフィードを取得するURLを作成。引数はstart-index。
	    	var reL = /\/search\/label\/(.+)/;  // ラベル収得のための正規表現パターン。
	    	var reQ = /\?q=(.+)/;  // 検索語収得のための正規表現パターン。
	    	var reM = /(\d\d\d\d)_(\d\d)_\d\d_archive.html/;  // 月のアーカイブページから年月を得るための正規表現パターン。
	    	var reY = /\/search\?(updated-min=\d\d\d\d-01-01T00:00:00%2B09:00&updated-max=\d\d\d\d-01-01T00:00:00%2B09:00)/;  // 年のアーカイブページから期間を得るための正規表現パターン。
	    	var url = "?"; // フィードを得るURLを初期化。
	    	var url2 = "";  // アーカイブページ用の追加URLを初期化。
	    	var thisUrl = location.href;  // 現在表示しているURLを収得。
	    	thisUrl = thisUrl.replace(/\?m=[01][&\?]/,"?").replace(/[&\?]m=[01]/,"");  // ウェブバージョンとモバイルサイトのパラメータを削除。
	    	if (reQ.test(thisUrl)) {  // 検索結果ページのとき
	        	var q = reQ.exec(thisUrl)[1];  // 検索文字列を収得
	        	url = "/?q=" + q + "&";
	    	} else if (reL.test(thisUrl)) {  // ラベルインデックスページの時。
	            var postLabel = reL.exec(thisUrl)[1];  // ラベル名を取得。後読みは未実装の可能性あるので使わない。
	            url = "/-/" + postLabel + url;       
	        } else if (reM.test(thisUrl)) {  // 月のアーカイブページの時。モバイルの時は後ろに?m=1がつく。
	        	var arr = reM.exec(thisUrl);  // URLから年月を取得。
	        	var em = new Date(arr[1], arr[2], 0).getDate();  // 月の末日を取得。28から31のいずれかしか返ってこないはず。
	        	url2 = "&published-min=" + arr[1] + "-" + arr[2] + "-01T00:00:00%2B09:00&published-max=" + arr[1] + "-" + arr[2] + "-" + em  + "T23:59:99%2B09:00";  
	        } else if (reY.test(thisUrl)) {  // 年のアーカイブページの時。
	        	url2 = reY.exec(thisUrl)[1].replace(/updated-/g,"published-");  // URLから期間を取得。
	        	url2 = "&" + url2;       
	        } 
	    	url = "/feeds/posts/summary" + url + "alt=json-in-script&callback=PageNavi3_Blogger.callback.loadFeed&max-results=" + g.perPage + "&start-index=" + idx + url2;    
	    	fd._writeScript(url);
	    },   
	    _writeScript: function (url) {  // スクリプト注入。
	        var ws = nd.createElem('script');
	        ws.type = 'text/javascript';
	        ws.src = url;
	        document.getElementsByTagName('head')[0].appendChild(ws);
	    }        			
    }; // end of fd
    return pg;  // グローバルスコープにだす。
}();
//デフォルト値を変更したいときは以下のコメントアウトをはずして設定する。
//PageNavi3_Blogger.defaults["perPage"] = 10 //1ページあたりの投稿数。
//PageNavi3_Blogger.defaults["numPages"] = 5 // ページナビに表示するページ数。
PageNavi3_Blogger.all("blog-pager3");  // ページナビの起動。引き数にHTMLの要素のid。