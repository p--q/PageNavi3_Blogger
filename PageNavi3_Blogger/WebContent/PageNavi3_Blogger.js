// PageNavi3_Bloggerモジュール
var PageNavi3_Blogger = PageNavi3_Blogger || function() {
    var pg = {  // グローバルスコープに出すオブジェクト。グローバルスコープから呼び出すときはPageNavi3_Bloggerになる。
        defaults : {  // 既定値。
            "perPage" : 7, //1ページあたりの投稿数。1ページの容量が1MBを超えないように設定する。最大150まで。
            "numPages" : 5  // ページナビに表示する通常ページボタンの数。スタートページからエンドページまで。
        },
        callback : {  // フィードを受け取るコールバック関数。
        	
        	
        	
//            getURL : function(root){  // フィードからタイムスタンプを得て表示させるURLを作成してそこに移動する。
//                var post = root.feed.entry[0];  // フィードから先頭の投稿を取得。
//                var m = /(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d)\.\d\d\d(.\d\d:\d\d)/i.exec(post.published.$t);
//                var timestamp = encodeURIComponent(m[1] + m[2]);  // 先頭の投稿からタイプスタンプを取得。
//                var addr_label = "/search/label/" + g.postLabel + "?updated-max=" + timestamp + "&max-results=" + g.perPage + "#PageNo=" + g.pageNo;
//                var addr_page = "/search?updated-max=" + timestamp + "&max-results=" + g.perPage + "#PageNo=" + g.pageNo; 
//                location.href =(g.postLabel)?addr_label:addr_page;  // ラベルインデックスページとインデックスページでURLが異なることへの対応。
//            }, 
            loadFeed : function(json){  // 引数にフィードを受け取る関数。 
            	var posts = [];
            	Array.prototype.push.apply(posts, json.feed.entry);// 投稿のフィードデータを配列に追加。
            	createIndex(posts);
            	
            	
//            	vars.dic[d].push([e.link[4].href, e.link[4].title, url]);  // 辞書の値の配列に[投稿のURL, 投稿タイトル, サムネイルのURL]
//                var total_posts = parseInt(root.feed.openSearch$totalResults.$t, 10);  // 取得したフィードから総投稿総数を得る。
//                createNodes(total_posts);  // 総投稿数をもとにページナビのボタンを作成する。
            }
        },
        all: function(elementID) {  // ここから開始する。引数にページナビを置換する要素のidを入れる。
        	g.elementID = elementID;
        	if (g.elementID) {createURL(1);}  // 置換する要素が存在するときページナビを作成する。
        }
    }; // end of pg
    var g = {  // PageNavi3_Bloggerモジュール内の"グローバル"変数。
        perPage : pg.defaults.perPage,  // デフォルト値の取得。
        numPages : pg.defaults.numPages,  // デフォルト値の取得。
        jumpPages : pg.defaults.numPages, // ジャンプボタンでページ番号が総入れ替えになる設定値。
        // postLabel : null,  // ラベル名。
        //pageNo : null,  // ページ番号。
        // currentPageNo : null,  // 現在のページ番号。
        elementID : null  // ページナビを挿入するdiv要素のid。
    };
    
    
    function createIndex(posts) {  // 投稿のフィードデータからインデックスページを作成する。
    	
    	
    	
    	
    }
    function createURL(idx) {  // URLから情報を得てフィードを取得するURLを作成。
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
    	writeScript(url);
    }   
    function writeScript(url) {  // スクリプト注入。
        var ws = createElem('script');
        ws.type = 'text/javascript';
        ws.src = url;
        document.getElementsByTagName('head')[0].appendChild(ws);
    }        
	function createElem(tag){  // tagの要素を作成して返す。
		return document.createElement(tag); 
	}       
	
    var nd = {  // HTML要素のノードを作成するオブジェクト。
            postsflxC: function() {  // 投稿のflexコンテナを返す。
                var node = createElem("div");  // flexコンテナになるdiv要素を生成。
                node.style.display = "flex";  // flexコンテナにする。
                node.style.flexWrap = "wrap";  // flexコンテナの要素を折り返す。 
                return node;
            },
            postsflxI: function(text) {  // 投稿のflexアイテムを返す。
                var node = createElem("div");  // flexアイテムになるdiv要素を生成。
                node.textContent = text;
                node.style.flex = "1 0 14%";  // flexアイテムの最低幅を1/7弱にして均等に拡大可能とする。
                node.style.textAlign = "center";  // flexアイテムの内容を中央寄せにする。  
                return node;
            },
            dateflxIWithPost: function(date) {  // 投稿の日のflexアイテムを返す。
                var node = nd.calflxI(); // カレンダーのflexアイテムを取得。  
                node.className = "post";  // クラス名をpostにする。
                node.textContent = date;  // 日をtextノードに取得。textContentで代入すると子ノードは消えてしまうので注意。
                node.style.backgroundColor = "rgba(128,128,128,.4)";  // 背景色
                node.style.borderRadius = "50%";  // 背景の角を丸める
                node.style.cursor = "pointer";  // マウスポインタの形状を変化させる。
                return node;
            },
            datePostsNode: function() {  // 日の投稿データを表示させるflexコンテナを返す。
                var node = createElem("div");  // flexコンテナになるdiv要素を生成。
                node.style.display = "flex";  // flexコンテナにする。
                node.id = vars.dataPostsID;  // idを設定。
                node.style.flexDirection = "column";  // flexアイテムを縦並びにする。
                return node;
            },
            _postflxC: function() {  // 日の投稿のdiv要素を返す。
                var node = createElem("div");  // div要素を生成。
                node.style.borderTop = "dashed 1px rgba(128,128,128,.5)";
                node.style.paddingTop = "5px";       
                return node;
            },
            _imgflxI: function(arr) {  // サムネイル画像の投稿のdiv要素を返す。引数は配列。
                var node = createElem("div");  // div要素を生成。
                var img = createElem("img");
                img.src = arr[2];  // 配列からサムネイル画像のurlを取得。
                var a = nd._a(arr);  // 投稿のurlを入れたa要素を取得。
                a.appendChild(img);  // サムネイル画像のノードをa要素に追加。
                node.appendChild(a);            
                return node;
            },
            _a: function(arr) {  // 投稿のurlを入れたa要素を返す。
                var node = createElem("a"); 
                node.href = arr[0];  // 配列から投稿のurlを取得。
                return node;
            },
            _titleflxI: function(arr) {  // 投稿タイトルの投稿のdiv要素を返す。
                var node = createElem("div");  //div要素を生成。
                var a = nd._a(arr);
                a.textContent = arr[1];
                node.appendChild(a);            
                return node;
            },
            postNode: function(arr) {  // 引数は[投稿のURL, 投稿タイトル, サムネイルのURL]の配列。
                var node = nd._postflxC(); // 日の投稿のflexコンテナを取得。
                if (arr[2]) {  // サムネイルがあるとき
                    var imgflxI = nd._imgflxI(arr);  // サムネイル画像を入れる投稿のdiv要素。引数は配列。
                    imgflxI.style.float = "left";  // 画像の周りのテキストを右から下に回りこませる。
                    imgflxI.style.padding = "0 5px 5px 0";  // 右と下に5px空ける。
                    node.appendChild(imgflxI);
                }
                var titleflxI = nd._titleflxI(arr);
                node.appendChild(titleflxI);
                return node;
            },
            _arrowflxI: function(text,id) {  // 月を移動するボタンを返す。
                var node = createElem("div");  // flexアイテムになるdiv要素を生成。
                node.textContent = text;
                node.id = id;
                node.style.flex = "0 0 14%";  // 1/7幅で伸縮しない。
                node.style.textAlign = "center";
                return node;
            },
            leftarrowflxI: function() {  // 左向き矢印のflexアイテム。flexBasis14%。
                var dt = new Date();  // 今日の日付オブジェクトを取得。
                var now = new Date(dt.getFullYear(), dt.getMonth(),1);  // 今月の1日のミリ秒を取得。
                var caldate = new Date(vars.y, vars.m-1,1);  // カレンダーの1日のミリ秒を取得。
                if (now > caldate) {  // 表示カレンダーの月が現在より過去のときのみ左矢印を表示させる。
                    var node = nd._arrowflxI('\u00ab',"left_calendar");
                    node.style.cursor = "pointer";  // マウスポインタの形状を変化させる。
                    node.title = (vars.L10N)?"Newer":"翌月へ";
                    return node;
                } else {
                    return nd._arrowflxI(null,null);
                }
            },
            rightarrowflxI: function() {  // 右向き矢印のflexアイテム。flexBasis14%。
                var dt = new Date(2013,3,1);  // 最初の投稿月の日付オブジェクトを取得。
                var firstpost = new Date(dt.getFullYear(), dt.getMonth(),1);  // 今月の1日のミリ秒を取得。
                var caldate = new Date(vars.y, vars.m-1,1);  // カレンダーの1日のミリ秒を取得。
                if (firstpost > caldate) {  // 表示カレンダーの月が初投稿より未来のときのみ右矢印を表示させる。
                    return nd._arrowflxI(null,null);
                } else {
                    var node = nd._arrowflxI('\u00bb',"right_calendar");
                    node.style.cursor = "pointer";  // マウスポインタの形状を変化させる。
                    node.title = (vars.L10N)?"Older":"前月へ";
                    return node;
                }
            },        
            titleflxI: function(title) {
                var node = createElem("div");  // flexアイテムになるdiv要素を生成。
                node.textContent = title;
                node.id = "title_calendar";
                node.style.flex = "1 0 72%";
                node.style.textAlign = "center";
                node.style.cursor = "pointer";  // マウスポインタの形状を変化させる。
                node.title = (vars.L10N)?"Switching between published and updated":"公開日と更新日を切り替える";
                return node;
            }
        };  // end of nd
    
    
    
    
    
//    function redirect(pageNo) {  // ページ番号のボタンをクリックされた時に呼び出される関数。
//        g.pageNo = pageNo;  // 表示するページ番号
//        if (pageNo==1) {  // 1ページ目を取得するときはページ番号からURLを算出する必要がない。
//            location.href = (!g.postLabel)?"/":"/search/label/" + g.postLabel + "?max-results=" + g.perPage;  // ラベルページインデックスの場合分け。
//        } else {
//            var startPost = (g.pageNo - 1) * g.perPage;  // 新たに表示する先頭ページの先頭になる投稿番号を取得。
//            var url;
//            if (g.postLabel) {   // ラベルページインデックスの場合分け。
//                url = "/feeds/posts/summary/-/" + g.postLabel + "?start-index=" + startPost + "&max-results=1&alt=json-in-script&callback=PageNavi3_Blogger.callback.getURL";
//            } else {
//                url = "/feeds/posts/summary?start-index=" + startPost + "&max-results=1&alt=json-in-script&callback=PageNavi3_Blogger.callback.getURL";
//            }
//            writeScript(url);  //スクリプト注入。
//        }
//    }

//    function createNodes(total_posts) {  // 総投稿数からページナビのボタンを作成。
//        var buttunElems = []; // ボタン要素を入れる配列。
//        var numPages = g.numPages;  // ページナビに表示するページ数。
//        var prevText = '\u00ab';  // 左向きスキップのための矢印。
//        var nextText = '\u00bb';  // 右向きスキップのための矢印。
//        var diff =  Math.floor(numPages / 2);  // スタートページ - 現在のページ = diff。
//        var pageStart = g.currentPageNo - diff;  // スタートページの算出。
//        if (pageStart < 1) {pageStart = 1;}  // スタートページが1より小さい時はスタートページを1にする。
//        var lastPageNo = Math.ceil(total_posts / g.perPage); // 総投稿数から総ページ数を算出。
//        var pageEnd = pageStart + numPages - 1;  // エンドページの算出。
//        if (pageEnd > lastPageNo) {pageEnd = lastPageNo;} // エンドページが総ページ数より大きい時はエンドページを総ページ数にする。
//        if (pageStart > 1) {buttunElems.push(createButton(1,1));}  // スタートページが2以上のときはスタートページより左に1ページ目のボタンを作成する。
//        if (pageStart == 3) {buttunElems.push(createButton(2, 2));} // スタートページが3のときはジャンプボタンの代わりに2ページ目のボタンを作成する。
//        if (pageStart > 3) {  // スタートページが4以上のときはジャンプボタンを作成する。
//            var prevNumber = pageStart - g.jumpPages + diff;  // ジャンプボタンでジャンプしたときに表示するページ番号。
//            if (prevNumber < 1) {prevNumber = 1;}
//            buttunElems.push(createButton(prevNumber, prevText));  // ページ番号が1のときだけボタンの作り方が異なるための場合分け。
//        }
//        for (var j = pageStart; j <= pageEnd; j++) {buttunElems.push((j == g.currentPageNo)?createCurrentNode(j):createButton(j, j));}  // スタートボタンからエンドボタンまで作成。
//        if (pageEnd == lastPageNo - 2) {buttunElems.push(createButton(lastPageNo - 1, lastPageNo - 1));}  // エンドページと総ページ数の間に1ページしかないときは右ジャンプボタンは作成しない。
//        if (pageEnd < (lastPageNo - 2)) {  // エンドページが総ページ数より3小さい時だけ右ジャンプボタンを作成。
//            var nextnumber = pageEnd + 1 + diff;  // ジャンプボタンでジャンプしたときに表示するページ番号。
//            if (nextnumber > lastPageNo) {nextnumber = lastPageNo;} // 表示するページ番号が総ページ数になるときは総ページ数の番号にする。
//            buttunElems.push(createButton(nextnumber, nextText));  // 右ジャンプボタンの作成。
//        }
//        if (pageEnd < lastPageNo) {buttunElems.push(createButton(lastPageNo, lastPageNo));}  // 総ページ番号ボタンの作成。
//        writeHtml(buttunElems);  // htmlの書き込み。
//    }
//    function createButton(pageNo, text) {  // redirectするボタンのノード作成。
//        var spanNode = createElem('div');
//        spanNode.className = "displaypageNum";
//        spanNode.appendChild(createElem('a'));
//        spanNode.firstChild.textContent = text;
//        spanNode.firstChild.href = "#";
//        spanNode.firstChild.title = pageNo;  // redirect()の引数に使う。
//        return spanNode;
//    }
//    function createCurrentNode(j) {  // 現在表示中のページのノード作成。
//        var spanNode = createElem('div');
//        spanNode.className = "pagecurrent"; 
//        spanNode.textContent = j;
//        return spanNode;
//    }
//
//    function onclickEvent(e) {  // Event bubblingで発火させる関数。
//        e=e||event; // IE sucks
//        var target = e.target||e.srcElement; // targetはaになる。// and sucks again // target is the element that has been clicked
//        if (target && target.parentNode.className=="displaypageNum") {
//            redirect(target.title);
//            return false; // stop event from bubbling elsewhere
//        }
//    }
//    function writeHtml(buttunElems) {  // htmlの書き込み。
//        var divNode = createElem('div');       
//        buttunElems.forEach(function(b){
//            divNode.appendChild(b);
//        });  // ボタンノードを新しいdivノードの子ノードに追加する。
//        divNode.style.padding = "0px 5px";
//        divNode.style.display = "flex";  // flexの子要素はdivにする。spanはダメ。
//        divNode.style.justifyContent = "center";  // ボタンを中央寄せにする
//        divNode.style.alignItems = "center";  // これがないと現在のページのボタンがずれる。
//        divNode.style.transform = "scaleX(0.9)";  // 水平方向に0.9倍にする。
//        var dupNode;
//        g.elements.forEach(function(elem){
//            elem.textContent = null;  // 要素を初期化。
//            dupNode = divNode.cloneNode(true);  // ボタンノードを子ノードとするdivノードを複製する。デフォルトのプロパティしかコピーされない。イベントもコピーされない。
//            dupNode.onclick = onclickEvent;  // 複製したノードにイベントのプロパティを追加する。
//            elem.appendChild(dupNode);   // 既存のノードに追加して表示させる。
//        });  
//    }
    return pg;  // グローバルスコープにだす。
}();
//デフォルト値を変更したいときは以下のコメントアウトをはずして設定する。
//PageNavi3_Blogger.defaults["perPage"] = 10 //1ページあたりの投稿数。
//PageNavi3_Blogger.defaults["numPages"] = 5 // ページナビに表示するページ数。
PageNavi3_Blogger.all("blog-pager3");  // ページナビの起動。引き数にHTMLの要素のid。