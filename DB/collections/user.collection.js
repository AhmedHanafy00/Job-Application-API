import {Schema,Types} from 'mongoose';
import mongoose from 'mongoose';
const userSchema = new Schema({
    firstName : {type : String, required : true,select : false},// USE {select : false} if u dont want it to appear 
    lastName : {type : String, required : true,select : false},
    userName: {type: String},
    email : {type : String , unique : true , required : true},
    recoveryEmail : {type : String , required : true},
    password: {type : String , required : true},
    phone : {type :Number , required : true,unique : true },
    isOnline : { type: Boolean, default: false },
    companyID : {type : Types.ObjectId, ref : "Company"},
    DOB : {type : Date ,required : true},
    isConfirmed : {type : Boolean, default : false},
    role : {
        type: [
            {
              type: String,
              enum: ["user", "Company_HR"],
              default: ["user"]
            }
           ],
           required : true,
     },
    forgetCode : {type : String , unique : true}
},
{
    timestamps : true 
}
)

userSchema.pre('save', function (next) {
  // Check if both firstName and lastName are present before setting userName
  if (this.firstName && this.lastName) {
    // Ensure that firstName and lastName are strings
    const firstName = String(this.firstName);
    const lastName = String(this.lastName);

    // Concatenate and set userName to lowercase
    this.userName = (firstName + lastName).toLowerCase();
  }

  next();
});
export const User = mongoose.model ("User",userSchema);



//I had to use the firstName and lastName without the userName as there was always an error thats happeneing that made me delete the entire collection to fix it.

//as per StackOverFlow, this error can only be fixed if i deleted the collection and make it all over again, it happened many times.

//this was the error ("E11000 duplicate key error collection: exam.users index: forgetCode_1 dup key: { forgetCode: null })

//I had to improvise and make some changes on the original user collection schema 