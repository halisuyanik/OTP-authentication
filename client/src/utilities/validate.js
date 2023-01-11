import toast  from "react-hot-toast";



function emailVerify(errors={}, values){
    if(!values.email){
        errors.email=toast.error('email required !');
    }
    else if(values.email.includes(" ")){
        errors.email=toast.error('wrong email !')
    }
    else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        errors.email = toast.error("invalid email address !")
    }
    return errors;
}

export async function emailValidate(values){
    const errors=emailVerify({},values)
    return errors;
}

function passwordVerify(errors={}, values){
    const specialPass = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!values.password){
        errors.password=toast.error('password required !');
    }
    else if(values.password.includes(" ")){
        errors.password=toast.error('wrong password !')
    }
    else if(values.password.length<4){
        errors.password=toast.error('password must be more than 4 characters !')
    }
    else if(!specialPass.test(values.password)){
        errors.password = toast.error("Password must have special character !");
    }
    return errors;
}

export async function profileValidate(values){
    const errors=emailVerify({}, values);
    return errors;
}

export async function signUpValidate(values){
    const errors=emailVerify({}, values);
    passwordVerify(errors, values);
    return errors;

}

export async function passwordValidate(values){
    const errors=passwordVerify({},values);
    return errors;
}

export async function resetPasswordValidate(values){
    const errors=passwordVerify({},values);
    if(values.confirm_pass!==values.password){
        errors.exist=toast.error("passwords do not match !");
    }
    return errors;
}