var express = require('express');
var app = express();
var serv = require('http').Server(app);
app.get('/',function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
serv.listen(3000);
console.log("Server started!");

var socketCounter=0;
var adressList=[];
var alive = true;
var univ;
var chat = [];
for(var i=0;i<5;i++)chat[i]=":";
var Universe = function(x,y){
	var self = {
		nbPlanet:6,//Math.ceil((x*y)/800000),
		planetList:{},
		playerList:{},
		socketList:{},
		explosionQ:[],
		nbcapa:Math.ceil((x*y)/3000000),
		nbshield:Math.ceil((x*y)/3000000),
		nbarmor:Math.ceil((x*y)/3000000),
		nbrf5:Math.ceil((x*y)/3000000),
		nbrf75:Math.ceil((x*y)/6000000),
		nbrepair10:Math.ceil((x*y)/3000000),
		nbrepair400:Math.ceil((x*y)/6000000),
		nbrepair1000:Math.ceil((x*y)/10000000),
		nbthrusterx4:Math.ceil((x*y)/3000000),
		nbthrusterx8:Math.ceil((x*y)/6000000),
		nbbulletdmg10:Math.ceil((x*y)/3000000),
		nbbulletdmg15:Math.ceil((x*y)/6000000),
		nbbullets100:Math.ceil((x*y)/3000000),
		nbbullets200:Math.ceil((x*y)/6000000),
		capaList:{},
		shieldList:{},
		armorList:{},
		rf5List:{},
		//rf50List[],
		repair10List:{},
		//repair400List[],
		//repair1000List[],
		thrusterx4List:{},
		//thrusterx8List[],
		bulletdmg10List:{},
		//bulletdmg100List[],
		bullets100List:{},
		//bullets200List[],
		sizex:x,
		sizey:y,
	}
	for(var i=0;i < self.nbcapa;i++) self.capaList[i] = Capa(self.sizex,self.sizey);
	for(var i=0;i < self.nbshield;i++) self.shieldList[i] = Shield(self.sizex,self.sizey);
	for(var i=0;i < self.nbPlanet;i++) self.planetList[i] = Planet(self.sizex,self.sizey);
	for(var i=0;i < self.nbrf5;  i++) self.rf5List[i] = Rf5(self.sizex,self.sizey);
	for(var i=0;i < self.nbarmor;i++) self.armorList[i] = Armor(self.sizex,self.sizey);
	for(var i=0;i < self.nbbulletdmg10;i++) self.bulletdmg10List[i] = Bulletdmg10(self.sizex,self.sizey);
	for(var i=0;i < self.nbthrusterx4;i++) self.thrusterx4List[i] = Thrusterx4(self.sizex,self.sizey);
	for(var i=0;i < self.nbbullets100;i++)  self.bullets100List[i] = Bullets100(self.sizex,self.sizey);
	for(var i=0;i < self.nbrepair10;i++)self.repair10List[i] = Repair10(self.sizex,self.sizey); 
	self.update = function(){	
		for(var j in self.playerList){
			if(!(typeof self.playerList[j] === "undefined")){
				for(var h in self.capaList){
                                        //rf5
                                     /*   var sidex = self.playerList[j].x-self.rf5List[h].x;
                                        var sidey = self.playerList[j].y-self.rf5List[h].y;
                                        var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                        var force = ((self.playerList[j].mass*self.rf5List[h].mass)/Math.pow(distance,2))/10;
                                        var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                        var percentForcey = 1-percentForcex;
                                        if(sidex<0)self.rf5List[h].accelx = 0-(force*percentForcex);
                                        else self.rf5List[h].accelx = force*percentForcex;
                                        if(sidey<0)self.rf5List[h].accely = 0-(force*percentForcey);
                                        else self.rf5List[h].accely = force*percentForcey;
                                */
                                        for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
                                                self.playerList[j].bulletQ[k].life--;
                                                if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
                                                else if( !(typeof self.capaList[h]=== 'undefined') &&
                                                (Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.capaList[h].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.capaList[h].y),2))<= 12)){
                                                        self.playerList[j].bulletQ.splice(k,1);
                                                        delete self.capaList[h]; self.capaList[h] = Capa(self.sizex,self.sizey);
                                                }
                                        }
                                        if(self.capaList[h].x > self.sizex || self.capaList[h].x < 0 ||  self.capaList[h].y > self.sizey || self.capaList[h].y <0){
                                                delete self.capaList[h];self.capaList[h] = Capa(self.sizex,self.sizey);
                                        }
                                        else if(Math.sqrt(Math.pow((self.playerList[j].x - self.capaList[h].x),2)+Math.pow((self.playerList[j].y - self.capaList[h].y),2))
                                                <= (10+13+5*Math.log(self.playerList[j].tArmor/25))){
                                                        self.playerList[j].tCapacitor += self.capaList[h].bonus;
							self.playerList[j].capacitor += self.capaList[h].bonus;
                                                        delete self.capaList[h];self.capaList[h] = Capa(self.sizex,self.sizey);
                                        }

                                }

				for(var h in self.rf5List){
					//rf5
                                     /*   var sidex = self.playerList[j].x-self.rf5List[h].x;
                                        var sidey = self.playerList[j].y-self.rf5List[h].y;
                                        var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                        var force = ((self.playerList[j].mass*self.rf5List[h].mass)/Math.pow(distance,2))/10;
                                        var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                        var percentForcey = 1-percentForcex;
                                        if(sidex<0)self.rf5List[h].accelx = 0-(force*percentForcex);
                                        else self.rf5List[h].accelx = force*percentForcex;
                                        if(sidey<0)self.rf5List[h].accely = 0-(force*percentForcey);
                                        else self.rf5List[h].accely = force*percentForcey;
				*/	
					for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
                                        	self.playerList[j].bulletQ[k].life--;
                                        	if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
                                        	else if( !(typeof self.rf5List[h]=== 'undefined') && 
						(Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.rf5List[h].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.rf5List[h].y),2))<= 12)){
                                                	self.playerList[j].bulletQ.splice(k,1);
                                                	delete self.rf5List[h]; self.rf5List[h] = Rf5(self.sizex,self.sizey);
						}
					}
					if(self.rf5List[h].x > self.sizex || self.rf5List[h].x < 0 ||  self.rf5List[h].y > self.sizey || self.rf5List[h].y <0){
                                        	delete self.rf5List[h];self.rf5List[h] = Rf5(self.sizex,self.sizey);
                                	}
                                	else if(Math.sqrt(Math.pow((self.playerList[j].x - self.rf5List[h].x),2)+Math.pow((self.playerList[j].y - self.rf5List[h].y),2))
                        	                <= (10+13+5*Math.log(self.playerList[j].tArmor/25))){
                	                                self.playerList[j].rateFire = self.playerList[j].rateFire/self.rf5List[h].bonus;
        	                                        delete self.rf5List[h];self.rf5List[h] = Rf5(self.sizex,self.sizey);
	                                }

				}
				for(var h in self.bulletdmg10List){
					//bulletdmg10
				/*	var sidex = self.playerList[j].x-self.bulletdmg10List[h].x;
                                        var sidey = self.playerList[j].y-self.bulletdmg10List[h].y;
                                        var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                        var force = ((self.playerList[j].mass*self.bulletdmg10List[h].mass)/Math.pow(distance,2))/10;
                                        var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                        var percentForcey = 1-percentForcex;
                                        if(sidex<0)self.bulletdmg10List[h].accelx = 0-(force*percentForcex);
                                        else self.bulletdmg10List[h].accelx = force*percentForcex;
                                        if(sidey<0)self.bulletdmg10List[h].accely = 0-(force*percentForcey);
                                        else self.bulletdmg10List[h].accely = force*percentForcey;
			*/
					for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
                                                self.playerList[j].bulletQ[k].life--;
                                                if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
                                                else if( !(typeof self.bulletdmg10List[h]=== 'undefined') &&
                                                (Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.bulletdmg10List[h].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.bulletdmg10List[h].y),2))<= 12)){
                                                        self.playerList[j].bulletQ.splice(k,1);
                                                        delete self.bulletdmg10List[h]; self.bulletdmg10List[h] = Bulletdmg10(self.sizex,self.sizey);
                                                }
                                        }
					if(self.bulletdmg10List[h].x > self.sizex || self.bulletdmg10List[h].x < 0 ||  self.bulletdmg10List[h].y > self.sizey || self.bulletdmg10List[h].y <0){
                                        	delete self.bulletdmg10List[h];self.bulletdmg10List[h] = Bulletdmg10(self.sizex,self.sizey);
                                	}
                                	else if(Math.sqrt(Math.pow((self.playerList[j].x - self.bulletdmg10List[h].x),2)+Math.pow((self.playerList[j].y - self.bulletdmg10List[h].y),2))
                                        	<= (10+13+5*Math.log(self.playerList[j].tArmor/25))){
                                               		self.playerList[j].bulletDmg +=self.bulletdmg10List[h].bonus;
                                        	        delete self.bulletdmg10List[h];self.bulletdmg10List[h] = Bulletdmg10(self.sizex,self.sizey);
                                	}

				}
				for(var h in self.bullets100List){
			/*		//bullets100
					var sidex = self.playerList[j].x-self.bullets100List[h].x;
                                        var sidey = self.playerList[j].y-self.bullets100List[h].y;
                                        var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                        var force = ((self.playerList[j].mass*self.bullets100List[h].mass)/Math.pow(distance,2))/10;
                                        var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                        var percentForcey = 1-percentForcex;
                                        if(sidex<0)self.bullets100List[h].accelx = 0-(force*percentForcex);
                                        else self.bullets100List[h].accelx = force*percentForcex;
                                        if(sidey<0)self.bullets100List[h].accely = 0-(force*percentForcey);
                                        else self.bullets100List[h].accely = force*percentForcey;
		*/
					for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
                                                self.playerList[j].bulletQ[k].life--;
                                                if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
                                                else if( !(typeof self.bullets100List[h]=== 'undefined') &&
                                                (Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.bullets100List[h].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.bullets100List[h].y),2))<= 12)){
                                                        self.playerList[j].bulletQ.splice(k,1);;
                                                        delete self.bullets100List[h]; self.bullets100List[h] = Bullets100(self.sizex,self.sizey);
                                                }
                                        }
					if(self.bullets100List[h].x > self.sizex || self.bullets100List[h].x < 0 ||  self.bullets100List[h].y > self.sizey || self.bullets100List[h].y <0){
                                        	delete self.bullets100List[h];self.bullets100List[h] = Bullets100(self.sizex,self.sizey);
                                	}
                                	else if(Math.sqrt(Math.pow((self.playerList[j].x - self.bullets100List[h].x),2)+Math.pow((self.playerList[j].y - self.bullets100List[h].y),2))
                        	                <= (10+13+5*Math.log(self.playerList[j].tArmor/25))){
                	                                self.playerList[j].bullets += self.bullets100List[h].bonus;
        	                                        delete self.bullets100List[h];self.bullets100List[h] = Bullets100(self.sizex,self.sizey);
	                                }

				}	
				for(var h in self.thrusterx4List){
					//thrusterx4
		/*			var sidex = self.playerList[j].x-self.thrusterx4List[h].x;
                                        var sidey = self.playerList[j].y-self.thrusterx4List[h].y;
                                        var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                        var force = ((self.playerList[j].mass*self.thrusterx4List[h].mass)/Math.pow(distance,2))/10;
                                        var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                        var percentForcey = 1-percentForcex;
                                        if(sidex<0)self.thrusterx4List[h].accelx = 0-(force*percentForcex);
                                        else self.thrusterx4List[h].accelx = force*percentForcex;
                                        if(sidey<0)self.thrusterx4List[h].accely = 0-(force*percentForcey);
                                        else self.thrusterx4List[h].accely = force*percentForcey;
		*/	
					for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
                                                self.playerList[j].bulletQ[k].life--;
                                                if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
                                                else if( !(typeof self.thrusterx4List[h]=== 'undefined') &&
                                                (Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.thrusterx4List[h].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.thrusterx4List[h].y),2))<= 12)){
                                                        self.playerList[j].bulletQ.splice(k,1);;
                                                        delete self.thrusterx4List[h]; self.thrusterx4List[h] = Thrusterx4(self.sizex,self.sizey);
                                                }
                                        }
					if(self.thrusterx4List[h].x > self.sizex || self.thrusterx4List[h].x < 0 ||  self.thrusterx4List[h].y > self.sizey || self.thrusterx4List[h].y <0){
                                        	delete self.thrusterx4List[h];self.thrusterx4List[h] = Thrusterx4(self.sizex,self.sizey);
                                	}
                                	else if(Math.sqrt(Math.pow((self.playerList[j].x - self.thrusterx4List[h].x),2)+Math.pow((self.playerList[j].y - self.thrusterx4List[h].y),2))
                        	                <= (10+13+5*Math.log(self.playerList[j].tArmor/25))){
                	                                self.playerList[j].thruster = self.playerList[j].thruster*self.thrusterx4List[h].bonus;
        	                                        delete self.thrusterx4List[h];self.thrusterx4List[h] = Thrusterx4(self.sizex,self.sizey);
	                                }

				}
				for(var h in self.repair10List){
					//repair10
		/*			var sidex = self.playerList[j].x-self.repair10List[h].x;
                                        var sidey = self.playerList[j].y-self.repair10List[h].y;
                                        var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                        var force = ((self.playerList[j].mass*self.repair10List[h].mass)/Math.pow(distance,2))/10;
                                        var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                        var percentForcey = 1-percentForcex;
                                        if(sidex<0)self.repair10List[h].accelx = 0-(force*percentForcex);
                                        else self.repair10List[h].accelx = force*percentForcex;
                                        if(sidey<0)self.repair10List[h].accely = 0-(force*percentForcey);
                                        else self.repair10List[h].accely = force*percentForcey;
		*/		
					for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
                                                self.playerList[j].bulletQ[k].life--;
                                                if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
                                                else if( !(typeof self.repair10List[h]=== 'undefined') &&
                                                (Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.repair10List[h].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.repair10List[h].y),2))<= 12)){
                                                        self.playerList[j].bulletQ.splice(k,1);;
                                                        delete self.repair10List[h]; self.repair10List[h] = Repair10(self.sizex,self.sizey);
                                                }
                                        }
					if(self.repair10List[h].x > self.sizex || self.repair10List[h].x < 0 ||  self.repair10List[h].y > self.sizey || self.repair10List[h].y <0){
                                        	delete self.repair10List[h];self.repair10List[h] = Repair10(self.sizex,self.sizey);
                                	}
                                	else if(Math.sqrt(Math.pow((self.playerList[j].x - self.repair10List[h].x),2)+Math.pow((self.playerList[j].y - self.repair10List[h].y),2))
                        	                <= (10+13+5*Math.log(self.playerList[j].tArmor/25))){
                	                                self.playerList[j].armorRep += self.repair10List[h].bonus;
        	                                        delete self.repair10List[h];self.repair10List[h] = Repair10(self.sizex,self.sizey);
	                                }

                                }
				for(var h in self.armorList){
                                        //repair10
                /*                      var sidex = self.playerList[j].x-self.repair10List[h].x;
                                        var sidey = self.playerList[j].y-self.repair10List[h].y;
                                        var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                        var force = ((self.playerList[j].mass*self.repair10List[h].mass)/Math.pow(distance,2))/10;
                                        var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                        var percentForcey = 1-percentForcex;
                                        if(sidex<0)self.repair10List[h].accelx = 0-(force*percentForcex);
                                        else self.repair10List[h].accelx = force*percentForcex;
                                        if(sidey<0)self.repair10List[h].accely = 0-(force*percentForcey);
                                        else self.repair10List[h].accely = force*percentForcey;
                */
                                        for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
                                                self.playerList[j].bulletQ[k].life--;
                                                if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
                                                else if( !(typeof self.armorList[h]=== 'undefined') &&
                                                (Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.armorList[h].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.armorList[h].y),2))<= 12)){
                                                        self.playerList[j].bulletQ.splice(k,1);;
                                                        delete self.armorList[h]; self.armorList[h] = Armor(self.sizex,self.sizey);
                                                }
                                        }
                                        if(self.armorList[h].x > self.sizex || self.armorList[h].x < 0 ||  self.armorList[h].y > self.sizey || self.armorList[h].y <0){
                                                delete self.armorList[h];self.armorList[h] = Armor(self.sizex,self.sizey);
                                        }
                                        else if(Math.sqrt(Math.pow((self.playerList[j].x - self.armorList[h].x),2)+Math.pow((self.playerList[j].y - self.armorList[h].y),2))
                                                <= (10+13+5*Math.log(self.playerList[j].tArmor/25))){
                                                        self.playerList[j].armor += self.armorList[h].bonus;
							self.playerList[j].tArmor += self.armorList[h].bonus;
                                                        delete self.armorList[h];self.armorList[h] = Armor(self.sizex,self.sizey);
                                        }

                                }
				for(var h in self.shieldList){
                                        //repair10
                /*                      var sidex = self.playerList[j].x-self.repair10List[h].x;
                                        var sidey = self.playerList[j].y-self.repair10List[h].y;
                                        var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                        var force = ((self.playerList[j].mass*self.repair10List[h].mass)/Math.pow(distance,2))/10;
                                        var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                        var percentForcey = 1-percentForcex;
                                        if(sidex<0)self.repair10List[h].accelx = 0-(force*percentForcex);
                                        else self.repair10List[h].accelx = force*percentForcex;
                                        if(sidey<0)self.repair10List[h].accely = 0-(force*percentForcey);
                                        else self.repair10List[h].accely = force*percentForcey;
                */
                                        for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
                                                self.playerList[j].bulletQ[k].life--;
                                                if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
                                                else if( !(typeof self.shieldList[h]=== 'undefined') &&
                                                (Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.shieldList[h].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.shieldList[h].y),2))<= 12)){
                                                        self.playerList[j].bulletQ.splice(k,1);;
                                                        delete self.shieldList[h]; self.shieldList[h] = Shield(self.sizex,self.sizey);
                                                }
                                        }
                                        if(self.shieldList[h].x > self.sizex || self.shieldList[h].x < 0 ||  self.shieldList[h].y > self.sizey || self.shieldList[h].y <0){
                                                delete self.shieldList[h];self.shieldList[h] = Shield(self.sizex,self.sizey);
                                        }
                                        else if(Math.sqrt(Math.pow((self.playerList[j].x - self.shieldList[h].x),2)+Math.pow((self.playerList[j].y - self.shieldList[h].y),2))
                                                <= (10+13+5*Math.log(self.playerList[j].tArmor/25))){
                                                        self.playerList[j].shield += self.shieldList[h].bonus;
                                                        self.playerList[j].tShield += self.shieldList[h].bonus;
                                                        delete self.shieldList[h];self.shieldList[h] = Shield(self.sizex,self.sizey);
                                        }

                                }
				for(var z in self.playerList){
					if(!(typeof self.playerList[j] === "undefined" ||typeof self.playerList[z] === "undefined") && (self.playerList[j] != self.playerList[z])){
						var sidex = self.playerList[j].x-self.playerList[z].x;
						var sidey = self.playerList[j].y-self.playerList[z].y;
						var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
						var force = ((self.playerList[j].mass*self.playerList[z].mass)/Math.pow(distance,2))/10;
						var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
						var percentForcey = 1-percentForcex;
						if(sidex<0)self.playerList[z].accelx = 0-(force*percentForcex);
						else self.playerList[z].accelx = force*percentForcex;
						if(sidey<0)self.playerList[z].accely = 0-(force*percentForcey);
						else self.playerList[z].accely = force*percentForcey;
					}
				
					for(var k = self.playerList[j].bulletQ.length-1; k >= 0; k--){
						self.playerList[j].bulletQ[k].life--;
						if(self.playerList[j].bulletQ[k].life <= 100)self.playerList[j].bulletQ.shift();
						else if( !(typeof self.playerList[z] === "undefined") && self.playerList[j].id != self.playerList[z].id && 
						(Math.sqrt(Math.pow((self.playerList[j].bulletQ[k].x - self.playerList[z].x),2)+Math.pow((self.playerList[j].bulletQ[k].y - self.playerList[z].y),2))
						<= (13+5*Math.log(self.playerList[z].tArmor/25)))){
							self.playerList[j].bulletQ.splice(k,1);
							self.playerList[z].gettingHit(self.playerList[j].bulletDmg);
							if(alive == false){
								self.playerList[j].tArmor+=self.playerList[z].tArmor;
								self.playerList[j].armor+=self.playerList[z].tArmor;
								self.playerList[j].bullets+=self.playerList[z].bullets;
								self.playerList[j].armorRep+=self.playerList[z].armorRep;
								socket = self.socketList[self.playerList[z].id];
								socket.emit('dead');
								delete self.playerList[z];
								alive=true;
							}
						}
					}
				 }
				 for(var z in self.explosionQ){
					if(!(typeof self.playerList[j] === "undefined") && (self.playerList[j] != self.playerList[self.explosionQ[z].owner])){
						var sidex = self.playerList[j].x-self.explosionQ[z].x;
                                                var sidey = self.playerList[j].y-self.explosionQ[z].y;
                                                if(Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2)) <= (self.explosionQ[z].radius+(13+5*Math.log(self.playerList[j].tArmor/25)))){
							self.playerList[j].gettingHit(self.explosionQ[z].damage);
							if(alive == false){
								self.playerList[self.explosionQ[z].owner].tArmor+=self.playerList[j].tArmor;
                                                                self.playerList[self.explosionQ[z].owner].armor+=self.playerList[j].tArmor;
                                                                self.playerList[self.explosionQ[z].owner].bullets+=self.playerList[j].bullets;
                                                                self.playerList[self.explosionQ[z].owner].armorRep+=self.playerList[j].armorRep;
                                                                socket = self.socketList[self.playerList[j].id];
                                                                socket.emit('dead');
                                                                delete self.playerList[j];
                                                                alive=true;
								self.explosionQ.splice(z,1);
							}
						}		
					}
				}
			}
		}
		for(var j in self.explosionQ){
			var radius = self.explosionQ[j].radius;var x=self.explosionQ[j].x;var y=self.explosionQ[j].y;
			 for(var z in self.capaList){
                                if(Math.sqrt(Math.pow((x - self.capaList[z].x),2)+Math.pow((y - self.capaList[z].y),2)) <= 12+radius){
                                        delete self.capaList[z]; self.capaList[z] = Capa(self.sizex,self.sizey);
                                }
                        }
			for(var z in self.repair10List){
				if(Math.sqrt(Math.pow((x - self.repair10List[z].x),2)+Math.pow((y - self.repair10List[z].y),2)) <= 12+radius){
                                        delete self.repair10List[z]; self.repair10List[z] = Repair10(self.sizex,self.sizey);
				}
			}
			 for(var z in self.armorList){
                                if(Math.sqrt(Math.pow((x - self.armorList[z].x),2)+Math.pow((y - self.armorList[z].y),2)) <= 12+radius){
                                        delete self.armorList[z]; self.armorList[z] = Armor(self.sizex,self.sizey);
                                }
                        }
			 for(var z in self.shieldList){
                                if(Math.sqrt(Math.pow((x - self.shieldList[z].x),2)+Math.pow((y - self.shieldList[z].y),2)) <= 12+radius){
                                        delete self.shieldList[z]; self.shieldList[z] = Shield(self.sizex,self.sizey);
                                }
                        }
			 for(var z in self.rf5List){
                                if(Math.sqrt(Math.pow((x - self.rf5List[z].x),2)+Math.pow((y - self.rf5List[z].y),2)) <= 12+radius){
                                        delete self.rf5List[z]; self.rf5List[z] = Rf5(self.sizex,self.sizey);
                                }
                        }
			 for(var z in self.bulletdmg10List){
                                if(Math.sqrt(Math.pow((x - self.bulletdmg10List[z].x),2)+Math.pow((y - self.bulletdmg10List[z].y),2)) <= 12+radius){
                                        delete self.bulletdmg10List[z]; self.bulletdmg10List[z] = Bulletdmg10(self.sizex,self.sizey);
                                }
                        }
			 for(var z in self.bullets100List){
                                if(Math.sqrt(Math.pow((x - self.bullets100List[z].x),2)+Math.pow((y - self.bullets100List[z].y),2)) <= 12+radius){
                                        delete self.bullets100List[z]; self.bullets100List[z] = Bullets100(self.sizex,self.sizey);
                                }
                        }
			 for(var z in self.thrusterx4List){
                                if(Math.sqrt(Math.pow((x - self.thrusterx4List[z].x),2)+Math.pow((y - self.thrusterx4List[z].y),2)) <= 12+radius){
                                        delete self.thrusterx4List[z]; self.thrusterx4List[z] = Thrusterx4(self.sizex,self.sizey);
                                }
                        }
		}
	        while(self.explosionQ.length != 0){
			self.explosionQ.shift();
		}
		for(var j in self.capaList){self.capaList[j].accelx=0;self.capaList[j].accely=0;}
		for(var j in self.playerList){self.playerList[j].accelx=0;self.playerList[j].accely=0;}
		for(var j in self.armorList){self.armorList[j].accelx=0;self.armorList[j].accely=0;}
		for(var j in self.shieldList){self.shieldList[j].accelx=0;self.shieldList[j].accely=0;}
		for(var j in self.rf5List){self.rf5List[j].accelx=0;self.rf5List[j].accely=0;}
                for(var j in self.bulletdmg10List){self.bulletdmg10List[j].accelx=0;self.bulletdmg10List[j].accely=0;}
                for(var j in self.bullets100List){self.bullets100List[j].accelx=0;self.bullets100List[j].accely=0;}
                for(var j in self.thrusterx4List){self.thrusterx4List[j].accelx=0;self.thrusterx4List[j].accely=0;}
                for(var j in self.repair10List){self.repair10List[j].accelx=0;self.repair10List[j].accely=0}
		for(var i in self.planetList){
			for(var j in self.capaList){
                                var sidex = self.planetList[i].x-self.capaList[j].x;
                                var sidey = self.planetList[i].y-self.capaList[j].y;
                                var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                var force = ((self.planetList[i].mass*self.capaList[j].mass)/Math.pow(distance,2))/10;
                                var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                var percentForcey = 1-percentForcex;
                                if(sidex<0)self.capaList[j].accelx += 0-(force*percentForcex);
                                else self.capaList[j].accelx += force*percentForcex;
                                if(sidey<0)self.capaList[j].accely += 0-(force*percentForcey);
                                else self.capaList[j].accely += force*percentForcey;
                        }
			for(var j in self.repair10List){
				var sidex = self.planetList[i].x-self.repair10List[j].x;
                                var sidey = self.planetList[i].y-self.repair10List[j].y;
                                var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                var force = ((self.planetList[i].mass*self.repair10List[j].mass)/Math.pow(distance,2))/10;
                                var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                var percentForcey = 1-percentForcex;
                                if(sidex<0)self.repair10List[j].accelx += 0-(force*percentForcex);
                                else self.repair10List[j].accelx += force*percentForcex;
                                if(sidey<0)self.repair10List[j].accely += 0-(force*percentForcey);
                                else self.repair10List[j].accely += force*percentForcey;
			}
			for(var j in self.armorList){
                                var sidex = self.planetList[i].x-self.armorList[j].x;
                                var sidey = self.planetList[i].y-self.armorList[j].y;
                                var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                var force = ((self.planetList[i].mass*self.armorList[j].mass)/Math.pow(distance,2))/10;
                                var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                var percentForcey = 1-percentForcex;
                                if(sidex<0)self.armorList[j].accelx += 0-(force*percentForcex);
                                else self.armorList[j].accelx += force*percentForcex;
                                if(sidey<0)self.armorList[j].accely += 0-(force*percentForcey);
                                else self.armorList[j].accely += force*percentForcey;
                        }
			for(var j in self.shieldList){
                                var sidex = self.planetList[i].x-self.shieldList[j].x;
                                var sidey = self.planetList[i].y-self.shieldList[j].y;
                                var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                var force = ((self.planetList[i].mass*self.shieldList[j].mass)/Math.pow(distance,2))/10;
                                var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                var percentForcey = 1-percentForcex;
                                if(sidex<0)self.shieldList[j].accelx += 0-(force*percentForcex);
                                else self.shieldList[j].accelx += force*percentForcex;
                                if(sidey<0)self.shieldList[j].accely += 0-(force*percentForcey);
                                else self.shieldList[j].accely += force*percentForcey;
                        }
			for(var j in self.rf5List){
				var sidex = self.planetList[i].x-self.rf5List[j].x;
                                var sidey = self.planetList[i].y-self.rf5List[j].y;
                                var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                var force = ((self.planetList[i].mass*self.rf5List[j].mass)/Math.pow(distance,2))/10;
                                var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                var percentForcey = 1-percentForcex;
                                if(sidex<0)self.rf5List[j].accelx += 0-(force*percentForcex);
                                else self.rf5List[j].accelx += force*percentForcex;
                                if(sidey<0)self.rf5List[j].accely += 0-(force*percentForcey);
                                else self.rf5List[j].accely += force*percentForcey;
			}
			for(var j in self.bulletdmg10List){
                                var sidex = self.planetList[i].x-self.bulletdmg10List[j].x;
                                var sidey = self.planetList[i].y-self.bulletdmg10List[j].y;
                                var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                var force = ((self.planetList[i].mass*self.bulletdmg10List[j].mass)/Math.pow(distance,2))/10;
                                var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                var percentForcey = 1-percentForcex;
                                if(sidex<0)self.bulletdmg10List[j].accelx += 0-(force*percentForcex);
                                else self.bulletdmg10List[j].accelx += force*percentForcex;
                                if(sidey<0)self.bulletdmg10List[j].accely += 0-(force*percentForcey);
                                else self.bulletdmg10List[j].accely += force*percentForcey;
                        }
			for(var j in self.bullets100List){
                                var sidex = self.planetList[i].x-self.bullets100List[j].x;
                                var sidey = self.planetList[i].y-self.bullets100List[j].y;
                                var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                var force = ((self.planetList[i].mass*self.bullets100List[j].mass)/Math.pow(distance,2))/10;
                                var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                var percentForcey = 1-percentForcex;
                                if(sidex<0)self.bullets100List[j].accelx += 0-(force*percentForcex);
                                else self.bullets100List[j].accelx += force*percentForcex;
                                if(sidey<0)self.bullets100List[j].accely += 0-(force*percentForcey);
                                else self.bullets100List[j].accely += force*percentForcey;
                        }
			for(var j in self.thrusterx4List){
			 	var sidex = self.planetList[i].x-self.thrusterx4List[j].x;
                                var sidey = self.planetList[i].y-self.thrusterx4List[j].y;
                                var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
                                var force = ((self.planetList[i].mass*self.thrusterx4List[j].mass)/Math.pow(distance,2))/10;
                                var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
                                var percentForcey = 1-percentForcex;
                                if(sidex<0)self.thrusterx4List[j].accelx += 0-(force*percentForcex);
                                else self.thrusterx4List[j].accelx += force*percentForcex;
                                if(sidey<0)self.thrusterx4List[j].accely += 0-(force*percentForcey);
                                else self.thrusterx4List[j].accely += force*percentForcey;
			}
			for(var j in self.playerList){
				var sidex = self.planetList[i].x-self.playerList[j].x;
				var sidey = self.planetList[i].y-self.playerList[j].y;
				var distance = Math.sqrt(Math.pow(sidex,2)+Math.pow(sidey,2));
				var force = ((self.planetList[i].mass*self.playerList[j].mass)/Math.pow(distance,2))/10;
				var percentForcex = (Math.asin(Math.abs(sidex)/distance))/(1.57);
				var percentForcey = 1-percentForcex;
				if(sidex<0)self.playerList[j].accelx+=0-(force*percentForcex);
				else self.playerList[j].accelx+=force*percentForcex;
				if(sidey<0)self.playerList[j].accely+=0-(force*percentForcey);
				else self.playerList[j].accely+=force*percentForcey;
			}
			
		}
		for(var i in self.capaList){self.capaList[i].update();}
		for(var i in self.armorList){self.armorList[i].update();}
		for(var i in self.shieldList){self.shieldList[i].update();}
		for(var i in self.playerList){self.playerList[i].update();}
                for(var i in self.rf5List){self.rf5List[i].update();}
                for(var i in self.bulletdmg10List){self.bulletdmg10List[i].update();}
                for(var i in self.bullets100List){self.bullets100List[i].update();}
                for(var i in self.thrusterx4List){self.thrusterx4List[i].update();}
		for(var i in self.repair10List){self.repair10List[i].update();}
	}
	return self;
}	

