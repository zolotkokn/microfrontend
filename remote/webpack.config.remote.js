const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devServer: {
        static: path.join(__dirname, 'build'),
        hot: true,
        port: 3001,
    },
    output: {
        filename: 'remoteEntry.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new ModuleFederationPlugin({
        //     name: 'remote', // Имя remote-приложения
        //     filename: 'remoteEntry.js', // Входной файл с экспонируемыми модулями
        //     exposes: {
        //         './Button': './src/Button', // Экспонируемый модуль
        //     },
        //     shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
        // }),
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
};
