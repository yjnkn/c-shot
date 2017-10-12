# Circle Shot! 説明書

## ファイル構成

### ローカルファイル
* 説明書
  - readme.txt
* htmlファイル
  - index.html
  - style.css
* リソースファイル
  - bg.png
  - ok.png
  - ng.png
  - main.png
  - score.png
  - ngarea.png
  - catalog.json
* ソースコード
  - main.js
  - TNkBoard.js
  - TNkButton.js
  - TNkCatalog.js
  - TNkFaild.js
  - TNkScene.js
  - TNkShot.js
  - TNkTitle.js

### 外部ファイル
* ライブラリ
  - http://coderun.9leap.net/static/enchant.js-latest/enchant.js
* Webフォント
  - http://fonts.googleapis.com/css?family=Audiowide


## 遊び方
### 起動
index.htmlをFirefox、Chrome等のhtml5対応ブラウザで開いてください。  
なお、インターネットに接続されている環境が必要となります。

### タイトル画面
タイトルをタップしてください。
セレクト画面に切り替わります。

### セレクト画面
プレイしたい面をタップしてください。ゲーム画面に切り替わります。  
"return"をタップするとタイトル画面に切り替わります。

### ゲーム画面
1. まず背景となるグラフィックが表示され、フェイドアウトでマスクの下に隠れます。そしてゲームが始まります。
2. 画面に触れると円が現れます。円は画面をなでる指に追従して動きます。
3. 画面をタップすると円で指定された範囲のマスクが除去され、背後のグラフィックが表示されます。
4. 2～3を繰り返し、肌を露出させていきます。
5. shotをタップするとエンド画面に切り替わります。
6. 2～3の工程で水着を露出させるとゲームオーバーとなり、エンド画面に切り替わります。
7. zoom inをタップすると円が大きくなります。
8. zoom outをタップすると円が小さくなります。

### エンド画面
shotのタップで切り替わった場合、スコアが表示されます。
スコアは露出面積とタップ回数（少ないことが望ましい）から算出されます。  
retryをタップするとゲーム画面に切り替わります。  
exit/nextをタップするとセレクト画面に切り替わります。
