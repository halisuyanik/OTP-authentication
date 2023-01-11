const express=require('express');
const router=express.Router();
const {signup, generateOTP,signupMail, verifyOTP, auth, resetSession , signin, getUser, updateUser, resetPassword, verifyUser}=require('../controllers/userController');
const useAuth=require('../middleware/useAuth');
const localVariables=require('../middleware/useLocalVariables');
// router.post('/signup',  function (req, res) {
//     res.json('simple res');
// });
router.post('/signup', signup);
router.get('/generateOTP', verifyUser, localVariables, generateOTP);
router.post('/signupMail', signupMail);
router.get('/verifyOTP', verifyOTP);
router.post('/auth', auth);
router.get('/resetSession', resetSession);
router.post('/signin', verifyUser, signin);
router.get('/account/:email', getUser);

router.put('/updateuser',useAuth, updateUser);
router.put('/resetPassword', resetPassword);


module.exports=router;