var Capa = function(sizex,sizey){
        var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:1,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;
}
var Shield = function(sizex,sizey){
        var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:1,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;
}
var Armor = function(sizex,sizey){
        var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:1,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;
}
var Rf5 = function(sizex,sizey){
	var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:1.05,
        }
        self.update = function(){
		self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
	}
	return self;
}
var Repair10 = function(sizex,sizey){
	 var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:10,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;

}
var Thrusterx4 = function(sizex,sizey){
	var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:1.1487,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;
}
var Bulletdmg10 = function(sizex,sizey){
	var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:1,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;
}
var Bulletdmg20 = function(sizex,sizey){
        var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:2,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;
}

var Bulletdmg100 = function(sizex,sizey){
        var self = {
                mass:0.04,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:100,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;
}
var Bullets100 = function(sizex,sizey){
	var self = {
                mass:0.1,
                x:Math.random()*sizex,
                y:Math.random()*sizey,
                speedx:(Math.random()*4-Math.random()*4),
                speedy:(Math.random()*4-Math.random()*4),
                accelx:0,
                accely:0,
                bonus:100,
        }
        self.update = function(){
                self.speedx += self.accelx;
                self.speedy += self.accely;
                self.x += self.speedx;
                self.y += self.speedy;
        }
        return self;
}
var Planet = function(sizex,sizey){
	var self = {
		x:Math.floor((sizex-400)*Math.random())+200,
		y:Math.floor((sizey-400)*Math.random())+200,
		mass:Math.floor(Math.abs(Math.random() - Math.random()) * (1 + 40000 - 1000) + 1000), 
		color:""
		
	}
	if(self.mass<4000)self.color="#6e1b18";
	else if(self.mass<8000)self.color="#f20a13";
	else if(self.mass<14000)self.color="#fe6b05";
	else if(self.mass<20000)self.color="#f3dc10";
	else if(self.mass<26000)self.color="#9fd8db";
	else if(self.mass<32000)self.color="#387fd6";
	else if(self.mass>32000)self.color="#543ce9";
	return self;
}

var Player = function(idd){
	var self = {
		name:"",
		shield:25,
		tShield:25,
		armor:25,
		tArmor:25,
		armorRep:0,
		capacitor:5,
		tCapacitor:5,
		mass:0.02,
		id:idd,
		x:Math.floor(univ.sizex*Math.random()),
		y:Math.floor(univ.sizey*Math.random()),
		speedx:0,
		speedy:0,
		accelx:0,
		accely:0,
		angle:0,
		bullets:100,
		rateFire:40.0,
		coolDown:0,
		bulletQ:[],
		bulletDmg:5,
		repair:false,
		down:false,
		up:false,
		right:false,
		left:false,
		fire:false,
		explode:false,
		thruster:0.02,
	}
	self.repairing = function(){
		var rep=0;
		if(self.repair == true && self.armorRep >=0.1 && self.tArmor > self.armor){
			rep = self.tArmor-self.armor;
			if(rep<=self.armorRep){
				self.armorRep-=rep;
				self.armor=self.tArmor;
			}
			else{
				self.armor+=self.armorRep;
				self.armorRep=0;
			}
		}
	}
	self.shoot = function(){	
		if(self.coolDown <= 0 && self.bullets >= 1 && self.fire == true){
			var bullet = Bullet(self.id,self.angle,self.x,self.y);
			self.bulletQ.push(bullet);		
			self.bullets -= 1;
			self.coolDown = self.rateFire;
		}
	}
	self.exploding = function(){
		if((self.capacitor > self.tCapacitor/5) && self.explode == true){
			var expl = Explosion(self.id,self.tArmor,self.capacitor,self.tCapacitor,self.x,self.y);
			univ.explosionQ.push(expl);
			self.capacitor=0;
		}
	}
	self.rotate = function(){
		if(self.right == true && self.left == false)self.angle+=     (Math.PI/(64*1+Math.pow(Math.log(self.mass*50),3)));
		else if(self.right == false && self.left == true)self.angle-=(Math.PI/(64*1+Math.pow(Math.log(self.mass*50),3)));
	}	
	self.accelerate = function(){
		if(self.down == false && self.up == true && self.capacitor >=0.1){
			self.capacitor-=0.1;
			if(self.capacitor < 0){self.capacitor=0;}
			self.accelx += Math.sin(self.angle)*(self.thruster*(0.02/self.mass));
			self.accely -= Math.cos(self.angle)*(self.thruster*(0.02/self.mass));
		}
	}
	self.gettingHit = function(dmg){
		if(dmg <= self.shield){
			self.shield-=dmg;
		}
		else{
			var reste = dmg-Math.abs(self.shield);
			self.shield = 0;
			if(reste < self.armor){
				self.armor-=reste;
			}
			else{alive=false;}
		}
	}			
        self.update = function(){
		self.mass = (self.tArmor/25)*0.02;
		if(self.coolDown >= 0)self.coolDown -=1;
		if(self.shield < self.tShield)self.shield += 0.005+(Math.log(self.shield+1)*0.005);
		if(self.shield < 0)self.shield=0;
		if(self.shield > self.tShield)self.shield=self.tShield;
	
		if(self.capacitor < self.tCapacitor)self.capacitor += 0.015+(Math.log(((self.capacitor/self.tCapacitor)*25+1))*0.025);
                if(self.capacitor < 0)self.capacitor=0;
                if(self.capacitor > self.tCapacitor)self.capacitor=self.tCapacitor;
	
		self.rotate();
		self.repairing();
		self.shoot();
		self.exploding();
		self.accelerate();
		self.speedx += self.accelx;
		self.speedy += self.accely;
		self.x += self.speedx;
		self.y += self.speedy;
		if(self.x<=0){
			self.speedx=0;self.accelx=0;self.x=0;
		}
		else if(self.x>=univ.sizex){
			self.speedx=0;self.accelx=0;self.x=univ.sizex;
		}
		if(self.y<=0){
			self.speedy=0;self.accely=0;self.y=0;
		}
		if(self.rateFire<5){self.rateFire=5;}
		else if(self.y>=univ.sizey){
			self.speedy=0;self.accely=0;self.y=univ.sizey;
		}
		lifePack = [];
                lifePack.push({damage:self.bulletDmg,rof:self.rateFire,thruster:self.thruster,mass:self.mass,repair:self.armorRep,bullets:self.bullets,tShield:self.tShield,shield:self.shield,tArmor:self.tArmor,armor:self.armor,tCap:self.tCapacitor,cap:self.capacitor,x:self.x,y:self.y,id:self.id});
                var socket = univ.socketList[self.id];
                socket.emit('life',lifePack);
		for(var i in self.bulletQ){
			self.bulletQ[i].update();
		}
        }
	return self;
}
var Bullet = function(id,anglee,xx,yy){
	var self = {
		angle:anglee,
		x:xx,
		y:yy,
		owner:id,
		speedx:0,
		speedy:0,
		life:3000,
	}
	self.update = function(){
		self.x += self.speedx;
		self.y += self.speedy;
	}
	self.speedx = Math.sin(self.angle)*20;
	self.speedy = (0-Math.cos(self.angle))*20;
	return self;
}

var Explosion = function(id,tArmor,capacitor,tcap,xx,yy){
        var self = {
		owner:id,
		x:xx,
		y:yy,
                radius:(13+5*Math.log(tArmor/25))*3.5*(capacitor/tcap),
                damage:capacitor,
        }
	return self;
}

var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){
	//console.log('socket connection!');
	if(socketCounter==0){
		univ = Universe(2500,1875); 
		//console.log('universe created!');	
	}
	socket.id = ++socketCounter;
        //console.log(socketCounter);
        univ.socketList[socket.id]=socket;
        var packet = [];
        for(var i in univ.planetList){packet.push({sizex:univ.sizex,sizey:univ.sizey,nb:univ.nbPlanet,x:univ.planetList[i].x,y:univ.planetList[i].y,mass:univ.planetList[i].mass,color:univ.planetList[i].color});}
        socket.emit('planets',packet);
	
	socket.on('namee',function(data){
		var player = Player(socket.id);
		univ.playerList[socket.id]=player;
        	var time = new Date();
		univ.playerList[socket.id].name=data.substring(0,13);
		console.log("Connection from: "+univ.playerList[socket.id].name+" ("+socket.remoteAddress+")  at: "+time.getHours()+":"+time.getMinutes());
		socket.emit('play');
	});
	socket.on('chat',function(data){
		while(chat.length >4)chat.shift();
		chat.push(univ.playerList[socket.id].name+": "+data.substring(0,38));
		var time = new Date();
		console.log(univ.playerList[socket.id].name+" ("+socket.remoteAddress+") said: \""+data.substring(0,38)+"\"  at: "+time.getHours()+":"+time.getMinutes());
	});
	socket.on('keyPress',function(data){
                if( !(typeof univ.playerList[socket.id]=== 'undefined') && data.inputId === 'left'&& data.state == true) univ.playerList[socket.id].left = data.state;
		else if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'left'&& data.state == false) univ.playerList[socket.id].left = data.state;
        
	        if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'up' && data.state == true) univ.playerList[socket.id].up = data.state;
		else if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'up'&& data.state == false) univ.playerList[socket.id].up = data.state;
		
		if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'down' && data.state == true) univ.playerList[socket.id].down = data.state;
                else if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'down' && data.state == false) univ.playerList[socket.id].down = data.state;

		if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'right' && data.state == true) univ.playerList[socket.id].right = data.state;
                else if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'right'&& data.state == false) univ.playerList[socket.id].right = data.state;
		
		if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'fire' && data.state == true) univ.playerList[socket.id].fire = data.state;
		else if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'fire' && data.state == false) univ.playerList[socket.id].fire = data.state;
		
		if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'repair' && data.state == true) univ.playerList[socket.id].repair = data.state;
                else if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'repair' && data.state == false) univ.playerList[socket.id].repair = data.state;
		
		if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'explode' && data.state == true) univ.playerList[socket.id].explode = data.state;
                else if(!(typeof univ.playerList[socket.id]=== 'undefined') &&data.inputId === 'explode' && data.state == false) univ.playerList[socket.id].explode = data.state;
        });

	socket.on('disconnect',function(){
		var time = new Date();
		for(var i in univ.playerList){if(univ.playerList[i].id==socket.id){console.log("Disconnection from: "+univ.playerList[i].name+" ("+socket.remoteAddress+") at: "+time.getHours()+":"+time.getMinutes());}}
		delete univ.socketList[socket.id];
                delete univ.playerList[socket.id];
		//console.log("player: "+socket.id+"has disconnected");
	});
	socket.on('deleteSocket',function(){
		delete univ.socketList[socket.id];
		var time = new Date();
		console.log("Disconnection from: A dead player... at: "+time.getHours()+":"+time.getMinutes()+" :(");
	});	
});
new timer(20,loop);

