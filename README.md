**Hyperledger Fabric 4 Org 1 Peer node**

* Download
* Generate Network Genesis Block
```
../bin/configtxgen -profile EtcdRaftNetwork -channelID bb-sys-channel -outputBlock ./channel-artifacts/genesis.block
```
* Generate Channel Block and Anchor Peer
1.  DSChannel
```
export CHANNEL_NAME=dschannel  && ../bin/configtxgen -profile DSChannel -outputCreateChannelTx ./channel-artifacts/DSChannel.tx -channelID $CHANNEL_NAME
../bin/configtxgen -profile DSChannel -outputAnchorPeersUpdate ./channel-artifacts/{DataScienceMSP / eClinicMSP / ZeelMSP / ZGMSP}DSanchors.tx -channelID $CHANNEL_NAME -asOrg {DataScienceMSP / eClinicMSP / ZeelMSP / ZGMSP}
```
2.  NoDSChannel
```
export CHANNEL_NAME=nodschannel  && ../bin/configtxgen -profile NoDSChannel -outputCreateChannelTx ./channel-artifacts/NoDSChannel.tx -channelID $CHANNEL_NAME
../bin/configtxgen -profile NoDSChannel -outputAnchorPeersUpdate ./channel-artifacts/{DataScienceMSP / eClinicMSP / ZeelMSP / ZGMSP}NoDSanchors.tx -channelID $CHANNEL_NAME -asOrg {DataScience / eClinicMSP / ZeelMSP / ZGMSP}
```
* Create Channel block from cli terminal
1.  DSChannel
```
export CHANNEL_NAME=dschannel && export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/nbp.com/orderers/nbpOrderer1.nbp.com/msp/tlscacerts/tlsca.nbp.com-cert.pem
peer channel create -o nbpOrderer1.nbp.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/DSChannel.tx --tls --cafile $ORDERER_CA
```
2.  NoDSChannel
```
export CHANNEL_NAME=nodschannel && export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/nbp.com/orderers/nbpOrderer1.nbp.com/msp/tlscacerts/tlsca.nbp.com-cert.pem
peer channel create -o nbpOrderer1.nbp.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/NoDSChannel.tx --tls --cafile $ORDERER_CA
```
* Start following containers using following commands:

Bapuka:
```
    docker-compose -f docker-compose-ca-eclinic.yaml up -d
    docker-compose -f docker-compose-peer0eclinic.yaml up -d
    docker-compose -f docker-compose-cli-eclinic.yaml up -d
```
* Open cli terminal
* Copy channel block from "file-from-docker-containers" folder to cli container
* Fetch channel config
```
export CHANNEL_NAME=dschannel && export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/nbp.com/orderers/nbpOrderer1.nbp.com/msp/tlscacerts/tlsca.nbp.com-cert.pem

peer channel fetch 0 dschannel.block -o nbpOrderer1.nbp.com:7050 -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
```
* Connect to the Fabric channel from cli terminal
```
peer channel join -b dschannel.block
peer channel join -b nodschannel.block
```
* Update Anchor Peer from cli terminal

```
export CHANNEL_NAME=dschannel && export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/nbp.com/orderers/nbpOrderer1.nbp.com/msp/tlscacerts/tlsca.nbp.com-cert.pem
peer channel update -o nbpOrderer1.nbp.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/eClinicMSPDSanchors.tx --tls --cafile $ORDERER_CA
```
```
export CHANNEL_NAME=nodschannel && export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/nbp.com/orderers/nbpOrderer1.nbp.com/msp/tlscacerts/tlsca.nbp.com-cert.pem
peer channel update -o nbpOrderer1.nbp.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/eClinicMSPNoDSanchors.tx --tls --cafile $ORDERER_CA
```
* Install Chaincode
```
peer chaincode install -n bloodtest -v 99.0 -l node -p /opt/gopath/src/github.com/hyperledger/fabric-samples/chaincode/blood_test/node/
```
* Instantiate Chaincode **##ALREADY INSTANTIATED ##DO NOT**
```
export CHANNEL_NAME=dschannel && export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/nbp.com/orderers/nbpOrderer1.nbp.com/msp/tlscacerts/tlsca.nbp.com-cert.pem

peer chaincode instantiate -o nbpOrderer1.nbp.com:7050 --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n bloodtest -v 99.0 -l node -c '{"Args":["init"]}' -P "AND ('DataScienceMSP.peer','eClinicMSP.peer')"
```
* Query chaincode
```
export CHANNEL_NAME=dschannel

peer chaincode query -C $CHANNEL_NAME -n bloodtest -c '{"Args":["readResult","Kleenex"]}'
```
* Invoke chaincode
```
export CHANNEL_NAME=dschannel && export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/nbp.com/orderers/nbpOrderer1.nbp.com/msp/tlscacerts/tlsca.nbp.com-cert.pem

peer chaincode invoke -o nbpOrderer1.nbp.com:7050 --tls true --cafile $ORDERER_CA -C $CHANNEL_NAME -n bloodtest --peerAddresses peer0.datascience.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/datascience.com/peers/peer0.datascience.com/tls/ca.crt -c '{"Args":["addResult","Kleenex","KR","A type"]}'
```
