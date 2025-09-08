import jwt from 'jsonwebtoken'

const isAuth = async (req , res , next)=>{
   const token =  req.cookies.token

   if(!token){
    return res.send(404).json({message:'Token not found'})
   }

   try {
    const decoded =  jwt.verify(token , process.env.JWT_SECRET)
    console.log(decoded)
    req.userId = decoded.id
    next()

   } catch (error) {
      return res.status(401).json({message :'Token is not Valid'})
   }
}

export default isAuth