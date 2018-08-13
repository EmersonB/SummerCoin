var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var firebase = require("firebase");

var router = express.Router();
var app = express();


app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/'));
app.use('/api', router);

app.set('port', process.env.PORT || 8080);
var listener = app.listen(app.get('port'), function() {
  console.log( listener.address().port );
});

firebase.initializeApp({
  databaseURL: "https://hacktj2018.firebaseio.com",
  service_account: "service.json"
})

var db = firebase.database();
var ref = db.ref("employees");

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

var numPre = 30
var numMeta = 6
var input = "R"
var output = "R"

var limit = 8
var beat={'R':'P','P':'S','S':'R'}
var moves=['','','','']
var pScore=[[],[],[],[],[],[]]
for(var i = 0; i<numPre; i++){
  pScore[0].push(5);
  pScore[1].push(5);
  pScore[2].push(5);
  pScore[3].push(5);
  pScore[4].push(5);
  pScore[5].push(5);
}
var centrifuge={'RP':0,'PS':1,'SR':2,'PR':3,'SP':4,'RS':5,'RR':6,'PP':7,'SS':8}
var centripete={'R':0,'P':1,'S':2}
var soma = [0,0,0,0,0,0,0,0,0];
var rps = [1,1,1];
var a="RPS"
var best = [0,0,0];
var length=0
var p = []
var m = []
for(var i = 0; i<numPre; i++){
  p.push("RPS"[Math.floor(Math.random() * "RPS".length)])
}
for(var i = 0; i<numMeta; i++){
  m.push("RPS"[Math.floor(Math.random() * "RPS".length)])
}
var mScore=[5,2,5,2,4,2]
var dithering = 0.7
if (!(input)){
    var limit = 8
    var beat={'R':'P','P':'S','S':'R'}
    var moves=['','','','']
    var pScore=[[],[],[],[],[],[]]
    for(var i = 0; i<numPre; i++){
      pScore[0].push(5);
      pScore[1].push(5);
      pScore[2].push(5);
      pScore[3].push(5);
      pScore[4].push(5);
      pScore[5].push(5);
    }
    var centrifuge={'RP':0,'PS':1,'SR':2,'PR':3,'SP':4,'RS':5,'RR':6,'PP':7,'SS':8}
    var centripete={'R':0,'P':1,'S':2}
    var soma = [0,0,0,0,0,0,0,0,0];
    var rps = [1,1,1];
    var a="RPS"
    var best = [0,0,0];
    var length=0
    var p = []
    var m = []
    for(var i = 0; i<numPre; i++){
      p.push("RPS"[Math.floor(Math.random() * "RPS".length)])
    }
    for(var i = 0; i<numMeta; i++){
      m.push("RPS"[Math.floor(Math.random() * "RPS".length)])
    }
    var mScore=[5,2,5,2,4,2]
    var dithering = 0.7
  }
else{
    for(var i=0; i < numPre; i++){
        var pp = p[i]
        var bpp = beat[pp]
        var bbpp = beat[bpp]
        pScore[0][i]=0.9*pScore[0][i]+((input==pp)-(input==bbpp))*3
        pScore[1][i]=0.9*pScore[1][i]+((output==pp)-(output==bbpp))*3
        pScore[2][i]=0.87*pScore[2][i]+(input==pp)*3.3-(input==bpp)*1.2-(input==bbpp)*2.3
        pScore[3][i]=0.87*pScore[3][i]+(output==pp)*3.3-(output==bpp)*1.2-(output==bbpp)*2.3
        pScore[4][i]=(pScore[4][i]+(input==pp)*3)*(1-(input==bbpp))
        pScore[5][i]=(pScore[5][i]+(output==pp)*3)*(1-(output==bbpp))
      }
    for(var i=0; i<numMeta; i++){
        mScore[i]=0.96*(mScore[i]+(input==m[i])-(input==beat[beat[m[i]]])) + (Math.random()-0.5)*dithering
      }
    soma[centrifuge[input+output]] +=1;
    rps[centripete[input]] +=1;
    moves[0]+=(centrifuge[input+output]).toString()
    moves[1]+=input
    moves[2]+=output
    length+=1
    for(var y = 0; y<3; y++){
        j=Math.min([length,limit])
        while(j>=1 && !(moves[y].slice(length-j,length) in moves[y].slice(0,length-1))){
            j-=1
          }
        i = moves[y].lastIndexOf(moves[y].slice(length-j,length),0,length-1)
        p[0+2*y] = moves[1][j+i]
        p[1+2*y] = beat[moves[2][j+i]]
      }
    j=Math.min([length,limit])
    while(j>=2 && !(moves[0].slice(0,length-2).contains(moves[0].slice(length-j,length-1)))){
        j-=1
      }
    i = moves[0].lastIndexOf(moves[0].slice(length-j,length-1),0,length-2)
    if (j+i>=length){
        p[6] = p[7] = "RPS"[Math.floor(Math.random() * "RPS".length)]
      }
    else{
        p[6] = moves[1][j+i]
        p[7] = beat[moves[2][j+i]]
      }

    best[0] = soma[centrifuge[output+'R']]*rps[0]/rps[centripete[output]]
    best[1] = soma[centrifuge[output+'P']]*rps[1]/rps[centripete[output]]
    best[2] = soma[centrifuge[output+'S']]*rps[2]/rps[centripete[output]]
    p[8] = p[9] = a[best.indexOf(Math.max(best))]

    for(var i = 10; i<numPre; i++){
        p[i]=beat[beat[p[i-10]]]
      }

    for(var i = 0; i<numMeta; i+=2){
        m[i]=       p[pScore[i  ].indexOf(Math.max(pScore[i  ]))]
        m[i+1]=beat[p[pScore[i+1].indexOf(Math.max(pScore[i+1]))]]
      }
    }
output = beat[m[mScore.indexOf(Math.max(mScore))]]
if (Math.max(mScore)<3+Math.random() || getRandomInt(3,40)>length || Math.random() < 0.5) {
    output=beat["RPS"[Math.floor(Math.random() * "RPS".length)]]
  }

console.log(output)


function Bot() {
  var limit = 8
  var beat={'R':'P','P':'S','S':'R'}
  var moves=['','','','']
  var pScore=[[],[],[],[],[],[]]
  for(var i = 0; i<numPre; i++){
    pScore[0].push(5);
    pScore[1].push(5);
    pScore[2].push(5);
    pScore[3].push(5);
    pScore[4].push(5);
    pScore[5].push(5);
  }
  var centrifuge={'RP':0,'PS':1,'SR':2,'PR':3,'SP':4,'RS':5,'RR':6,'PP':7,'SS':8}
  var centripete={'R':0,'P':1,'S':2}
  var soma = [0,0,0,0,0,0,0,0,0];
  var rps = [1,1,1];
  var a="RPS"
  var best = [0,0,0];
  var length=0
  var p = []
  var m = []
  for(var i = 0; i<numPre; i++){
    p.push("RPS"[Math.floor(Math.random() * "RPS".length)])
  }
  for(var i = 0; i<numMeta; i++){
    m.push("RPS"[Math.floor(Math.random() * "RPS".length)])
  }
  var mScore=[5,2,5,2,4,2]
  var dithering = 0.7
}

Bot.prototype.getMove = function(input) {
  
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
