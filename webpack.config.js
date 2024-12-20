const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = (env = {}) => {

    console.log('PARAMS:', env.customParams);

    return {
        entry: './host/src/index.js', // Начальная точка входа для host
        mode: 'production',  // Используем production для продакшн-сборки
        output: {
            filename: 'main.[contenthash].js',  // Уникальные имена файлов для кэширования
            path: path.resolve(__dirname, 'build'),  // Одна директория для всех файлов
            publicPath: '/',  // Файлы будут загружаться из корня
            clean: true,  // Очистка директории перед сборкой
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
                    react: { singleton: true, eager: true },
                    'react-dom': { singleton: true, eager: true },
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
                    react: { singleton: true, eager: true },
                    'react-dom': { singleton: true, eager: true },
                },
            }),
            // HtmlWebpackPlugin для remote (если нужен отдельный рендеринг remote)
            // new HtmlWebpackPlugin({
            //     template: './remote/index.html',
            //     filename: 'remote.html',  // Отдельный HTML для remote (опционально)
            // }),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all', // Разделение общих частей кода в отдельные файлы
            },
        },
    }
};
