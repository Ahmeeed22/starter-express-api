module.exports = (res , name , value) => {
    const options ={
        path : '/' ,
        expires : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        httpOnly : true ,
        secure : true ,
        sameSite : 'none' ,
        encode : v=> v
    }
    res.cookie(name , value , options) ;
    return res ;
}