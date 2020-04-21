var Promise = require('./promise2');

function test(){
    new Promise(function(resolve, reject){
        console.log('start');
        setTimeout(function(){
            console.log('************')
            resolve(1000);
        },100);
    }).then(function(result){
        console.log('result=>', result);
    });
}

test();