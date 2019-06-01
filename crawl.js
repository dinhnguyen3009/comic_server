const express = require('express');
const cheerio = require('cheerio');
const {get} = require('./lib');
var inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
const {json} = require('body-parser');
const cors = require("cors");
const {Comic} = require('./Comic');
const {User} = require('./User');
const { parse } = require('node-html-parser');

const app   = express();
app.use(json());
app.use(cors());
try{
    //const {link} = req.body;
    //Hamtruyentranh #bsisread-container
    //nettryen .page-chapter
    get('http://www.hamtruyentranh.net/xem-truyen/dice-473/chap-6.html').then(
    //link chap
    html=>{
    let $ = cheerio.load(html);
    //crawl page, lấy dữ liệu trong thẻ html
    let arr = $('#bsinread-container img').toArray().map(img => $(img).attr('src'));
    //crawl những thẻ có class lazy lấy source của nó cho vào mảng arr
    let stories = arr.map((img, i) => ({url: img, page: i}));
    //tạo mảng mới là 1 json file có 2 thuộc tính url và page
    console.log(stories)
    }
    )
}
catch(err){
    console.log(err)
}

