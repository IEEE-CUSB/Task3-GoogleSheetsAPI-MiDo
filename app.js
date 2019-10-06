const express = require('express'),
      app = express(),
      mysql = require('mysql'),
      joi = require('joi'),
      bodyparser = require('body-parser'),
      {google} = require('googleapis'),
       keys = require('./keys.json'),
       client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        ['https://www.googleapis.com/auth/spreadsheets'],
       );

app.use(bodyparser.json());
app.use(express.urlencoded());
app.use(express.json());

var mysqlConnection = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: '',
  database: 'ieee'
});

mysqlConnection.connect((err)=>{
  if(!err)
  console.log('DB Connection Succeded');
  else
  console.log('DB Failed \n Error: ' + JSON.stringify(err,undefined,2));
});

client.authorize(function(err, tokens) {
  if(err) {
      console.log('Google Sheets API Failed \n Error: ' + JSON.stringify(err,undefined,2));
      return;
  } else {
      console.log('Google Sheets API Connected!');
  }
});

const gsapi = google.sheets({
  version:'v4',
  auth: client
});
 
app.use('/', express.static('form'));

app.post('/submit', function (req, res) {
    const SchemaValidation = {
      name: joi.string().min(4)
        .required()
        .error(() => {
          return {
            message: 'Name is required. (min:4 chars)',
          };
        }),
        email: joi.string()
        .email()
        .error(() => {
          return {
            message: 'Email field can\'t be Empty',
          };
        }),
        phone: joi.string()
        .min(8)
        .max(14)
        .required()
        .error(() => {
          return {
            message: 'Valid Phone number is Required (min:8 characters - max: 14 characters)',
          };
        }),
        university: joi.string()
        .required()
        .error(() => {
          return {
            message: 'University Field is Required',
          };
        }),
        faculty: joi.string()
        .required()
        .error(() => {
          return {
            message: 'Faculty Field is Required',
          };
        }),
        academicyear: joi.string()
        .required()
        .error(() => {
          return {
            message: 'Academic Year Field is Required and should range from 1-6',
          };
        }),
        workshop: joi.array()
        .items(joi.string().error(() => {
          return {
            message: 'You Should pickup 2 Committees',
          };
        })),
        first_choice: joi.string()
        .required()
        .error(() => {
          return {
            message: 'You should pickup first choice',
          };
        }),
        second_choice: joi.string()
        .required()
        .error(() => {
          return {
            message: 'You should pickup second choice',
          };
        }),
    };
    
    joi.validate(req.body,SchemaValidation,(err, result) => {
      if(err) {
          res.send(`<p style='color:red; text-align:center; margin-top:20px;'>${err.details[0].message}</p>`);
          return; // don't try saving to db if the schema isnt valid
      }
      mysqlConnection.query('INSERT INTO `form` (`name`,`email`,`phone`,`university`,`faculty`,`academic_year`,`first_choice`,`second_choice`) VALUES ("'+req.body.name+'","'+req.body.email+'","'+req.body.phone+'","'+req.body.university+'","'+req.body.faculty+'","'+req.body.academicyear+'","'+req.body.first_choice+'","'+req.body.second_choice+'")', function(error, results, fields) {		
          if(error){
            res.send(`<p style='color:red; text-align:center; margin-top:20px;'>Make sure you entered Correct Data</p>`);
            return;
          }
          else
          {
            mysqlConnection.query(`SELECT id FROM form WHERE phone = '${req.body.phone}' LIMIT 1;`,(err,rows,fields) => {
                if(err) {
                  res.send(`<p style='color:red; text-align:center; margin-top:20px;'>Can't find User Id</p>`);
                  return;
                } else 
                {
                  let ID = rows[0].id,
                      dataArray = [ID, req.body.name, req.body.email, req.body.phone, req.body.university, req.body.faculty, req.body.academicyear, req.body.first_choice, req.body.second_choice];
                  const insertData = {
                      spreadsheetId: '1AoTk7I1iWiNJJojK4YNBM4A2XwpwYaMgjnUESFSc4pA',
                      range: 'A2',
                      valueInputOption: 'USER_ENTERED',
                      resource: { values: [dataArray]}
                  }
                  gsapi.spreadsheets.values.append(insertData);
                  res.send(`<p style='color:green; text-align:center; margin-top:20px;'>Successfully Posted Data</p>`);
                }
            });
          }
      });
    })
  });
  
app.listen(3000); 