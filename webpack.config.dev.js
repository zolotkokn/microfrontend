const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const webpackHotMiddleware = require('webpack-hot-middleware');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = (env = {}) => {


    console.log('PARAMS:', env.customParams);

    return {
        entry: './host/src/index.js', // Начальная точка входа для host
        mode: 'development',          // Включаем режим разработки
        devServer: {
            // contentBase: path.join(__dirname, 'build'),
            historyApiFallback: true,   // Поддержка HTML5 History API
            static: {
                directory: path.resolve(__dirname, 'build'), // Указываем директорию для статических файлов
            },
            liveReload: false,
            hot: true,  // Включаем hot reload
            // open: true, // Автоматически открывать браузер при запуске
            compress: true, // Включаем сжатие
            port: 3000, // Порт для локального сервера
        },
        output: {
            publicPath: 'auto',  // Базовый путь для статических файлов
            // path: path.resolve(__dirname, 'build'),
            filename: '[name].js',  // Без кэширования
            chunkFilename: '[name].js',  // Без кэширования
        },
        optimization: {
            // splitChunks: false, // Отключаем разделение на несколько чанков
            runtimeChunk: 'single',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader', // Используем babel-loader для транспиляции
                    },
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(), // Очистка папки dist перед сборкой
            // Настраиваем Module Federation для host
            new ModuleFederationPlugin({
                name: 'host',
                remotes: {
                    // Указываем путь к remote, который будет в той же директории
                    remote: 'remote@/remoteEntry.js',
                },
                shared: {
                    react: {singleton: true, eager: true},
                    'react-dom': {singleton: true, eager: true},
                },
            }),
            // HtmlWebpackPlugin для host-приложения
            new HtmlWebpackPlugin({
                template: './host/index.html',
                filename: 'index.html',  // Главный файл index для host-приложения
            }),

            // Настраиваем Module Federation для remote
            new ModuleFederationPlugin({
                name: 'remote',
                filename: 'remoteEntry.js',  // Файл экспорта remote в той же папке
                exposes: {
                    './Button': './remote/src/Button',  // Экспортируем компонент Button
                },
                shared: {
                    react: {singleton: true, eager: true},
                    'react-dom': {singleton: true, eager: true},
                },
            }),
            // HtmlWebpackPlugin для remote (если нужен отдельный рендеринг remote)
            // new HtmlWebpackPlugin({
            //     template: './remote/index.html',
            //     filename: 'remote.html',  // Отдельный HTML для remote (опционально)
            // }),
        ],
    };
};
