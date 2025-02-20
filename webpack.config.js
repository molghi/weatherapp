const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    mode: "development",
    entry: {
        bundle: path.resolve(__dirname, "src/js/Controller.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
        clean: true,
        assetModuleFilename: "[name][ext]",
    },
    devtool: "source-map",
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(mp4|webm|ogg|mov)$/, // Adjust extensions as needed
                type: "asset/resource",
                generator: {
                    filename: "assets/videos/[name].[hash][ext]", // Path within dist
                },
            },
            {
                test: /sass\.dart\.js$/,
                parser: { requireEnsure: false },
            },
            {
                test: /\.css$/, // Match .css files
                use: ["style-loader", "css-loader"], // Use these loaders for CSS
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.ico$/i,
                type: "asset/resource",
            },
            {
                test: /\.svg$/, // Match all SVG files
                type: "asset/resource", // Use asset module to handle the file
                generator: {
                    filename: "assets/icons/[name].[hash][ext]", // Save them in the desired folder with a hash in the filename
                },
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/icons/[name][ext]", // Customize output folder
                },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".css"], // Allow resolving .js and .css extensions
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Weather Control",
            filename: "index.html",
            template: "src/template.html",
            favicon: "./src/img/favicon.ico",
        }),
        // new BundleAnalyzerPlugin()
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/vid"), // Source folder
                    to: "assets/videos", // Destination in dist
                },
            ],
        }),
        new webpack.DefinePlugin({
            "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
            "process.env.OPEN_WEATHER_MAP_API_KEY": JSON.stringify(process.env.OPEN_WEATHER_MAP_API_KEY),
            "process.env.WEATHER_API_KEY": JSON.stringify(process.env.WEATHER_API_KEY),
            "process.env.UNSPLASH_KEY": JSON.stringify(process.env.UNSPLASH_KEY),
        }),
    ],
    stats: {
        warningsFilter: [/sass\.dart\.js/],
    },
};
