module.exports = {
    entry: {
        main: './main.js',
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                { pragma: 'ToyReact.createElement' },
                            ],
                        ],
                    },
                },
            },
        ],
    },
    mode: 'development',
    devServer: {
        contentBase: './dist',
    },
    optimization: {
        minimize: false,
    },
};
