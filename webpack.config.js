const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    mode: 'development',  
    entry: {
        bundle: path.resolve(__dirname, 'src/js/Controller.js')  
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',  
        clean: true, 
        assetModuleFilename: '[name][ext]'
    },
    devtool: 'source-map',    
    devServer: {
        static: { 
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000,
        open: true,  
        hot: true, 
        compress: true, 
        historyApiFallback: true
    },
    module: {  
        rules: [
            {
                test: /\.(mp4|webm|ogg|mov)$/,  // Adjust extensions as needed
                type: 'asset/resource',
                generator: {
                    filename: 'assets/videos/[name].[hash][ext]', // Path within dist
                },
            },
            {
                test: /sass\.dart\.js$/,
                parser: { requireEnsure: false },
            },
            {
                test: /\.scss$/,  
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
                test: /\.ico$/i,
                type: 'asset/resource'
            },
            {
                test: /\.svg$/,  // Match all SVG files
                type: 'asset/resource',  // Use asset module to handle the file
                generator: {
                    filename: 'assets/icons/[name].[hash][ext]',  // Save them in the desired folder with a hash in the filename
                },
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [  
        new HtmlWebpackPlugin({
            title: 'Weather Control',
            filename: 'index.html',
            template: 'src/template.html',
            favicon: './src/img/favicon.ico'
        }),
        // new BundleAnalyzerPlugin()
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/vid'), // Source folder
                    to: 'assets/videos', // Destination in dist
                },
            ],
        }),
    ], 
    stats: {
        warningsFilter: [/sass\.dart\.js/],
    }
}