function timer(delay, callback)
{
    var self = this;
    var counter = 0;
    var start = new Date().getTime();
    function delayed()
    {
        callback(delay);
        counter ++;
        var diff = (new Date().getTime() - start) - counter * delay;
        setTimeout(delayed, delay - diff);
    }
    delayed();
    setTimeout(delayed, delay);
}

function loop(){
	if(socketCounter!=0){
		univ.update(); 
		var packet = [];
		var rf5Pack = [];
		var bulletdmg10Pack = [];
		var capaPack = [];
		var bullets100Pack = [];
		var thrusterx4Pack = [];
		var repair10Pack = [];
		var armorPack = [];
		var shieldPack = [];
		var top5 = [];
		var explosionPack =[];
		for(var i in univ.capaList){capaPack.push({x:univ.capaList[i].x,y:univ.capaList[i].y});}
		for(var i in univ.explosionQ){explosionPack.push({x:univ.explosionQ[i].x,y:univ.explosionQ[i].y,radius:univ.explosionQ[i].radius});}		
		for(var i in univ.rf5List){rf5Pack.push({x:univ.rf5List[i].x,y:univ.rf5List[i].y});}
		for(var i in univ.bulletdmg10List){bulletdmg10Pack.push({x:univ.bulletdmg10List[i].x,y:univ.bulletdmg10List[i].y});}
		for(var i in univ.bullets100List){bullets100Pack.push({x:univ.bullets100List[i].x,y:univ.bullets100List[i].y});}
		for(var i in univ.thrusterx4List){thrusterx4Pack.push({x:univ.thrusterx4List[i].x,y:univ.thrusterx4List[i].y});}
		for(var i in univ.repair10List){repair10Pack.push({x:univ.repair10List[i].x,y:univ.repair10List[i].y});}
		for(var i in univ.armorList){armorPack.push({x:univ.armorList[i].x,y:univ.armorList[i].y});}
		for(var i in univ.shieldList){shieldPack.push({x:univ.shieldList[i].x,y:univ.shieldList[i].y});}
		for(var i=0;i<5;i++){top5.push({player:"",score:0});}
		for(var i in univ.playerList){
			if(univ.playerList[i].mass > top5[0].score){top5[4]=top5[3];top5[3]=top5[2];top5[2]=top5[1];top5[1]=top5[0];top5[0]={player:univ.playerList[i].name,score:univ.playerList[i].mass};} 
			else if(univ.playerList[i].mass > top5[1].score){top5[4]=top5[3];top5[3]=top5[2];top5[2]=top5[1];top5[1]={player:univ.playerList[i].name,score:univ.playerList[i].mass};}
			else if(univ.playerList[i].mass > top5[2].score){top5[4]=top5[3];top5[3]=top5[2];top5[2]={player:univ.playerList[i].name,score:univ.playerList[i].mass};}
			else if(univ.playerList[i].mass > top5[3].score){top5[4]=top5[3];top5[3]={player:univ.playerList[i].name,score:univ.playerList[i].mass};}
			else if(univ.playerList[i].mass > top5[4].score){top5[4]={player:univ.playerList[i].name,score:univ.playerList[i].mass};}
		}
		for(var i in univ.playerList){
			packet.push({namee:univ.playerList[i].name,x:univ.playerList[i].x,y:univ.playerList[i].y,angle:univ.playerList[i].angle,bullets:univ.playerList[i].bulletQ,
			tShield:univ.playerList[i].tShield,shield:univ.playerList[i].shield,tArmor:univ.playerList[i].tArmor,armor:univ.playerList[i].armor,id:univ.playerList[i].id});
		}
        	for(var i in univ.socketList){
			var socket = univ.socketList[i];
			socket.emit('capa',capaPack);
			socket.emit('chat',chat);
			socket.emit('armor1',armorPack);
			socket.emit('shield1',shieldPack);
			socket.emit('top5',top5);
			socket.emit('rf5',rf5Pack);
			socket.emit('bulletdmg10',bulletdmg10Pack);
			socket.emit('bullets100',bullets100Pack);
			socket.emit('thrusterx4',thrusterx4Pack);
			socket.emit('repair10',repair10Pack);
			socket.emit('newPos',packet);
			socket.emit('explosion',explosionPack);
			//console.log("emition of position");
		}
        }
}
