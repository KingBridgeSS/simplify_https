const NodeRSA = require('node-rsa');
const AesEncryption = require('aes-encryption')

function rsa(){
    let key=new NodeRSA();
    key.generateKeyPair(512);
    let private_key=key.exportKey('private');
    let public_key=key.exportKey('public');

    console.log(private_key)
    console.log(public_key)

    let plain="Hello, world!"
    console.log('Plain text: '+plain)
    let cypher=new NodeRSA().importKey(public_key).encrypt(plain,'base64')
    console.log('Cypher text: '+cypher)
    let decrypted=new NodeRSA().importKey(private_key).decrypt(cypher,'utf-8')
    console.log('Decrypted test: '+decrypted)
}

function aes(){

    const aes = new AesEncryption()
    const dict='0123456789abcdef'
    let key=''
    for(let i=0;i<64;i++){
        let index=Math.floor(Math.random()*16)
        key+=dict[index]
    }
    console.log('key: ',key)
    aes.setSecretKey(key)
    // Note: secretKey must be 64 length of only valid HEX characters, 0-9, A, B, C, D, E and F

    const encrypted = aes.encrypt('some-plain-text')
    const decrypted = aes.decrypt(encrypted)

    console.log('encrypted >>>>>>', encrypted)
    console.log('decrypted >>>>>>', decrypted)
}
aes()