const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// if you run server with 'dist' non-existent, it'll still run, it runs from memory -- it's not running it directly from dist files

module.exports = {
    mode: 'development',   // this makes the output more verbose, 'production' is more concise
    entry: {
        bundle: path.resolve(__dirname, 'src/js/Controller.js')  // __dirname is a variable that points to the root folder here that contains the src folder
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',  // 'name' here references 'bundle' in 'entry' above; 'contenthash' is a little help to prevent browser hashing, it's new every time we build
        clean: true, // keep only one js file in 'dist'
        assetModuleFilename: '[name][ext]'   // to keep the names of images, otherwise they'll be renamed; if you have any imgs in src/images, they will be put into 'dist'
    },
    devtool: 'source-map',    // also generates .js.map in dist, helps in debugging
    devServer: {
        static: { // telling dev server what to serve
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000,
        open: true,  // opens the browser automatically
        hot: true, // hot reloading
        compress: true, // enable gzop compression
        historyApiFallback: true
    },
    module: {  // for loaders
        rules: [
            {
                test: /\.scss$/,   // apply to every .scss
                use: ['style-loader', 'css-loader', 'sass-loader']
            }, 
            {
                test: /\.js$/, 
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [  // for plugins
        new HtmlWebpackPlugin({
            title: 'New Project',
            filename: 'index.html',
            template: 'src/template.html'
        }),
        // new BundleAnalyzerPlugin()
    ]
}