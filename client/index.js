const net = require('net');
const NodeRSA = require('node-rsa');
const AesEncryption = require('aes-encryption')

const HOST='127.0.0.1'
const PORT=2333

let action='get_public_key'
/*
actions:
get_public_key
input_name
receive_greetings
 */


//Get 3rd parameter from terminal
let name=process.argv[2]==null?'bridge':process.argv[2]

// generate an aes key
const aes = new AesEncryption()
const dict='0123456789abcdef'
let key=''
for(let i=0;i<64;i++){
    let index=Math.floor(Math.random()*16)
    key+=dict[index]
}
console.log('aes key generated: \n',key,'\n')
// Note: secretKey must be 64 length of only valid HEX characters, 0-9, A, B, C, D, E and F
aes.setSecretKey(key)

const client = net.createConnection({port:PORT,host:HOST }, () => {
    // 'connect' listener.
    console.log('connected to server!');
});
client.on('data', (buf) => {
    let data=buf.toString()
    let to_send=''
    switch (action) {
        case 'get_public_key':{
            console.log('Received RSA public key: \n',data,'\n')
            // use received RSA public key to encrypt aes key before send
            let encrypted_aes_key=new NodeRSA().importKey(data).encrypt(key,'base64')
            to_send=JSON.stringify({'action':action,'encrypted_aes_key':encrypted_aes_key})
            action='input_name'
            break
        }
        case "input_name":{
            console.log('Received aes encrypted data: \n',data,'\n')
            let plain=aes.decrypt(data)
            console.log('Decrypted data: \n',plain,'\n')
            to_send=JSON.stringify({'action':action,'name':aes.encrypt(name)})
            action='receive_greetings'
            break
        }
        case "receive_greetings":{
            console.log('Received aes encrypted data: \n',data,'\n')
            let plain=aes.decrypt(data)
            console.log('Decrypted data: \n',plain,'\n')
            client.destroy()
            break
        }
    }
    console.log(`Sending message: \n${to_send}`,'\n');
    client.write(to_send)
});
