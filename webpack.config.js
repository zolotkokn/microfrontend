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
                    remote: 'remote@/remoteEntry.js',
                },
                shared: {
                    react: { singleton: true, eager: true },
                    'react-dom': { singleton: true, eager: true },
                },
            }),
            new HtmlWebpackPlugin({
                template: './host/index.html',
                filename: 'index.html',
            }),
            new ModuleFederationPlugin({
                name: 'remote',
                filename: 'remoteEntry.js',
                exposes: {
                    './Button': './remote/src/Button',
                },
                shared: {
                    react: { singleton: true, eager: true },
                    'react-dom': { singleton: true, eager: true },
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
