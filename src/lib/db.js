var storage = window.localStorage;

export default {
  getLang: function () {
    var lang = storage.getItem('lang');
    if (lang === null) {
      lang = "zh-CN";
    }
    return lang;
  },
  setLang: function (lang) {
    storage.setItem('lang', lang);
  },
  //获取当前网络Id
  getCurrentChainId: function () {
    var chainId = storage.getItem('chain-id');
    if (chainId === null)
      chainId = "0x1";
    return chainId;
  },
  //设置当前网络Id
  setCurrentChainId: function (chainId) {
    storage.setItem('chain-id', chainId);
  },
  //获取当前合约地址
  getCurrentContractAddress: function () {
    var address = storage.getItem('contract-address');
    return address;
  },
  //设置当前合约地址
  setCurrentContractAddress: function (address) {
    storage.setItem('contract-address', address);
  },
  //获取指定网络的所有合约
  getContracts: function (chainId) {
    var addrList = storage.getItem(chainId);
    var contracts = [];
    if (addrList !== null) {
      var array = JSON.parse(addrList);
      for (let i in array) {
        const addr = array[i];
        var contract = storage.getItem(addr);
        if (contract !== null) {
          contracts.push(JSON.parse(contract));
        }
      }
    }
    return contracts;
  },
  //获取指定地址的合约
  getContract: function (address) {
    var contract = storage.getItem(address);
    return contract;
  },
  //更新合约数据
  updateContract: function (contract) {
    storage.setItem(contract.address, JSON.stringify(contract));
  },
  //在指定网络中添加合约
  addContract: function (chainId, contract) {
    var addrList = storage.getItem(chainId);
    if (addrList === null)
      addrList = [];
    else
      addrList = JSON.parse(addrList);
    addrList.push(contract.address);
    storage.setItem(chainId, JSON.stringify(addrList));
    storage.setItem(contract.address, JSON.stringify(contract));
  },
  //移除指定合约
  removeContract: function (chainId, contract) {
    var addrList = storage.getItem(chainId);
    if (addrList === null)
      addrList = [];
    else
      addrList = JSON.parse(addrList);
    addrList = addrList.filter(item => item !== contract.address);
    storage.setItem(chainId, JSON.stringify(addrList));
    storage.removeItem(contract.address);
  }
}