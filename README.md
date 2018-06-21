# mean-angular4-chat-app

This source code is part of tutorial [Building Chat Application using MEAN Stack (Angular 4) and Socket.io](https://www.djamware.com/post/58e0d15280aca75cdc948e4e/building-chat-application-using-mean-stack-angular-4-and-socketio)

Step to run:

* Prepare Node.js and Angular CLI
* Clone this repo
* Run 'npm install'
* Run 'ng build --prod'
* Run 'nodemon' or 'npm start'

If you think this source code is useful, it will be great if you just give it star or just buy me a cup of cofee [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Q5WK24UVWUGBN)


<!-- Ben  -->
<!-- Enable angular to update automatically -->
sudo ng serve --poll=2000

Simple MEAN apps

https://www.youtube.com/watch?v=wtIvu085uU0

MongoDB
Express
Angular
NodeJS

Create
Read
Update
Delete

environment:
Install npm
Install node


Create a MEAN project under the project directory. Server side
- npm init 
- npm install dependency components
  	- sudo npm install express --save
  	- sudo npm install mongoose cors body-parser --save
	- sudo npm install nodemon
	
Client side
	under angular project folder
	- sudo npm install @angular/cli
	- sudo npm install socket.io-client
	- sudo npm install @types/socket.io-client


- Create an angular folder, you need to rename the package.json file, after the new ng file is created, rename the package.json
  	- ng new client	//new projectFolderName

- Create new component under angular project folder
    - Ng g c componentName
    - Ng g s serviceName



Make sure mongoDB is running
- mongod

Check mongoDB command
- mongo
- Show dbs
- Show collections
- use dbs
- Db.collectionName.find().pretty()
- db.collection.drop()
- db.user.remove({})

Execute on server side:
npm start 

Execute on client side:
ng serve -o --port 4080 --host 0.0.0.0 --ssl true --ssl-key ./routes/encryption/pk.pem --ssl-cert ./routes/encryption/cert2.pem --public airpoint.com.hk

