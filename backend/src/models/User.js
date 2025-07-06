import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    bio:{
        type:String,
        default:""
    },
    profilePicture:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isOnboarding:{
        type:Boolean,
        default:false
    },

    friends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},{timestamps:true} );


// This pre-save middleware runs before saving a User document.
// It hashes the user's password using bcrypt with a generated salt.
// If hashing succeeds, the plain password is replaced with its hashed version.
// If an error occurs during hashing, it is passed to the next middleware.

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next(); // If the password hasn't been modified, skip hashing
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});



userSchema.methods.matchPassword= async function(enteredPassword){
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect; // Returns true if the entered password matches the hashed password
};

const User = mongoose.model("User",userSchema);




export default User;


