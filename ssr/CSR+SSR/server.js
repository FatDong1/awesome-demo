const fs = require('fs');
const path = require('path');
const express = require('express');
const server = express();
server.use(express.static('dist'));

const bundle = fs.readFileSync(path.resolve(__dirname, 'dist/serverBundle.js'), 'utf-8');

// 将打包后的entry-server.js渲染成html文件，再把打包后的entry-client.js混合进html中
const renderer = require('vue-server-renderer').createBundleRenderer(bundle, {
    template: fs.readFileSync(path.resolve(__dirname, 'index.ssr.html'), 'utf-8'),
    clientManifest: require(path.resolve(__dirname, 'dist/vue-ssr-client-manifest.json'))
});

server.get('/index', (req, res) => {
    renderer.renderToString(req, (err, html) => {
        if (err) {
            console.error(err);
            res.status(500).end('服务器内部错误');
            return;
        }
        res.end(html);
    })
});


server.listen(8002, () => {
    console.log('后端渲染服务器启动，端口号为：8002');
});
