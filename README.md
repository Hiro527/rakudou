# rakudou
落道 - YouTube Downloader

## 使い方
1. リポジトリをクローンする: `git clone https://github.com/Hiro527/rakudou.git`
2. 必要なパッケージをインストールする: `npm ci`
3. コマンドを実行する: `node index.js [動画のURL] (mp3: mp3ファイルへの音声の変換を行いたい場合はつけてください)`


## 使用例
```
Hiro@ubuntu: ~$ node .\index.js https://www.youtube.com/watch?v=Qh6aSTTkmEs mp3

######     ##     ###  ##  ##   ##  #####     #####   ##   ##
 ##  ##   ####     ##  ##  ##   ##   ## ##   ##   ##  ##   ##
 ##  ##  ##  ##    ## ##   ##   ##   ##  ##  ##   ##  ##   ##
 #####   ##  ##    ####    ##   ##   ##  ##  ##   ##  ##   ##
 ## ##   ######    ## ##   ##   ##   ##  ##  ##   ##  ##   ##
 ##  ##  ##  ##    ##  ##  ##   ##   ## ##   ##   ##  ##   ##
#### ##  ##  ##   ###  ##   #####   #####     #####    #####   v1.0.0 / (c)2021 Hiro527

【ぶいすぽっ！】Blessing ~12人で歌ってみた~ | 花芽なずな / Nazuna Kaga - 00:04:40
100% [===================>]  |  00:00:21  |  138MB of 138MB
[INFO] ダウンロードが完了しました: ./output/【ぶいすぽっ！】Blessing ~12人で歌ってみた~_20211231105246.mp4
[INFO] mp3への変換を開始します
[INFO] mp3への変換が完了しました: ./output/【ぶいすぽっ！】Blessing ~12人で歌ってみた~_20211231105246.mp3
```

## 必要条件
- Node.js >= 16.13.0
- npm >= 8.1.2
- ffmpeg >= 4.4.1-full_build