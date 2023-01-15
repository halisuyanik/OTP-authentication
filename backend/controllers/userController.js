const AppUser=require('../models/AppUserModel');
const hashbcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
// const env=require('../config');
const otpGenerator=require('otp-generator');

require('dotenv').config();

const generateToken=(_id, email)=>{
    return jwt.sign({_id, email}, process.env.JWT_SECRET, {expiresIn:'2d'})
}

const verifyUser=async(req, res, next)=>{
    try {
        const {email}=req.method=="GET" ? req.query: req.body;
        let existUser=await AppUser.findOne({email});
        if(!existUser) return res.status(404).send({error:"not found user"});
        next();
    } catch (error) {
        return res.status(404).send({error:"auth error"});
    }
}


const signup=async(req, res)=>{
    const {email, password}=req.body;
    try {
        const existEmail=new Promise((resolve, reject)=>{
            AppUser.findOne({email}, function(error, email){
                if(error) reject(new Error(err))
                if(email) reject({error: "This e-mail has already been registered."})
                resolve();
            })
        });
        Promise.all([existEmail])
            .then(()=>{
                if(password){
                    hashbcrypt.hash(password, 10)
                        .then(hashedPassword=>{
                            const user=new AppUser({
                                email,
                                password:hashedPassword,
                            })
                            user.save()
                                .then(result=>res.status(201).send({message:"user register successfully"}))
                                .catch(error=>res.status(500).send({error}))
                        })
                        .catch(error=>{
                            return res.status(500).send({
                                error:"Enable to hashed password"
                            })
                        })
                }
            })
            .catch(error=>{
                return res.status(500).send({error})
            });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const generateOTP=async(req, res)=>{
    req.app.locals.OTP = await otpGenerator.generate(6,{lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false});
    res.status(201).send({code:req.app.locals.OTP});
}


const verifyOTP=async(req, res)=>{
    const {code}=req.query;
    if(parseInt(req.app.locals.OTP)===parseInt(code)){
        req.app.locals.OTP=null;
        req.app.locals.resetSession=true;
        return res.status(201).send({message:"verify success"});
    }
    return res.status(400).send({error:"invalid OTP"});
}

const resetSession=async(req, res)=>{
    if(req.app.locals.resetSession){
        req.app.locals.resetSession=false;
        return res.status(201).send({message:"access allowed"})
    }
    return res.status(440).json({error: "session expired"});
}

const signin=async(req, res)=>{
    const {email, password}=req.body;
    try {
        AppUser.findOne({email})
        .then(user=>{
            hashbcrypt.compare(password, user.password)
            .then(passwordEqual=>{
                if(!passwordEqual) return res.status(400).send({error:"invalid password"})
                const token=generateToken(user._id, user.email);
                return res.status(200).send({ message:"signin success", email:user.email, token});
            })
            .catch(error=>{
                return res.status(400).send({error:"password does not match"})
            })
        })
        .catch(error=>{
            return res.status(404).send({error:"this e-mail account has not been registered before"});
        })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getUser=async(req, res)=>{
    const {email}=req.params;
    try {
        if(!email) return res.status(501).send({error:"invalid email"});
        AppUser.findOne({email},function(error, user){
            if(error) return res.status(500).send({error});
            if(!user) return res.status(501).send({error:"not found user"});
            return res.status(201).send(user);
        })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateUser=async(req, res)=>{
    // const {email, mobile, address, firstname, lastname}=req.body;
    const userChanges=req.body;
    try {
        const userId=req.user._id;
        if(userId){
            AppUser.updateOne({_id:userId}, userChanges, function(error, user){
                if(error) throw error;
                return res.status(201).send({ message : "user updated success"});
            })
        }
        else{
            return res.status(401).send({error:"user not found"});
        }
       
    } catch (error) {
        res.status(400).json({error: error.message});
    }
    
}

const resetPassword=async(req, res)=>{
    const {email, password}=req.body;
    if(!req.app.locals.resetSession) return res.status(440).send({error:"session expired"})
    try {
        AppUser.findOne({email})
        .then(user=>{
            hashbcrypt.hash(password, 10)
            .then(hashedPassword=>{
                AppUser.updateOne({email:user.email},{password:hashedPassword}, function(error, data){
                    if(error) throw error;
                    req.app.locals.resetSession=false;
                    return res.status(201).send({message:"password updated"});
                })
            })
            .catch(error=>{
                return res.status(500).send({error:"enable to hashed password"})
            })
        })
        .catch(error=>{
            return res.status(500).send({error})
        })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports={signup, generateOTP, verifyOTP, resetSession , signin, getUser, updateUser, resetPassword, verifyUser}


