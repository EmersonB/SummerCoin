function Bot(input) {
  this.output = "R"
  this.input = ""
  this.numPre = 30
  this.numMeta = 6
  this.limit = 8
  this.beat={'R':'P','P':'S','S':'R'}
  this.moves=['','','','']
  this.pScore=[[],[],[],[],[],[]]
  for(var i = 0; i<this.numPre; i++){
    this.pScore[0].push(5);
    this.pScore[1].push(5);
    this.pScore[2].push(5);
    this.pScore[3].push(5);
    this.pScore[4].push(5);
    this.pScore[5].push(5);
  }
  this.centrifuge={'RP':0,'PS':1,'SR':2,'PR':3,'SP':4,'RS':5,'RR':6,'PP':7,'SS':8}
  this.centripete={'R':0,'P':1,'S':2}
  this.soma = [0,0,0,0,0,0,0,0,0];
  this.rps = [1,1,1];
  this.a="RPS"
  this.best = [0,0,0];
  this.length=0
  this.p = []
  this.m = []
  for(var i = 0; i<this.numPre; i++){
    this.p.push("RPS"[Math.floor(Math.random() * "RPS".length)])
  }
  for(var i = 0; i<this.numMeta; i++){
    this.m.push("RPS"[Math.floor(Math.random() * "RPS".length)])
  }
  this.mScore=[5,2,5,2,4,2]
  this.dithering = 0.7
}

Bot.prototype.getMove = function(input) {
  if(this.output == undefined){
    this.output = "R";
  }
  for(var i=0; i < this.numPre; i++){
      var pp = this.p[i]
      var bpp = this.beat[pp]
      var bbpp = this.beat[bpp]
      this.pScore[0][i]=0.9*this.pScore[0][i]+((input==pp)-(input==bbpp))*3
      this.pScore[1][i]=0.9*this.pScore[1][i]+((this.output==pp)-(this.output==bbpp))*3
      this.pScore[2][i]=0.87*this.pScore[2][i]+(input==pp)*3.3-(input==bpp)*1.2-(input==bbpp)*2.3
      this.pScore[3][i]=0.87*this.pScore[3][i]+(this.output==pp)*3.3-(this.output==bpp)*1.2-(this.output==bbpp)*2.3
      this.pScore[4][i]=(this.pScore[4][i]+(input==pp)*3)*(1-(input==bbpp))
      this.pScore[5][i]=(this.pScore[5][i]+(this.output==pp)*3)*(1-(this.output==bbpp))
    }
  for(var i=0; i<this.numMeta; i++){
      this.mScore[i]=0.96*(this.mScore[i]+(input==this.m[i])-(input==this.beat[this.beat[this.m[i]]])) + (Math.random()-0.5)*this.dithering
    }
  this.soma[this.centrifuge[input+this.output]] +=1;
  this.rps[this.centripete[input]] +=1;
  this.moves[0]+=(this.centrifuge[input+this.output])
  this.moves[1]+=input
  this.moves[2]+=this.output
  this.length+=1
  for(var y = 0; y<3; y++){
      j=Math.min([this.length,this.limit])
      while(j>=1 && !(this.moves[y].slice(this.length-j,this.length) in this.moves[y].slice(0,this.length-1))){
          j-=1
        }
      i = this.moves[y].lastIndexOf(this.moves[y].slice(this.length-j,this.length),0,this.length-1)
      this.p[0+2*y] = this.moves[1][j+i]
      this.p[1+2*y] = this.beat[this.moves[2][j+i]]
    }
  j=Math.min([this.length,this.limit])
  while(j>=2 && !(this.moves[0].slice(0,this.length-2).contains(this.moves[0].slice(this.length-j,this.length-1)))){
      j-=1
    }
  i = this.moves[0].lastIndexOf(this.moves[0].slice(this.length-j,this.length-1),0,this.length-2)
  if (j+i>=this.length){
    this.p[6] = this.p[7] = "RPS"[Math.floor(Math.random() * "RPS".length)]
    }
  else{
    this.p[6] = this.moves[1][j+i]
    this.p[7] = this.beat[this.moves[2][j+i]]
    }

  this.best[0] = this.soma[this.centrifuge[this.output+'R']]*this.rps[0]/this.rps[this.centripete[this.output]]
  this.best[1] = this.soma[this.centrifuge[this.output+'P']]*this.rps[1]/this.rps[this.centripete[this.output]]
  this.best[2] = this.soma[this.centrifuge[this.output+'S']]*this.rps[2]/this.rps[this.centripete[this.output]]
  this.p[8] = this.p[9] = this.a[this.best.indexOf(Math.max(...this.best))]

  for(var i = 10; i<this.numPre; i++){
    this.p[i]=this.beat[this.beat[this.p[i-10]]]
    }

  for(var i = 0; i<this.numMeta; i+=2){
    this.m[i]=       this.p[this.pScore[i  ].indexOf(Math.max(...this.pScore[i  ]))]
    this. m[i+1]=this.beat[this.p[this.pScore[i+1].indexOf(Math.max(...this.pScore[i+1]))]]
    }
  this.output = this.beat[this.m[this.mScore.indexOf(Math.max(...this.mScore))]]
  if (Math.max(...this.mScore)<3+Math.random() || this.getRandomInt(3,40)>this.length || Math.random() < 0.5) {
    this.output=this.beat["RPS"[Math.floor(Math.random() * "RPS".length)]]
  }
  if(this.output == undefined){
    this.output = "R";
  }
  return this.output
}

Bot.prototype.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = Bot;
