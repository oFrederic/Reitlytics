# コーディング試験 README

## 概要
本コーディング試験では、応募者のプログラミングスキルやコードの可読性、設計力を評価します。

### 試験に必要なスキルセット
- TypeScript（またはJavaScript）
- React / Vueなどのライブラリ用いた開発スキル
- API通信（GraphQLまたはREST）
- テスト（Jestなど）

## 期限
期限は14日以内。\
早期に完成した場合は、ご提出ください。

## 課題
デザインファイルを参考に、データを参照・整形し、要件を満たすWebアプリケーションを作成してください。

### デザインファイル
[Figma](https://www.figma.com/design/waqt2SJqBcFOoHHu3X2k0Y/Frontend-Coding-Test?node-id=23-1798&m=dev&t=DLxUWLV5VH4I4fwJ-1)\
デザインの改変は可能です。\
任意でデザインファイルもご共有ください。
パスワードは`estie`です。

### データ
`src/mocks/buildings.json`にあるデータの説明です。\
実際のプロダクトではBackend側から呼び出すデータです。
```
  "data": {
    "jReitBuildings": [
      {
        "id": "bb4acc0899fc681d4354f23bda42d26d1136d539dea9c096ceff170168e33d37",
        "acquisition": {
          "acquisitionPrice": 15100000000, // 取得時取引価格
          "acquisitionDate": "2003-09-10", // 初回取得日
          "initialCapRate": "4.80"　// 取得時CR(キャップレート)
        },
        "buildingSpec": {
          "address": "東京都渋谷区宇田川町21番6号", // 住所
          "completedMonth": 10, // 竣工月
          "completedYear": 1999, // 竣工年
          "grossFloorArea": "2019.34", // 延床面積
          "latitude": "35.6598986111111", // 緯度
          "longitude": "139.700305277778", // 経度
          "name": "QFRONT(キューフロント)", // 建物名
          "netLeasableAreaTotal": "1255.35" // 貸付可能面積
        },
        "yieldEvaluation": {
          "appraisedPrice": 39200000000, // 最新鑑定評価額
          "capRate": "2.40" // 最新CR(キャップレート)
        },
        "assetType": { // アセットの種類
          "isOffice": false, // オフィス
          "isRetail": true, // 商業施設
          "isHotel": false, // ホテル
          "isParking": false, // 駐車場
          "isIndustrial": false, // 工場
          "isLogistic": false, // 物流施設
          "isResidential": false, // 住宅
          "isHealthCare": false, // 医療施設
          "isOther": false // その他
        },
        "transfer": {
          "transferDate": null // 譲渡日
        },
        "capRateHistories": [ // キャップレートの履歴
          {
            "id": "6ae27e590fddcfad894dd76f67d60d5e1979b02b96b9f18522008e5aef016091",
            "jReitBuildingId": "bb4acc0899fc681d4354f23bda42d26d1136d539dea9c096ceff170168e33d37", // jReitBuildings.idと同様の値
            "capRate": "4.80", // キャップレート
            "closingDate": "2003-09-10" // 決算期の締め日（初回は初回取得日）
          },
        ],
        "financials": [ // 決算データ
          {
            "leasing": { // 賃貸状況に関するデータ
              "occupancyRate": "100.00" // 稼働率
            }
          }
        ]
      }
    ]
  }
```

### 要件
1. 検索画面で建物を検索可能にする
2. 検索結果を地図にプロットする
3. 上記の検索結果に対するキャップレートと稼働率の分析グラフを表示する
4. 詳細ページで物件の基本情報を表示する

### 実装の条件
- HTML/CSS、またはライブラリの使用をしてUIを作成すること
- SPAとして動作すること
- テストコード（Jest, Testing Library）を最低1つ含めること
- `buildings.json`を参照し、デザインにある項目を出力すること

## 環境
リポジトリにはNext.jsのデータを配置していますが、Remix, Nuxtなど任意のフレームワークを使用することが可能です。
またLintなど、ご自由に設定・インストールしてください。

### デフォルトの推奨環境
- Node.js: v18以上
- パッケージマネージャ: npm
- 任意のエディタ（VS Code推奨）

### セットアップ手順
```sh
# リポジトリをクローン
$ git clone https://github.com/estie-inc/frontend-coding-test.git
$ cd frontend-coding-test

# 依存関係をインストール
$ npm install # または yarn install

# 開発サーバー起動
$ npm run dev # または yarn dev
```

## 提出方法
1. 本リポジトリをcloneしてください。
2. `main` ブランチから、機能・要件ごとに`feature/{任意の名前}` ブランチを作成してください。
3. 課題を実装し、コミットメッセージを適切に記述してください。
4. プルリクエストを作成してください。
5. 4つの課題をmainにmergeしてください。
6. 試験担当者に完了の旨をご連絡ください。

## 評価基準の例
- **コードの可読性**: 一貫したスタイルや命名規則が守られているか
- **設計力**: 状態管理やコンポーネント設計が適切か
- **エラーハンドリング**: 例外処理やバリデーションが適切に行われているか
- **パフォーマンス**: 不要なレンダリングや非効率な処理がないか
- **テスト**: 最低限のユニットテストが含まれているか

## その他
### 許可
- AIによるコード生成の利用は許可します。使用した箇所や成果など、PRのコメント内にご記載ください。

### 禁止事項
- 第三者へのとのコードの共有
- インターネットからの過度なコードの流用（参考にする程度は可）

### Q&A
#### Q1. 途中で分からなくなった場合、質問は可能ですか？
A1. はい。仕様のご相談は可能です。\
事前に質問がある場合は、試験開始前にご連絡ください。\
具体的な実装方法など、直接的な解答はお答えすることはできません。

#### Q2. TypeScriptではなくJavaScriptで実装してもよいですか？
A2. 原則としてTypeScriptでの実装を推奨しますが、JavaScriptでの提出も可能です。\
TypeScriptを使用することが評価の一部となりますので、ご注意ください。

#### Q3. 他のライブラリを追加してもよいですか？
A3. 可能です。

#### Q4. データの取り扱い方に指定はありますか？
A4. mockのまま、FrontendでJSONをそのまま使用しても構いません。実際のプロダクトではBackendから呼び出すデータのため、あえてRESTとして呼び出す、GraphQLのサーバーを作成する、Server Actionで扱う、型を指定する…などを行なっていただいた場合、加点要素になります。

#### Q5. 要件以外のPRの作成は可能ですか？
A5. 可能です。環境設定やライブラリの追加など、レビューがしやすいと思える単位でPRを作成してください。
