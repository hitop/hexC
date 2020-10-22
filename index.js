if (window.localStorage && localStorage.hct && Date.now() - localStorage.hct < 60*60*24) {
  console.log("localdata");
  var ch = JSON.parse(localStorage.ctohex);
}
else { 
  var ch;
  var chx = new XMLHttpRequest();
  chx.open("GET","ctohex.json",true);
  chx.send();
  chx.onreadystatechange=function(){
    if(chx.readyState==4&&chx.status==200){
      ch = JSON.parse(chx.responseText);
      localStorage.ctohex = chx.responseText;
      localStorage.hct = Date.now();
    }
  }
}

function removeCshow(k = 1) {
  for(k;document.getElementsByClassName("cShow").length > k;k++){
    document.getElementsByClassName("cShow")[k].style.display = "none";
  }
  // document.body.removeChild(document.body.lastChild);
}

function hexC(evt) {
  evt = (evt) ? evt : ((window.event) ? window.event : "")
  keyCode = evt.keyCode ? evt.keyCode : (evt.which ? evt.which : evt.charCode);
  if (keyCode == 13) {
    let civ = document.getElementById("cInv");
    let cv = civ.value,chex,hexn="";
    cv = cv.replace("色","");
    if(cv.indexOf("#") == 0){
      hexn = Object.keys(ch).filter(key => ch[key] === cv);
      if(hexn.length > 0) hexn = hexn.join("<br>");
      else hexn = "";
      chex = cv;
    }
    else if(cv == "r" || cv == "random" || cv == "随机"){
      hexn = randomP(ch)[0];
      chex = ch[hexn];
    }
    else if(chex = cv.match(/r([2-8])/)){
      hexn = randomP(ch,chex[1]);
      for(let j in hexn){
        csDiv(j,ch[hexn[j]],hexn[j]);
      }
      removeCshow(chex[1]);
      return;
    }
    else if(cv.indexOf("*") == 0){
      wildHex();
      return;
    }
    else if(jcv = ch[cv.toLowerCase()]){
      hexn = cv;
      chex = jcv;
    }
    else{
      wildHex();
      return;
    }
    csDiv(0,chex,hexn);
    removeCshow();
    civ.placeholder = chex;
  }
}

function wildHex() {
  let civ = document.getElementById("cInv");
  let cv = civ.value;
  if(cv.indexOf("*") == 0) cv = cv.substr(1)
  let nc = {},i=1;
  for(let c in ch){
    if(c.match(cv)) {
      nc[c] = ch[c];
      i += 1;
      if(i>8) break;
    }
  }

  if (Object.keys(nc).length == 0) {
    removeCshow();
    let rc = randomP(ch)[0];
    csDiv(0, ch[rc], rc);
    cTip("无匹配，显示随机颜色",1);
    return;
  }
  else{
    let j=0;
    for(let fc in nc){
      csDiv(j,nc[fc],fc);
      j += 1;
    }
    removeCshow(j);
  }
}

function csDiv(num,hex,hexn) {
  let csh = document.getElementsByClassName("cShow")[num];
  if(csh){
    csh.getElementsByTagName('input')[0].value = hex;
    csh.getElementsByTagName("span")[0].innerHTML = hexn;
    csh.style.backgroundColor = hex;
    csh.style.display = "block";
  }
  else{
    csh = document.createElement("div");
    csh.style.display = "block";
    csh.className = "cShow";
    csh.setAttribute("onclick", "copyHexc(" + num + ")");
    csh.style.backgroundColor = hex;
    let cinput = document.createElement("input");
    cinput.type = "text";
    cinput.className = "chex";
    cinput.value = hex;
    csh.appendChild(cinput);
    let cspan = document.createElement("span");
    cspan.className = "hexName";
    cspan.innerHTML = hexn;
    cspan.setAttribute("onclick", "event.stopPropagation();copyHexc(0,this.innerHTML)")
    csh.appendChild(cspan);
    document.body.appendChild(csh);
  }
}

function copyHexc(i,str=false) {
  let chex = document.getElementsByClassName("cShow")[i].getElementsByTagName("input")[0],ostr="";
  if (str){
    ostr = chex.value;
    chex.value = str;
  }
  else if (chex.value == "") return;
  chex.select();
  if(document.execCommand("copy")) {
    cTip("复制内容：" + chex.value);
    if(str) {chex.value = ostr}
  }
  else console.log("复制失败");
  chex.blur();
}

function randomP(obj,i=1) {
  // obj 随机选取
  var keys = Object.keys(obj),tmpv = [];
  for(i; i>0; i--){
    tmpv.push(keys[keys.length * Math.random() << 0]);
  }
  return tmpv;
}

function fadeOut(el){
  el.style.opacity = 1;

  (function fade() {
  if ((el.style.opacity -= .05) < 0) {
    el.style.display = "none";
  } else {
    requestAnimationFrame(fade);
  }
  })();
};

function fadeIn(el, display){
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
  var val = parseFloat(el.style.opacity);
  if (!((val += .05) > 1)) {
    el.style.opacity = val;
    requestAnimationFrame(fade);
  }
  })();
};

function cTip(str,p = 0) {
  let ct = document.getElementById('ctip')
  if(ct == undefined){
    ct = document.createElement('div');
    ct.id = "ctip";
  }
  ct.innerHTML = str;
  if(p!=0) {ct.style.top = "20px";ct.style.bottom = "unset";}
  document.body.appendChild(ct);
  fadeIn(ct);
  setTimeout("fadeOut(document.getElementById('ctip'))",3000)
}