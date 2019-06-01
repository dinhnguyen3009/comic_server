const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dinh:1@cluster0-gljyw.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}).catch(error => console.log(error));
const User = mongoose.model('User',{
    Username : {type: String, require: true, unique: true, trim: true},
    PassWord: {type : String , require : true , trim : true},
    Readcomics: {type : Array, require : true, trim : true},
    Likedcomics: {type : Array, require : true, trim : true},
    Comments: {type : Array, require : true, trim : true},
    Rating: {type : Array, require : true, trim : true}
})
module.exports = {User};

//Them User
// const newUser = new User({Username: 'Admin',
// PassWord:'root',
// Likedcomics:[{Id:'5cadeebf38b46c22ecf4ff28', Name:'One Puch Man'}],
// Readcomics:[{Id:'5cadc938d23ee129f435cc1a',Name:'One Piece'}],
// Comments:[{Id:'5cadeebf38b46c22ecf4ff28',Comment:'Chúc các bạn đọc truyện vui vẻ.'},{Id:'5cadc938d23ee129f435cc1a',Comment:'Chúc các bạn đọc truyện vui vẻ.'}]
// });
// newUser.save()
// .then(w => console.log(w))
// .catch(error => console.log(error));
// test = async ()=>{
//     user = await User.findOne({Username:"admin"})
//     console.log(user._id);
// }
// test();

// app.get('/user' ,(req,res) =>{
//     User.find({})
//     .then(user => res.send(user));
// });