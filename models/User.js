import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    skills: [String],
    interests: [String],
    experienceLevel: String,
    experienceSummary: String,
    github:String,
    linkedin:String,
    portfolio:String,
    bio:String,
});

const User = mongoose.model('User',userSchema);

export default User