const express = require('express');
const cheerio = require('cheerio');
const {get} = require('./lib');
var inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
const {json} = require('body-parser');
const cors = require("cors");
const {Comic} = require('./Comic');
const {User} = require('./User');
const sizeOf = require('image-size');

const app   = express();
app.use(json());
app.use(cors());

//Tương tác trên mảng user.

app.get('/user' ,(req,res) =>{
    User.find({})
    .then(user => res.send(user));
});

app.post('/user/signin', async(req,res) =>{
    try {
        const {username,password} = req.body;
        const user = await User.findOne({Username:username});
        if(!user){
            return res.send({success:false,message:'Tài khoản không tồn tại.'});
        }
        if(password!=user.PassWord){
            return res.send({success:false,message:'Bạn đã nhập sai mật khẩu'});
        }
        res.send({success:true,user:user})
    } catch (error) {
        res.status(400).send({success:false,message:'Tạm thời không thể đăng nhập'});
    }
})

app.post('/user/signup',async(req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({Username:username});
        if(user){
            return res.send({success:false,message:'Tên tài khoản đã được sử dụng'});
        }
        const newUser = new User({Username: username,
            PassWord:password,
            Likedcomics:[],
            Readcomics:[],
            Comments:[]
            });
        await newUser.save();
        res.send({success:true,message:'Bạn đã đăng kí thành công'})

    } catch (error) {
        res.status(400).send({success:false,message:'Tạm thời không thể đăng ký'});
    }
})
app.get('/user/liked/:_id', async (req,res)=>{
    try{
        const {_id} = req.params;
        const userInfo = await User.findById(_id);
        const newDatas = userInfo.Likedcomics;
        res.send({success:true,newDatas}) 
    }
    catch(error){
        res.status(400).send({success:false,message:error.message});
    }
})
app.get('/user/read/:_id', async (req,res)=>{
    try{
        const {_id} = req.params;
        const userInfo = await User.findById(_id);
        const newDatas = userInfo.Readcomics;
        res.send({success:true,newDatas}) 
    }
    catch(error){
        res.status(400).send({success:false,message:error.message});
    }
})
app.post('/user/liked', async(req,res)=>{
    try {
        const {idUser,idComic,name} = req.body;
        const user = await User.findById(idUser);
        let update = true;
        if(!user){
            res.send({success:false,message:'Hệ thống tạm lỗi, mời bạn thoát ra và đăng nhập lại'});
        }
        const getListliked = user.Likedcomics;
        for(var i=0;i<getListliked.length;i++){
            if(getListliked[i].Id===idComic){
                update = false;
                break;
            }
        }
        if(update){
            const likedComic = user.Likedcomics;
            const newlikedComic = likedComic.concat({Id:idComic,Name:name});
            await User.findByIdAndUpdate(idUser, {Likedcomics : newlikedComic} ,{new : true}).catch(error => 
            {
                res.status(400).send({success:false,message:error.message});
            });
            res.send({success:true,message:'Bạn đã thêm thành công vào mục truyện yêu thích',likedComics:newlikedComic});
        }
        if(!update){
            const likedComic = user.Likedcomics;
            const newlikedComic = likedComic.filter(comic=>{return comic.Id!==idComic});
            await User.findByIdAndUpdate(idUser, {Likedcomics : newlikedComic} ,{new : true}).catch(error => 
            {
                res.status(400).send({success:false,message:error.message});
            });
            res.send({success:true,message:'Bạn đã hủy thích truyện này',likedComics:newlikedComic});
        }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message});
    }
})

app.post('/user/add/read', async(req,res)=>{
    try {
        const {idUser,idComic,name,chapter,link} = req.body;
        const user = await User.findById(idUser);
        if(!user){
            res.status(400).send({success:false,message:'Wrong User'});
        }
        const getListread = user.Readcomics;
        const deleteReadComic = getListread.filter(comic=>{return comic.Id!==idComic});
        const newReadComic = deleteReadComic.concat({Id:idComic,Name:name,Chapter:chapter,Link:link});
        await User.findByIdAndUpdate(idUser, {Readcomics : newReadComic} ,{new : true}).catch(error => 
            {
                res.status(400).send({success:false,message:error.message});
            });
        res.send({success:true,readComics:newReadComic});
    } catch (error) {
        res.status(400).send({success:false,message:error.message});
    }
})

app.post('/user/read', async(req,res)=>{
    try {
        const {idUser,idComic,name} = req.body;
        const user = await User.findById(idUser);
        let update = true;
        if(!user){
            res.status(400).send({success:false,message:'Wrong User'});
        }
        const getListread = user.Readcomics;
        for(var i=0;i<getListread.length;i++){
            if(getListread[i].Id===idComic){
                res.status(400).send({success:false,message:'Already'});
                update = false;
                break;
            }
        }
        if(update){
            const readComic = user.Readcomics;
            const newReadComic = readComic.concat({Id:idComic,Name:name,Chapter:'1',link:''});
            await User.findByIdAndUpdate(idUser, {Readcomics : newReadComic} ,{new : true}).catch(error => 
                {
                    res.status(400).send({success:false,message:error.message});
                });
            res.send({success:true,readComics:newReadComic});
        }
    } catch (error) {
        res.status(400).send({success:false,message:error.message});
    }
})

