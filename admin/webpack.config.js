const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = () => {
  let plug = [{ from: "public", to: "public" }];
  return {
    entry: "/src/index.js",
    resolve: {
      fallback: { path: require.resolve("path-browserify") },
    },
    output: {
      path: path.join(__dirname, "/build"),
      filename: "[name].[contenthash].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.css|.scss$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            "file-loader",
            {
              loader: "image-webpack-loader",
              options: {
                disable: true,
              },
            },
          ],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new Dotenv({
        systemvars: true,
        silent: true,
        defaults: true,
      }),
      new CopyPlugin(plug),
    ],
  };
};
