const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = (env = {}) => {
    console.log('PARAMS:', env.customParams);

    return {
        entry: './host/src/index.js',
        mode: 'production',
        output: {
            filename: 'main.[contenthash].js',
            path: path.resolve(__dirname, 'build'),
            publicPath: '/',
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ModuleFederationPlugin({
                name: 'host',
                remotes: {
                    remote: 'remote@/remoteEntry.[contenthash].js',
                    store: 'store@/remoteStoreEntry.[contenthash].js',
                    ui: 'ui@/remoteUiEntry.[contenthash].js',
                },
                shared: {
                    react: { singleton: true, eager: true },
                    'react-dom': { singleton: true, eager: true },
                    'react-redux': {singleton: true, eager: true},
                },
            }),
            new HtmlWebpackPlugin({
                template: './host/index.html',
                filename: 'index.html',
            }),
            new ModuleFederationPlugin({
                name: 'remote',
                filename: 'remoteEntry.[contenthash].js',
                exposes: {
                    './Button': './remote/src/Button',
                },
                shared: {
                    react: { singleton: true, eager: true },
                    'react-dom': { singleton: true, eager: true },
                },
            }),
            new ModuleFederationPlugin({
                name: 'store',
                filename: 'remoteStoreEntry.[contenthash].js',
                exposes: {
                    './Store': './store/src/store',
                },
                shared: {
                    react: {singleton: true, eager: true},
                    'react-dom': {singleton: true, eager: true},
                    'react-redux': {singleton: true, eager: true},
                },
            }),

            new ModuleFederationPlugin({
                name: 'ui',
                filename: 'remoteUiEntry.[contenthash].js',
                exposes: {
                    './TodoList': './ui/src/TodoList',
                    './TodoForm': './ui/src/TodoForm',
                },
                shared: {
                    react: {singleton: true, eager: true},
                    'react-dom': {singleton: true, eager: true},
                    'react-redux': {singleton: true, eager: true},
                },
            }),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
    }
};
