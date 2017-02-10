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
            	ix.createIndex(posts);  // インデックスページの作成。
            }
        },
        all: function(elementID) {  // ここから開始する。引数にページナビを置換する要素のidを入れる。
        	g.elem = document.getElementById(elementID);  // 要素のidの要素を取得。
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
    var ix = {  // インデックスページ作成。
	    createIndex: function(posts) {  // 投稿のフィードデータからインデックスページを作成する。
	    	var dateouter = nd.divClass(["date-outer"]);  // date-outerクラスのdiv要素を作成。
	    	var h3 = nd.h3Class(["mobile-index-title","entry-title"]);  // 投稿タイトルをいれるh3タグを作成。
//	    	h3.itemprop = "name";  // なぜか設定できない。とくに必要ないのかも。
	    	var stack = [nd.divClass(["date-posts"]),nd.divClass(["post-outer"]),nd.divClass(["mobile-date-outer","date-outer"]),nd.divClass(["mobile-post-outer"]),nd.createElem("a"),h3];  // 入れ子にするノードの配列。
	    	var p = nd.stackNodes(stack);  // date-postsクラスのdiv要素が外側のノードの入れ子を作成。
	    	var postheader = nd.divClass(["post-header"]);  // post-headerクラスのdiv要素を作成。
	    	postheader.setAttribute("style","display:flex;justify-content:flex-end");  // post-headerクラスのstyleを設定。右寄せのflexコンテナにする。
	    	var node = nd.createElem("div");  // ラベルリストをいれるdiv要素を作成。
	    	node.setAttribute("style","flex-grow:1;align-self:center");  // 幅が広がるflexアイテムにする。
	    	postheader.appendChild(node);  // post-headerクラスのdivの子ノードにする。
	    	node = nd.createElem("div");  // 投稿日時を入れるdiv要素を作成。
	    	node.setAttribute("style","font-size:0.9em;flex-shrink:0;");  // 投稿日時のstyleを設定。幅は縮ませない。
	    	postheader.appendChild(node);  // 投稿日時を入れるdiv要素をpost-headerクラスのdivの子ノードにする。 
	    	p.firstChild.firstChild.firstChild.appendChild(postheader);  // mobile-post-outerクラスのdiv要素の子ノードにpostheaderノードを追加。
	    	var mobileindexarrow = nd.divClass(["mobile-index-arrow"]);  // mobile-index-arrowクラスのdiv要素を作成。
	    	mobileindexarrow.appendChild(nd.createTxt("›"));  // mobileindexarrowノードにテキストノードを追加。
	    	p.firstChild.firstChild.firstChild.appendChild(mobileindexarrow);  // mobile-post-outerクラスのdiv要素の子ノードにmobileindexarrowノードを追加。
	    	stack = [nd.divClass(["mobile-index-contents"]),nd.divClass(["mobile-index-thumbnail"]),nd.divClass(["Image"]),nd.imgClass([])];  // 入れ子にするノードの配列。
	    	p.firstChild.firstChild.firstChild.appendChild(nd.stackNodes(stack));  // mobile-index-contentsクラスのdiv要素が外側の入れ子のノードをmobile-post-outerクラスのdiv要素の子ノードに追加。
	    	p.firstChild.firstChild.firstChild.lastChild.setAttribute("style","display:flex;align-items:center;");  // mobile-index-contentsクラスのdiv要素をフレックスボックスにする。
	    	p.firstChild.firstChild.firstChild.lastChild.appendChild(nd.divClass(["post-body"]));  // mobile-index-contentsクラスのdiv要素の子ノードにpost-bodyクラスのdiv要素を追加。
	    	p.firstChild.firstChild.firstChild.lastChild.appendChild(nd.divClass([]));  // mobile-index-contentsクラスのdiv要素の子ノードにdiv要素を追加。
	    	p.firstChild.firstChild.firstChild.lastChild.lastChild.setAttribute("style","clear:both;");  // 上記で追加したdiv要素のsytleを設定。
	    	p.firstChild.firstChild.firstChild.appendChild(nd.divClass([]));  // ラベル名をdiv要素をmobile-post-outerクラスのdiv要素の子ノードに追加。
	    	posts.forEach(function(e){  // 各投稿のフィードデータについて。
	    		var postouter = p.cloneNode(true);  // date-postsクラスのdiv要素が外側のノードの入れ子を複製。
	    		postouter.firstChild.firstChild.firstChild.firstChild.firstChild.appendChild(nd.createTxt(e.title.$t));  // h3要素のテキストノードに投稿タイトルを追加。
	    		postouter.firstChild.firstChild.firstChild.firstChild.href = e.link[4].href;  // 投稿へのURLをa要素に追加。
	    		var labels = (e.category)?e.category:""; // ラベル一覧を取得。
	    		postouter.firstChild.firstChild.firstChild.childNodes[1].firstChild.appendChild(ix._createLabelist(labels));  // post-headerクラスのdiv要素にラベル一覧のノードを追加。
	    		postouter.firstChild.firstChild.firstChild.childNodes[1].lastChild.appendChild(ix._createDate(e.published.$t, "公開"));  // post-headerクラスのdiv要素に公開日時のノードを追加。
	    		postouter.firstChild.firstChild.firstChild.childNodes[1].lastChild.appendChild(ix._createDate(e.updated.$t, "更新"));  // post-headerクラスのdiv要素に更新日時のノードを追加。
	    		postouter.firstChild.firstChild.firstChild.childNodes[3].firstChild.firstChild.firstChild.src = (e.media$thumbnail)?e.media$thumbnail.url:"";  // 投稿のサムネイルの表示。
	    		postouter.firstChild.firstChild.firstChild.childNodes[3].childNodes[1].appendChild(nd.createTxt(ix._createSummary(e.summary.$t)));   // サマリーの表示。
	    		dateouter.appendChild(postouter); 
	    	});
	    	g.elem.appendChild(dateouter);
	    },
	    _createLabelist: function(labels) {  // 投稿のラベルの配列を引数にラベルのdiv要素を返す関数。
	    	var node = nd.createElem("div");
	    	if (labels) {
	    		node.appendChild(nd.createTxt("ラベル: "));
	    		var a = nd.createElem("a");
	    		var e = labels.pop();
	    		ix._createLabel(node,a,e);
    			e = labels.pop();
	    		while (e) {
	    			node.appendChild(nd.createTxt(", "));
	    			ix._createLabel(node,a,e);
	    			e = labels.pop();
	    		}
	    	}
	    	return node;
	    },
	    _createLabel: function(node,a,e) {
	    	var url = "/search/label/";
	    	var label = a.cloneNode(false);
			label.href = url + e.term;
    		label.appendChild(nd.createTxt(e.term));
			node.appendChild(label);
	    },
	    _createSummary: function(s) {  // サマリーを整形して返す関数。(このブログ特有の処理です）
	    	var reS = /前の関連記事：[\W\w]*/;  // サマリーから除く文字列の正規表現パターン。
	    	var reB = /^前の関連記事：/;  // 以前の記事の整形用の正規表現パターン。
	    	var n = 120;  // サマリーを表示させる制限文字数。
	    	if (reB.test(s)) {  // 先頭に前の関連記事のリンクがあるとき
	    		return s.substring(1,n) + "…";
	    	} else {
	    		s = s.replace(reS,"");
	    		return (s.length>n)?s.substring(1,n) + "…":s;
	    	}
	    },
    	_createDate: function(d,txt) {  // 整形日時のdiv要素を返す関数。
    		var reD = /(\d\d\d\d)-(\d\d)-(\d\d).(\d\d):(\d\d):\d\d/;  // 日時を得る正規表現パターン。
    		var arr = reD.exec(d);  // 日時の取得。
    		var node = nd.createElem("div");
//    		node.setAttribute("style","font-size:0.9em;text-align:right;padding-bottom:5px;padding-right:30px");
    		node.appendChild(nd.createTxt(arr[1] + "年" + arr[2] + "月" + arr[3] + "日 " + arr[4] + "時" + arr[5] + "分" + txt));
    		return node;
    	}
    };  // end of ix
    var nd = {  // ノード関連。
		divClass: function(classNames) {  // クラス名の配列を引数としてdiv要素を返す関数。
			return nd._tagClass("div", classNames);
		},
		h3Class: function(classNames) {  // クラス名の配列を引数としてh3要素を返す関数。
			return nd._tagClass("h3", classNames);
		},
		imgClass: function(classNames) {  // クラス名の配列を引数としてimg要素を返す関数。
			return nd._tagClass("img", classNames);
		},
		_tagClass: function(tag,classNames) {  // 生成するtag名、クラス名の配列を引数として要素を返す関数。
			var node = nd.createElem(tag);  // tag要素を作成。
			if (classNames.length){
				classNames.forEach(function(e) {
					node.classList.add(e);  // クラスを追加。
				});
			}
			return node;				
		},
		createElem: function(tag) {  // tagの要素を作成して返す関数。
			return document.createElement(tag); 
		},
		createTxt: function(txt) {  // テキストノードを返す関数。
			return document.createTextNode(txt);
		},
		stackNodes: function(stack) {  // ノードの配列を引数として入れ子のノードを返す関数。
	    	var c = stack.pop();
	    	while (stack.length) {  // 配列の要素の有無でfalseは判断できないので配列の長さで判断する。
	    		var p = stack.pop();
	    		p.appendChild(c);
	    		c = p;
	    	}
	    	return p;
		}
    };  // end of nd
    var fd = {  // フィード関連。
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