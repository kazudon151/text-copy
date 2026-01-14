// 拡張機能をインストールした時に、右クリックメニューを作成する
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "save-as-txt",
        title: "選択範囲を.txtとして保存", // 右クリックに出る文字
        contexts: ["selection"] // テキストを選択している時だけ表示する
    });
});

// メニューがクリックされた時の処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "save-as-txt" && info.selectionText) {
        
        // 1. 選択されたテキストを取得
        const text = info.selectionText;

        // 2. ファイル名を生成 (例: 20260115_selection.txt)
        const now = new Date();
        // 日本時間っぽく調整してYYYYMMDDHHMM形式に
        const dateStr = now.toISOString().replace(/[-:T.]/g, "").slice(0, 14);
        const filename = `${dateStr}_selection.txt`;

        // 3. テキストをData URI形式（ダウンロード可能なURL）に変換
        // 日本語文字化けを防ぐためにUTF-8のBOM付きにする等の処理も本来は必要だが、
        // AIに投げる用ならこれだけで十分通じます。
        const blobUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);

        // 4. ダウンロードを実行
        chrome.downloads.download({
            url: blobUrl,
            filename: filename,
            saveAs: false // falseにすると確認画面を出さずに即保存（設定による）
        });
    }
});