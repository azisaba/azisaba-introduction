# Azisaba Introduction 
* Minecraftのサーバーリストサービスに掲載する、アジ鯖の紹介ページ

## 内容物
- [introduction.md](./introduction.md)
    - サーバー紹介のMarkdownファイル
- `jms.html`
    - [JMS](https://minecraft.jp/servers/mc.azisaba.net)に掲載するhtmlファイル
    - `introduction.md`から生成する
- [src](./src/)
    - `introduction.md`から`jms.html`を生成するjs類を格納

## `jsm.html`を取得する方法
### Release
mainブランチに`introduction.md`をプッシュするとGithub Actionsで自動生成します。  
生成されたhtmlは[Relaese](https://github.com/azisaba/azisaba-introduction/releases)から得られます。

### ローカル実行
1. `git clone https://github.com/azisaba/azisaba-introduction.git && cd ./azisaba-introduction/src`を実行
1. `pnpm install`を実行
1. `introduction.md`を編集する
1. `pnpm generate`または`node index.js`を実行
1. ひとつ上の階層に`jms.html`が生成される
