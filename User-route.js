const express = require('express')
const {getAllUsers,getUserById,usersignup,userlogin,userupdatePassword,userupdateProfile,deleteUser } = require('../controller/User-controller')


const UserRouter = express.Router()


UserRouter.get("/getallusers", getAllUsers)
UserRouter.post("/usersignup", usersignup)
UserRouter.post("/userlogin", userlogin)
UserRouter.put("/userforgetPassword",userupdatePassword)
UserRouter.put("/updateProfile",getUserById)
UserRouter.put("/deleteuser",deleteUser)


module.exports = UserRouter;
 