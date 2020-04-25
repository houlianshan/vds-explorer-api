
# VDS Explorer API

**A VDS blockchain explorer and API.**

## Depends

- VDS P2P Peer
- npm >=8.4.0
- MongoDB Server >= v3.4

## Getting Started

### 1. Install nodejs

    $ sudo apt install nodejs

### 2. Setup Bitcore config

Edit the "bitcore.config.json" file:

```json
{
  "bitcoreNode": {
    "modules": ["./vds"],
    "services": {
      "api": {
        "wallets": {
          "allowCreationBeforeCompleteSync": true
        }
      }
    },
    "chains": {
      "VDS": {
        "mainnet": {
          "chainSource": "p2p",
          "trustedPeers": [
              {
                "host": "127.0.0.1",     //VDS节点公网IP
                "port": 6533             //VDS节点端口
              }
            ],
            "rpc": {
              "host": "127.0.0.1",
              "port": 6532,
              "username": "xxxxxxxx",
              "password": "xxxxxxxx"
            }
          }
      }
    }
  }
}
```

### 3. Install MongoDB

    $ sudo apt-get install mongodb

### 4. Install npm depends

    $ npm install

### 5. Start VDS Explorer API

    $ npm run node

Copyright
---------

This software is developed by [www.ivds.org](https://www.ivds.org).
