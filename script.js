var fs = require('fs'),
    file = __dirname + '/jsonfiles/verses.json',
    json;

fs.readFile(file, 'utf8', function (err, data) {
    if (err) return console.error(err);
    data = data.replace('\r','').replace('\n', '');
    json = JSON.parse(data.substr(2).slice(0, -4));

    //for (var index = 0; index < json.length; index++) {
        //var item = json[index];
        //console.log(item);
    /*}*/
});

