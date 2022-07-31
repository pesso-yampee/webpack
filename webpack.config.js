const Path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackWatchedGlobEntries = require("webpack-watched-glob-entries-plugin");
// 監視するファイルをオブジェクト形式で格納
const entries = WebpackWatchedGlobEntries.getEntries(
  [Path.resolve(__dirname, "./src/ejs/*.ejs")],
  { ignore: Path.resolve(__dirname, "./src/ejs/_*.ejs") }
)();
// ejsファイルをhtmlファイルに変換する処理
const htmlGlobPlugins = (entries) => {
  return Object.keys(entries).map((key) => {
    return new HtmlWebpackPlugin({
      filename: `${key}.html`,
      template: `./src/ejs/${key}.ejs`,
      inject: "body" // bodyタグ直前にscriptタグを設置
    });
  });
};

const webpack = {
  mode: "development",
  entry: "./src/js/index.js",
  output: {
    path: Path.resolve(__dirname, "dist"),
    clean: true, // ビルド時にdistフォルダをクリーンアップする
  },
  module: {
    rules: [
      {
        /**
         * 変換するファイルを特定。
         * 拡張子となる「.」をエスケープさせるためにバックスラッシュを記載。
         * .jpeg(jpg) .png .gif .svgで終わるファイルを対象とする。
         */
        test: /\.(jpe?g|png|gif|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "/src/media/images/[name].[ext]",
          },
        },
      },

      // ejs
      {
        rules: [
          {
            // 大文字と小文字を区別しない
            test: /\.ejs$/i,
            use: ["html-loader", "template-ejs-loader"],
          },
        ],
      },

      // scss
      // {
      //   test: /\.(css|scss)$/,
      //   use: {
      //     loader:
      //   }
      // }
    ],
  },

  plugins: [...htmlGlobPlugins(entries)]
};
module.exports = webpack;
