const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { VueLoaderPlugin } = require('vue-loader')

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/'
}

module.exports = {

    externals:{
        paths: PATHS
    },

    entry: {
        app: PATHS.src
    },
    output: {
        path: PATHS.dist,
        filename: `${PATHS.assets}js/[name].js`,
        publicPath: "/"
    },
    module:{
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options:{
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                use:[
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options:{
                            sourceMap: true
                        }
                    },{
                        loader: 'postcss-loader',
                        options:{
                            sourceMap: true,
                            config:{
                                path:'src/config/postcss.config.js'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.styl$/,
                
                use:[
                    'style-loader',
                    MiniCssExtractPlugin.loader,

                    {
                        loader: 'css-loader',
                        options:{
                            sourceMap: true
                        }
                    },{
                        loader: 'postcss-loader',
                        options:{
                            sourceMap: true,
                            config:{
                                path:'src/config/postcss.config.js'
                            }
                        }
                    },{
                        loader: 'stylus-loader',
                        options:{
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },


    plugins:[
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].css`,
        }),
        new HtmlWebpackPlugin({
            hash: false,
            template: `${PATHS.src}/index.html`,
            filename: './index.html'
        }),
        new CopyWebpackPlugin([
            {
                from: `${PATHS.src}/img`,
                to: `${PATHS.assets}img`
            },{
                from: `${PATHS.src}/static`,
                to: ''
            }
        ])
    ],
};