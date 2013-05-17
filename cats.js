javascript:{
var a ='http://i.imgur.com/gaCFC.gif';
for(var i=0;i<25;i++){
window.open(a,'_blank','width=250,height=210,left='+(i%5)*255+',top='+Math.floor(i/5)*230)
}
window.location=a;
}