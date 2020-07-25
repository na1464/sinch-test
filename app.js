const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const APPKEY = '289ed235-9088-4a27-84c7-2ec339e4f495';
const APPSECRET = '4jj7ZfxXMU6ltVYtcE1PSg==';

app.use('/receive-call', (req, res) => {
    const queryString = req.query;
    console.log(req.body);
    const event = req.body.event;
    
    switch (event) {
        case'ice':
        console.log('## - EVENT ICE');
        
        res.json({
            instructions: [
                {
                    name:'Say',
                    text:'Hello World, This will not be recorded',
                    locale:'en-US',
                },
                {
                    name: "StartRecording",
                    options: {
                        destinationUrl: "s3://sinch-call-recordings/",
                        credentials: "AKIAISYJEETGBF3DGC6A:+sAWRl5EWOOtDyv+SyB9tnvam+VM3xiiqmQHIdJL:ap-south-1",
                        format: "mp3",
                        notificationEvents: true
                  }
                },
                {
                    name:'Say',
                    text:'Hello World, This will be recorded',
                    locale:'en-US',
                },
            ],
            action:{
                name:'ConnectPstn',
                number:'+918329458133',// CALLEE
                locale:'en-US',
                maxDuration:3000,
                cli:req.body.cli,// CALER_ID/CLI
                indications:'us',
            },
        });
        break;
        case'ace':
            console.log('## - EVENT ACE');
            console.log('## - ACTION Continue');
            res.json({
                action:{
                name:'continue',
                },
            });
        break;
    }

});

app.use('/make-call', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.use('/getCalllogs', (req, res) => {

    const callId = req.query.callId;

    const APIURL = 'https://calling.api.sinch.com/calling/v1/calls/id/' + callId;

    var options = { 
		method: 'GET',
		url: APIURL,
        auth: {
            'user' : APPKEY,
            'password' : APPSECRET
        },
        headers: {
            'Content-Type' : `application/json`
        },
		json: true
    };

    request(options,(error, response, body) => {
        if(!error){
            res.send(body);
        } else {
            res.send(error);
        }
    });

   
});

app.listen(9001,() => {
    console.log('Listening on port 9001');
});