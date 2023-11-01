/**
 * 使用参数 --change-pages参数编译时，app.json中将调整app.json中文件路径
 */
'use strict';

module.exports = {
    apply(compiler) {
        compiler.hooks.emit.tap('compilation', compilation => {
            if (!(process.argv && process.argv.indexOf('--change-pages') > -1)) {
                return;
            }
            // 遍历所有资源文件
            for (let filePathName in compilation.assets) {
                if (/^app\.json/i.test(filePathName)) {
                    console.log('\n- 调整app.json中文件的路径...');
                    // 获取文件内容
                    let content = compilation.assets[filePathName].source() || '';
                    let data = JSON.parse(content);
                    if (typeof data.subPackages !== 'undefined' && data.subPackages.length) {
                        for (let i in data.subPackages) {
							if (data.subPackages[i].root.indexOf('pages') !== -1) {
								for (let j in data.subPackages[i].pages) {
									data.pages.push(data.subPackages[i].root + '/' + data.subPackages[i].pages[j])
								}
								delete data.subPackages[i]
							}
                        }
						data.subPackages = data.subPackages.filter(n => n)
                    }
                    content = JSON.stringify(data, null, 2);
                    // 重写指定输出模块内容
                    compilation.assets[filePathName] = {
                        source() {
                            return content;
                        },
                        size() {
                            return content.length;
                        }
                    };
                }
            }

        });
    },
};
