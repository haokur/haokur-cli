const { getLocalIp } = require('../utils/ip');
let [, , ...argvs] = process.argv;

// 显示ip地址
let isShowList = typeof argvs[0] === 'undefined' || argvs[0] === '--list';
if (isShowList) {
    let ips = getLocalIp();
    console.log('\n');
    console.log('----------- IPv4 -----------\n');
    ips.IPv4.forEach(item => {
        console.log(`http://${item}`);
    });
    console.log('\n');
    console.log('----------- IPv6 -----------\n');
    ips.IPv6.forEach(item => {
        console.log(`${item}`);
    });
}
