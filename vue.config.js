module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "com.rymcu.nebula-helper",
                "productName": "nebula-helper",
                "copyright": "Copyright © rymcu.com",
                "win": {
                    "icon": "./favicon.ico",
                    "target": [
                        {
                            "target": "nsis",
                            "arch": [
                                "x64",
                                "ia32"
                            ]
                        }
                    ]
                },
                "linux": {
                    "icon": "./favicon.ico",
                    "target": [
                        "snap"
                    ]
                }
            }
        }
    }
}