const net = require('net');
const NodeRSA = require('node-rsa');
const AesEncryption = require('aes-encryption')

const PORT=2333

const server = net.createServer((socket) => {
    // generate a RSA key pair and send the public key
    let rsa_key=new NodeRSA();
    rsa_key.generateKeyPair(512);
    let public_key_string=rsa_key.exportKey('public');
    console.log('RSA key pair generated.')

    // initialize aes Encryption
    const aes = new AesEncryption()

    socket.write(public_key_string)

    socket.on('data',(buf)=>{
        let recv=buf.toString()
        let data=JSON.parse(recv)
        switch (data.action){
            case 'get_public_key':{
                console.log(`Received data contains RSA encrypted aes key: \n${recv}\n`);
                let aes_key=rsa_key.decrypt( data.encrypted_aes_key,'utf-8')
                aes.setSecretKey(aes_key)
                let to_send=aes.encrypt('Please enter your name: ')
                console.log('Sending message: \n',to_send,'\n')
                socket.write(to_send)
                break;
            }
            case 'input_name':{
                console.log('Received aes encrypted data: \n',recv,'\n')
                let plain=aes.decrypt(data.name)
                let to_send=aes.encrypt(`Ciao, ${plain}`)
                console.log('Sending message: \n',to_send,'\n')
                socket.end(to_send)
                socket.destroy()
                break;
            }
        }
    })
}).on('error', (err) => {
    // Handle errors here.
    throw err;
});

server.listen(PORT,() => {
    console.log('opened server on', server.address());
});