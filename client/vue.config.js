module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:3601',
                changeOrigin: true
            },
        }
    }
}