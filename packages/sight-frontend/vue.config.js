module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:3700',
                changeOrigin: true
            },
        }
    }
}
