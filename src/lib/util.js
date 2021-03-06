export default {
  networks: [{
    id: "0x1",
    name: "Mainnet",
    network: "homestead",
  }, {
    id: "0x3",
    name: "Ropsten",
    network: "ropsten",
  }, {
    id: "0x4",
    name: "Rinkeby",
    network: "rinkeby",
  }, {
    id: "0x5",
    name: "Goerli",
    network: "goerli",
  }, {
    id: "0x2a",
    name: "Kovan",
    network: "kovan",
  }],
  //获取网络浏览器的域名
  getChainDomain: function (chainId) {
    if (chainId === "0x1") {
      return "https://etherscan.io/";
    }
    for (let i in this.networks) {
      let network = this.networks[i];
      if (network.id === chainId) {
        return 'https://' + network.network + '.etherscan.io';
      }
    }
    return null;
  },
  //获取指定的Network
  getNetwork: function (chainId) {
    for (let i in this.networks) {
      let network = this.networks[i];
      if (network.id === chainId) {
        return network;
      }
    }
    return null;
  },
  //获取Metamask的当前账户
  getMetaMaskAccount: async function () {
    if (window.ethereum === null) {
      return null;
    }
    let accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    let account = accounts.length === 0 ? null : accounts[0];
    return account;
  },
  //获取Metamask的当前账户
  requestMetaMaskAccount: async function () {
    if (window.ethereum === null) {
      alert('请确保已安装MetaMask!');
      return null;
    }
    let accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    let account = accounts.length === 0 ? null : accounts[0];
    return account;
  },
  //获取当前网络
  getMetaMaskChainId: function () {
    if (window.ethereum && window.ethereum.isConnected()) {
      return window.ethereum.chainId;
    }
    return null;
  }
}