//Tương tác trên mảng Comic và user
app.post('/comment',async(req,res)=>{
    try {
        const {idUser,idComic,comment,name} = req.body;
        const user = await User.findById(idUser);
        const userComment = user.Comments;
        const tempTime = new Date();
        const timeComment =tempTime.getDate()+'/'+(tempTime.getMonth()+1)+'/'+tempTime.getFullYear();
        const newUsercomment = userComment.concat({idComment:userComment.length, time: timeComment, Id:idComic,Comment:comment});
        await User.findByIdAndUpdate(idUser, {Comments : newUsercomment} ,{new : true}).catch(error => 
            {
                res.status(400).send({success:false,message:error.message});
            });

        const comic = await Comic.findById(idComic);
        const comicComment = comic.Comments;
        const newComiccomment = comicComment.concat({idComment:comicComment.length, time: timeComment,Id:idUser,Name:name,Comment:comment});
        await Comic.findByIdAndUpdate(idComic, {Comments : newComiccomment} ,{new : true}).catch(error => 
            {
                res.status(400).send({success:false,message:error.message});
            });
        const newDetailComic = await Comic.findById(idComic);
        res.send({success:true,commentComics:newDetailComic});
    } catch (error) {
        res.status(400).send({success:false,message:error.message});
    }
})
app.post('/rating',async(req,res)=>{
    try {
        const {idUser,idComic,rating} = req.body;
        const user = await User.findById(idUser);
        const userRating = user.Rating;
        const deleteRatingUser = userRating.filter(comic=>{return comic.Id!==idComic});
        const newUserRating = deleteRatingUser.concat({Id:idComic,Rating:rating});
        await User.findByIdAndUpdate(idUser, {Rating : newUserRating} ,{new : true}).catch(error => 
            {
                res.status(400).send({success:false,message:error.message});
            });

        const comic = await Comic.findById(idComic);
        const comicRating = comic.Rating;
        const deleteRatingComic = comicRating.filter(comic=>{return comic.Id!==idUser});
        const newComicRating = deleteRatingComic.concat({Id:idUser,Rating:rating});
        await Comic.findByIdAndUpdate(idComic, {Rating : newComicRating} ,{new : true}).catch(error => 
            {
                res.status(400).send({success:false,message:error.message});
            });
        
        res.send({success:true,userRating:newUserRating,comicRating:newComicRating});
    } catch (error) {
        res.status(400).send({success:false,message:error.message});
    }
})
//Tương tác trên mảng Comic


app.get('/comic',(req,res)=>{
    Comic.find({}).then(comic=>{
    const newDatas = comic.map(w=>{
        const newData = {name:w.Name, id: w._id, image: w.Image, countChapter : w.Chapters.length};
        return newData;})
        res.send({success:true,newDatas});
})
})

app.get('/comic/:_id',(req,res)=>{
    const {_id} = req.params;
    Comic.findById(_id).then(
        comic => {
            const newDatas = comic;
            res.send({success:true,newDatas})
        }
        
    ).catch(error => console.log(error));
})
app.post('/comic/add',async(req,res)=>{
    try {
        const {ComicInfo} = req.body;
        const comic = await Comic.findOne({Name:ComicInfo.Name});
        if(comic){
            return res.send({success:false,message:'Truyện này đã có trong danh sách truyện hiện hành'});
        }
        const newComic = new Comic({Name: ComicInfo.Name,
        Image: ComicInfo.Image,
        Author: ComicInfo.Author,
        Chapters:[{Chapter:'1',Link:ComicInfo.ChapterOne}],
        Comments:[],
        Rating:[]
        });
        await newComic.save();
        res.send({success:true,message:'Bạn đã thêm đầu truyện mới thành công'})
    } catch (error) {
        res.send({success:false,message:error.message});
    }
})
app.delete('/comic/:_id' , (req, res) => {
    const {_id} = req.params
    Comic.findByIdAndDelete(_id)
    .then(w => {
        if(!w) return res.send({success : false , message : 'Lỗi hệ thống'});
        return res.send({success : true , message:'Bạn đã xóa thành công'});
    })
    .catch(error => console.log(error));
})
app.put('/comic/add/:_id',async(req,res)=>{
    try {
        const {_id} = req.params;
        const {order,link} = req.body;
        const comic = await Comic.findById(_id)
        if(comic){
            let add = true;
            const listChapter = comic.Chapters;
            let newChapters = [];
            for(var i=0;i<listChapter.length;i++){
                if(listChapter[i].Chapter===order){
                    add = false;
                    break;
                }
            }
            if(add===true){
                newChapters= listChapter.concat({Chapter:order,Link:link});
            }
            else{
                newChapters = listChapter.map(c=>{
                    if(c.Chapter===order){
                        const newChapter={...c, Link:link}
                        return newChapter
                    }
                    return c;
                })
            }
            await Comic.findByIdAndUpdate(_id, {Chapters : newChapters} ,{new : true}).catch(error => console.log(error));
            res.send({success:true,message:'Cập nhật thành công'})
        }   
    } catch (error) {
        res.send({success:false,message:error.message});
    }
})

app.post('/comic/:id/',(req,res)=>{
    try{
        const {link} = req.body;
        get(link).then(
        //link chap
        html=>{
        let $ = cheerio.load(html);
        //crawl page, lấy dữ liệu trong thẻ html
        let arr = $('#bsinread-container img').toArray().map(img => $(img).attr('src'));
        //crawl những thẻ có class lazy lấy source của nó cho vào mảng arr
        let stories = arr.map((img, i) => ({url: img, page: i}));
        //tạo mảng mới là 1 json file có 2 thuộc tính url và page
        res.send({success:true, stories})
        }
        )
    }
    catch(err){
        console.log(err)
    }
})

app.listen( process.env.PORT || '4000' , () => console.log("Server Started"));