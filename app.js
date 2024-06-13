const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {registermodel}=require("./models/register")
const bcrypt=require("bcryptjs")


const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://sonalazar:9633591213@cluster0.jd3vcot.mongodb.net/busdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/SignUp",async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let register=new registermodel(input)
    register.save()
    console.log(register)
    res.json({"status":"success"})
})

app.post("/SignIn", (req, res) => {
    let input = req.body
     registermodel.find({"email":req.body.email}).then(
        (response)=>{
           if (response.length>0) {
            let dbPassword=response[0].password
            console.log(dbPassword)
            bcrypt.compare(input.password,dbPassword,(error,isMath)=>{
                if (isMath) {
                   jwt.sign({email:input.email},"bus-app",{expiresIn:"1d"},(error,token)=>{
                    if(error){
                        res.json({"status":"unable to create token"})
                    }else{
                        res.json({"status":"success","userid":response[0]._id,"token":token})
                    }
                   })
                } else {
                    
                    res.json("incorrect password")
                }
            })
           } else {

            res.json({"status":"user not found"})

           }
        }
    ).catch()

})

app.listen(8080,()=>{
    console.log("server started")
})
    