module.export = {
    pluginOptions: {
        electronBuilder: {
            externals: ['serialport'],
            nodeModulesPath: ['../../node_modules', './node_modules']
        }
    }
}