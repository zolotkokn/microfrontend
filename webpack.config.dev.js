const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = (env = {}) => {
    console.log('PARAMS:', env.customParams);

    return {
        mode: 'development',
        entry: './host/src/index.js',
        resolve: {
            modules: [
                path.resolve(__dirname, 'node_modules'), 'node_modules'
            ],
            extensions: ['.js', '.jsx', '.json']
        },
        devServer: {
            historyApiFallback: true,
            static: {
                directory: path.resolve(__dirname, 'build'),
            },
            liveReload: false,
            hot: true,
            compress: true,
            port: 3000,
        },
        output: {
            publicPath: 'auto',
            filename: '[name].js',
            chunkFilename: '[name].js',
        },
        optimization: {
            runtimeChunk: 'single',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules|Remote/,
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
                    react: {singleton: true, eager: true},
                    'react-dom': {singleton: true, eager: true},
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
                    react: {singleton: true, eager: true},
                    'react-dom': {singleton: true, eager: true},
                },
            }),
        ],
    };
};
