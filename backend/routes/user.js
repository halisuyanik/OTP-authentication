const express=require('express');
const router=express.Router();
const {signup, generateOTP, verifyOTP, resetSession , signin, getUser, updateUser, resetPassword, verifyUser}=require('../controllers/userController');
const useAuth=require('../middleware/useAuth');
const localVariables=require('../middleware/useLocalVariables');
const {mailServiceSignupMail}=require('../controllers/mailSenderController');
// router.post('/signup',  function (req, res) {
//     res.json('simple res');
// });
router.post('/signup', signup);
router.get('/generateOTP', verifyUser, localVariables, generateOTP);
router.post('/signupMail', mailServiceSignupMail);
router.get('/verifyOTP', verifyUser, verifyOTP);
router.post('/auth', verifyUser, (req, res)=>{res.end()});
router.get('/resetSession', resetSession);
router.post('/signin', verifyUser, signin);
router.get('/account/:email', getUser);

router.put('/updateuser',useAuth, updateUser);
router.put('/resetPassword', verifyUser, resetPassword);


module.exports=router;