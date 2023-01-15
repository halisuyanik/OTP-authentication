const nodemailer=require('nodemailer')
const Mailgen = require('mailgen');
require('dotenv').config();

let testAccount = nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass
    }
});


var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

const mailServiceSignupMail=async(req, res)=>{
    const {userEmail, text, subject}=req.body;
    var email={
        body:{
            name:userEmail,
            intro:text || "Welcome to board",
            outro:"Need help, or have questions?"
        }
    }
    var emailBody=mailGenerator.generate(email);
    let message={
        from:process.env.ETHEREAL_EMAIL,
        to:userEmail,
        subject:subject ||"signup success",
        html:emailBody
    }
    transporter.sendMail(message)
    .then(()=>{
       return res.status(200).send({message:"received e-mail"}) 
    })
    .catch(error=>res.status(500).send({error}))
}

module.exports={mailServiceSignupMail};