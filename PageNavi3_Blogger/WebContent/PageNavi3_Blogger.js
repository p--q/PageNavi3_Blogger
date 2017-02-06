// PageNavi3_Bloggerモジュール
var PageNavi3_Blogger = PageNavi3_Blogger || function() {
    var pg = {  // グローバルスコープに出すオブジェクト。グローバルスコープから呼び出すときはPageNavi3_Bloggerになる。
        defaults : {  // 既定値。
            "perPage" : 7, //1ページあたりの投稿数。1ページの容量が1MBを超えないように設定する。
            "numPages" : 5  // ページナビに表示する通常ページボタンの数。スタートページからエンドページまで。
        },
        callback : {  // フィードを受け取るコールバック関数。
            getURL : function(root){  // フィードからタイムスタンプを得て表示させるURLを作成してそこに移動する。
                var post = root.feed.entry[0];  // フィードから先頭の投稿を取得。
                var m = /(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d)\.\d\d\d(.\d\d:\d\d)/i.exec(post.published.$t);
                var timestamp = encodeURIComponent(m[1] + m[2]);  // 先頭の投稿からタイプスタンプを取得。
                var addr_label = "/search/label/" + g.postLabel + "?updated-max=" + timestamp + "&max-results=" + g.perPage + "#PageNo=" + g.pageNo;
                var addr_page = "/search?updated-max=" + timestamp + "&max-results=" + g.perPage + "#PageNo=" + g.pageNo; 
                location.href =(g.postLabel)?addr_label:addr_page;  // ラベルインデックスページとインデックスページでURLが異なることへの対応。
            }, 
            acceptFeed : function(root){ 
                var total_posts = parseInt(root.feed.openSearch$totalResults.$t, 10);  // 取得したフィードから総投稿総数を得る。
                createNodes(total_posts);  // 総投稿数をもとにページナビのボタンを作成する。
            }
        },
        all: function(elementID) {  // ここから開始する。引数にページナビを置換する要素のidを入れる。
        	g.elementID = elementID;
        	createPageNavi();  // ページナビの作成。
        }
    }; // end of pg
    var g = {  // PageNavi3_Bloggerモジュール内の"グローバル"変数。
        perPage : pg.defaults.perPage,  // デフォルト値の取得。
        numPages : pg.defaults.numPages,  // デフォルト値の取得。
        jumpPages : pg.defaults.numPages, // ジャンプボタンでページ番号が総入れ替えになる設定値。
        // postLabel : null,  // ラベル名。
        pageNo : null,  // ページ番号。
        currentPageNo : null,  // 現在のページ番号。
        elementID : null  // ページナビを挿入するdiv要素のid。
    };
    function redirect(pageNo) {  // ページ番号のボタンをクリックされた時に呼び出される関数。
        g.pageNo = pageNo;  // 表示するページ番号
        if (pageNo==1) {  // 1ページ目を取得するときはページ番号からURLを算出する必要がない。
            location.href = (!g.postLabel)?"/":"/search/label/" + g.postLabel + "?max-results=" + g.perPage;  // ラベルページインデックスの場合分け。
        } else {
            var startPost = (g.pageNo - 1) * g.perPage;  // 新たに表示する先頭ページの先頭になる投稿番号を取得。
            var url;
            if (g.postLabel) {   // ラベルページインデックスの場合分け。
                url = "/feeds/posts/summary/-/" + g.postLabel + "?start-index=" + startPost + "&max-results=1&alt=json-in-script&callback=PageNavi3_Blogger.callback.getURL";
            } else {
                url = "/feeds/posts/summary?start-index=" + startPost + "&max-results=1&alt=json-in-script&callback=PageNavi3_Blogger.callback.getURL";
            }
            writeScript(url);  //スクリプト注入。
        }
    }
    function createElem(tag){  // tagの要素を作成して返す。
       return document.createElement(tag); 
    }   
    function createNodes(total_posts) {  // 総投稿数からページナビのボタンを作成。
        var buttunElems = []; // ボタン要素を入れる配列。
        var numPages = g.numPages;  // ページナビに表示するページ数。
        var prevText = '\u00ab';  // 左向きスキップのための矢印。
        var nextText = '\u00bb';  // 右向きスキップのための矢印。
        var diff =  Math.floor(numPages / 2);  // スタートページ - 現在のページ = diff。
        var pageStart = g.currentPageNo - diff;  // スタートページの算出。
        if (pageStart < 1) {pageStart = 1;}  // スタートページが1より小さい時はスタートページを1にする。
        var lastPageNo = Math.ceil(total_posts / g.perPage); // 総投稿数から総ページ数を算出。
        var pageEnd = pageStart + numPages - 1;  // エンドページの算出。
        if (pageEnd > lastPageNo) {pageEnd = lastPageNo;} // エンドページが総ページ数より大きい時はエンドページを総ページ数にする。
        if (pageStart > 1) {buttunElems.push(createButton(1,1));}  // スタートページが2以上のときはスタートページより左に1ページ目のボタンを作成する。
        if (pageStart == 3) {buttunElems.push(createButton(2, 2));} // スタートページが3のときはジャンプボタンの代わりに2ページ目のボタンを作成する。
        if (pageStart > 3) {  // スタートページが4以上のときはジャンプボタンを作成する。
            var prevNumber = pageStart - g.jumpPages + diff;  // ジャンプボタンでジャンプしたときに表示するページ番号。
            if (prevNumber < 1) {prevNumber = 1;}
            buttunElems.push(createButton(prevNumber, prevText));  // ページ番号が1のときだけボタンの作り方が異なるための場合分け。
        }
        for (var j = pageStart; j <= pageEnd; j++) {buttunElems.push((j == g.currentPageNo)?createCurrentNode(j):createButton(j, j));}  // スタートボタンからエンドボタンまで作成。
        if (pageEnd == lastPageNo - 2) {buttunElems.push(createButton(lastPageNo - 1, lastPageNo - 1));}  // エンドページと総ページ数の間に1ページしかないときは右ジャンプボタンは作成しない。
        if (pageEnd < (lastPageNo - 2)) {  // エンドページが総ページ数より3小さい時だけ右ジャンプボタンを作成。
            var nextnumber = pageEnd + 1 + diff;  // ジャンプボタンでジャンプしたときに表示するページ番号。
            if (nextnumber > lastPageNo) {nextnumber = lastPageNo;} // 表示するページ番号が総ページ数になるときは総ページ数の番号にする。
            buttunElems.push(createButton(nextnumber, nextText));  // 右ジャンプボタンの作成。
        }
        if (pageEnd < lastPageNo) {buttunElems.push(createButton(lastPageNo, lastPageNo));}  // 総ページ番号ボタンの作成。
        writeHtml(buttunElems);  // htmlの書き込み。
    }
    function createPageNavi() {  // URLからラベル名、検索語、ページナビの年月を得てフィードを取得する。
    	var y,m;
    	var url = null;
        var thisUrl = location.href;  // 現在表示しているURLを収得。
        if (/\/search\/label\//i.test(thisUrl)) {  // ラベルインデックスページの場合URLからラベル名を取得。
            thisUrl = thisUrl.replace("m=0?","");  // モバイルデバイスからウェブバージョンを見た時の文字列を削除。
            var postLabel = /\/search\/label\/(.+)(?=\?)/i.exec(thisUrl)[1];  // ラベル名を取得。後読みは未実装の可能性あるので使わない。
            url = '/feeds/posts/summary/-/' + postLabel + "?alt=json-in-script&callback=PageNavi3_Blogger.callback.acceptFeed&max-results=" + g.perPage;       
        } else if (/_archive.html/i.test(thisURL)) {  // 月のアーカイブページの時。モバイルの時は後ろに?m=1がつく。
        	var match = /(\d\d\d\d)_(\d\d)_\d\d_archive.html/i.exec(thisUrl);  // URLから年月を取得。
        	y = match[1];  // 年を取得。
        	m = match[2];  // 月を取得。
        	
        } else if (/\/search\?updated-min=(\d\d\d\d)-01-01T00:00:00%2B09:00&updated-max=(\d\d\d\d)-01-01T00:00:00%2B09:00&/i.test(thisURL)) {  // 年のアーカイブページの時。
        	y = /\/search\?updated-min=(\d\d\d\d)-01-01T00:00:00%2B09:00&updated-max=(\d\d\d\d)-01-01T00:00:00%2B09:00&/i.exec(thisUrl)[1];  // URLから年を取得。
        	
        	
        	url = "/feeds/posts/summary?start-index=" + startPost + "&alt=json-in-script&callback=PageNavi3_Blogger.callback.acceptFeed&max-results=" + g.perPage;
        	
        } else if (/\?q=/i.test(thisURL)) {  // 検索結果ページのとき
        	thisUrl = thisUrl.replace("&m=1","");  // モバイルサイトの付属文字列を削除。
        	var q = /\?q=(.+)/i.exec(thisUrl);  // 検索文字列を収得。
        	
        	
        } else {  // 通常のインデックスページのとき
        	
        	
        	
        }
        if (url) {writeScript(url);}
        
        
        
        
        if (!/\?q=|\.html$|updated-min=/i.test(thisUrl)) {  // 検索結果や固定ページやアーカイブページではないとき。
            g.currentPageNo = (/#PageNo=/i.test(thisUrl))?/#PageNo=(\d+)/i.exec(thisUrl)[1]:1;  // URLから現在のページ番号の取得。
            var url;  // フィードを取得するためのURL。
            if (g.postLabel) {  // 総投稿数取得のためにフィードを取得するURLの作成。ラベルインデックスのときはそのラベル名の総投稿数を取得するため。
                url = '/feeds/posts/summary/-/' + g.postLabel + "?alt=json-in-script&callback=PageNavi3_Blogger.callback.getTotalPostCount&max-results=1";          
            } else {
                url = "/feeds/posts/summary?max-results=1&alt=json-in-script&callback=PageNavi3_Blogger.callback.getTotalPostCount";
            }
            writeScript(url); 
        }
    }   
    function createButton(pageNo, text) {  // redirectするボタンのノード作成。
        var spanNode = createElem('div');
        spanNode.className = "displaypageNum";
        spanNode.appendChild(createElem('a'));
        spanNode.firstChild.textContent = text;
        spanNode.firstChild.href = "#";
        spanNode.firstChild.title = pageNo;  // redirect()の引数に使う。
        return spanNode;
    }
    function createCurrentNode(j) {  // 現在表示中のページのノード作成。
        var spanNode = createElem('div');
        spanNode.className = "pagecurrent"; 
        spanNode.textContent = j;
        return spanNode;
    }
    function writeScript(url) {  // スクリプト注入。
        var ws = createElem('script');
        ws.type = 'text/javascript';
        ws.src = url;
        document.getElementsByTagName('head')[0].appendChild(ws);
    }
    function onclickEvent(e) {  // Event bubblingで発火させる関数。
        e=e||event; // IE sucks
        var target = e.target||e.srcElement; // targetはaになる。// and sucks again // target is the element that has been clicked
        if (target && target.parentNode.className=="displaypageNum") {
            redirect(target.title);
            return false; // stop event from bubbling elsewhere
        }
    }
    function writeHtml(buttunElems) {  // htmlの書き込み。
        var divNode = createElem('div');       
        buttunElems.forEach(function(b){
            divNode.appendChild(b);
        });  // ボタンノードを新しいdivノードの子ノードに追加する。
        divNode.style.padding = "0px 5px";
        divNode.style.display = "flex";  // flexの子要素はdivにする。spanはダメ。
        divNode.style.justifyContent = "center";  // ボタンを中央寄せにする
        divNode.style.alignItems = "center";  // これがないと現在のページのボタンがずれる。
        divNode.style.transform = "scaleX(0.9)";  // 水平方向に0.9倍にする。
        var dupNode;
        g.elements.forEach(function(elem){
            elem.textContent = null;  // 要素を初期化。
            dupNode = divNode.cloneNode(true);  // ボタンノードを子ノードとするdivノードを複製する。デフォルトのプロパティしかコピーされない。イベントもコピーされない。
            dupNode.onclick = onclickEvent;  // 複製したノードにイベントのプロパティを追加する。
            elem.appendChild(dupNode);   // 既存のノードに追加して表示させる。
        });  
    }
    return pg;  // グローバルスコープにだす。
}();
//デフォルト値を変更したいときは以下のコメントアウトをはずして設定する。
//PageNavi3_Blogger.defaults["perPage"] = 10 //1ページあたりの投稿数。
//PageNavi3_Blogger.defaults["numPages"] = 5 // ページナビに表示するページ数。
PageNavi3_Blogger.all("blog-pager3");  // ページナビの起動。引き数にHTMLの要素のid。