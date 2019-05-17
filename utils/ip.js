const os = require("os");

/**
 * 获取本地 ip 地址
 * @param {String} ipType ip类型 分 IPV4 和 IPv6
 */
function getLocalIp(ipType) {
  var ifaces = os.networkInterfaces();
  var ips = {
    IPv4: [],
    IPv6: []
  };

  Object.keys(ifaces).forEach(item => {
    ifaces[item].forEach(face => {
      ips[face.family].push(face.address);
    });
  });

  return ipType ? ips[ipType] : ips;
}

exports.getLocalIp = getLocalIp;
