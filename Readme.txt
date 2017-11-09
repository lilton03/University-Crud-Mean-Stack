A simple crud application built sample code built on MEAN stack.

M- monggo db

E- express

A- angular

N- node.js


To run application please install node.js and mongodb

Install Node.js:

sudo apt-get update

sudo apt-get install nodejs

sudo apt-get install npm


Install Mongodb:

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list

sudo apt-get update

sudo apt-get install -y mongodb-org

Start Mongodb:

sudo service mongod start

Create Database:

>use test

-check if test database was created: 
>db

it should output:
-test



Execute application:

-Navigate to ../MEAN STACK TEST/University Manager

-Then to execute the application node server.js

-Then to see on browser go to http://localhost:3000

