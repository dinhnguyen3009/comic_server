const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dinh:1@cluster0-gljyw.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}).catch(error => console.log(error));
const Comic = mongoose.model('DauTruyen',{
    Name : {type: String, require: true, unique: true, trim: true},
    Image: {type : String , require : true , trim : true},
    Author: {type : String, require : true, trim : true},
    Chapters: {type : Array, require : true, trim : true},
    Comments: {type : Array, require : true, trim : true},
    Rating: {type : Array, require : true, trim : true}
})
module.exports = {Comic};
//Them Dau Truyen
// const newComic = new Comic({Name: 'One Puch Man',
//  Image:'http://truyentranhtuan.com/wp-content/uploads/2013/10/onepunch-man-200x304.jpg',
// Author:' Murata Yuusuke',
// Introdution:'Onepunch-Man là một Manga thể loại siêu anh hùng với đặc trưng phồng tôm đấm phát chết luôn… Lol!!! Nhân vật chính trong Onepunch-man là Saitama, một con người mà nhìn đâu cũng thấy “tầm thường”, từ khuôn mặt vô hồn, cái đầu trọc lóc, cho tới thể hình long tong. Tuy nhiên, con người nhìn thì tầm thường này lại chuyên giải quyết những vấn đề hết sức bất thường. Anh thực chất chính là một siêu anh hùng luôn tìm kiếm cho mình một đối thủ mạnh. Vấn đề là, cứ mỗi lần bắt gặp một đối thủ tiềm năng, thì đối thủ nào cũng như đối thủ nào, chỉ ăn một đấm của anh là… chết luôn. Liệu rằng Onepunch-Man Saitaman có thể tìm được cho mình một kẻ ác dữ dằn đủ sức đấu với anh? Hãy theo bước Saitama trên con đường một đấm tìm đối cực kỳ hài hước của anh!!',
// Chapters:[{Chapter:'1',Link:'http://www.nettruyen.com/truyen-tranh/cu-dam-huy-diet/chap-1/80034'}],
// Comments:[{Id:'admin', Name:'admin',Comment:'Chúc các bạn đọc truyện vui vẻ.'}]
// });
// newComic.save()
// .then(w => console.log(w))
// .catch(error => console.log(error));

//Xem Cac Dau Truyen Hien Hanh
// Comic.find({}).then(comic=>{
//     const newDatas = comic.map(w=>{
//         const newData = {name:w.Name, id: w._id};
//         return newData;})
//         console.log(newDatas);
// })


//Update Tap Moi Cho Dau Truyen , Dong thoi mo rong co the chinh sua cac thanh phan trong tap truyen.
// Comic.findById('5cadc938d23ee129f435cc1a').then(
//     comic => {const newChapter = comic.Chapters;
//         const newChapters= newChapter.concat({Chapter:'2',Link:'http://www.nettruyen.com/truyen-tranh/vua-cuop-bien/chap-2/266192'});
//         Comic.findByIdAndUpdate('5cadc938d23ee129f435cc1a', {Chapters : newChapters} ,{new : true})
//         .then(w => console.log(w))
//         .catch(error => console.log(error));}
//     ).catch(error => console.log(error));

// Comic.findById('5cadc938d23ee129f435cc1a').then(
//     comic => console.log(comic.Chapters)
// ).catch(error => console.log(error));
