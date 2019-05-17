const inquirer = require('inquirer');
const exec = require('child_process').exec;

// 是否是window系统
const isWindow32 = process.platform == 'win32';

// 解析命令行参数
let [, , ...ports] = process.argv;

if (!ports.length) {
    return console.log('请输入端口号或者app关键字');
}

/**
 * 格式化输出 port 的进程输出
 * @param {string} stdout console.log打印日志
 * COMMAND PID
 * node    3000
 * 转化为
 * [
 *  { COMMAND:'node',PID:3000},
 * ]
 */
function formatPortStd(stdout) {
    let stdRows = stdout.split('\n').map(item => item.split(/\s+/));
    let stdKeys = stdRows[0];
    let stdArr = [];
    stdRows.forEach((item, index) => {
        if (index > 0) {
            let obj = {};
            item.forEach((_item, i) => {
                let key = stdKeys[i];
                if (key) obj[key] = _item;
            });
            stdArr.push(obj);
        }
    });
    return stdArr;
}

// 格式化输出 app 的进程输出
function formatAppStd(stdout) {
    let stdRows = stdout.split('\n').map(item => item.split(/\s+/));
    let arrs = [];
    stdRows.forEach(item => {
        let obj = {};
        if (item.length > 2) {
            obj.pid = item[1];
            obj.program = typeof item[10] === 'undefined' ? '' : item[10];
            obj.dir = typeof item[11] === 'undefined' ? '' : item[11];
            if (!(obj.program.includes('wflow') || obj.dir.includes('wflow'))) {
                arrs.push(obj);
            }
        }
    });
    return arrs;
}

// 杀进程
function killPid(killPids, callback, killedPids = [], port = '') {
    let item = killPids[0];
    killPids.shift();
    if (!item) return false;
    // 如果已经杀过该进程
    if (killedPids.includes(item.PID)) {
        return killPid(killPids, killedPids);
    }
    exec('kill ' + item.PID, function(err, stdout, stderr) {
        if (err) {
            console.log(
                `❌ ${item.COMMAND}=>占用${port}端口进程为${item.PID}清理失败！`
            );
        } else {
            console.log(
                `👌 ${item.COMMAND}=>占用${port}端口进程为${item.PID}清理成功！`
            );
        }
        // 把杀掉的进程加入已杀进程列表
        killedPids.push(item.PID);
        if (killPids.length) {
            killPid(killPids, callback, killedPids, port);
        } else {
            callback && callback();
        }
    });
}

// 主逻辑
function MainProcess(port, callback) {
    // 如果是检索app,杀对应的进程(默认为true)
    var isKillApp = true;
    if (parseInt(port) > 0) {
        isKillApp = false;
    }

    var cmd;
    if (isWindow32) {
        cmd = isKillApp ? 'netstat -ano' : `lsof -i :${port}`;
    } else {
        // mac ,linux 系统
        cmd = isKillApp ? `ps aux | grep ${port}` : `lsof -i :${port}`;
    }

    if (isKillApp) {
        exec(cmd, (err, stdout) => {
            let formatedStdout = formatAppStd(stdout);
            // 提供所有选项供选择
            inquirer
                .prompt([
                    {
                        type: 'checkbox',
                        name: 'commands',
                        message: '请选择要结束的进程',
                        choices: formatedStdout.map(item => {
                            return {
                                name: `${item.pid}-${item.program}-(${
                                    item.dir
                                })`,
                            };
                        }),
                    },
                ])
                .then(res => {
                    let pids = res.commands.map(item => {
                        return {
                            COMMAND: item.split('-')[1],
                            PID: item.split('-')[0],
                        };
                    });
                    killPid(pids, callback, [], port);
                });
        });
    } else {
        exec(cmd, function(err, stdout, stderr) {
            if (err) {
                return console.error(`❌ 未找到对应端口的进程`);
            }

            // 格式化 stdout 输出
            let formatedStdArr = formatPortStd(stdout);

            // 解析出所有占用端口程序
            let portCommands = [];
            formatedStdArr.forEach(item => {
                if (!portCommands.includes(item.COMMAND) && item.COMMAND) {
                    portCommands.push(item.COMMAND);
                }
            });

            // 提供进行供选择;
            inquirer
                .prompt([
                    {
                        type: 'checkbox',
                        name: 'commands',
                        message: '请选择要结束的进程',
                        choices: portCommands.map(item => {
                            return { name: item };
                        }),
                    },
                ])
                .then(res => {
                    let needCommands = res.commands;
                    // 找出对应命令的PID,沙雕
                    let toKillItems = formatedStdArr.filter(item => {
                        return needCommands.includes(item.COMMAND);
                    });
                    killPid(toKillItems, callback, [], port);
                });
        });
    }
}

function MainRun(orders) {
    if (!orders.length) return;
    var port = orders[0];
    orders.shift();
    MainProcess(port, function() {
        MainRun(orders);
    });
}

// 可支持多条遍历执行
MainRun(ports);
