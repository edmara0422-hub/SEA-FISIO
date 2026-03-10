(function(){
'use strict';

window.onerror=function(msg,url,line,col,err){
  var d=document.getElementById('icu-dbg');
  if(!d){d=document.createElement('div');d.id='icu-dbg';d.style.cssText='position:fixed;bottom:80px;left:10px;right:10px;background:#300;color:#f88;padding:8px;font-size:11px;z-index:9999;border-radius:8px;max-height:150px;overflow:auto';document.body.appendChild(d);}
  d.textContent='ERRO: '+(err?err.stack:msg)+' L:'+line+' C:'+col;
  return true;
};

function showDbg(msg){
  var d=document.getElementById('icu-dbg');
  if(!d){d=document.createElement('div');d.id='icu-dbg';d.style.cssText='position:fixed;bottom:80px;left:10px;right:10px;background:#300;color:#f88;padding:8px;font-size:11px;z-index:9999;border-radius:8px;max-height:150px;overflow:auto';document.body.appendChild(d);}
  d.textContent=msg;
}

var MAX_PATIENTS=14;
var patients=[];
var editingId=null;
var trashPatients=[];

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}

function newPatient(){
  return{
    id:uid(),leito:'',nome:'',idade:'',sexo:'',altura:'',peso:'',pesoIdeal:'',pesoAtual:'',statusClinico:'',
    balanco24h:'',balancoAcumulado:'',
    historia:'',diagnostico:'',examesLab:'',examesImagem:'',
    examesLabList:[],examesImagemList:[],
    glasgowO:'',glasgowV:'',glasgowM:'',rass:'',neurologico:'',
    metaRASS:'',sedativos:[],bnmList:[],metaTOF:'',ultimoTOF:'',
    cardiovascular:'',cardiovascularMudanca:'',pas:'',pad:'',pam:'',fc:'',lactatoCardio:'',dvaList:[],
    pulmonar:'',secrecao:'',
    tipoVia:'',dataTOT:'',dataTQT:'',dataExtubacao:'',dataDecanulacao:'',viaAereaHist:[],modoVM:'',
    vt:'',fr:'',peep:'',fio2:'',trigger:'',ti:'',ie:'',
    ppico:'',pplato:'',pmean:'',
    ps:'',ciclagem:'',
    p01:'',pocc:'',pmusc:'',
    ipap:'',epap:'',interfaceVNI:'facial',
    gasoId:'',gasoData:'',gasoHora:'',gasoPH:'',gasoPaCO2:'',gasoPaO2:'',gasoHCO3:'',gasoBE:'',gasoSaO2:'',gasoLactato:'',gasoFiO2:'',gasoObs:'',
    sfSpO2:'',sfFiO2:'',
    gasometrias:[],
    protocoloVM:[],
    weanRSBI_FR:'',weanRSBI_VC:'',weanPImax:'',weanPEmax:'',weanCV:'',weanVM_VC:'',weanVM_FR:'',
    weanTRETipo:'',weanTREResult:'',weanObs:'',weanTentativas:[],
    percepcao:'',pendencias:'',condutas:'',motora:'',mobilidade:'',mrc:'',
    problemasVinculados:[],
    createdAt:new Date().toISOString()
  };
}

// CALCULOS
function calcPesoIdeal(alt,sexo){
  var a=parseFloat(alt);if(isNaN(a)||a<100||a>250)return 0;
  if(sexo==='M')return 50+0.91*(a-152.4);
  if(sexo==='F')return 45.5+0.91*(a-152.4);
  return 47.75+0.91*(a-152.4);
}
function calcPF(pao2,fio2){
  var p=parseFloat(pao2),f=parseFloat(fio2)/100;
  if(isNaN(p)||isNaN(f)||f===0)return null;
  return p/f;
}
function interpPF(v){
  if(v>=400)return{t:'Normal',c:'#4ade80',s:'normal'};
  if(v>=300)return{t:'Preservado',c:'#4ade80',s:'preservado'};
  if(v>=200)return{t:'SDRA Leve',c:'#facc15',s:'leve'};
  if(v>=100)return{t:'SDRA Moderada',c:'#fb923c',s:'moderada'};
  return{t:'SDRA Grave',c:'#f87171',s:'grave'};
}
function calcDP(plato,peep){
  var pl=parseFloat(plato),pe=parseFloat(peep);
  if(isNaN(pl)||isNaN(pe))return null;return pl-pe;
}
function calcCest(vt,dp){
  var v=parseFloat(vt);if(isNaN(v)||!dp||dp===0)return null;return v/dp;
}
function calcResist(pico,plato,fluxo){
  var pi=parseFloat(pico),pl=parseFloat(plato);
  if(isNaN(pi)||isNaN(pl))return null;
  var fl=parseFloat(fluxo);
  if(!isNaN(fl)&&fl>0)return(pi-pl)/(fl/60);
  return pi-pl;
}
function calcGlasgow(o,v,m){
  if(v==='T'){var s=parseInt(o||0)+parseInt(m||0);return{total:s+'T',interp:'Intubado',cor:'#60a5fa'};}
  var t=(parseInt(o)||0)+(parseInt(v)||0)+(parseInt(m)||0);
  if(t>=15)return{total:15,interp:'Consciente e Orientado',cor:'#4ade80'};
  if(t>=13)return{total:t,interp:'Disfuncao Leve',cor:'#facc15'};
  if(t>=9)return{total:t,interp:'Disfuncao Moderada',cor:'#fb923c'};
  return{total:t,interp:'Coma (VA definitiva)',cor:'#f87171'};
}
function calcRSBI(fr,vc){
  var f=parseFloat(fr),v=parseFloat(vc);
  if(isNaN(f)||isNaN(v)||v===0)return null;return f/(v/1000);
}
function interpRSBI(v){
  if(v<80)return{t:'Favoravel ao desmame',c:'#4ade80'};
  if(v<=105)return{t:'Risco moderado',c:'#facc15'};
  return{t:'Alto risco de falha',c:'#f87171'};
}
function calcDias(dt){
  if(!dt)return 0;
  var parts=dt.split(/[-T]/);
  var y=parseInt(parts[0]),m=parseInt(parts[1])-1,day=parseInt(parts[2]);
  var d=new Date(y,m,day);d.setHours(0,0,0,0);
  var h=new Date();h.setHours(0,0,0,0);
  return Math.floor((h-d)/(864e5))+1;
}
function analisarGaso(p){
  var pH=parseFloat(p.gasoPH),co2=parseFloat(p.gasoPaCO2),hco3=parseFloat(p.gasoHCO3);
  if(isNaN(pH)||isNaN(co2)||isNaN(hco3))return null;
  var tipo='Normal',origem='',comp='';
  if(pH<7.35){
    tipo='Acidose';
    if(co2>45&&hco3<22){origem='Mista';comp='Nao compensada';}
    else if(co2>45){origem='Respiratoria';comp=hco3>26?'Parcial':'Nao compensada';}
    else if(hco3<22){origem='Metabolica';comp=co2<35?'Parcial':'Nao compensada';}
  }else if(pH>7.45){
    tipo='Alcalose';
    if(co2<35&&hco3>26){origem='Mista';comp='Nao compensada';}
    else if(co2<35){origem='Respiratoria';comp=hco3<22?'Parcial':'Nao compensada';}
    else if(hco3>26){origem='Metabolica';comp=co2>45?'Parcial':'Nao compensada';}
  }
  var cor='#4ade80';
  if(tipo!=='Normal')cor='#facc15';
  if(origem==='Mista'||comp==='Nao compensada')cor='#fb923c';
  if(pH<7.2||pH>7.6)cor='#f87171';
  return{tipo:tipo,origem:origem,comp:comp,cor:cor,full:tipo+(origem?' '+origem:'')+(comp?' - '+comp:'')};
}
function interpP01(v){
  var n=parseFloat(v);if(isNaN(n))return null;
  if(n>=1.5&&n<=3.5)return{t:'Drive Normal (1.5-3.5)',c:'#4ade80'};
  if(n<1.0)return{t:'Drive Hipo (<1.0) - Superassistencia/Falha desmame',c:'#f87171'};
  if(n<1.5)return{t:'Drive Baixo-Normal',c:'#facc15'};
  if(n<=4.0)return{t:'Drive Leve elevado (3.5-4.0)',c:'#facc15'};
  return{t:'Drive Hiper (>4.0) - Subassistencia/Falha desmame',c:'#f87171'};
}
function interpPocc(v){
  var n=parseFloat(v);if(isNaN(n))return null;
  if(n>=5&&n<=10)return{t:'Normal (5-10)',c:'#4ade80'};
  if(n<5)return{t:'Baixo (<5)',c:'#facc15'};
  return{t:'Elevado (>10)',c:'#fb923c'};
}
function calcPmusc(pocc){
  var n=parseFloat(pocc);if(isNaN(n))return null;
  return Math.abs(0.75*n);
}
function interpPmusc(v){
  var n=parseFloat(v);if(isNaN(n))return null;
  if(n<5)return{t:'Superassistencia (<5) - Baixo drive',c:'#60a5fa'};
  if(n<=10)return{t:'Protecao Diafragmatica (5-10)',c:'#4ade80'};
  if(n<=13)return{t:'Esforco Moderado (10-13)',c:'#facc15'};
  return{t:'Esforco Excessivo (>13-15)',c:'#f87171'};
}

// Analise automatica dos exames laboratoriais (interpretacao por valor de referencia)
function analisarExameLab(ex){
  if(!ex)return{items:[],alertas:[]};
  var items=[],alertas=[];
  function num(v){var n=parseFloat(String(v).replace(',','.'));return isNaN(n)?null:n;}
  var refs={hb:[12,17],ht:[36,50],leuco:[4,11],plaq:[150,400],creat:[0.6,1.2],ureia:[15,40],k:[3.5,5],na:[135,145],lac:[0,2],pcr:[0,5],bt:[0,1.2],alb:[3.5,5],tgo:[0,40],tgp:[0,41],inr:[0.8,1.2]};
  var labels={hb:'HB',ht:'HT',leuco:'Leuco',plaq:'Plaq',creat:'Creat',ureia:'Ureia',k:'K+',na:'Na+',lac:'Lac',pcr:'PCR',bt:'BT',alb:'Alb',tgo:'TGO',tgp:'TGP',inr:'INR'};
  ['hb','ht','creat','ureia','k','na','lac','pcr','bt','alb','tgo','tgp','inr','leuco','plaq'].forEach(function(k){
    var v=ex[k];if(v==null||v==='')return;
    var n=num(v);if(n===null)return;
    var r=refs[k],l=labels[k]||k,cor='#4ade80',txt='';
    if(k==='leuco'){if(n<100)n=n*1000;r=[4,11];}
    if(k==='plaq')r=[150,400];
    if(r){
      if(k==='lac'||k==='pcr'||k==='bt'){if(n>r[1]){cor='#f87171';txt=n>4?'Elevado (risco)':'Elevado';if(k==='lac'&&n>=4)alertas.push({t:'Lactato elevado - considerar hipoperfusao',c:'#f87171'});}else txt='Normal';}
      else if(k==='na'){if(n<135){cor=n<125?'#f87171':'#facc15';txt='Hiponatremia'+(n<125?' grave':'');alertas.push({t:'Na+ '+n+' - avaliar osmolaridade e correcao',c:cor});}else if(n>145){cor=n>155?'#f87171':'#facc15';txt='Hipernatremia'+(n>155?' grave':'');}else txt='Normal';}
      else if(k==='k'){if(n<3.5){cor=n<2.5?'#f87171':'#facc15';txt='Hipocalemia'+(n<2.5?' grave':'');alertas.push({t:'K+ '+n+' - risco arritmia, repor com cuidado',c:cor});}else if(n>5){cor=n>6?'#f87171':'#facc15';txt='Hipercalemia'+(n>6?' grave':'');alertas.push({t:'K+ '+n+' - avaliar ECG e causa',c:cor});}else txt='Normal';}
      else if(k==='creat'){if(n>r[1]){cor=n>=2?'#f87171':'#facc15';txt='Elevada'+(n>=2?' - considerar IRA':'');alertas.push({t:'Creatinina '+n+' - avaliar KDIGO e debito',c:cor});}else txt='Normal';}
      else if(k==='ureia'){if(n>r[1]){cor='#facc15';txt='Elevada';}else txt='Normal';}
      else if(k==='hb'){if(n<r[0]){cor=n<7?'#f87171':'#facc15';txt='Anemia'+(n<7?' grave':'');}else if(n>r[1])txt='Policitemia';else txt='Normal';}
      else if(k==='ht'){if(n<r[0]){cor='#facc15';txt='Baixo';}else if(n>r[1])txt='Alto';else txt='Normal';}
      else if(k==='leuco'){var leuVal=n;if(leuVal<100)leuVal=leuVal*1000;if(leuVal<4000){cor='#facc15';txt='Leucopenia';}else if(leuVal>11000){cor='#facc15';txt='Leucocitose';}else txt='Normal';}
      else if(k==='plaq'){if(n<150){cor=n<50?'#f87171':'#facc15';txt='Trombocitopenia'+(n<50?' grave':'');}else if(n>400)txt='Alto';else txt='Normal';}
      else if(k==='alb'){if(n<r[0]){cor='#facc15';txt='Hipoalbuminemia';}else txt='Normal';}
      else if(k==='tgo'||k==='tgp'){if(n>r[1]){cor=n>3*r[1]?'#f87171':'#facc15';txt='Elevada';}else txt='Normal';}
      else if(k==='inr'){if(n>r[1]){cor=n>2?'#f87171':'#facc15';txt='Alterado'+(n>2?' - risco sangramento':'');}else txt='Normal';}
    }
    items.push({k:k,label:l,val:v,interp:txt||'OK',cor:cor});
  });
  return{items:items,alertas:alertas};
}

var formTab='dados';

// RENDER
function renderICU(){
  var ct=document.getElementById('icu-content');
  if(!ct)return;
  if(showingRef){renderRef();return;}
  if(editingId){renderForm();return;}

  var vaCounts={TOT:0,'TQT-AA':0,'TQT-O2':0,'TQT-VM':0,'TQT-P':0,'RE-MFR':0,'RE-MFV':0,VNI:0,HFNC:0,RPPI:0};
  patients.forEach(function(p){
    var v=p.tipoVia;
    if(v==='TOT'||v==='TNT'||v==='ML')vaCounts.TOT++;
    else if(v==='TQT-AA')vaCounts['TQT-AA']++;
    else if(v==='TQT-O2')vaCounts['TQT-O2']++;
    else if(v==='TQT-VM')vaCounts['TQT-VM']++;
    else if(v==='TQT-P')vaCounts['TQT-P']++;
    else if(v==='RE-MFR')vaCounts['RE-MFR']++;
    else if(v==='RE-MFV')vaCounts['RE-MFV']++;
    else if(v==='VNI')vaCounts.VNI++;
    else if(v==='HFNC')vaCounts.HFNC++;
    else if(v==='RPPI')vaCounts.RPPI++;
  });
  var vaBadgeStyles={TOT:'background:rgba(248,113,113,.15);color:#f87171;border-color:rgba(248,113,113,.3)','TQT-AA':'background:rgba(192,132,252,.12);color:#c084fc;border-color:rgba(192,132,252,.3)','TQT-O2':'background:rgba(147,197,253,.15);color:#93c5fd;border-color:rgba(147,197,253,.3)','TQT-VM':'background:rgba(192,132,252,.2);color:#c084fc;border-color:rgba(192,132,252,.4)','TQT-P':'background:rgba(251,191,36,.15);color:#fbbf24;border-color:rgba(251,191,36,.3)','RE-MFR':'background:rgba(74,222,128,.15);color:#4ade80;border-color:rgba(74,222,128,.3)','RE-MFV':'background:rgba(96,165,250,.15);color:#60a5fa;border-color:rgba(96,165,250,.3)',VNI:'background:rgba(250,204,21,.15);color:#facc15;border-color:rgba(250,204,21,.3)',HFNC:'background:rgba(34,211,238,.15);color:#22d3ee;border-color:rgba(34,211,238,.3)',RPPI:'background:rgba(251,146,60,.15);color:#fb923c;border-color:rgba(251,146,60,.3)'};
  var vaLabels={TOT:'TOT','TQT-AA':'TQT-AA','TQT-O2':'TQT-O2','TQT-VM':'TQT-VM','TQT-P':'TQT-P','RE-MFR':'MFR','RE-MFV':'Venturi',VNI:'VNI',HFNC:'HFNC',RPPI:'RPPI'};

  var h='<div class="icu-hdr glass2">';
  h+='<div class="icu-hdr-left">';
  h+='<div class="icu-hdr-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:28px;height:28px"><path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg></div>';
  h+='<div><div style="font-size:20px;font-weight:800;color:var(--silver-l);letter-spacing:-.5px">Pacientes</div>';
  h+='<div style="font-size:12px;color:var(--w40)"><b style="color:var(--silver-l)">'+patients.length+'</b> paciente(s) ativo(s)</div></div>';
  h+='</div>';
  h+='<div class="icu-hdr-right">';
  if(trashPatients.length)h+='<button class="icu-trash-btn" onclick="event.stopPropagation();ICU.showTrash()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:16px;height:16px"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg> Lixeira <span class="icu-trash-count">'+trashPatients.length+'</span></button>';
  h+='<button class="icu-ref-btn glow-hover" onclick="event.stopPropagation();ICU.showRef()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> Ref.</button>';
  h+='<button class="icu-add-btn2" onclick="event.stopPropagation();ICU.addPatient()"'+(patients.length>=MAX_PATIENTS?' disabled':'')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px"><path d="M12 4.5v15m7.5-7.5h-15"/></svg> Adicionar</button>';
  h+='</div></div>';

  // Badges via aerea (especifico por tipo)
  if(patients.length){
    h+='<div class="icu-va-badges">';
    ['TOT','TQT-AA','TQT-O2','TQT-VM','TQT-P','RE-MFR','RE-MFV','VNI','HFNC','RPPI'].forEach(function(k){
      if(vaCounts[k]>0)h+='<span class="icu-va-badge" style="'+vaBadgeStyles[k]+'">'+vaLabels[k]+' '+vaCounts[k]+'</span>';
    });
    h+='</div>';
  }

  if(!patients.length){
    h+='<div class="icu-empty glass2"><p style="color:var(--w50);font-size:13px">Nenhum paciente registrado</p><p style="color:var(--w30);font-size:11px;margin-top:6px">Clique em "Adicionar" para comecar</p></div>';
  }else{
    h+='<div class="icu-list" style="display:flex;flex-direction:column;gap:3px">';
    patients.forEach(function(p,i){
      var diasTOT=(p.tipoVia==='TOT'||p.tipoVia==='TNT')?calcDias(p.dataTOT):0;
      var diasTQT=p.tipoVia&&p.tipoVia.startsWith('TQT')?calcDias(p.dataTQT):0;
      var viaCor=(p.tipoVia==='TOT'||p.tipoVia==='TNT')?'#f87171':p.tipoVia&&p.tipoVia.startsWith('TQT')?'#c084fc':p.tipoVia&&p.tipoVia.startsWith('RE')?'#4ade80':(p.tipoVia==='VNI'||p.tipoVia==='HFNC'||p.tipoVia==='RPPI')?'#facc15':'#60a5fa';

      h+='<div class="icu-pcard glass2" onclick="ICU.editPatient(\''+p.id+'\')" style="cursor:pointer;padding:4px 8px;border-radius:8px;min-height:0;border:1px solid rgba(255,255,255,.06)">';
      h+='<div class="icu-pcard-row" style="display:flex;align-items:center;gap:4px">';
      h+='<div class="icu-pcard-arrows" style="display:flex;flex-direction:column;gap:0"><button type="button" onclick="event.stopPropagation();ICU.movePatient('+i+',-1)"'+(i===0?' disabled':'')+' class="icu-arr" style="min-height:0;height:auto;padding:0;line-height:1;font-size:10px;background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer">&uarr;</button><button type="button" onclick="event.stopPropagation();ICU.movePatient('+i+',1)"'+(i===patients.length-1?' disabled':'')+' class="icu-arr" style="min-height:0;height:auto;padding:0;line-height:1;font-size:10px;background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer">&darr;</button></div>';
      h+='<div class="icu-pcard-leito" style="min-width:26px;width:26px;height:26px;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(255,255,255,.06);color:var(--silver-l);flex-shrink:0">'+(p.leito||'--')+'</div>';
      h+='<div class="icu-pcard-info" style="flex:1;min-width:0">';
      h+='<div class="icu-pcard-top" style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;min-height:0">';
      if(p.idade)h+='<span class="icu-pcard-age" style="font-size:8px;padding:1px 3px;border-radius:4px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.4)">'+p.idade+'a</span>';
      h+='<span class="icu-pcard-name" style="font-size:10px;font-weight:700;color:var(--silver-l);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0">'+(p.nome?p.nome.toUpperCase():'SEM NOME')+'</span>';
      h+='<div class="icu-pcard-badges" style="display:flex;gap:2px;flex-wrap:wrap;align-items:center">';
      if(p.tipoVia)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px;background:'+viaCor+'22;color:'+viaCor+';border:1px solid '+viaCor+'44">'+p.tipoVia+'</span>';
      if(diasTOT)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px;background:rgba(251,191,36,.12);color:#fbbf24;border:1px solid rgba(251,191,36,.3)">D'+diasTOT+' TOT</span>';
      if(diasTQT)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px;background:rgba(192,132,252,.12);color:#c084fc;border:1px solid rgba(192,132,252,.3)">D'+diasTQT+' TQT</span>';
      h+='</div>';
      h+='<div class="icu-pcard-acts" style="display:flex;gap:2px;align-items:center;margin-left:auto">';
      h+='<button onclick="event.stopPropagation();ICU.deletePatient(\''+p.id+'\')" class="icu-act-btn icu-del-btn" title="Excluir" style="width:20px;height:20px;min-width:20px;min-height:20px;padding:0;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg></button>';
      h+='<button onclick="event.stopPropagation();ICU.editPatient(\''+p.id+'\')" class="icu-act-btn" title="Abrir" style="width:20px;height:20px;min-width:20px;min-height:20px;padding:0;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg></button>';
      h+='</div></div>';
      if(p.diagnostico)h+='<div class="icu-pcard-diag" style="font-size:8px;color:rgba(255,255,255,.4);margin-top:2px;white-space:normal;word-break:break-word;line-height:1.2">'+p.diagnostico+'</div>';
      h+='</div>';
      h+='</div></div>';
    });
    h+='</div>';
  }
  ct.innerHTML=h;
}

function renderForm(){
  var ct=document.getElementById('icu-content');
  var p=patients.find(function(x){return x.id===editingId;});
  if(!p){editingId=null;renderICU();return;}
  var g=calcGlasgow(p.glasgowO,p.glasgowV,p.glasgowM);
  var pesoIdeal=calcPesoIdeal(p.altura,p.sexo);
  var dp=calcDP(p.pplato,p.peep);
  var cest=calcCest(p.vt,dp);
  var resist=calcResist(p.ppico,p.pplato,p.fluxo);
  var pf=calcPF(p.gasoPaO2,p.gasoFiO2||p.fio2);
  var gasoAnalise=analisarGaso(p);
  var diasTOT=calcDias(p.dataTOT);
  var diasTQT=calcDias(p.dataTQT);

  var h='<div class="icu-form">';
  h+='<div class="icu-form-head"><button class="tbtn icu-back-btn" onclick="ICU.closeForm()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="m15 18-6-6 6-6"/></svg><span>Voltar</span></button><span class="icu-form-title">Leito '+(p.leito||'--')+' - '+(p.nome||'Novo Paciente')+'</span><button class="icu-save-btn" onclick="ICU.saveAndClose()">Salvar</button></div>';

  // TABS
  var tabs=[{id:'dados',label:'Dados',icon:'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0'},{id:'neuro',label:'Neuro',icon:'M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7zM9 21v-1h6v1a1 1 0 01-1 1h-4a1 1 0 01-1-1z'},{id:'cardio',label:'Cardio',icon:'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'},{id:'resp',label:'Resp',icon:'M7.5 3.5C5 3.5 3 6 3 9c0 4 3.5 7.5 9 12.5 5.5-5 9-8.5 9-12.5 0-3-2-5.5-4.5-5.5-1.5 0-2.8.8-3.5 2-.7-1.2-2-2-3.5-2z'},{id:'motora',label:'Motora',icon:'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'},{id:'percepcao',label:'Pend.',icon:'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z'}];
  h+='<div class="icu-tabs">';
  tabs.forEach(function(t){
    h+='<button class="icu-tab'+(formTab===t.id?' active':'')+'" onclick="ICU.setTab(\''+t.id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:16px;height:16px"><path d="'+t.icon+'"/></svg> '+t.label+'</button>';
  });
  h+='</div>';

  h+='<div class="icu-tab-content">';

  if(formTab==='dados'){
    h+='<div class="icu-divider">Identificacao / Antropometria</div>';
    h+='<div class="icu-row icu-row-dados-inline icu-row-id">';
    h+='<div class="icu-field icu-field-nome"><label>Nome *</label><input type="text" class="icu-input-compact" value="'+(p.nome||'')+'" placeholder="Nome" onchange="ICU.set(\'nome\',this.value)" onblur="ICU.saveField()"/></div>';
    h+='<div class="icu-field icu-field-leito"><label>Leito</label><input type="text" value="'+(p.leito||'')+'" placeholder="01" onchange="ICU.set(\'leito\',this.value)" onblur="ICU.saveField()"/></div>';
    h+='<div class="icu-field icu-field-status"><label>Status</label><select onchange="ICU.set(\'statusClinico\',this.value);ICU.saveField()">'+opts([['','--'],['estavel','Estavel'],['grave','Grave'],['critico','Critico'],['instavel','Instavel']],p.statusClinico)+'</select></div>';
    h+='<div class="icu-field icu-field-idade"><label>Idade</label><input type="number" value="'+(p.idade||'')+'" placeholder="45" onchange="ICU.set(\'idade\',this.value)" onblur="ICU.saveField()"/></div>';
    h+='<div class="icu-field icu-field-sexo"><label>Sexo</label><select onchange="ICU.setR(\'sexo\',this.value)">'+opts([['','--'],['M','M'],['F','F']],p.sexo)+'</select></div>';
    h+='<div class="icu-field icu-field-peso"><label>Peso</label><input type="number" value="'+(p.peso||'')+'" placeholder="70" onchange="ICU.set(\'peso\',this.value)" onblur="ICU.saveField()"/></div>';
    h+='<div class="icu-field icu-field-altura"><label>Alt (cm)</label><input type="number" value="'+(p.altura||'')+'" placeholder="170" onchange="ICU.setR(\'altura\',this.value)"/></div>';
    h+='<div class="icu-field icu-field-peso-atual"><label>P.Atual</label><input type="number" value="'+(p.pesoAtual||'')+'" placeholder="-" onchange="ICU.set(\'pesoAtual\',this.value)" onblur="ICU.saveField()"/></div>';
    h+='<div class="icu-field icu-field-predito"><label>P.Pred</label><div class="icu-calc-val icu-calc-compact">'+(pesoIdeal?'<b>'+pesoIdeal.toFixed(1)+' kg</b>':'<span style="color:var(--w30)">sexo+alt</span>')+'</div></div>';
    h+='</div>';
    var bh24=parseFloat(p.balanco24h),bhAc=parseFloat(p.balancoAcumulado);
    var bhMsg='',bhCor='#60a5fa',bhRecomend='';
    if(!isNaN(bh24)||!isNaN(bhAc)){
      if(!isNaN(bh24)){
        if(bh24>2000){bhMsg='24h muito positivo - risco congestao/edema';bhCor='#f87171';bhRecomend='Considerar diuretico, restricao hidrica e avaliar funcao renal/cardíaca.';}
        else if(bh24>1000){bhMsg='24h positivo - risco retencao';bhCor='#f87171';bhRecomend='Avaliar peso, diurese e necessidade de diuretico.';}
        else if(bh24>500){bhMsg='24h levemente positivo';bhCor='#facc15';bhRecomend='Manter monitoracao.';}
        else if(bh24>=-500){bhMsg='Balanco 24h equilibrado';bhCor='#4ade80';}
        else if(bh24>=-1000){bhMsg='24h negativo - avaliar perdas e ingesta';bhCor='#facc15';bhRecomend='Verificar diurese, drenos, perdas insensíveis e oferta.';}
        else{bhMsg='24h muito negativo - risco desidratacao/hipovolemia';bhCor='#f87171';bhRecomend='Avaliar reposicao volêmica, causa das perdas e estado hemodinamico.';}
      }
      if(!isNaN(bhAc)){
        if(bhAc>5000){bhMsg+=(bhMsg?' | ':'')+'Acum. muito elevado';bhCor='#f87171';bhRecomend=(bhRecomend?bhRecomend+' ':'')+'Acumulado alto: considerar diuretico de alça e/ou ultrafiltracao.';}
        else if(bhAc>3000){bhMsg+=(bhMsg?' | ':'')+'Acum. elevado';if(bhCor!=='#f87171')bhCor='#facc15';bhRecomend=(bhRecomend?bhRecomend+' ':'')+'Considerar diuretico conforme funcao renal.';}
        else if(bhAc<-2000){bhMsg+=(bhMsg?' | ':'')+'Acum. negativo';if(bhCor!=='#f87171')bhCor='#facc15';bhRecomend=(bhRecomend?bhRecomend+' ':'')+'Avaliar estado volêmico e reposicao.';}
      }
    }
    if(pesoIdeal){
      var vc4=(pesoIdeal*4).toFixed(0),vc5=(pesoIdeal*5).toFixed(0),vc6=(pesoIdeal*6).toFixed(0),vc7=(pesoIdeal*7).toFixed(0),vc8=(pesoIdeal*8).toFixed(0);
      h+='<div class="icu-calc-card icu-vc-compact" style="margin-top:8px;border-color:rgba(96,165,250,.25);background:rgba(96,165,250,.06)">';
      h+='<div class="icu-vc-inner">';
      h+='<div class="icu-vc-left"><div class="icu-vc-title">VC Peso Pred. ('+pesoIdeal.toFixed(1)+' kg)</div>';
      h+='<div class="icu-vc-pills">';
      h+='<div class="icu-vc-pill"><span>4</span><b>'+vc4+'</b></div>';
      h+='<div class="icu-vc-pill"><span>5</span><b>'+vc5+'</b></div>';
      h+='<div class="icu-vc-pill icu-vc-pill-6"><span>6</span><b>'+vc6+'</b></div>';
      h+='<div class="icu-vc-pill"><span>7</span><b>'+vc7+'</b></div>';
      h+='<div class="icu-vc-pill"><span>8</span><b>'+vc8+'</b></div>';
      h+='</div></div>';
      h+='<div class="icu-vc-right">';
      h+='<div class="icu-field icu-field-bal"><label>Bal.Acum</label><input type="number" value="'+(p.balancoAcumulado||'')+'" placeholder="+2500" onchange="ICU.setR(\'balancoAcumulado\',this.value)"/></div>';
      h+='<div class="icu-field icu-field-bal"><label>Bal. 24H</label><input type="number" value="'+(p.balanco24h||'')+'" placeholder="+500" onchange="ICU.setR(\'balanco24h\',this.value)"/></div>';
      if(bhMsg)h+='<div class="icu-bal-eval icu-bal-eval-inline" style="border-color:'+bhCor+'30;background:'+bhCor+'08"><span style="color:'+bhCor+'">'+bhMsg+'</span></div>';
      if(bhRecomend)h+='<div class="icu-bal-recomend" style="margin-top:6px;font-size:9px;color:var(--w50);line-height:1.4;padding:6px;border-radius:6px;background:var(--w02);border:1px solid var(--gb)">'+bhRecomend+'</div>';
      h+='</div></div></div>';
    }else{
      h+='<div class="icu-row icu-row-balance">';
      h+='<div class="icu-field icu-field-bal"><label>Bal.Acum</label><input type="number" value="'+(p.balancoAcumulado||'')+'" placeholder="+2500" onchange="ICU.setR(\'balancoAcumulado\',this.value)"/></div>';
      h+='<div class="icu-field icu-field-bal"><label>Bal. 24H</label><input type="number" value="'+(p.balanco24h||'')+'" placeholder="+500" onchange="ICU.setR(\'balanco24h\',this.value)"/></div>';
      if(bhMsg)h+='<div class="icu-bal-eval" style="border-color:'+bhCor+'30;background:'+bhCor+'08"><span style="color:'+bhCor+'">'+bhMsg+'</span></div>';
      if(bhRecomend)h+='<div class="icu-bal-recomend" style="margin-top:6px;font-size:9px;color:var(--w50);line-height:1.4;padding:6px;border-radius:6px;background:var(--w02)">'+bhRecomend+'</div>';
      h+='</div>';
    }

    h+='<div class="icu-divider">Hist. Clinica / Diagnostico</div>';
    h+=tarea('Historia Clinica','historia',p.historia);
    h+=tarea('Diagnostico','diagnostico',p.diagnostico);

    // EXAMES LABORATORIAIS
    h+='<div class="icu-divider icu-divider-exam">Exames Laboratoriais</div>';
    h+='<button class="icu-add-exam-btn" onclick="ICU.addExame()">+ Novo Exame</button>';
    var exList=p.examesLabList||[];
    if(exList.length===0){
      h+='<div class="icu-empty-exam">Nenhum exame registrado</div>';
    }else{
      exList.forEach(function(ex,ei){
        h+='<div class="icu-exam-card">';
        h+='<div class="icu-exam-head">';
        h+='<div class="icu-field icu-field-date"><label>Data</label><input type="date" class="icu-date-compact" value="'+(ex.data||'')+'" onchange="ICU.setExame('+ei+',\'data\',this.value)"/></div>';
        h+='<button class="icu-act-btn icu-del-btn" onclick="ICU.delExame('+ei+')" title="Remover" style="margin-left:auto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M6 18L18 6M6 6l12 12"/></svg></button>';
        h+='</div>';
        h+='<div class="icu-exam-grid">';
        var labs=[{k:'hb',l:'HB',u:'g/dL',ref:'12-17'},{k:'ht',l:'HT',u:'%',ref:'36-50'},{k:'leuco',l:'Leuco',u:'/mm3',ref:'4k-11k'},{k:'plaq',l:'Plaq',u:'x10³',ref:'150-400'},{k:'creat',l:'Creat',u:'mg/dL',ref:'0.6-1.2'},{k:'ureia',l:'Ureia',u:'mg/dL',ref:'15-40'},{k:'k',l:'K+',u:'mEq/L',ref:'3.5-5.0'},{k:'na',l:'Na+',u:'mEq/L',ref:'135-145'},{k:'lac',l:'Lac',u:'mmol/L',ref:'<2.0'},{k:'pcr',l:'PCR',u:'mg/L',ref:'<5'},{k:'bt',l:'BT',u:'mg/dL',ref:'<1.2'},{k:'alb',l:'Alb',u:'g/dL',ref:'3.5-5.0'},{k:'tgo',l:'TGO',u:'U/L',ref:'<40'},{k:'tgp',l:'TGP',u:'U/L',ref:'<41'},{k:'inr',l:'INR',u:'',ref:'0.8-1.2'}];
        labs.forEach(function(lb){
          h+='<div class="icu-exam-field">';
          h+='<label>'+lb.l+'</label>';
          h+='<input type="text" value="'+(ex[lb.k]||'')+'" placeholder="'+lb.ref+'" onchange="ICU.setExame('+ei+',\''+lb.k+'\',this.value)"/>';
          if(lb.u)h+='<span class="icu-exam-unit">'+lb.u+'</span>';
          h+='</div>';
        });
        h+='</div>';
        var labAnalise=analisarExameLab(ex);
        if(labAnalise.items.length>0){
          h+='<div class="icu-lab-analise" style="margin-top:8px;padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:10px">';
          h+='<div style="font-weight:700;color:var(--silver-l);margin-bottom:6px">Análise automática</div>';
          labAnalise.items.forEach(function(it){
            h+='<span style="margin-right:8px;margin-bottom:4px;display:inline-block"><span style="color:var(--w50)">'+it.label+'</span> <b style="color:'+it.cor+'">'+it.interp+'</b></span>';
          });
          if(labAnalise.alertas.length>0){
            h+='<div style="margin-top:8px;padding:6px;border-radius:6px;background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.2)">';
            labAnalise.alertas.forEach(function(a){h+='<div style="color:'+a.c+';font-weight:600">'+a.t+'</div>';});
            h+='</div>';
          }
          h+='</div>';
        }
        h+='</div>';
      });
    }

    h+='<div class="icu-divider">Exames de Imagem</div>';
    h+='<button class="icu-add-exam-btn" onclick="ICU.addExameImagem()">+ Novo Exame Imagem</button>';
    var imgList=p.examesImagemList||[];
    if(imgList.length===0){
      h+='<div class="icu-empty-exam">Nenhum exame de imagem registrado</div>';
    }else{
      imgList.forEach(function(img,ii){
        h+='<div class="icu-exam-card icu-img-card">';
        h+='<div class="icu-exam-head">';
        h+='<div class="icu-field icu-field-date"><label>Data</label><input type="date" class="icu-date-compact" value="'+(img.data||'')+'" onchange="ICU.setExameImagem('+ii+',\'data\',this.value)"/></div>';
        h+='<div class="icu-field icu-field-tipo"><label>Tipo</label><select onchange="ICU.setExameImagem('+ii+',\'tipo\',this.value)">'+opts([['','Selecionar'],['RX Torax','RX Tórax'],['RX Abdome','RX Abdome'],['TC Cranio','TC Crânio'],['TC Torax','TC Tórax'],['TC Abdome','TC Abdome'],['RM Cranio','RM Crânio'],['RM Coluna','RM Coluna'],['USG Abdome','USG Abdome'],['USG Venosa','USG Venosa'],['ECO','Eco'],['Ecodoppler','Ecodoppler'],['Cintilografia','Cintilografia'],['AngioTC','AngioTC'],['Outro','Outro']],img.tipo||'')+'</select></div>';
        h+='<button class="icu-act-btn icu-del-btn" onclick="ICU.delExameImagem('+ii+')" title="Remover"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M6 18L18 6M6 6l12 12"/></svg></button>';
        h+='</div>';
        h+='<div class="icu-field"><label>Laudo / Achados</label><textarea rows="1" class="icu-textarea-compact icu-img-laudo" style="min-height:32px" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'" onchange="ICU.setExameImagem('+ii+',\'laudo\',this.value)" onblur="ICU.saveField()" placeholder="Achados...">'+(img.laudo||'')+'</textarea></div>';
        h+='</div>';
      });
    }
  }

  if(formTab==='neuro'){
    h+='<div class="icu-divider">Avaliacao neurologica - Glasgow</div>';
    h+='<div class="icu-row icu-row-neuro-top">';
    h+='<div class="icu-field icu-field-neuro"><label>O</label><select onchange="ICU.setR(\'glasgowO\',this.value)">'+opts([['','--'],['4','4'],['3','3'],['2','2'],['1','1']],p.glasgowO)+'</select></div>';
    h+='<div class="icu-field icu-field-neuro"><label>V</label><select onchange="ICU.setR(\'glasgowV\',this.value)">'+opts([['','--'],['5','5'],['4','4'],['3','3'],['2','2'],['1','1'],['T','T']],p.glasgowV)+'</select></div>';
    h+='<div class="icu-field icu-field-neuro"><label>M</label><select onchange="ICU.setR(\'glasgowM\',this.value)">'+opts([['','--'],['6','6'],['5','5'],['4','4'],['3','3'],['2','2'],['1','1']],p.glasgowM)+'</select></div>';
    h+='<div class="icu-field icu-field-neuro"><label>RASS</label><select onchange="ICU.set(\'rass\',this.value);ICU.saveField()">'+opts([['','--'],['+4','+4'],['+3','+3'],['+2','+2'],['+1','+1'],['0','0'],['-1','-1'],['-2','-2'],['-3','-3'],['-4','-4'],['-5','-5']],p.rass)+'</select></div>';
    h+='<div class="icu-field icu-field-neuro"><label>Meta RASS</label><select onchange="ICU.set(\'metaRASS\',this.value);ICU.saveField()">'+opts([['','--'],['-1','-1'],['-2','-2'],['-3','-3'],['-4','-4'],['-5','-5'],['0','0']],p.metaRASS)+'</select></div>';
    h+='<div class="icu-field icu-field-neuro"><label>Meta TOF</label><select onchange="ICU.set(\'metaTOF\',this.value);ICU.saveField()">'+opts([['','--'],['0/4','0/4'],['1/4','1/4'],['2/4','2/4'],['3/4','3/4'],['4/4','4/4']],p.metaTOF)+'</select></div>';
    h+='<div class="icu-field icu-field-neuro"><label>Ult. TOF</label><select onchange="ICU.set(\'ultimoTOF\',this.value);ICU.saveField()">'+opts([['','--'],['0/4','0/4'],['1/4','1/4'],['2/4','2/4'],['3/4','3/4'],['4/4','4/4']],p.ultimoTOF)+'</select></div>';
    h+='</div>';
    if(g.total)h+='<div class="icu-calc-card icu-calc-compact-row" style="border-color:'+g.cor+'30;background:'+g.cor+'08;margin-top:4px;padding:4px 8px"><div class="icu-calc-row"><span>Glasgow:</span><b style="color:'+g.cor+'">'+g.total+' - '+g.interp+'</b></div></div>';

    var rassVal=(p.rass!==undefined&&p.rass!==''),metaRASS=(p.metaRASS!==undefined&&p.metaRASS!==''),tofVal=(p.ultimoTOF!==undefined&&p.ultimoTOF!==''),metaTOF=(p.metaTOF!==undefined&&p.metaTOF!=='');
    var neuroAnalise=[];
    if(rassVal&&metaRASS){var rn=parseInt(p.rass,10),mn=parseInt(p.metaRASS,10);if(!isNaN(rn)&&!isNaN(mn)){if(rn>mn)neuroAnalise.push({txt:'RASS '+p.rass+' acima da meta '+p.metaRASS+' - paciente mais acordado que alvo',cor:'#facc15'});else if(rn<mn)neuroAnalise.push({txt:'RASS '+p.rass+' abaixo da meta - sedacao mais profunda',cor:'#60a5fa'});else neuroAnalise.push({txt:'RASS na meta',cor:'#4ade80'});}}
    if(tofVal&&metaTOF){var tofN=parseInt((p.ultimoTOF||'0').split('/')[0],10),metaN=parseInt((p.metaTOF||'0').split('/')[0],10);if(!isNaN(tofN)&&!isNaN(metaN)){if(tofN<metaN)neuroAnalise.push({txt:'TOF '+p.ultimoTOF+' abaixo da meta '+p.metaTOF+' - avaliar bloqueio residual antes de extubar',cor:'#f87171'});else neuroAnalise.push({txt:'TOF adequado para meta',cor:'#4ade80'});}}
    var bnms=p.bnmList||[];if(bnms.length>0){var emUso=bnms.filter(function(b){return parseFloat(b.atual)>0;});if(emUso.length>0)neuroAnalise.push({txt:'BNM em uso: '+emUso.map(function(b){return b.droga;}).join(', ')+' - manter monitorizacao TOF',cor:'#fb923c'});}
    var seds=p.sedativos||[];if(seds.length>0){var sedAtivos=seds.filter(function(s){return s.droga;});if(sedAtivos.length>0)neuroAnalise.push({txt:'Sedativos: '+sedAtivos.map(function(s){return s.droga;}).join(', ')+' - avaliar profundidade e interacao',cor:'#60a5fa'});}
    if(neuroAnalise.length>0){h+='<div class="icu-calc-card" style="border-color:rgba(168,85,247,.25);background:rgba(168,85,247,.06);padding:10px;margin-top:8px"><div style="font-size:10px;font-weight:700;color:#a855f7;margin-bottom:6px">Análise Neuro / BNM</div>';neuroAnalise.forEach(function(a){h+='<div style="font-size:10px;color:'+a.cor+';padding:2px 0">'+a.txt+'</div>';});h+='</div>';}

    h+='<div class="icu-divider">Observacoes neurologicas</div>';
    h+=tarea('Observacoes','neurologico',p.neurologico);

    h+='<div class="icu-row icu-row-neuro-btns">';
    var sedDrogas=['Midazolam','Propofol','Dexmedetomidina','Fentanil','Ketamina','Remifentanil','Sufentanil','Morfina','Precedex','Etomidato'];
    h+='<button class="icu-add-exam-btn" onclick="ICU.addSedativo()">+ Medicamento</button>';
    h+='<button class="icu-add-exam-btn icu-add-bnm-btn" onclick="ICU.addBNM()">+ BNM</button>';
    h+='</div>';
    var seds=p.sedativos||[];
    if(seds.length===0){
      h+='<div style="text-align:center;padding:12px;color:var(--w30);font-size:11px">Nenhum sedativo em uso</div>';
    }else{
      seds.forEach(function(s,si){
        h+='<div class="icu-drug-card">';
        h+='<div class="icu-drug-head">';
        h+='<div class="icu-field"><label>Medicamento</label><select onchange="ICU.setSedativo('+si+',\'droga\',this.value)">'+opts([['','Selecionar']].concat(sedDrogas.map(function(d){return[d,d];})),s.droga)+'</select></div>';
        h+='<button class="icu-act-btn icu-del-btn" onclick="ICU.delSedativo('+si+')" title="Remover" style="align-self:flex-end"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M6 18L18 6M6 6l12 12"/></svg></button>';
        h+='</div>';
        h+='<div class="icu-row" style="margin-top:8px">';
        h+='<div class="icu-field icu-field-fix"><label>Inicio Plantao</label><input type="text" value="'+(s.inicio||'')+'" placeholder="ml/h" onchange="ICU.setSedativo('+si+',\'inicio\',this.value)"/></div>';
        h+='<div class="icu-field icu-field-fix"><label>Atual</label><input type="text" value="'+(s.atual||'')+'" placeholder="ml/h" onchange="ICU.setSedativo('+si+',\'atual\',this.value)"/></div>';
        h+='<div class="icu-field"><label>Unidade</label><select onchange="ICU.setSedativo('+si+',\'unidade\',this.value)">'+opts([['ml/h','ml/h'],['mcg/kg/min','mcg/kg/min'],['mcg/kg/h','mcg/kg/h'],['mg/h','mg/h'],['mg/kg/h','mg/kg/h']],s.unidade||'ml/h')+'</select></div>';
        h+='</div>';
        if(s.droga&&s.atual){
          var acao=parseFloat(s.atual)>0?'Em uso':'Desligado';
          var acaoCor=parseFloat(s.atual)>0?'#60a5fa':'#f87171';
          h+='<div style="margin-top:6px;font-size:10px;font-weight:700;color:'+acaoCor+'">'+s.droga+' - '+acao+' ('+s.atual+' '+(s.unidade||'ml/h')+')</div>';
        }
        h+='</div>';
      });
    }

    var bnmDrogas=['Cisatracurio','Rocuronio','Pancuronio','Atracurio','Succinilcolina','Vecuronio'];
    var bnms=p.bnmList||[];
    if(bnms.length===0){
      h+='<div style="text-align:center;padding:12px;color:var(--w30);font-size:11px">Nenhum BNM em uso</div>';
    }else{
      bnms.forEach(function(b,bi){
        h+='<div class="icu-drug-card">';
        h+='<div class="icu-drug-head">';
        h+='<div class="icu-field"><label>Medicamento</label><select onchange="ICU.setBNM('+bi+',\'droga\',this.value)">'+opts([['','Selecionar']].concat(bnmDrogas.map(function(d){return[d,d];})),b.droga)+'</select></div>';
        h+='<button class="icu-act-btn icu-del-btn" onclick="ICU.delBNM('+bi+')" title="Remover" style="align-self:flex-end"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M6 18L18 6M6 6l12 12"/></svg></button>';
        h+='</div>';
        h+='<div class="icu-row" style="margin-top:8px">';
        h+='<div class="icu-field icu-field-fix"><label>Inicio Plantao</label><input type="text" value="'+(b.inicio||'')+'" placeholder="ml/h" onchange="ICU.setBNM('+bi+',\'inicio\',this.value)"/></div>';
        h+='<div class="icu-field icu-field-fix"><label>Atual</label><input type="text" value="'+(b.atual||'')+'" placeholder="ml/h" onchange="ICU.setBNM('+bi+',\'atual\',this.value)"/></div>';
        h+='<div class="icu-field"><label>Unidade</label><select onchange="ICU.setBNM('+bi+',\'unidade\',this.value)">'+opts([['ml/h','ml/h'],['mcg/kg/min','mcg/kg/min'],['mcg/kg/h','mcg/kg/h'],['mg/h','mg/h']],b.unidade||'ml/h')+'</select></div>';
        h+='</div>';
        if(b.droga&&b.atual){
          var acao=parseFloat(b.atual)>0?'Em uso':'Desligado';
          var acaoCor=parseFloat(b.atual)>0?'#60a5fa':'#f87171';
          h+='<div style="margin-top:6px;font-size:10px;font-weight:700;color:'+acaoCor+'">'+b.droga+' - '+acao+' ('+b.atual+' '+(b.unidade||'ml/h')+')</div>';
        }
        if(b.droga&&parseFloat(b.atual)>0){
          h+='<div style="margin-top:6px"><button class="icu-add-exam-btn" style="background:rgba(248,113,113,.08);border-color:rgba(248,113,113,.2);color:#f87171;font-size:10px;padding:4px 10px" onclick="ICU.setBNM('+bi+',\'atual\',\'0\')">Desligar</button></div>';
        }
        h+='</div>';
      });
    }
  }

  if(formTab==='cardio'){
    h+='<div class="icu-divider">Parametros Hemodinamicos e DVA</div>';
    h+='<div class="icu-row icu-row-cardio-one">';
    h+=field('PAS (mmHg)','pas',p.pas,'number','120');
    h+=field('PAD (mmHg)','pad',p.pad,'number','80');
    h+=field('PAM (mmHg)','pam',p.pam,'number','85');
    h+=field('FC (bpm)','fc',p.fc,'number','80');
    h+=field('Lactato','lactatoCardio',p.lactatoCardio,'number','1.2');
    h+='<div class="icu-field icu-field-mudanca"><label>Mudanca Hemodinamica</label><select onchange="ICU.set(\'cardiovascularMudanca\',this.value);ICU.saveField()">'+opts([['','--'],['estavel','Estavel'],['reducao_dva','Reducao DVA'],['inicio_dva','Inicio DVA'],['piora','Piora']],p.cardiovascularMudanca)+'</select></div>';
    h+='<div class="icu-field icu-field-dva-btn"><label>&nbsp;</label><button type="button" class="icu-add-exam-btn icu-btn-dva" onclick="ICU.addDVA()">+ DVA</button></div>';
    h+='</div>';

    // PAM auto
    if(p.pas&&p.pad){
      var pamCalc=Math.round((parseFloat(p.pad)*2+parseFloat(p.pas))/3);
      if(!isNaN(pamCalc))h+='<div class="icu-calc-card" style="border-color:'+(pamCalc<65?'#f8717130':pamCalc>100?'#facc1530':'#4ade8030')+';background:'+(pamCalc<65?'#f8717108':pamCalc>100?'#facc1508':'#4ade8008')+'"><div class="icu-calc-row"><span>PAM Calculada:</span><b style="color:'+(pamCalc<65?'#f87171':pamCalc>100?'#facc15':'#4ade80')+'">'+pamCalc+' mmHg'+(pamCalc<65?' - HIPOTENSAO':pamCalc>100?' - Elevada':' - Adequada')+'</b></div></div>';
    }

    // DVA
    h+='<div class="icu-divider-sub">Drogas Vasoativas (DVA)</div>';
    var dvaDrogas=['Noradrenalina','Adrenalina','Vasopressina','Dobutamina','Dopamina','Milrinona','Levosimendan','Fenilefrina','Nitroprussiato','Nitroglicerina'];
    var dvas=p.dvaList||[];
    if(dvas.length===0){
      h+='<div style="text-align:center;padding:12px;color:var(--w30);font-size:11px">Nenhuma DVA em uso</div>';
    }else{
      h+='<div style="margin-bottom:4px;font-size:10px;color:var(--w40);font-weight:700">'+dvas.length+' em uso</div>';
      dvas.forEach(function(d,di){
        h+='<div class="icu-drug-card">';
        h+='<div class="icu-drug-head">';
        h+='<div class="icu-field"><label>Medicamento</label><select onchange="ICU.setDVA('+di+',\'droga\',this.value)">'+opts([['','Selecionar']].concat(dvaDrogas.map(function(dd){return[dd,dd];})),d.droga)+'</select></div>';
        h+='<button class="icu-act-btn icu-del-btn" onclick="ICU.delDVA('+di+')" title="Remover" style="align-self:flex-end"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M6 18L18 6M6 6l12 12"/></svg></button>';
        h+='</div>';
        h+='<div class="icu-row" style="margin-top:8px">';
        h+='<div class="icu-field icu-field-fix"><label>Inicio Plantao</label><input type="text" value="'+(d.inicio||'')+'" placeholder="ml/h" onchange="ICU.setDVA('+di+',\'inicio\',this.value)"/></div>';
        h+='<div class="icu-field icu-field-fix"><label>Atual</label><input type="text" value="'+(d.atual||'')+'" placeholder="ml/h" onchange="ICU.setDVA('+di+',\'atual\',this.value)"/></div>';
        h+='<div class="icu-field"><label>Unidade</label><select onchange="ICU.setDVA('+di+',\'unidade\',this.value)">'+opts([['ml/h','ml/h'],['mcg/kg/min','mcg/kg/min'],['mcg/min','mcg/min'],['mg/h','mg/h'],['UI/min','UI/min'],['UI/h','UI/h']],d.unidade||'ml/h')+'</select></div>';
        h+='</div>';
        if(d.droga&&d.atual){
          var acao=parseFloat(d.atual)>0?'Em uso':'Desligado';
          var acaoCor=parseFloat(d.atual)>0?'#60a5fa':'#f87171';
          h+='<div style="margin-top:6px;font-size:10px;font-weight:700;color:'+acaoCor+'">'+d.droga+' - '+acao+' ('+d.atual+' '+(d.unidade||'ml/h')+')</div>';
        }
        if(d.droga&&parseFloat(d.atual)>0){
          h+='<div style="margin-top:6px"><button class="icu-add-exam-btn" style="background:rgba(248,113,113,.08);border-color:rgba(248,113,113,.2);color:#f87171;font-size:10px;padding:4px 10px" onclick="ICU.setDVA('+di+',\'atual\',\'0\')">Desligar</button></div>';
        }
        h+='</div>';
      });
    }

    // Analise automatica DVA (equivalente noradrenalina + carga vasoativa)
    if(dvas.length>0){
      var analises=[];
      var equivNoradr=null;
      dvas.forEach(function(d){
        if(!d.droga)return;
        var ini=parseFloat(d.inicio)||0;
        var atu=parseFloat(d.atual)||0;
        var un=(d.unidade||'ml/h').toLowerCase();
        if(atu>0&&un==='mcg/kg/min'){
          if(equivNoradr===null)equivNoradr=0;
          if(d.droga==='Noradrenalina')equivNoradr+=atu;
          else if(d.droga==='Adrenalina')equivNoradr+=atu*0.1;
          else if(d.droga==='Dopamina')equivNoradr+=atu*0.01;
        }
        if(atu===0&&ini>0)analises.push({txt:d.droga+' DESLIGADA',cor:'#4ade80',icon:'⏹'});
        else if(atu>0&&ini===0)analises.push({txt:'Nova DVA: '+d.droga+' ('+d.atual+' '+(d.unidade||'ml/h')+')',cor:'#f87171',icon:'🆕'});
        else if(atu>ini&&ini>0)analises.push({txt:d.droga+' AUMENTOU ('+ini+' → '+atu+' '+(d.unidade||'ml/h')+')',cor:'#f87171',icon:'⬆'});
        else if(atu<ini&&atu>0)analises.push({txt:d.droga+' REDUZIU ('+ini+' → '+atu+' '+(d.unidade||'ml/h')+')',cor:'#4ade80',icon:'⬇'});
        else if(atu===ini&&atu>0)analises.push({txt:d.droga+' MANTIDA ('+atu+' '+(d.unidade||'ml/h')+')',cor:'#60a5fa',icon:'➡'});
      });
      if(analises.length>0){
        var piora=analises.some(function(a){return a.icon==='⬆'||a.icon==='🆕';});
        var melhora=analises.some(function(a){return a.icon==='⬇'||a.icon==='⏹';});
        var statusDVA=piora&&melhora?{t:'Ajuste DVA',c:'#facc15'}:piora?{t:'Piora Hemodinamica',c:'#f87171'}:melhora?{t:'Melhora Hemodinamica',c:'#4ade80'}:{t:'Estavel',c:'#60a5fa'};
        h+='<div class="icu-calc-card" style="border-color:'+statusDVA.c+'30;background:'+statusDVA.c+'08;padding:10px;margin-top:8px">';
        h+='<div style="font-size:11px;font-weight:700;color:'+statusDVA.c+';margin-bottom:6px">'+statusDVA.t+'</div>';
        analises.forEach(function(a){
          h+='<div style="font-size:10px;color:'+a.cor+';padding:2px 0">'+a.icon+' '+a.txt+'</div>';
        });
        if(equivNoradr!==null&&equivNoradr>0){
          var eqTxt='Equiv. Noradr. ~'+equivNoradr.toFixed(2)+' mcg/kg/min';
          var eqCor=equivNoradr>0.5?'#f87171':equivNoradr>0.2?'#facc15':'#4ade80';
          h+='<div style="margin-top:8px;padding:6px;border-radius:6px;background:var(--w02);font-size:10px;font-weight:700;color:'+eqCor+'">'+eqTxt+'</div>';
          if(equivNoradr>0.5)h+='<div style="font-size:9px;color:var(--w50);margin-top:4px">Carga vasoativa alta - avaliar volemia, causa do choque e considerar suporte adicional (ECMO se refratario).</div>';
        }
        var numDVA=dvas.filter(function(d){return d.droga&&parseFloat(d.atual)>0;}).length;
        if(numDVA>=2)h+='<div style="font-size:9px;color:var(--w50);margin-top:6px">'+numDVA+' DVA em uso - avaliar necessidade de todas e causa base.</div>';
        h+='</div>';
      }
    }

    h+='<div class="icu-divider">Avaliacao Cardiovascular</div>';
    h+=tarea('Avaliacao Cardiovascular','cardiovascular',p.cardiovascular);
  }

  if(formTab==='resp'){
    h+='<div class="icu-divider">Avaliacao Pulmonar / Secrecao / Via Aerea</div>';
    var viaOpts=[
      ['','Selecionar'],
      ['RE-AA','RE - Ar Ambiente'],
      ['RE-O2','RE - O2 Cateter'],
      ['RE-MFS','RE - Masc. Facial Simples'],
      ['RE-MFR','RE - Masc. c/ Reservatorio'],
      ['RE-MFV','RE - Masc. Venturi'],
      ['VNI','VNI'],
      ['HFNC','HFNC (Cateter Alto Fluxo)'],
      ['RPPI','RPPI'],
      ['TOT','TOT (Tubo Orotraqueal)'],
      ['TNT','TNT (Tubo Nasotraqueal)'],
      ['ML','ML (Mascara Laringea)'],
      ['TQT-AA','TQT - Ar Ambiente'],
      ['TQT-O2','TQT - com O2'],
      ['TQT-VM','TQT - em VM'],
      ['TQT-P','TQT - Prolong./Desmame']
    ];
    h+='<div class="icu-row icu-row-resp-one">';
    h+='<div class="icu-field icu-field-resp"><label>Aval. Pulmonar</label><textarea rows="1" class="icu-input-resp icu-textarea-resp" style="resize:none;overflow:hidden;min-height:28px" oninput="this.style.height=\'auto\';this.style.height=Math.max(28,this.scrollHeight)+\'px\';ICU.set(\'pulmonar\',this.value)" onchange="ICU.set(\'pulmonar\',this.value)" onblur="ICU.saveField()" placeholder="...">'+(p.pulmonar||'')+'</textarea></div>';
    h+='<div class="icu-field icu-field-resp"><label>Secrecao</label><textarea rows="1" class="icu-input-resp icu-textarea-resp" style="resize:none;overflow:hidden;min-height:28px" oninput="this.style.height=\'auto\';this.style.height=Math.max(28,this.scrollHeight)+\'px\';ICU.set(\'secrecao\',this.value)" onchange="ICU.set(\'secrecao\',this.value)" onblur="ICU.saveField()" placeholder="...">'+(p.secrecao||'')+'</textarea></div>';
    h+='<div class="icu-field icu-field-resp"><label>Via Aerea Atual</label><select onchange="ICU.changeVia(this.value)">'+opts(viaOpts,p.tipoVia)+'</select></div>';
    h+='</div>';

    // Data IOT, Extubou, Re-IOT, Salvar, Dias - UMA LINHA (PC e celular igual)
    if(p.tipoVia==='TOT'||p.tipoVia==='TNT'){
      var iotVal=p.dataTOT||'';
      var iotP=iotVal.split('T');
      var iotD=iotP[0]||'';
      var iotT=iotP[1]?iotP[1].substring(0,5):'';
      var iotDDisplay=iotD?(iotD.split('-')[2]||'')+'/'+(iotD.split('-')[1]||'')+'/'+(iotD.split('-')[0]||''):'';
      h+='<div class="icu-row icu-row-resp-events">';
      h+='<div class="icu-field icu-field-resp icu-iot-datetime"><label>Data IOT</label><div class="icu-iot-dt-wrap"><input type="text" class="icu-input-resp icu-iot-date" value="'+iotDDisplay+'" placeholder="DD/MM/AAAA" onchange="ICU.setIOTDt(this,\'date\')" onblur="ICU.setIOTDt(this,\'date\')"/><input type="time" value="'+iotT+'" onchange="ICU.setIOTDt(this,\'time\')" class="icu-input-resp"/></div></div>';
      h+='<div class="icu-field icu-field-resp-btn"><label>&nbsp;</label><button type="button" onclick="ICU.toggleEvt(\'showExt\')" class="icu-resp-evt-btn'+(p.showExt?' icu-resp-evt-on':'')+'">Extubou</button></div>';
      h+='<div class="icu-field icu-field-resp-btn"><label>&nbsp;</label><button type="button" onclick="ICU.toggleEvt(\'showReIOT\')" class="icu-resp-evt-btn icu-resp-evt-reiot'+(p.showReIOT?' icu-resp-evt-on':'')+'">Re-IOT</button></div>';
      h+='<div class="icu-field icu-field-resp-btn"><label>&nbsp;</label><button type="button" class="icu-small-btn icu-resp-hist-btn" onclick="ICU.saveVAHist()">Salvar</button></div>';
      h+='<div class="icu-field icu-field-resp icu-field-dias"><label>Dias</label><div class="icu-calc-val icu-input-resp" style="color:'+(diasTOT>=7?'#f87171':'var(--silver-l)')+'">D'+diasTOT+(diasTOT>=7?'!':'')+'</div></div>';
      h+='</div>';
      if(p.showExt) h+='<div class="icu-row icu-row-resp-one" style="margin-top:4px">'+field('Data Extubacao','dataExtubacao',p.dataExtubacao,'date','')+field('Hora','horaExtubacao',p.horaExtubacao,'time','')+'</div>';
      if(p.showReIOT) h+='<div class="icu-row icu-row-resp-one" style="margin-top:4px">'+field('Data Re-IOT','dataReIOT',p.dataReIOT,'date','')+field('Hora','horaReIOT',p.horaReIOT,'time','')+'</div>';
    }
    if(p.tipoVia&&p.tipoVia.startsWith('TQT')){
      h+='<div class="icu-row icu-row-resp-events">';
      h+=field('Data TQT','dataTQT',p.dataTQT,'date','');
      h+='<div class="icu-field icu-field-resp"><label>Dias TQT</label><div class="icu-calc-val icu-input-resp">D'+diasTQT+'</div></div>';
      h+='<div class="icu-field icu-field-resp-btn"><label>&nbsp;</label><button type="button" onclick="ICU.toggleEvt(\'showDecan\')" class="icu-resp-evt-btn'+(p.showDecan?' icu-resp-evt-on':'')+'">Decanulou</button></div>';
      if(p.tipoVia==='TQT-VM') h+='<div class="icu-field icu-field-resp-btn"><label>&nbsp;</label><button type="button" onclick="ICU.toggleEvt(\'showDescVM\')" class="icu-resp-evt-btn icu-resp-evt-desc'+(p.showDescVM?' icu-resp-evt-on':'')+'">Desconexao VM</button></div>';
      h+='<div class="icu-field icu-field-resp-btn"><label>&nbsp;</label><button type="button" class="icu-small-btn icu-resp-hist-btn" onclick="ICU.saveVAHist()">Salvar</button></div>';
      h+='</div>';
      if(p.showDecan) h+='<div class="icu-row icu-row-resp-one" style="margin-top:4px">'+field('Data Decanulacao','dataDecanulacao',p.dataDecanulacao,'date','')+field('Hora','horaDecanulacao',p.horaDecanulacao,'time','')+'</div>';
      if(p.showDescVM) h+='<div class="icu-row icu-row-resp-one" style="margin-top:4px">'+field('Data Desconexao VM','dataDescVM',p.dataDescVM,'date','')+field('Hora','horaDescVM',p.horaDescVM,'time','')+'</div>';
    }
    if(p.tipoVia&&p.tipoVia!=='TOT'&&p.tipoVia!=='TNT'&&!p.tipoVia.startsWith('TQT')){
      h+='<div class="icu-row icu-row-resp-events" style="margin-top:6px">';
      h+='<div class="icu-field icu-field-resp-btn"><label>&nbsp;</label><button type="button" class="icu-small-btn icu-resp-hist-btn" onclick="ICU.saveVAHist()">Salvar</button></div>';
      h+='</div>';
    }
    var vaHist=p.viaAereaHist||[];
    if(vaHist.length>0){
      h+='<div style="margin-top:8px"><b style="color:var(--silver-l);font-size:11px">Via Aérea ('+vaHist.length+')</b>';
      vaHist.forEach(function(v,i){
        var cor=v.tipo==='EXTUBACAO'?'#4ade80':v.tipo==='DECANULACAO'?'#4ade80':v.tipo==='RE-IOT'?'#f87171':v.tipo==='DESC-VM'?'#60a5fa':(v.tipo||'').startsWith('TQT')?'#fb923c':(v.tipo==='TOT'||v.tipo==='TNT')?'#f87171':(v.tipo==='VNI'||v.tipo==='HFNC')?'#60a5fa':'#4ade80';
        h+='<div class="icu-gaso-hist" style="margin-top:4px"><span style="font-size:9px;color:'+cor+';font-weight:700">'+v.tipo+'</span><span style="font-size:10px;color:var(--w40)">'+v.data+'</span><button onclick="ICU.delViaHist('+i+')" class="icu-act-btn icu-del-btn" style="width:20px;height:20px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M6 18L18 6M6 6l12 12"/></svg></button></div>';
      });
      h+='</div>';
    }

    // GASOMETRIA ARTERIAL + S/F na mesma linha
    h+='<div class="icu-divider">Gasometria Arterial</div>';

    var gf=function(lb,k,v,ph,tp){return '<div class="icu-field"><label>'+lb+'</label><input type="'+(tp||'number')+'" step="any" placeholder="'+(ph||'')+'" value="'+(v||'')+'" oninput="ICU.set(\''+k+'\',this.value);ICU.liveGaso()" onblur="ICU.saveField()" style="padding:5px 4px;font-size:11px;text-align:center"></div>';};
    var gasoD=p.gasoData||'',gasoDDisplay='';
    if(gasoD){var gp=gasoD.split('-');if(gp.length>=3)gasoDDisplay=(gp[2]||'').substring(0,2)+'/'+(gp[1]||'').substring(0,2)+'/'+((gp[0]||'').length>=4?(gp[0]||'').slice(-2):(gp[0]||''));}
    var gasoT=p.gasoHora||'';
    h+='<div class="icu-grid6 icu-gaso-row">';
    h+='<div class="icu-field"><label>Data</label><input type="text" class="icu-gaso-date" value="'+gasoDDisplay+'" placeholder="DD/MM/AA" maxlength="8" onchange="ICU.setGasoDt(this,\'date\')" onblur="ICU.setGasoDt(this,\'date\');ICU.saveField()" style="padding:5px 4px;font-size:11px;text-align:center"/></div>';
    h+='<div class="icu-field icu-gaso-hora"><label>Hora</label><input type="time" value="'+gasoT+'" onchange="ICU.set(\'gasoHora\',this.value)" onblur="ICU.saveField()" style="padding:5px 4px;font-size:11px;text-align:center"/></div>';
    h+='<div class="icu-field"><label style="font-size:8px">SpO2%</label><input type="number" placeholder="96" value="'+(p.sfSpO2||'')+'" oninput="ICU.set(\'sfSpO2\',this.value);ICU.liveGaso()" style="padding:5px 4px;font-size:11px;text-align:center"></div>';
    h+='<div class="icu-field"><label style="font-size:8px">FiO2%</label><input type="number" placeholder="40" value="'+(p.sfFiO2||'')+'" oninput="ICU.set(\'sfFiO2\',this.value);ICU.liveGaso()" style="padding:5px 4px;font-size:11px;text-align:center"></div>';
    h+=gf('pH','gasoPH',p.gasoPH,'7.40')+gf('PaCO2','gasoPaCO2',p.gasoPaCO2,'40');
    h+='</div>';
    h+='<div class="icu-grid6 icu-gaso-row">';
    h+=gf('PaO2','gasoPaO2',p.gasoPaO2,'85')+gf('HCO3','gasoHCO3',p.gasoHCO3,'24')+gf('BE','gasoBE',p.gasoBE,'-1')+gf('SaO2%','gasoSaO2',p.gasoSaO2,'96')+gf('Lac','gasoLactato',p.gasoLactato,'1.5')+gf('FiO2%','gasoFiO2',p.gasoFiO2,'40');
    h+='</div>';

    h+='<div class="icu-field"><label>Obs Gasometricas</label><textarea rows="1" style="resize:none;overflow:hidden;min-height:28px;padding:6px 8px;font-size:11px" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\';ICU.set(\'gasoObs\',this.value)" onblur="ICU.saveField()" placeholder="...">'+(p.gasoObs||'')+'</textarea></div>';

    // ANALISE AUTOMATICA
    h+='<div id="gasoAnaliseBox">';
    if(gasoAnalise)h+='<div class="icu-calc-card" style="border-color:'+gasoAnalise.cor+'30;background:'+gasoAnalise.cor+'08;margin-top:6px"><div class="icu-calc-row"><span>Analise:</span><b style="color:'+gasoAnalise.cor+'">'+gasoAnalise.full+'</b></div></div>';
    h+='</div>';

    // Salvar e Historico da gasometria - logo abaixo da gasometria (antes dos criterios P/F)
    h+='<div class="icu-gaso-btns" style="display:flex;gap:8px;margin-top:10px"><button class="icu-small-btn" onclick="ICU.saveGaso()">Salvar</button><button class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearGaso()">Limpar Gaso</button></div>';
    if(p.gasometrias.length){
      h+='<div style="margin-top:8px"><b style="color:var(--silver-l);font-size:11px">Historico Gasometria ('+p.gasometrias.length+')</b>';
      p.gasometrias.forEach(function(gs,i){
        var gsDate=gs.data?gs.data+(gs.hora?' '+gs.hora:''):new Date(gs.ts).toLocaleString('pt-BR');
        var resumo='pH '+gs.pH+' | CO2 '+gs.paCO2+' | O2 '+gs.paO2+(gs.pf?' | P/F '+gs.pf:'')+(gs.sf?' | S/F '+gs.sf:'');
        h+='<div style="margin-top:6px;border:1px solid var(--gb);border-radius:8px;overflow:hidden">';
        h+='<div class="icu-gaso-hist" style="cursor:pointer" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'block\':\'none\'">';
        h+='<span style="color:var(--w30);font-size:10px">'+gsDate+'</span><span style="font-size:10px;color:var(--w50)">'+resumo+'</span>';
        h+='<button onclick="event.stopPropagation();ICU.delGaso('+i+')" class="icu-act-btn icu-del-btn" style="width:20px;height:20px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M6 18L18 6M6 6l12 12"/></svg></button></div>';
        h+='<div style="display:none;padding:8px;background:var(--w03);font-size:10px;color:var(--w50)">';
        h+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px">';
        h+='<span>pH: <b style="color:var(--silver-l)">'+gs.pH+'</b></span>';
        h+='<span>PaCO2: <b style="color:var(--silver-l)">'+(gs.paCO2||'-')+'</b></span>';
        h+='<span>PaO2: <b style="color:var(--silver-l)">'+(gs.paO2||'-')+'</b></span>';
        h+='<span>HCO3: <b style="color:var(--silver-l)">'+(gs.hco3||'-')+'</b></span>';
        h+='<span>BE: <b style="color:var(--silver-l)">'+(gs.be||'-')+'</b></span>';
        h+='<span>SaO2: <b style="color:var(--silver-l)">'+(gs.sao2||'-')+'%</b></span>';
        h+='<span>Lac: <b style="color:var(--silver-l)">'+(gs.lactato||'-')+'</b></span>';
        h+='<span>FiO2: <b style="color:var(--silver-l)">'+(gs.fio2||'-')+'%</b></span>';
        h+='</div>';
        if(gs.analise){h+='<div style="margin-bottom:6px;padding:4px 8px;border-radius:6px;background:#60a5fa10;border:1px solid #60a5fa20"><b style="color:#60a5fa">Analise:</b> <span style="color:var(--silver-l)">'+gs.analise+'</span></div>';}
        if(gs.pf){
          h+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">';
          h+='<span style="padding:2px 6px;border-radius:4px;background:#4ade8010;border:1px solid #4ade8020"><b>P/F:</b> '+gs.pf+'</span>';
          h+='<span style="padding:2px 6px;border-radius:4px;background:var(--w05)">Normal: <b>'+gs.pfNormal+'</b></span>';
          h+='<span style="padding:2px 6px;border-radius:4px;background:var(--w05)">Berlim: <b>'+gs.pfBerlim+'</b></span>';
          h+='<span style="padding:2px 6px;border-radius:4px;background:var(--w05)">Global: <b>'+gs.pfGlobal+'</b></span>';
          h+='</div>';
        }
        if(gs.sf){
          h+='<div style="display:flex;gap:6px;flex-wrap:wrap">';
          h+='<span style="padding:2px 6px;border-radius:4px;background:#a78bfa10;border:1px solid #a78bfa20"><b>S/F:</b> '+gs.sf+'</span>';
          h+='<span style="padding:2px 6px;border-radius:4px;background:var(--w05)">Lit: <b>'+gs.sfLit+'</b></span>';
          h+='<span style="padding:2px 6px;border-radius:4px;background:var(--w05)">SOFA: <b>'+gs.sfSofa+'</b></span>';
          h+='</div>';
        }
        h+='</div></div>';
      });
      h+='</div>';
    }

    // CRITERIOS P/F com 3 colunas completas
    h+='<div id="pfCriteriosBox">';
    if(pf){
      var pfVal=Math.round(pf);
      var pfIdx=pfVal>300?0:pfVal>200?1:pfVal>100?2:3;
      var cc=['#4ade80','#facc15','#fb923c','#f87171'];
      var hlRow=function(rng,grav,sel,cor){return '<div style="display:flex;justify-content:space-between;padding:3px 4px;font-size:9px;border-bottom:1px solid var(--gb);'+(sel?'background:'+cor+'15;border-radius:4px':'')+'"><span style="color:var(--w40)">'+rng+'</span><span style="color:'+(sel?cor:'var(--w40)')+';font-weight:'+(sel?'700':'400')+'">'+grav+'</span></div>';};

      h+='<div class="icu-divider" style="margin-top:10px">Criterios de Oxigenacao (P/F)</div>';
      h+='<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:stretch">';

      h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
      h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:4px">CRITERIOS NORMAIS (P/F)</div>';
      h+=hlRow('> 300','Normal',pfIdx===0,cc[0]);
      h+=hlRow('200 < P/F ≤ 300','Leve',pfIdx===1,cc[1]);
      h+=hlRow('100 < P/F ≤ 200','Moderada',pfIdx===2,cc[2]);
      h+=hlRow('P/F ≤ 100','Grave',pfIdx===3,cc[3]);
      h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+cc[pfIdx]+'15;text-align:center"><span style="font-size:9px;color:var(--w40)">P/F: </span><b style="font-size:14px;color:'+cc[pfIdx]+'">'+pfVal+'</b></div>';
      h+='</div>';

      h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
      h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:2px">BERLIM 2012 (SDRA)</div>';
      h+='<div style="font-size:7px;color:#fb923c;margin-bottom:4px">⚠️ Requer PEEP ≥ 5 cmH₂O</div>';
      h+=hlRow('> 300','Sem SDRA',pfIdx===0,cc[0]);
      h+=hlRow('200 < P/F ≤ 300','Leve',pfIdx===1,cc[1]);
      h+=hlRow('100 < P/F ≤ 200','Moderada',pfIdx===2,cc[2]);
      h+=hlRow('P/F ≤ 100','Grave',pfIdx===3,cc[3]);
      var bLbl=['Sem SDRA','SDRA Leve','SDRA Moderada','SDRA Grave'];
      h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+cc[pfIdx]+'15;text-align:center"><b style="font-size:11px;color:'+cc[pfIdx]+'">'+bLbl[pfIdx]+'</b></div>';
      h+='</div>';

      h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
      h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:2px">GLOBAL 2023</div>';
      h+='<div style="display:flex;justify-content:space-between;font-size:7px;color:var(--w30);padding:2px 4px;border-bottom:1px solid var(--gb)"><span>Gravidade</span><span>P/F</span><span>S/F</span><span>PEEP</span></div>';
      var gS;gS=pfIdx===0;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(gS?'background:'+cc[0]+'15;border-radius:3px':'')+'"><span style="color:'+(gS?cc[0]:'var(--w40)')+'">Sem</span><span style="color:var(--w40)">>300</span><span style="color:var(--w40)">>315</span><span style="color:var(--w40)">-</span></div>';
      gS=pfIdx===1;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(gS?'background:'+cc[1]+'15;border-radius:3px':'')+'"><span style="color:'+(gS?cc[1]:'var(--w40)')+'">Leve</span><span style="color:var(--w40)">200-300</span><span style="color:var(--w40)">≤315</span><span style="color:var(--w40)">≥5</span></div>';
      gS=pfIdx===2;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(gS?'background:'+cc[2]+'15;border-radius:3px':'')+'"><span style="color:'+(gS?cc[2]:'var(--w40)')+'">Mod.</span><span style="color:var(--w40)">100-200</span><span style="color:var(--w40)">≤235</span><span style="color:var(--w40)">≥5</span></div>';
      gS=pfIdx===3;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;'+(gS?'background:'+cc[3]+'15;border-radius:3px':'')+'"><span style="color:'+(gS?cc[3]:'var(--w40)')+'">Grave</span><span style="color:var(--w40)">≤100</span><span style="color:var(--w40)">≤148</span><span style="color:var(--w40)">≥5</span></div>';
      var gLbl=['Sem SDRA','Leve','Moderada','Grave'];
      h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+cc[pfIdx]+'15;text-align:center"><b style="font-size:11px;color:'+cc[pfIdx]+'">'+gLbl[pfIdx]+'</b></div>';
      h+='</div>';

      h+='</div>';
    }
    h+='</div>';

    // CRITERIOS S/F com 3 colunas completas
    h+='<div id="sfCriteriosBox">';
    if(p.sfSpO2&&p.sfFiO2){
      var spV2=parseFloat(p.sfSpO2);var fiV2=parseFloat(p.sfFiO2)/100;
      if(!isNaN(spV2)&&!isNaN(fiV2)&&fiV2>0){
        var sf2=Math.round(spV2/fiV2);
        var sfIdx=sf2>315?0:sf2>274?1:sf2>232?2:3;
        var sfSIdx=sf2>300?0:sf2>250?1:sf2>200?2:3;
        var cc2=['#4ade80','#facc15','#fb923c','#f87171'];
        var hlSF=function(rng,grav,sel,cor){return '<div style="display:flex;justify-content:space-between;padding:3px 4px;font-size:9px;border-bottom:1px solid var(--gb);'+(sel?'background:'+cor+'15;border-radius:4px':'')+'"><span style="color:var(--w40)">'+rng+'</span><span style="color:'+(sel?cor:'var(--w40)')+';font-weight:'+(sel?'700':'400')+'">'+grav+'</span></div>';};

        h+='<div class="icu-divider" style="margin-top:10px">Criterios de Oxigenacao (S/F)</div>';
        h+='<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:stretch">';

        h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
        h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:2px">LITERATURA (S/F = 64 + 0.84×P/F)</div>';
        h+=hlSF('S/F > 315','P/F > 300',sfIdx===0,cc2[0]);
        h+=hlSF('274 < S/F ≤ 315','P/F 250-300',sfIdx===1,cc2[1]);
        h+=hlSF('232 < S/F ≤ 274','P/F 200-250',sfIdx===2,cc2[2]);
        h+=hlSF('S/F ≤ 232','P/F < 200',sfIdx===3,cc2[3]);
        h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+cc2[sfIdx]+'15;text-align:center"><span style="font-size:9px;color:var(--w40)">S/F: </span><b style="font-size:14px;color:'+cc2[sfIdx]+'">'+sf2+'</b></div>';
        h+='</div>';

        var sfSlbl=['SOFA 0-1','SOFA 2','SOFA 3','SOFA 4'];
        h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
        h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:4px">SOFA-2 (2025)</div>';
        h+=hlSF('S/F > 300','SOFA 0-1',sfSIdx===0,cc2[0]);
        h+=hlSF('250 < S/F ≤ 300','SOFA 2 (P/F≤300)',sfSIdx===1,cc2[1]);
        h+=hlSF('200 < S/F ≤ 250','SOFA 3 (P/F≤225)',sfSIdx===2,cc2[2]);
        h+=hlSF('S/F ≤ 200','SOFA 4 (P/F≤150)',sfSIdx===3,cc2[3]);
        h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+cc2[sfSIdx]+'15;text-align:center"><b style="font-size:11px;color:'+cc2[sfSIdx]+'">'+sfSlbl[sfSIdx]+'</b></div>';
        h+='</div>';

        h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
        h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:2px">COMPARACAO S/F → P/F</div>';
        h+='<div style="display:flex;justify-content:space-between;font-size:7px;color:var(--w30);padding:2px 4px;border-bottom:1px solid var(--gb)"><span>P/F</span><span>Lit. | SOFA-2</span></div>';
        var cS;cS=sf2>315;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(cS?'background:'+cc2[0]+'15;border-radius:3px':'')+'"><span style="color:var(--w40)">>300</span><span style="color:var(--w40)">>315 | >300</span></div>';
        cS=sf2>274&&sf2<=315;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(cS?'background:'+cc2[1]+'15;border-radius:3px':'')+'"><span style="color:var(--w40)">225-300</span><span style="color:var(--w40)">≤315 | ≤300</span></div>';
        cS=sf2>232&&sf2<=274;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(cS?'background:'+cc2[2]+'15;border-radius:3px':'')+'"><span style="color:var(--w40)">150-225</span><span style="color:var(--w40)">≤274 | ≤250</span></div>';
        cS=sf2<=232;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;'+(cS?'background:'+cc2[3]+'15;border-radius:3px':'')+'"><span style="color:var(--w40)">≤150</span><span style="color:var(--w40)">≤232 | ≤200</span></div>';
        h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:var(--w03);text-align:center;border:1px solid var(--gb)"><span style="font-size:9px;color:var(--w40)">S/F atual: </span><b style="font-size:12px;color:var(--silver-l)">'+sf2+'</b>';
        if(spV2>97)h+='<div style="font-size:7px;color:#fb923c;margin-top:2px">⚠️ SpO₂ >97% reduz precisao</div>';
        h+='</div>';
        h+='</div>';

        h+='</div>';
      }
    }
    h+='</div>';

    // VENTILACAO MECANICA
    h+='<div class="icu-divider">Ventilacao Mecanica</div>';
    var modoVMopts=[
      ['','Selecionar'],
      ['---','-- BASICO CONTROLADO --'],
      ['VCV','VCV (Vol. Controlado)'],
      ['PCV','PCV (Pressao Controlada)'],
      ['---2','-- BASICO ESPONTANEO --'],
      ['PSV','PSV (Pressao Suporte)'],
      ['TuboT','Tubo-T'],
      ['---3','-- BASICO VNI --'],
      ['CPAP','CPAP'],
      ['BIPAP','BiPAP/Bilevel'],
      ['---4','-- AVANCADO CONTROLADO --'],
      ['PRVC','PRVC (VC+)'],
      ['HFOV','HFOV (Alta Frequencia)'],
      ['MMV','MMV (Vol. Minuto Mandatorio)'],
      ['---5','-- AVANCADO ESPONTANEO --'],
      ['APRV','APRV'],
      ['VS','VS (Vol. Suporte)'],
      ['ASV','ASV (Hamilton)'],
      ['IntelliVENT','IntelliVENT-ASV'],
      ['SmartCare','SmartCare/PS (Drager)'],
      ['---6','-- ASSIST. PROPORCIONAL --'],
      ['PAV','PAV+ (Proporcional)'],
      ['NAVA','NAVA (Edi)'],
      ['ATC','ATC (Compensacao Tubo)']
    ];
    h+='<div class="icu-row">';
    h+='<div class="icu-field"><label>Modo Ventilatorio</label><select onchange="ICU.setR(\'modoVM\',this.value)">';
    modoVMopts.forEach(function(o){
      if(o[0].startsWith('---'))h+='<option disabled style="color:#666;font-weight:700">'+o[1]+'</option>';
      else h+='<option value="'+o[0]+'"'+(p.modoVM===o[0]?' selected':'')+'>'+o[1]+'</option>';
    });
    h+='</select></div>';
    h+='</div>';

    // ANALISE DE CURVAS E LOOPS
    h+='<div class="icu-divider">Analise de Curvas e Loops</div>';
    var curvaSel=function(icon,label,key,opts){
      var arr=p[key]||[];
      if(typeof arr==='string')arr=arr?[arr]:[];
      var s='<div class="icu-field"><label>'+icon+' '+label+'</label><select onchange="ICU.addCurva(\''+key+'\',this.value);this.selectedIndex=0"><option value="">Selecione alteracoes...</option>';
      opts.forEach(function(o){s+='<option value="'+o+'">'+o+'</option>';});
      s+='</select>';
      if(arr.length>0){
        s+='<div style="margin-top:4px;display:flex;flex-direction:column;gap:3px">';
        arr.forEach(function(v,i){
          var cor=v.startsWith('Normal')||v==='Sem assincronias'?'#4ade80':'#fb923c';
          s+='<div style="display:flex;align-items:center;gap:4px;padding:2px 6px;border-radius:6px;background:'+cor+'10;border:1px solid '+cor+'30">';
          s+='<span style="flex:1;font-size:9px;color:'+cor+'">'+v+'</span>';
          s+='<button onclick="ICU.rmCurva(\''+key+'\','+i+')" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:12px;padding:0 2px;line-height:1">&times;</button>';
          s+='</div>';
        });
        s+='</div>';
      }
      s+='</div>';return s;
    };
    var pxtOpts=['Normal - Sincronico Controlado','Normal - Sincronico A/C','Normal - Sincronico Espontaneo','Pico elevado (resistencia aumentada)','Plato elevado (complacencia reduzida)','Pico e Plato elevados','Auto-PEEP (pressao expiratoria final elevada)','Curva concava (obstrutiva)','Pressao negativa excessiva (esforco aumentado)','Overshoot (excesso de pressao inicial)','Undershoot (pressao insuficiente)','Duplo disparo','Esforco ineficaz (trigger nao detectado)','Ciclagem precoce','Ciclagem tardia'];
    var fxtOpts=['Normal - Sincronico Controlado','Normal - Sincronico A/C','Normal - Sincronico Espontaneo','Fluxo desacelerado (PCV normal)','Fluxo quadrado (VCV normal)','Fluxo expirat. nao retorna a zero (auto-PEEP)','Pico de fluxo expirat. reduzido (obstrucao)','Fluxo inspir. insuficiente (assincronia de fluxo)','Duplo pico inspiratorio','Fluxo reverso (ciclagem tardia)','Esforco ineficaz visivel no fluxo'];
    var vxtOpts=['Normal - Sincronico Controlado','Normal - Sincronico A/C','Normal - Sincronico Espontaneo','Volume nao retorna a zero (vazamento)','Volume reduzido (obstrucao ou restricao)','Volume excessivo (auto-trigger)','Curva em degrau (duplo disparo)','Volume instavel ciclo a ciclo'];
    var lpvOpts=['Normal - Padrao sigmoide','Histerese aumentada (recrutamento)','Histerese reduzida (pulmao rigido)','Ponto de inflexao inferior evidente','Ponto de inflexao superior evidente (hiperdistensao)','Beak sign (hiperdistensao)','Deslocamento para direita (reducao complacencia)','Deslocamento para esquerda (melhora complacencia)'];
    var lfvOpts=['Normal - Formato sigmoide','Loop achatado (restricao)','Concavidade expiratoria (obstrucao)','Volume reduzido (restricao grave)','Fluxo expirat. limitado','Loop irregular (assincronia)','Alargamento do loop (resistencia aumentada)'];
    var assOpts=['Sem assincronias','Esforco ineficaz (Ineffective Effort)','Duplo disparo (Double Triggering)','Auto-trigger','Assincronia de fluxo (Flow Starvation)','Ciclagem precoce (Premature Cycling)','Ciclagem tardia (Delayed Cycling)','Disparo reverso (Reverse Triggering)','Breath Stacking','Assincronia de PEEP (PEEP insuficiente)'];
    h+='<div class="icu-grid3 icu-curvas-row">';
    h+=curvaSel('📊','Pressao x Tempo','curvaPxT',pxtOpts);
    h+=curvaSel('🌊','Fluxo x Tempo','curvaFxT',fxtOpts);
    h+=curvaSel('📦','Volume x Tempo','curvaVxT',vxtOpts);
    h+='</div>';
    h+='<div class="icu-grid3 icu-curvas-row">';
    h+=curvaSel('🔄','Loop P-V','loopPV',lpvOpts);
    h+=curvaSel('💨','Loop F-V','loopFV',lfvOpts);
    h+=curvaSel('⚠️','Assincronias','assincronia',assOpts);
    h+='</div>';

    // Parametros por modo
    if(p.modoVM){
      var modoTipo='outro';
      var modosVol=['VCV','PRVC','HFOV','MMV'];
      var modosPress=['PCV'];
      var modosEsp=['PSV','TuboT','CPAP','BIPAP','VS','ASV','IntelliVENT','SmartCare','APRV','PAV','NAVA','ATC'];
      if(modosVol.indexOf(p.modoVM)>=0)modoTipo='volume';
      else if(modosPress.indexOf(p.modoVM)>=0)modoTipo='pressao';
      else if(modosEsp.indexOf(p.modoVM)>=0)modoTipo='espontaneo';

      var vmHistBlock=function(){
        if(!p.vmHist||!p.vmHist.length)return '';
        var s='<div style="margin-top:8px"><b style="color:var(--silver-l);font-size:11px">Historico Parametros ('+p.vmHist.length+')</b>';
        p.vmHist.forEach(function(vm,i){
          var resumoVM=vm.modo;
          var mVol=['VCV','PRVC','HFOV','MMV'];var mPress=['PCV'];
          if(vm.vt)resumoVM+=' | Vt:'+vm.vt;
          if(vm.ps)resumoVM+=' | PS:'+vm.ps;
          if(mPress.indexOf(vm.modo)>=0&&vm.ppico)resumoVM+=' | PC:'+vm.ppico;
          if(vm.fr)resumoVM+=' | FR:'+vm.fr;
          if(vm.peep)resumoVM+=' | PEEP:'+vm.peep;
          if(vm.fio2)resumoVM+=' | FiO2:'+vm.fio2+'%';
          if(mVol.indexOf(vm.modo)>=0&&vm.ppico)resumoVM+=' | PP:'+vm.ppico;
          if(vm.pplato)resumoVM+=' | Plato:'+vm.pplato;
          if(vm.dp)resumoVM+=' | DP:'+vm.dp;
          if(vm.cest)resumoVM+=' | Cest:'+vm.cest;
          if(vm.raw)resumoVM+=' | RAW:'+vm.raw;
          if(vm.p01)resumoVM+=' | P0.1:'+vm.p01;
          if(vm.pocc)resumoVM+=' | Pocc:'+vm.pocc;
          if(vm.pmusc)resumoVM+=' | Pmusc:'+vm.pmusc;
          s+='<div style="margin-top:4px;border:1px solid var(--gb);border-radius:8px;overflow:hidden">';
          s+='<div class="icu-gaso-hist" style="cursor:pointer" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'block\':\'none\'">';
          s+='<span style="color:var(--w30);font-size:10px">'+new Date(vm.ts).toLocaleString('pt-BR')+'</span><span style="font-size:10px;color:var(--w50)">'+resumoVM+'</span>';
          s+='<button onclick="event.stopPropagation();ICU.delVM('+i+')" class="icu-act-btn icu-del-btn" style="width:20px;height:20px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M6 18L18 6M6 6l12 12"/></svg></button></div>';
          s+='<div style="display:none;padding:8px;background:var(--w03);font-size:10px;color:var(--w50)">';
          s+='<div style="display:flex;flex-wrap:wrap;gap:6px">';
          var camposDef=[['modo','Modo'],['vt','Vt'],['vc','VC'],['ve','VE'],['fr','FR'],['peep','PEEP'],['fio2','FiO2'],['trigger','Trigger'],['ti','TI'],['ie','I:E'],['ps','PS'],['ipap','IPAP'],['epap','EPAP'],['ppico','P.Pico'],['pplato','P.Plato'],['dp','DP'],['cest','Cest'],['raw','RAW'],['p01','P0.1'],['pocc','Pocc'],['pmusc','Pmusc']];
          camposDef.forEach(function(c){var k=c[0],n=c[1];if(vm[k]!==undefined&&vm[k]!==null&&vm[k]!==''){s+='<span>'+n+': <b style="color:var(--silver-l)">'+vm[k]+'</b></span>';}});
          if(vm.analise)s+='<div style="margin-top:4px;width:100%;padding:3px 6px;border-radius:4px;background:#60a5fa10;border:1px solid #60a5fa20"><b style="color:#60a5fa">'+vm.analise+'</b></div>';
          s+='</div></div></div>';
        });
        return s+'</div>';
      };

      h+='<div class="icu-divider">Parametros Basicos - '+p.modoVM+'</div>';

      if(modoTipo==='volume'){
        h+='<div class="icu-vm-params">'+fieldVM('Vt (mL)','vt',p.vt,'number','450')+fieldVM('VC (mL)','vc',p.vc,'number','420')+fieldVM('VE (L/min)','ve',p.ve,'number','7.2')+fieldVM('FR (rpm)','fr',p.fr,'text','20/20')+fieldVM('PEEP','peep',p.peep,'number','10')+fieldVM('FiO2 (%)','fio2',p.fio2,'number','40')+fieldVM('Fluxo (L/min)','fluxo',p.fluxo,'number','60')+fieldVM('Trigger','trigger',p.trigger,'number','-2')+fieldVM('TI (s)','ti',p.ti,'number','1.0')+fieldVM('I:E','ie',p.ie,'text','1:2')+fieldVM('Pico','ppico',p.ppico,'number','28')+fieldVM('Plato','pplato',p.pplato,'number','25')+'</div>';
        h+='<div id="vmCalcBox"></div>';
        h+='<div class="icu-vm-btns" style="display:flex;gap:8px;margin-top:8px"><button class="icu-small-btn" onclick="ICU.saveVM()">Salvar Parametros</button><button class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearVM()">Limpar</button></div>';
        h+=vmHistBlock();
      }

      if(modoTipo==='pressao'){
        h+='<div class="icu-vm-params">'+fieldVM('PC (cmH2O)','ppico',p.ppico,'text','27 (12)')+fieldVM('VC (mL)','vc',p.vc,'number','420')+fieldVM('VE (L/min)','ve',p.ve,'number','7.2')+fieldVM('FR (rpm)','fr',p.fr,'text','20/20')+fieldVM('PEEP','peep',p.peep,'number','10')+fieldVM('FiO2 (%)','fio2',p.fio2,'number','40')+fieldVM('Trigger','trigger',p.trigger,'number','-2')+fieldVM('TI (s)','ti',p.ti,'number','0.8')+fieldVM('I:E','ie',p.ie,'text','1:2')+fieldVM('Plato','pplato',p.pplato,'number','22')+'</div>';
        h+='<div id="vmCalcBox"></div>';
        h+='<div class="icu-vm-btns" style="display:flex;gap:8px;margin-top:8px"><button class="icu-small-btn" onclick="ICU.saveVM()">Salvar Parametros</button><button class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearVM()">Limpar</button></div>';
        h+=vmHistBlock();
      }

      if(modoTipo==='espontaneo'){
        if(p.modoVM==='BIPAP'){
          h+='<div class="icu-grid3">'+fieldVM('IPAP','ipap',p.ipap,'number','15')+fieldVM('EPAP','epap',p.epap,'number','8')+fieldVM('VC (mL)','vc',p.vc,'number','420')+'</div>';
        }else if(p.modoVM==='CPAP'){
          h+='<div class="icu-grid3">'+fieldVM('CPAP/PEEP','peep',p.peep,'number','8')+fieldVM('VC (mL)','vc',p.vc,'number','420')+fieldVM('VE (L/min)','ve',p.ve,'number','7')+'</div>';
        }else if(p.modoVM==='APRV'){
          h+='<div class="icu-grid3">'+fieldVM('P-Alta','ppico',p.ppico,'text','28 (12)')+fieldVM('P-Baixa','peep',p.peep,'number','0')+fieldVM('T-Alta (s)','ti',p.ti,'number','4.5')+'</div>';
          h+='<div class="icu-grid3">'+fieldVM('T-Baixa (s)','trigger',p.trigger,'number','0.5')+fieldVM('FiO2 (%)','fio2',p.fio2,'number','60')+fieldVM('VC (mL)','vc',p.vc,'number','')+'</div>';
        }else if(p.modoVM==='PAV'||p.modoVM==='NAVA'){
          h+='<div class="icu-grid3">'+fieldVM('% Assist','ps',p.ps,'number','70')+fieldVM('PEEP','peep',p.peep,'number','8')+fieldVM('FiO2 (%)','fio2',p.fio2,'number','40')+'</div>';
        }else{
          h+='<div class="icu-vm-params">'+fieldVM('PS (cmH2O)','ps',p.ps,'text','10 (8)')+fieldVM('VC (mL)','vc',p.vc,'number','420')+fieldVM('VE (L/min)','ve',p.ve,'number','7')+fieldVM('FR (rpm)','fr',p.fr,'text','20/18')+fieldVM('PEEP','peep',p.peep,'number','8')+fieldVM('FiO2 (%)','fio2',p.fio2,'number','40')+fieldVM('Trigger','trigger',p.trigger,'number','-2')+fieldVM('TI (s)','ti',p.ti,'number','0.8')+fieldVM('I:E','ie',p.ie,'text','1:2')+fieldVM('P0.1','p01',p.p01,'number','')+fieldVM('Pocc','pocc',p.pocc,'number','')+fieldVM('Pmusc','pmusc',p.pmusc,'number','')+'</div>';
        }
        if(p.modoVM==='BIPAP'||p.modoVM==='CPAP'){
          h+='<div class="icu-grid3 icu-curvas-row">'+fieldVM('Trigger','trigger',p.trigger,'number','-2')+fieldVM('TI (s)','ti',p.ti,'number','0.8')+fieldVM('I:E','ie',p.ie,'text','1:2')+'</div>';
        }
        h+='<div id="vmCalcBox"></div>';
        h+='<div class="icu-vm-btns" style="display:flex;gap:8px;margin-top:8px"><button class="icu-small-btn" onclick="ICU.saveVM()">Salvar Parametros</button><button class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearVM()">Limpar</button></div>';
        h+=vmHistBlock();

        // Calculadora Desmame
        h+='<div class="icu-divider" style="margin-top:12px">Calculadora Desmame</div>';
        h+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><b style="font-size:11px;color:var(--silver-l)">Pressoes + Ventilometria</b>';
        h+='<button class="icu-small-btn" style="padding:2px 6px;font-size:9px" onclick="var el=document.getElementById(\'desmameInfo\');el.style.display=el.style.display===\'none\'?\'block\':\'none\'">Info</button></div>';
        h+='<div id="desmameInfo" style="display:none;padding:8px;margin-bottom:8px;border-radius:8px;background:var(--w03);border:1px solid var(--gb);font-size:10px;color:var(--w50);line-height:1.5">';
        h+='<b style="color:var(--silver-l)">Por que esses parametros sao importantes?</b><br><br>';
        h+='<b style="color:#60a5fa">PImax (Pressao Inspiratoria Maxima)</b><br>Avalia a forca dos musculos inspiratorios (diafragma e intercostais). Valores mais negativos (≤ -30 cmH2O) indicam forca muscular adequada para sustentar respiracao espontanea.<br>⚠️ Importante: -40 e MELHOR que -15!<br><br>';
        h+='<b style="color:#60a5fa">PEmax (Pressao Expiratoria Maxima)</b><br>Avalia a forca dos musculos expiratorios. Valores ≥ +60 cmH2O garantem tosse eficaz, essencial para protecao de vias aereas e clearance de secrecoes.<br><br>';
        h+='<b style="color:#60a5fa">Volume Minuto (VM)</b><br>Volume total de ar movimentado por minuto (VC x FR).<br>• VM < 4 L/min: HIPOVENTILACAO<br>• VM 4-10 L/min: NORMAL<br>• VM > 10 L/min: HIPERVENTILACAO<br><br>';
        h+='<b style="color:#60a5fa">Capacidade Vital (CV)</b><br>Maior volume de ar que pode ser expirado apos inspiracao maxima. Valores ≥ 15 mL/kg indicam reserva ventilatoria adequada.<br><br>';
        h+='<b style="color:#60a5fa">RSBI (Rapid Shallow Breathing Index)</b><br>Razao entre FR e Volume Corrente (em litros). Valores < 80 indicam respiracao eficiente. Valores > 105 sugerem fadiga muscular ou dificuldade de desmame.</div>';
        h+='<div class="icu-grid5">'+fieldVM('PImax','dPimax',p.dPimax,'number','-40')+fieldVM('PEmax','dPemax',p.dPemax,'number','+60')+fieldVM('VC (mL)','dVcDesm',p.dVcDesm,'number','450')+fieldVM('FR (irpm)','dFrDesm',p.dFrDesm,'number','18')+fieldVM('CV (mL/kg)','dCv',p.dCv,'number','15')+'</div>';
        h+='<div id="desmCalcBox"></div>';
        h+='<div style="margin-top:8px;display:flex;gap:8px">';
        h+='<button class="icu-small-btn" onclick="ICU.saveDesmame()">Salvar Desmame</button>';
        h+='<button class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearDesmame()">Limpar</button></div>';
        if(!p.desmHist)p.desmHist=[];
        if(p.desmHist.length){
          h+='<div style="margin-top:8px"><b style="color:var(--silver-l);font-size:11px">Historico Desmame ('+p.desmHist.length+')</b>';
          p.desmHist.forEach(function(d,i){
            var res='PImax:'+d.pimax+' | PEmax:'+d.pemax+' | FR:'+d.fr+' | VC:'+d.vc+' | VM:'+(d.vm||'-')+' | CV:'+d.cv+' | RSBI:'+(d.rsbi||'-');
            h+='<div style="margin-top:4px;border:1px solid var(--gb);border-radius:8px;overflow:hidden">';
            h+='<div class="icu-gaso-hist" style="cursor:pointer" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'block\':\'none\'">';
            h+='<span style="color:var(--w30);font-size:10px">'+new Date(d.ts).toLocaleString('pt-BR')+'</span><span style="font-size:10px;color:var(--w50)">'+res+'</span>';
            h+='<button onclick="event.stopPropagation();ICU.delDesm('+i+')" class="icu-act-btn icu-del-btn" style="width:20px;height:20px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M6 18L18 6M6 6l12 12"/></svg></button></div>';
            h+='<div style="display:none;padding:8px;background:var(--w03);font-size:10px;color:var(--w50)">';
            var dd=[['pimax','PImax'],['pemax','PEmax'],['vc','VC'],['fr','FR'],['cv','CV'],['vm','VM'],['rsbi','RSBI']];
            dd.forEach(function(c){if(d[c[0]])h+='<span>'+c[1]+': <b style="color:var(--silver-l)">'+d[c[0]]+'</b></span> ';});
            if(d.analise)h+='<div style="margin-top:4px;width:100%;padding:3px 6px;border-radius:4px;background:#60a5fa10;border:1px solid #60a5fa20"><b style="color:#60a5fa">'+d.analise+'</b></div>';
            h+='</div></div>';
          });
          h+='</div>';
        }

        // Parametros de Desmame Ventilatorio
        h+='<div class="icu-divider" style="margin-top:12px">Parametros de Desmame Ventilatorio</div>';
        // Badge tipo desmame
        var tipoDesmame='Simples';var corDesm='#4ade80';
        if(p.treDt){
          var treDate=new Date(p.treDt);var iotDate=p.dataTOT?new Date(p.dataTOT.split('T')[0]):null;
          if(iotDate){
            var diasDesm=Math.floor((treDate-iotDate)/(1000*60*60*24));
            if(diasDesm>14){tipoDesmame='Prolongado';corDesm='#f87171';}
            else if(diasDesm>7){tipoDesmame='Dificil';corDesm='#facc15';}
          }
        }
        h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">';
        h+='<b style="font-size:11px;color:var(--silver-l)">Etapas TOT/TQT</b>';
        if(p.treOK&&p.treDt){
          h+='<span style="padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700;background:'+corDesm+'20;color:'+corDesm+';border:1px solid '+corDesm+'30">'+tipoDesmame+'</span>';
        }
        h+='</div>';
        // Etapas
        h+='<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;font-size:10px;color:var(--w50);margin-bottom:10px;justify-content:center">';
        h+='<span style="padding:3px 8px;border-radius:6px;background:var(--w05);border:1px solid var(--gb)">① VCV/PCV</span>';
        h+='<span style="color:var(--w30)">→</span>';
        h+='<span style="padding:3px 8px;border-radius:6px;background:var(--w05);border:1px solid var(--gb)">② PSV</span>';
        h+='<span style="color:var(--w30)">→</span>';
        h+='<span style="padding:3px 8px;border-radius:6px;background:var(--w05);border:1px solid var(--gb)">③ TRE</span>';
        h+='<span style="color:var(--w30)">→</span>';
        var isTQT=p.tipoVia&&(p.tipoVia.indexOf('TQT')>=0);
        h+='<span style="padding:3px 8px;border-radius:6px;background:var(--w05);border:1px solid var(--gb)">④ '+(isTQT?'Desconexao':'Extubacao')+'</span></div>';
        // Botoes TRE + Extubacao/Desconexao
        var isTOT=p.tipoVia&&(p.tipoVia==='TOT'||p.tipoVia==='TNT'||p.tipoVia==='ML');
        h+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;justify-content:center">';
        h+='<button onclick="ICU.toggleTRE()" style="padding:6px 12px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;'+(p.treOK?'background:#4ade8020;border:1px solid #4ade8040;color:#4ade80':'background:var(--w05);border:1px solid var(--gb);color:var(--w50)')+'">TRE</button>';
        if(isTOT){
          h+='<button onclick="ICU.toggleExt()" style="padding:6px 12px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;'+(p.extOK?'background:#60a5fa20;border:1px solid #60a5fa40;color:#60a5fa':'background:var(--w05);border:1px solid var(--gb);color:var(--w50)')+'">Extubacao</button>';
        }
        if(isTQT){
          h+='<button onclick="ICU.toggleDescVM()" style="padding:6px 12px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;'+(p.descVM?'background:#60a5fa20;border:1px solid #60a5fa40;color:#60a5fa':'background:var(--w05);border:1px solid var(--gb);color:var(--w50)')+'">Desconexao da VM</button>';
        }
        h+='</div>';
        // TRE data/hora
        if(p.treOK){
          h+='<div class="icu-grid2" style="margin-bottom:6px">';
          h+='<div class="icu-field"><label>Data TRE</label><input type="date" value="'+(p.treDt||'')+'" onchange="ICU.set(\'treDt\',this.value);ICU.saveField()"/></div>';
          h+='<div class="icu-field"><label>Hora TRE</label><input type="time" value="'+(p.treTm||'')+'" onchange="ICU.set(\'treTm\',this.value);ICU.saveField()"/></div></div>';
        }
        // Resultado Extubacao
        if(isTOT&&p.extOK){
          h+='<div style="margin-bottom:6px"><label style="font-size:10px;color:var(--w40)">Resultado da Extubacao</label>';
          h+='<div style="display:flex;gap:6px;margin-top:4px">';
          h+='<button onclick="ICU.set(\'extResult\',\'Sucesso\');ICU.saveField();ICU.render()" style="padding:4px 12px;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;'+(p.extResult==='Sucesso'?'background:#4ade8020;border:1px solid #4ade8040;color:#4ade80':'background:var(--w05);border:1px solid var(--gb);color:var(--w50)')+'">Sucesso</button>';
          h+='<button onclick="ICU.set(\'extResult\',\'Falha\');ICU.saveField();ICU.render()" style="padding:4px 12px;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;'+(p.extResult==='Falha'?'background:#f8717120;border:1px solid #f8717140;color:#f87171':'background:var(--w05);border:1px solid var(--gb);color:var(--w50)')+'">Falha</button>';
          h+='</div></div>';
        }
        // Resultado Desconexao
        if(isTQT&&p.descVM){
          h+='<div style="margin-bottom:6px"><label style="font-size:10px;color:var(--w40)">Resultado da Desconexao</label>';
          h+='<div style="display:flex;gap:6px;margin-top:4px">';
          h+='<button onclick="ICU.set(\'descResult\',\'Sucesso\');ICU.saveField();ICU.render()" style="padding:4px 12px;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;'+(p.descResult==='Sucesso'?'background:#4ade8020;border:1px solid #4ade8040;color:#4ade80':'background:var(--w05);border:1px solid var(--gb);color:var(--w50)')+'">Sucesso</button>';
          h+='<button onclick="ICU.set(\'descResult\',\'Falha\');ICU.saveField();ICU.render()" style="padding:4px 12px;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;'+(p.descResult==='Falha'?'background:#f8717120;border:1px solid #f8717140;color:#f87171':'background:var(--w05);border:1px solid var(--gb);color:var(--w50)')+'">Falha</button>';
          h+='</div></div>';
        }
        // Salvar no historico
        h+='<div style="margin-top:8px"><button class="icu-small-btn" onclick="ICU.saveDesmEtapas()">Salvar Etapas no Historico</button></div>';
        if(!p.desmEtapasHist)p.desmEtapasHist=[];
        if(p.desmEtapasHist.length){
          h+='<div style="margin-top:8px"><b style="color:var(--silver-l);font-size:11px">Historico Etapas ('+p.desmEtapasHist.length+')</b>';
          p.desmEtapasHist.forEach(function(d,i){
            var res='TRE:'+(d.treOK?'Sim':'Nao');
            if(d.treDt)res+=' '+d.treDt;
            if(d.extOK)res+=' | Ext:'+(d.extResult||'-');
            if(d.descVM)res+=' | Desc:'+(d.descResult||'-');
            if(d.tipo)res+=' | '+d.tipo;
            h+='<div style="margin-top:4px;padding:6px 8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:10px;color:var(--w50);display:flex;justify-content:space-between;align-items:center">';
            h+='<span>'+new Date(d.ts).toLocaleString('pt-BR')+' — '+res+'</span>';
            h+='<button onclick="ICU.delDesmEtapa('+i+')" class="icu-act-btn icu-del-btn" style="width:20px;height:20px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M6 18L18 6M6 6l12 12"/></svg></button>';
            h+='</div>';
          });
          h+='</div>';
        }
      }

      if(modoTipo==='outro'){
        h+='<div class="icu-vm-params">'+fieldVM('PEEP','peep',p.peep,'number','8')+fieldVM('FiO2 (%)','fio2',p.fio2,'number','40')+'<div class="icu-field"></div><div class="icu-field"></div><div class="icu-field"></div></div>';
        h+='<div class="icu-vm-btns" style="display:flex;gap:8px;margin-top:8px"><button class="icu-small-btn" onclick="ICU.saveVM()">Salvar Parametros</button><button class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearVM()">Limpar</button></div>';
        h+=vmHistBlock();
      }
    }

    // PROTOCOLO VM ESPECIFICO
    h+='<div class="icu-divider">Protocolo VM Especifico</div>';
    var prots=[
      {id:'sdra',label:'SDRA (ARDSnet)',cor:'#f87171'},
      {id:'pav',label:'PAV (Pneumonia VM)',cor:'#fb923c'},
      {id:'asma',label:'Asma / Broncoespasmo',cor:'#facc15'},
      {id:'dpoc',label:'DPOC Exacerbado',cor:'#4ade80'},
      {id:'covid',label:'COVID-19 (SDRA Viral)',cor:'#f87171'},
      {id:'neuro',label:'Neuroprotecao (TCE/AVC)',cor:'#a78bfa'},
      {id:'trauma',label:'Trauma Toracico',cor:'#fb923c'},
      {id:'intraop',label:'Intra-Operatorio',cor:'#60a5fa'},
      {id:'cardio',label:'Cardiopatas (ICC/IAM)',cor:'#f87171'},
      {id:'tep',label:'TEP',cor:'#a78bfa'},
      {id:'obeso',label:'Obeso (IMC>30)',cor:'#facc15'},
      {id:'me',label:'Morte Encefalica (Doador)',cor:'#94a3b8'}
    ];
    var selProts=p.protocoloVM||[];
    h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px">';
    prots.forEach(function(pr){
      var isSelected=selProts.indexOf(pr.id)>=0;
      h+='<button style="text-align:left;padding:6px 8px;border-radius:8px;border:1px solid '+(isSelected?pr.cor+'40':'var(--gb)')+';background:'+(isSelected?pr.cor+'10':'var(--w03)')+';display:flex;align-items:center;gap:6px;cursor:pointer" onclick="ICU.toggleProtocolo(\''+pr.id+'\')">';
      h+='<div style="width:14px;height:14px;border-radius:3px;border:2px solid '+(isSelected?pr.cor:'var(--w30)')+';display:flex;align-items:center;justify-content:center;flex-shrink:0">';
      if(isSelected)h+='<svg viewBox="0 0 24 24" fill="none" stroke="'+pr.cor+'" stroke-width="3" style="width:10px;height:10px"><path d="M4.5 12.75l6 6 9-13.5"/></svg>';
      h+='</div>';
      h+='<span style="font-size:9px;font-weight:600;color:'+(isSelected?pr.cor:'var(--w50)')+';line-height:1.1">'+pr.label+'</span>';
      h+='</button>';
    });
    h+='</div>';
    selProts.forEach(function(pid){
      var pr=prots.filter(function(x){return x.id===pid})[0];
      if(!pr)return;
      h+='<div style="margin-bottom:6px">';
      h+='<button onclick="var c=this.nextElementSibling;var a=this.querySelector(\'.proto-arrow\');if(c.style.display===\'none\'){c.style.display=\'block\';a.style.transform=\'rotate(90deg)\'}else{c.style.display=\'none\';a.style.transform=\'rotate(0deg)\'}" style="width:100%;text-align:left;padding:8px 12px;border-radius:8px;border:1px solid '+pr.cor+'30;background:'+pr.cor+'08;display:flex;align-items:center;gap:8px;cursor:pointer">';
      h+='<svg class="proto-arrow" viewBox="0 0 24 24" fill="none" stroke="'+pr.cor+'" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;transition:transform .2s"><path d="M9 18l6-6-6-6"/></svg>';
      h+='<span style="font-size:10px;font-weight:700;color:'+pr.cor+'">'+pr.label+'</span>';
      h+='</button>';
      h+='<div style="display:none;padding:10px;border-radius:0 0 8px 8px;border:1px solid '+pr.cor+'15;border-top:none;background:'+pr.cor+'03;max-height:500px;overflow-y:auto">';
      h+=ICU.getProtocolContent(pr.id);
      h+='</div></div>';
    });

    // Calculadora Otimizacao de PEEP
    h+='<div style="margin-top:10px">';
    h+='<button onclick="ICU.toggleEvt(\'peepBoxOpen\')" style="width:100%;text-align:left;padding:10px 14px;border-radius:10px;border:1px solid #60a5fa30;background:#60a5fa08;display:flex;align-items:center;gap:8px;cursor:pointer">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;transition:transform .2s;transform:rotate('+(p.peepBoxOpen?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="font-size:11px;font-weight:700;color:#60a5fa">🎯 Otimizacao de PEEP - ΔP e Stress Index</span>';
    h+='</button>';
    h+='<div style="display:'+(p.peepBoxOpen?'block':'none')+';padding:12px;border-radius:0 0 10px 10px;border:1px solid #60a5fa15;border-top:none;background:#60a5fa03">';
    h+='<div style="font-size:10px;color:var(--w40);margin-bottom:8px">Insira os valores de 3 niveis de PEEP para encontrar a configuracao ideal</div>';
    var peepOpt=p.peepOpt||[{peep:'',plato:'',si:''},{peep:'',plato:'',si:''},{peep:'',plato:'',si:''}];
    // 3 tabelas em 1 coluna; cada nivel em uma unica linha (PEEP / Plato / SI)
    h+='<div class="icu-peep-cols">';
    for(var ni=0;ni<3;ni++){
      var nv=peepOpt[ni]||{peep:'',plato:'',si:''};
      h+='<div class="icu-peep-card">';
      h+='<div class="icu-peep-title">Nivel '+(ni+1)+'</div>';
      h+='<div class="icu-peep-row">';
      h+='<div class="icu-peep-field"><span>PEEP</span><input type="number" placeholder="5" value="'+(nv.peep||'')+'" oninput="ICU.setPeepOpt('+ni+',\'peep\',this.value)"></div>';
      h+='<div class="icu-peep-field"><span>Plato</span><input type="number" placeholder="22" value="'+(nv.plato||'')+'" oninput="ICU.setPeepOpt('+ni+',\'plato\',this.value)"></div>';
      h+='<div class="icu-peep-field"><span>SI</span><input type="text" placeholder=">1, <1, =1" value="'+(nv.si||'')+'" oninput="ICU.setPeepOpt('+ni+',\'si\',this.value)"></div>';
      h+='</div>';
      h+='</div>';
    }
    h+='</div>';
    h+='<div style="margin-top:8px;display:flex;gap:8px"><button class="icu-small-btn" onclick="ICU.calcPeepOpt()">Calcular PEEP Ideal</button><button class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearPeepOpt()">Limpar</button></div>';
    h+='<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">';
    h+='<div style="flex:1;min-width:120px;padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:9px;color:var(--w40);line-height:1.6">';
    h+='<b style="color:var(--silver-l)">📊 Driving Pressure (ΔP):</b><br>';
    h+='• Otimo: < 12 cmH₂O<br>• Aceitavel: 12-15 cmH₂O<br>• Elevado: > 15 cmH₂O<br><span style="color:var(--w30)">Formula: ΔP = Pplato - PEEP</span></div>';
    h+='<div style="flex:1;min-width:120px;padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:9px;color:var(--w40);line-height:1.6">';
    h+='<b style="color:var(--silver-l)">📈 Stress Index:</b><br>';
    h+='• Ideal: 0.9 - 1.1<br>• < 0.9: PEEP insuficiente (colapso)<br>• > 1.1: PEEP excessiva (hiperdistensao)<br><span style="color:var(--w30)">Analise da curva PxT em VCV</span></div>';
    h+='</div>';
    h+='</div></div>';
    if(p.peepOptResult){
      h+='<div style="margin-top:8px;padding:10px;border-radius:8px;border:1px solid #4ade8030;background:#4ade8008">';
      h+='<div style="font-size:10px;color:var(--w50)">'+p.peepOptResult+'</div>';
      h+='</div>';
    }

    // PRONA / TITULACAO / RECRUTAMENTO
    h+='<div style="margin-top:10px">';
    h+='<button onclick="ICU.toggleEvt(\'pronaBoxOpen\')" style="width:100%;text-align:left;padding:10px 14px;border-radius:10px;border:1px solid #a78bfa30;background:#a78bfa08;display:flex;align-items:center;gap:8px;cursor:pointer">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;transition:transform .2s;transform:rotate('+(p.pronaBoxOpen?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="font-size:11px;font-weight:700;color:#a78bfa">🫁 Prona / Titulacao / Recrutamento Pulmonar</span>';
    h+='</button>';
    h+='<div style="display:'+(p.pronaBoxOpen?'block':'none')+';padding:12px;border-radius:0 0 10px 10px;border:1px solid #a78bfa15;border-top:none;background:#a78bfa03">';

    // === POSICAO PRONA ===
    h+='<div style="margin-bottom:12px">';
    h+='<div style="font-size:10px;font-weight:700;color:#a78bfa;margin-bottom:8px">🔄 Posicao Prona</div>';
    var pronaAtiva=p.pronaAtiva||false;
    h+='<button onclick="ICU.toggleProna()" style="padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;'+(pronaAtiva?'background:#4ade8020;border:1px solid #4ade8040;color:#4ade80':'background:var(--w05);border:1px solid var(--gb);color:var(--w50)')+'">'+(pronaAtiva?'✅ Prona Ativa':'Iniciar Prona')+'</button>';
    if(pronaAtiva){
      h+='<div class="icu-grid3" style="margin-top:8px">';
      h+='<div class="icu-field"><label>Tempo Prona</label><select onchange="ICU.setR(\'pronaTempo\',this.value);ICU.render()">';
      ['16h','18h','20h','24h'].forEach(function(t){h+='<option value="'+t+'"'+(p.pronaTempo===t?' selected':'')+'>'+t+'</option>';});
      h+='</select></div>';
      h+='<div class="icu-field"><label>Data Inicio</label><input type="date" value="'+(p.pronaData||'')+'" onchange="ICU.setR(\'pronaData\',this.value);ICU.render()" style="padding:4px;font-size:10px"></div>';
      h+='<div class="icu-field"><label>Hora Inicio</label><input type="time" value="'+(p.pronaHora||'')+'" onchange="ICU.setR(\'pronaHora\',this.value);ICU.render()" style="padding:4px;font-size:10px"></div>';
      h+='</div>';
      if(p.pronaData&&p.pronaHora&&p.pronaTempo){
        var horas=parseInt(p.pronaTempo);
        var ini=new Date(p.pronaData+'T'+p.pronaHora);
        var fim=new Date(ini.getTime()+horas*3600000);
        var dd=String(fim.getDate()).padStart(2,'0')+'/'+String(fim.getMonth()+1).padStart(2,'0')+'/'+fim.getFullYear();
        var hh=String(fim.getHours()).padStart(2,'0')+':'+String(fim.getMinutes()).padStart(2,'0');
        var agora=new Date();var restMs=fim.getTime()-agora.getTime();
        var restTxt=restMs<=0?'<span style="color:#f87171">⏰ SUPINAR AGORA!</span>':Math.floor(restMs/3600000)+'h'+Math.floor((restMs%3600000)/60000)+'min restantes';
        h+='<div style="margin-top:6px;padding:8px;border-radius:8px;border:1px solid #4ade8030;background:#4ade8008;font-size:10px;color:var(--w50)">';
        h+='<b>Supinar em:</b> '+dd+' as '+hh+' | '+restTxt;
        h+='</div>';
      }
    }
    if(!p.pronaHist)p.pronaHist=[];
    if(p.pronaHist.length>0){
      h+='<div style="margin-top:6px;font-size:9px;color:var(--w40)">';
      h+='<b>Historico Prona ('+p.pronaHist.length+')</b>';
      p.pronaHist.forEach(function(ph,i){
        h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid var(--gb)">';
        h+='<span>'+ph.data+' '+ph.hora+' → '+ph.tempo+' | Supina: '+ph.supina+'</span>';
        h+='<button onclick="ICU.delPronaHist('+i+')" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:11px">&times;</button>';
        h+='</div>';
      });
      h+='</div>';
    }
    h+='</div>';

    // === MANOBRA RECRUTAMENTO ===
    h+='<div style="margin-bottom:12px">';
    h+='<div style="font-size:10px;font-weight:700;color:#fb923c;margin-bottom:4px">🔄 Manobra de Recrutamento</div>';
    h+='<div style="font-size:8px;color:var(--w30);margin-bottom:6px;line-height:1.5">FiO₂ 100%, FR 10, ΔP 15 cmH₂O | PCV: PEEP +5 a cada 2min ate 25-45 cmH₂O | Apos: PEEP 25, calcular Cest, iniciar titulacao decremental.</div>';
    if(!p.mraTab)p.mraTab=[];
    var mraRows=8;
    if(p.mraTab.length<mraRows){for(var mi=p.mraTab.length;mi<mraRows;mi++)p.mraTab.push({plato:'',peep:'',cest:'',sat:'',pam:'',best:false});}
    h+='<div style="overflow-x:auto"><table class="icu-prona-table" style="width:100%;border-collapse:collapse">';
    h+='<tr style="background:var(--w05)"><th class="icu-prona-th">PLATO</th><th class="icu-prona-th">PEEP</th><th class="icu-prona-th">ΔP</th><th class="icu-prona-th">CEST</th><th class="icu-prona-th">SAT</th><th class="icu-prona-th">PAM</th><th class="icu-prona-th" style="width:22px">★</th></tr>';
    for(var ri=0;ri<mraRows;ri++){
      var mr=p.mraTab[ri];
      var mPlato=parseFloat(mr.plato),mPeep=parseFloat(mr.peep);
      var mDp=(!isNaN(mPlato)&&!isNaN(mPeep))?(mPlato-mPeep).toFixed(0):'';
      var mraRowBg=mr.best?'background:#4ade8015;':'';
      h+='<tr style="'+mraRowBg+'">';
      h+='<td class="icu-prona-td"><input type="number" value="'+(mr.plato||'')+'" onchange="ICU.setMRA('+ri+',\'plato\',this.value);ICU.render()" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(mr.peep||'')+'" onchange="ICU.setMRA('+ri+',\'peep\',this.value);ICU.render()" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td icu-prona-td-num" style="color:'+(mDp&&parseFloat(mDp)>15?'#f87171':'#4ade80')+'">'+mDp+'</td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(mr.cest||'')+'" onchange="ICU.setMRA('+ri+',\'cest\',this.value)" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(mr.sat||'')+'" onchange="ICU.setMRA('+ri+',\'sat\',this.value)" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(mr.pam||'')+'" onchange="ICU.setMRA('+ri+',\'pam\',this.value)" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td icu-prona-td-star"><button type="button" onclick="ICU.toggleMraBest('+ri+')" style="background:none;border:none;cursor:pointer;font-size:11px;color:'+(mr.best?'#4ade80':'var(--w20)')+'">★</button></td></tr>';
    }
    h+='</table></div>';
    h+='<div style="margin-top:6px"><button class="icu-small-btn icu-prona-clear-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearMRA()">Limpar Tabela</button></div>';
    h+='</div>';

    // === TITULACAO PEEP ===
    h+='<div style="margin-bottom:12px">';
    h+='<div style="font-size:10px;font-weight:700;color:#60a5fa;margin-bottom:4px">🔽 Titulacao PEEP Decremental</div>';
    h+='<div style="font-size:8px;color:var(--w30);margin-bottom:6px;line-height:1.5">VCV, Onda Quadrada | PEEP 25: reduzir -2 cmH₂O a cada 4min | PEEP ideal: melhor Cest + 2 cmH₂O.</div>';
    if(!p.titTab)p.titTab=[];
    var titRows=10;
    if(p.titTab.length<titRows){for(var ti2=p.titTab.length;ti2<titRows;ti2++)p.titTab.push({pico:'',plato:'',peep:'',cest:'',si:'',sat:'',pam:'',best:false});}
    h+='<div style="overflow-x:auto"><table class="icu-prona-table icu-tit-table" style="width:100%;border-collapse:collapse">';
    h+='<tr style="background:var(--w05)"><th class="icu-prona-th">PICO</th><th class="icu-prona-th">PLATO</th><th class="icu-prona-th">PEEP</th><th class="icu-prona-th">ΔP</th><th class="icu-prona-th">CEST</th><th class="icu-prona-th">SI</th><th class="icu-prona-th">SAT</th><th class="icu-prona-th">PAM</th><th class="icu-prona-th" style="width:20px">★</th></tr>';
    for(var ti3=0;ti3<titRows;ti3++){
      var tr2=p.titTab[ti3];
      var tPlato=parseFloat(tr2.plato),tPeep=parseFloat(tr2.peep);
      var tDp=(!isNaN(tPlato)&&!isNaN(tPeep))?(tPlato-tPeep).toFixed(0):'';
      var rowBg=tr2.best?'background:#4ade8015;':'';
      h+='<tr style="'+rowBg+'">';
      h+='<td class="icu-prona-td"><input type="number" value="'+(tr2.pico||'')+'" onchange="ICU.setTit('+ti3+',\'pico\',this.value)" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(tr2.plato||'')+'" onchange="ICU.setTit('+ti3+',\'plato\',this.value);ICU.render()" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(tr2.peep||'')+'" onchange="ICU.setTit('+ti3+',\'peep\',this.value);ICU.render()" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td icu-prona-td-num" style="color:'+(tDp&&parseFloat(tDp)>15?'#f87171':'#4ade80')+'">'+tDp+'</td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(tr2.cest||'')+'" onchange="ICU.setTit('+ti3+',\'cest\',this.value)" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td"><input type="text" value="'+(tr2.si||'')+'" onchange="ICU.setTit('+ti3+',\'si\',this.value)" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(tr2.sat||'')+'" onchange="ICU.setTit('+ti3+',\'sat\',this.value)" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td"><input type="number" value="'+(tr2.pam||'')+'" onchange="ICU.setTit('+ti3+',\'pam\',this.value)" class="icu-prona-input"></td>';
      h+='<td class="icu-prona-td icu-prona-td-star"><button type="button" onclick="ICU.toggleTitBest('+ti3+')" style="background:none;border:none;cursor:pointer;font-size:10px;color:'+(tr2.best?'#4ade80':'var(--w20)')+'">★</button></td>';
      h+='</tr>';
    }
    h+='</table></div>';
    var bestTit=p.titTab.find(function(x){return x.best;});
    if(bestTit&&bestTit.peep){
      var peepIdeal=parseFloat(bestTit.peep)+2;
      h+='<div style="margin-top:6px;padding:8px;border-radius:8px;border:1px solid #4ade8030;background:#4ade8008;font-size:10px;color:#4ade80"><b>✅ PEEP Ideal: '+peepIdeal+' cmH₂O</b> (melhor Cest '+bestTit.cest+' + 2)</div>';
    }
    h+='<div style="margin-top:6px"><button class="icu-small-btn icu-prona-clear-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.clearTit()">Limpar Tabela</button></div>';
    h+='</div>';

    // === CALCULADORA RECRUTABILIDADE ===
    h+='<div class="icu-recrutabilidade-calc" style="margin-bottom:8px">';
    h+='<div style="font-size:10px;font-weight:700;color:#22d3ee;margin-bottom:4px">🫁 Calculadora de Recrutabilidade Pulmonar</div>';
    h+='<div class="icu-recrut-protocolo" style="margin-bottom:6px"><b>Protocolo (manobra de recrutamento):</b> (1) Modo volume controlado, fluxo constante; sedar/paralisar se necessario. (2) PEEP basal 5 cmH₂O. (3) Insuflacao progressiva em passos (ex.: 5 → 10 → 15 → 20 → 25 → 30 → 35 → 40 cmH₂O), pausa de 2–3 s no pico em cada passo. (4) Expiracao passiva ate PEEP 5. (5) Repetir ciclo e no passo de 20 cmH₂O medir volume inspiratorio e no passo correspondente da expiracao medir volume expiratorio. (6) Diferenca Vol.Insp − Vol.Exp &gt; 500 mL indica pulmao recrutavel.</div>';
    h+='<div class="icu-grid2" style="margin-bottom:6px">';
    h+='<div class="icu-field"><label>Volume Insp. (mL)</label><input type="number" placeholder="1200" value="'+(p.recVolInsp||'')+'" onchange="ICU.setR(\'recVolInsp\',this.value);ICU.render()" style="padding:5px;font-size:11px;text-align:center"></div>';
    h+='<div class="icu-field"><label>Volume Exp. (mL)</label><input type="number" placeholder="600" value="'+(p.recVolExp||'')+'" onchange="ICU.setR(\'recVolExp\',this.value);ICU.render()" style="padding:5px;font-size:11px;text-align:center"></div>';
    h+='</div>';
    h+='<div class="icu-recrut-protocolo" style="margin-bottom:6px">⚠️ Modo volume controlado, fluxo constante. Sedar paciente e evitar esforcos respiratorios.</div>';
    var recDiff=parseFloat(p.recVolInsp)-parseFloat(p.recVolExp);
    if(p.recVolInsp&&p.recVolExp&&!isNaN(recDiff)){
      var recOk=recDiff>500;
      h+='<div class="icu-recrut-resultado" style="padding:10px;border-radius:8px;border:1px solid '+(recOk?'#4ade8030':'#f8717130')+';background:'+(recOk?'#4ade8008':'#f8717108')+'">';
      h+='<div style="font-size:12px;font-weight:700;color:'+(recOk?'#4ade80':'#f87171')+'">Diferenca: '+recDiff+' mL</div>';
      h+='<div style="font-size:11px;font-weight:700;color:'+(recOk?'#4ade80':'#f87171')+';margin-top:4px">'+(recOk?'✅ PULMAO RECRUTAVEL':'❌ POUCO RECRUTAVEL')+'</div>';
      h+='<div style="font-size:9px;color:var(--w40);margin-top:6px;line-height:1.55">';
      if(recOk){
        h+='<b>Criterio:</b> Diferenca &gt; 500 mL (limiar classico da manobra de recrutamento).<br><b>Significado:</b> Boa resposta ao recrutamento alveolar; predominio de atelectasia reversivel (compliance melhor apos abrir unidades). Tipico de SDRA extrapulmonar (sepse, pancreatite, politrauma, derrame, pos-cirurgico).<br><b>Conduta:</b> PEEP mais alta (12–18 cmH₂O) costuma ser bem tolerada; manobras de recrutamento podem ser beneficas; titular PEEP (ARDSNet ou decremental); considerar prona se P/F &lt; 150.';
      }else{
        h+='<b>Criterio:</b> Diferenca &lt; 500 mL (pouco recrutavel).<br><b>Significado:</b> Pouca ganho de volume com a insuflacao; predominio de consolidacao/doenca parenquimatosa (compliance pouco melhora). Tipico de SDRA pulmonar (pneumonia, aspiracao, COVID-19).<br><b>Conduta:</b> PEEP moderada para evitar hiperdistensao; MRA com cautela (menor beneficio esperado); priorizar ventilacao protetora (VC 4–6 mL/kg PB); considerar pronacao e criterios para ECMO conforme protocolo.';
      }
      h+='</div></div>';
    }
    h+='<div style="margin-top:6px"><button class="icu-small-btn icu-prona-clear-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="ICU.setR(\'recVolInsp\',\'\');ICU.setR(\'recVolExp\',\'\');ICU.render()">Limpar</button></div>';
    h+='</div>';

    h+='</div></div>';
  }

  if(formTab==='motora'){
    h+='<div class="icu-divider">Avaliacao Motora</div>';
    h+=tarea('Avaliacao Motora / Funcional','motora',p.motora);

    // === FORCA MUSCULAR - MRC ===
    h+='<div class="icu-divider">Forca Muscular - MRC</div>';
    var mrcGroups=[
      {label:'Abdução de Ombro',kd:'mrcOmbroD',ke:'mrcOmbroE'},
      {label:'Flexão de Cotovelo',kd:'mrcCotoveloD',ke:'mrcCotoveloE'},
      {label:'Extensão de Punho',kd:'mrcPunhoD',ke:'mrcPunhoE'},
      {label:'Flexão de Quadril',kd:'mrcQuadrilD',ke:'mrcQuadrilE'},
      {label:'Extensão de Joelho',kd:'mrcJoelhoD',ke:'mrcJoelhoE'},
      {label:'Dorsiflexão de Tornozelo',kd:'mrcTornozeloD',ke:'mrcTornozeloE'}
    ];
    h+='<div class="icu-mrc-wrap"><table class="icu-mrc-table">';
    h+='<tr><th>Grupo</th><th>D</th><th>E</th></tr>';
    var mrcTotal=0;var mrcCount=0;
    mrcGroups.forEach(function(g){
      var vd=p[g.kd]||'',ve=p[g.ke]||'';
      if(vd!=='')mrcTotal+=parseInt(vd)||0;
      if(ve!=='')mrcTotal+=parseInt(ve)||0;
      if(vd!=='')mrcCount++;if(ve!=='')mrcCount++;
      h+='<tr><td class="icu-mrc-label">'+g.label+'</td>';
      h+='<td><select class="icu-mrc-sel" onchange="ICU.setR(\''+g.kd+'\',this.value);ICU.render()"><option value="">-</option>';
      for(var s=0;s<=5;s++)h+='<option value="'+s+'"'+(vd===''+s?' selected':'')+'>'+s+'</option>';
      h+='</select></td><td><select class="icu-mrc-sel" onchange="ICU.setR(\''+g.ke+'\',this.value);ICU.render()"><option value="">-</option>';
      for(var s2=0;s2<=5;s2++)h+='<option value="'+s2+'"'+(ve===''+s2?' selected':'')+'>'+s2+'</option>';
      h+='</select></td></tr>';
    });
    h+='</table></div>';
    var mrcInterp=mrcCount===12?(mrcTotal>=48?{txt:'Normal (≥48)',cor:'#4ade80'}:mrcTotal>=36?{txt:'Fraqueza leve (36-47)',cor:'#facc15'}:mrcTotal>=24?{txt:'Fraqueza mod. (24-35)',cor:'#fb923c'}:{txt:'Grave (<24) ICU-AW',cor:'#f87171'}):null;
    h+='<div class="icu-perme-result-row">';
    h+='<div class="icu-calc-compact-box" style="border-color:'+(mrcInterp?mrcInterp.cor+'30':'var(--gb)')+';background:'+(mrcInterp?mrcInterp.cor+'08':'var(--w03)')+'">';
    h+='<span class="icu-calc-label">MRC:</span> <b style="color:'+(mrcInterp?mrcInterp.cor:'var(--w40)')+'">'+(mrcCount===12?mrcTotal:'--')+'/60</b>'+(mrcInterp?' <span style="font-size:9px;color:'+mrcInterp.cor+'">'+mrcInterp.txt+'</span>':' <span style="font-size:8px;color:var(--w30)">Preencha 12 grupos</span>');
    h+='</div>';
    h+='<div class="icu-row-btns-inline"><button class="icu-small-btn icu-btn-sm" onclick="ICU.saveMRC()">Salvar MRC</button><button class="icu-small-btn icu-btn-sm icu-btn-clear" onclick="ICU.clearMRC()">Limpar</button></div>';
    h+='</div>';
    if(!p.mrcHist)p.mrcHist=[];
    if(p.mrcHist.length>0){
      h+='<div style="margin-top:8px;font-size:9px;color:var(--w40)"><b>Historico MRC ('+p.mrcHist.length+')</b>';
      p.mrcHist.forEach(function(m,i){
        h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid var(--gb)">';
        h+='<span>'+m.data+' | MRC: '+m.total+'/60 | '+m.interp+'</span>';
        h+='<button onclick="ICU.delMRCHist('+i+')" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:11px">&times;</button>';
        h+='</div>';
      });
      h+='</div>';
    }

    // === MOBILIDADE - PERME ===
    h+='<div class="icu-divider">Mobilidade - PERME Score</div>';
    var permeItems=[
      {label:'Estado Mental',key:'permeEstado',opts:['Não responde (0)','Responsivo a dor (1)','Responsivo a voz (2)','Alerta e orientado (3)'],vals:[0,1,2,3]},
      {label:'Barreiras a Mobilidade',key:'permeBarreira',opts:['2 ou mais barreiras (0)','1 barreira (1)','Nenhuma barreira (2)'],vals:[0,1,2]},
      {label:'Força Funcional MMSS',key:'permeForcaMS',opts:['Sem movimento (0)','Movimento sem vencer gravidade (1)','Vence gravidade (2)','Resistencia moderada (3)'],vals:[0,1,2,3]},
      {label:'Força Funcional MMII',key:'permeForcaMI',opts:['Sem movimento (0)','Movimento sem vencer gravidade (1)','Vence gravidade (2)','Resistencia moderada (3)'],vals:[0,1,2,3]},
      {label:'Mobilidade no Leito',key:'permeLeito',opts:['Nao realiza (0)','Assistencia total (1)','Assistencia parcial (2)','Independente (3)'],vals:[0,1,2,3]},
      {label:'Transferência Sentado',key:'permeTransf',opts:['Nao realiza (0)','Assistencia total (1)','Assistencia parcial (2)','Independente (3)'],vals:[0,1,2,3]},
      {label:'Capacidade de Marcha',key:'permeMarcha',opts:['Nao deambula (0)','Assist. total / esteira (1)','Assist. parcial (2)','Independente (3)'],vals:[0,1,2,3]}
    ];
    var permeTotal=0;var permeOk=true;
    h+='<div class="icu-perme-row">';
    permeItems.forEach(function(it){
      var v=p[it.key];
      if(v===undefined||v==='')permeOk=false;
      else permeTotal+=parseInt(v)||0;
      h+='<div class="icu-field icu-perme-field"><label>'+it.label+'</label><select class="icu-perme-sel" onchange="ICU.setR(\''+it.key+'\',this.value);ICU.render()"><option value="">-</option>';
      it.opts.forEach(function(o,oi){h+='<option value="'+it.vals[oi]+'"'+(v===''+it.vals[oi]?' selected':'')+'>'+o+'</option>';});
      h+='</select></div>';
    });
    h+='</div>';
    var permeInterp=permeOk?(permeTotal>=16?{txt:'Alta (16-21)',cor:'#4ade80'}:permeTotal>=8?{txt:'Mod. (8-15)',cor:'#facc15'}:{txt:'Baixa (0-7)',cor:'#f87171'}):null;
    h+='<div class="icu-perme-result-row">';
    h+='<div class="icu-calc-compact-box" style="border-color:'+(permeInterp?permeInterp.cor+'30':'var(--gb)')+';background:'+(permeInterp?permeInterp.cor+'08':'var(--w03)')+'">';
    h+='<span class="icu-calc-label">PERME:</span> <b style="color:'+(permeInterp?permeInterp.cor:'var(--w40)')+'">'+(permeOk?permeTotal:'--')+'/21</b>'+(permeInterp?' <span style="font-size:9px;color:'+permeInterp.cor+'">'+permeInterp.txt+'</span>':' <span style="font-size:8px;color:var(--w30)">Preencha itens</span>');
    h+='</div>';
    h+='<div class="icu-row-btns-inline"><button class="icu-small-btn icu-btn-sm" onclick="ICU.savePerme()">Salvar PERME</button><button class="icu-small-btn icu-btn-sm icu-btn-clear" onclick="ICU.clearPerme()">Limpar</button></div>';
    h+='</div>';
    if(!p.permeHist)p.permeHist=[];
    if(p.permeHist.length>0){
      h+='<div style="margin-top:8px;font-size:9px;color:var(--w40)"><b>Historico PERME ('+p.permeHist.length+')</b>';
      p.permeHist.forEach(function(m,i){
        h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid var(--gb)">';
        h+='<span>'+m.data+' | PERME: '+m.total+'/21 | '+m.interp+'</span>';
        h+='<button onclick="ICU.delPermeHist('+i+')" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:11px">&times;</button>';
        h+='</div>';
      });
      h+='</div>';
    }

    // === IMS (ICU Mobility Scale) ===
    h+='<div class="icu-divider">⚡ IMS - ICU Mobility Scale</div>';
    var imsOpts=[
      {val:0,txt:'Nenhuma mobilidade (acamado)'},
      {val:1,txt:'Exercicios no leito'},
      {val:2,txt:'Passivamente movido para cadeira (sem ortostatismo ativo)'},
      {val:3,txt:'Sentado beira-leito'},
      {val:4,txt:'Ortostatismo'},
      {val:5,txt:'Transferencia leito-cadeira (via ortostatismo)'},
      {val:6,txt:'Marcha estacionaria (no lugar)'},
      {val:7,txt:'Deambulacao com assistencia de 2+ pessoas'},
      {val:8,txt:'Deambulacao com assistencia de 1 pessoa'},
      {val:9,txt:'Deambulacao independente com dispositivo'},
      {val:10,txt:'Deambulacao independente sem dispositivo'}
    ];
    var imsVal=p.imsScore;
    var imsInterp=imsVal!==undefined&&imsVal!==''?(parseInt(imsVal)>=7?{txt:'Alta (7-10)',cor:'#4ade80'}:parseInt(imsVal)>=4?{txt:'Mod. (4-6)',cor:'#facc15'}:parseInt(imsVal)>=1?{txt:'Baixa (1-3)',cor:'#fb923c'}:{txt:'Imobilidade (0)',cor:'#f87171'}):null;
    h+='<div class="icu-ims-row">';
    h+='<div class="icu-field icu-ims-field"><label>IMS</label><select class="icu-ims-sel" onchange="ICU.setR(\'imsScore\',this.value);ICU.render()"><option value="">-</option>';
    imsOpts.forEach(function(o){h+='<option value="'+o.val+'"'+(imsVal===''+o.val?' selected':'')+'>'+o.val+' - '+o.txt+'</option>';});
    h+='</select></div>';
    h+='<div class="icu-calc-compact-box icu-ims-result" style="border-color:'+(imsInterp?imsInterp.cor+'30':'var(--gb)')+';background:'+(imsInterp?imsInterp.cor+'08':'var(--w03)')+'">';
    h+='<span class="icu-calc-label">IMS:</span> <b style="color:'+(imsInterp?imsInterp.cor:'var(--w40)')+'">'+(imsVal!==undefined&&imsVal!==''?imsVal:'--')+'/10</b>'+(imsInterp?' <span style="font-size:9px;color:'+imsInterp.cor+'">'+imsInterp.txt+'</span>':'');
    h+='</div>';
    h+='<button class="icu-small-btn icu-btn-sm" onclick="ICU.saveIMS()">Salvar</button><button class="icu-small-btn icu-btn-sm icu-btn-clear" onclick="ICU.clearIMS()">Limpar</button>';
    h+='</div>';
    if(!p.imsHist)p.imsHist=[];
    if(p.imsHist.length>0){
      h+='<div style="margin-top:8px;font-size:9px;color:var(--w40)"><b>Historico IMS ('+p.imsHist.length+')</b>';
      p.imsHist.forEach(function(m,i){
        h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid var(--gb)">';
        h+='<span>'+m.data+' | IMS: '+m.score+'/10 | '+m.interp+'</span>';
        h+='<button onclick="ICU.delIMSHist('+i+')" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:11px">&times;</button>';
        h+='</div>';
      });
      h+='</div>';
    }
  }

  if(formTab==='percepcao'){
    h+='<div class="icu-divider">Percepcao</div>';
    h+=tarea('Percepcao do Plantao','percepcao',p.percepcao);
    h+='<div class="icu-divider">Pendencias</div>';
    h+=tarea('Pendencias','pendencias',p.pendencias);
    h+='<div class="icu-divider">Condutas</div>';
    h+=tarea('Condutas','condutas',p.condutas);
  }

  // Nav arrows at bottom
  var order=['dados','neuro','cardio','resp','motora','percepcao'];
  var labels=['Dados','Neuro','Cardio','Resp','Motora','Pend.'];
  var ci=order.indexOf(formTab);
  h+='<div class="icu-nav-arrows">';
  if(ci>0)h+='<button class="icu-nav-btn" onclick="ICU.prevTab()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="m15 18-6-6 6-6"/></svg> '+labels[ci-1]+'</button>';
  else h+='<div></div>';
  if(ci<order.length-1)h+='<button class="icu-nav-btn icu-nav-next" onclick="ICU.nextTab()">'+labels[ci+1]+' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="m9 18 6-6-6-6"/></svg></button>';
  else h+='<button class="icu-nav-btn icu-nav-done" onclick="ICU.saveAndClose()">Concluir <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M4.5 12.75l6 6 9-13.5"/></svg></button>';
  h+='</div>';

  h+='</div>';
  h+='<div style="height:40px"></div></div>';
  var scrollY=ct.scrollTop;
  ct.innerHTML=h;
  ct.scrollTop=scrollY;
  ct.querySelectorAll('textarea').forEach(function(ta){var minH=ta.classList.contains('icu-textarea-resp')?28:0;if(ta.value||minH){ta.style.height='auto';ta.style.height=Math.max(minH,ta.scrollHeight)+'px';}});
  ICU.liveVM();
  ICU.liveDesmame();
}

function field(label,key,val,type,ph){
  return '<div class="icu-field"><label>'+label+'</label><input type="'+type+'" value="'+(val||'')+'" placeholder="'+(ph||'')+'" onchange="ICU.set(\''+key+'\',this.value)" onblur="ICU.saveField()"/></div>';
}
function fieldVM(label,key,val,type,ph){
  return '<div class="icu-field"><label>'+label+'</label><input type="'+type+'" value="'+(val||'')+'" placeholder="'+(ph||'')+'" oninput="ICU.set(\''+key+'\',this.value);ICU.liveVM();ICU.liveDesmame()" onblur="ICU.saveField()"/></div>';
}
function tarea(label,key,val){
  return '<div class="icu-field icu-tarea-compact"><label>'+label+'</label><textarea rows="1" class="icu-textarea-compact" style="min-height:32px" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'" onchange="ICU.set(\''+key+'\',this.value)" onblur="ICU.saveField()" placeholder="...">'+(val||'')+'</textarea></div>';
}
function opts(arr,sel){
  return arr.map(function(o){return '<option value="'+o[0]+'"'+(sel===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('');
}

// PERSISTENCE — Supabase como fonte principal; localStorage como cache/fallback
function save(){
  try{
    localStorage.setItem('icu_patients',JSON.stringify(patients));
    localStorage.setItem('icu_trash',JSON.stringify(trashPatients));
  }catch(e){}
  if(window.SEA_DB&&typeof window.dbSaveToolData==='function'){
    return window.dbSaveToolData('icu_patients',{patients:patients,trash:trashPatients}).then(function(res){
      if(res&&res.ok===false){
        try{if(typeof navigator!=='undefined'&&navigator&&navigator.onLine===false)return res;}catch(e){}
        try{if(window.showToast)window.showToast('Falha ao sincronizar pacientes.');}catch(e){}
      }
      return res;
    }).catch(function(err){
      try{console.warn('ICU Supabase save:',err);}catch(e){}
      try{if(typeof navigator!=='undefined'&&navigator&&navigator.onLine===false)return {ok:false,error:err};}catch(e){}
      try{if(window.showToast)window.showToast('Falha ao sincronizar pacientes.');}catch(e){}
      return {ok:false,error:err};
    });
  }
  return null;
}
function load(){
  function applyLocal(){
    try{
      var d=localStorage.getItem('icu_patients');if(d)patients=JSON.parse(d);
      var t=localStorage.getItem('icu_trash');if(t)trashPatients=JSON.parse(t);
    }catch(e){}
  }
  if(window.SEA_DB&&typeof window.dbLoadToolData==='function'){
    window.dbLoadToolData('icu_patients').then(function(cloud){
      if(cloud&&typeof cloud==='object'){
        if(cloud.patients&&Array.isArray(cloud.patients)){ patients=cloud.patients; try{localStorage.setItem('icu_patients',JSON.stringify(patients));}catch(e){} }
        if(cloud.trash&&Array.isArray(cloud.trash)){ trashPatients=cloud.trash; try{localStorage.setItem('icu_trash',JSON.stringify(trashPatients));}catch(e){} }
      }
      if(typeof renderICU==='function')renderICU();
    }).catch(function(){
      applyLocal();
      if(typeof renderICU==='function')renderICU();
    });
  }else{
    applyLocal();
  }
}

// API PUBLICA
// ==================== REFERENCIA CLINICA ====================
var clinicalSystems=[
{id:'cardiovascular',name:'Sistema Cardiovascular',icon:'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',color:'#f87171',problems:(window.CARDIOVASCULAR_PROBLEMS||[])},
{id:'respiratory',name:'Sistema Respiratorio',icon:'M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-7.065c-.022-.826-.16-1.875-.903-2.373-.715-.478-1.755-.142-2.29.526-1.084 1.352-2.07 1.934-3.862 1.934s-2.778-.582-3.862-1.934c-.535-.668-1.575-1.004-2.29-.526-.743.498-.881 1.547-.903 2.373a23.91 23.91 0 01-1.152 7.065C5.353 13.258 9.117 12.75 12 12.75z',color:'#38bdf8',problems:(window.RESPIRATORY_PROBLEMS||[])},
{id:'neurological',name:'Sistema Neurologico',icon:'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',color:'#c084fc',problems:(window.NEUROLOGICAL_PROBLEMS||[])},
{id:'renal',name:'Sistema Renal',icon:'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636',color:'#fbbf24',problems:[
{name:'IRA',desc:'Deterioracao aguda da funcao renal',assess:['KDIGO (Cr e debito urinario)','Causa (pre, renal, pos)','Sedimento urinario','USG renal'],interv:['Otimizar volemia','Suspender nefrotoxicos','Ajustar doses','TRS se indicada']},
{name:'Hipercalemia Grave',desc:'Potassio serico elevado com risco de arritmia',assess:['K > 6.5 mEq/L ou ECG alterado','Causa','Funcao renal','Medicacoes'],interv:['Gluconato de calcio (estabilizacao)','Insulina + glicose','Beta-2 agonista','Resina de troca','Dialise se refratario']},
{name:'Hipocalemia Grave',desc:'Potassio serico baixo com risco de arritmia',assess:['K < 2.5 mEq/L ou sintomatico','ECG','Magnesio','Causa'],interv:['Reposicao IV (max 20 mEq/h)','Corrigir magnesio','Monitorizacao cardiaca','Tratar causa']},
{name:'Hiponatremia Grave',desc:'Sodio serico baixo com sintomas neurologicos',assess:['Na < 125 mEq/L ou sintomatico','Osmolaridade serica/urinaria','Volemia','Velocidade de queda'],interv:['Salina hipertonica 3% se sintomatico','Correcao lenta (8-10 mEq/L/24h)','Tratar causa base']},
{name:'Hipernatremia Grave',desc:'Sodio serico elevado com desidratacao',assess:['Na > 155 mEq/L','Osmolaridade','Deficit de agua livre','Causa'],interv:['Reposicao de agua livre','Correcao lenta (10-12 mEq/L/24h)','Tratar causa base']},
{name:'Acidose Metabolica Grave',desc:'pH baixo com bicarbonato reduzido',assess:['pH < 7.2','HCO3 baixo','Anion gap','Lactato','Cetonas'],interv:['Tratar causa base','Bicarbonato se pH < 7.1','Dialise se intoxicacao','Suporte hemodinamico']},
{name:'Alcalose Metabolica',desc:'pH elevado com bicarbonato aumentado',assess:['pH > 7.45','HCO3 elevado','Cl urinario','Causa (vomitos, diureticos)'],interv:['Reposicao de cloreto','Suspender diureticos','Acetazolamida','Dialise se grave']},
{name:'Sindrome Hepatorrenal',desc:'IRA funcional em hepatopata',assess:['Criterios diagnosticos','Exclusao de outras causas','Ascite','Funcao hepatica'],interv:['Albumina + terlipressina','Suspender diureticos','Considerar TIPS','Transplante hepatico']},
{name:'Rabdomiolise',desc:'Destruicao muscular com liberacao de mioglobina',assess:['CPK elevada (> 5x)','Mioglobinuria','IRA','Hipercalemia','Causa'],interv:['Hidratacao agressiva','Manter debito urinario > 200ml/h','Alcalinizacao controversa','TRS se necessario']},
{name:'Sobrecarga Volemica',desc:'Excesso de volume com congestao',assess:['Balanco hidrico positivo','Edema','Congestao pulmonar','PVC elevada'],interv:['Diureticos','Restricao hidrica','Ultrafiltracao','TRS se refratario']},
{name:'Sindrome Cardiorrenal',desc:'Disfuncao cardiaca e renal concomitante',assess:['Tipo (1-5)','Funcao cardiaca','Funcao renal','Volemia'],interv:['Otimizar volemia','Inotropicos','Diureticos com cautela','Ultrafiltracao']}
]},
{id:'infectious',name:'Infectologia',icon:'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',color:'#4ade80',problems:[
{name:'Sepse',desc:'Disfuncao organica por resposta desregulada a infeccao',assess:['qSOFA/SOFA','Foco infeccioso','Lactato','Culturas','PCR/Procalcitonina'],interv:['ATB em 1 hora','Ressuscitacao volemica','Vasopressores se necessario','Controle de foco']},
{name:'Infeccao de Corrente Sanguinea',desc:'Bacteremia com repercussao clinica',assess:['Hemoculturas (2 pares)','Foco primario','Cateter vascular','ECO se S. aureus'],interv:['ATB de amplo espectro','Remover cateter suspeito','Descalonamento','Duracao adequada']},
{name:'Infeccao de Sitio Cirurgico',desc:'Infeccao relacionada a procedimento cirurgico',assess:['Sinais locais','Febre','Culturas','Imagem se profunda'],interv:['Drenagem cirurgica','ATB direcionado','Desbridamento se necessario']},
{name:'ITU Associada a Cateter',desc:'ITU em paciente com SVD > 48h',assess:['Sintomas','Urocultura > 10^3 UFC','Piuria','Tempo de cateter'],interv:['ATB direcionado','Trocar/remover cateter','Duracao 7-14 dias']},
{name:'C. difficile',desc:'Colite associada a antibioticos',assess:['Diarreia + ATB previo','Toxina nas fezes','PCR','Leucocitose','Megacolon'],interv:['Suspender ATB precipitante','Vancomicina VO (1a linha)','Fidaxomicina','Colectomia se grave']},
{name:'Candidemia',desc:'Infeccao fungica sistemica por Candida',assess:['Fatores de risco','Hemoculturas','Fundo de olho','1,3 beta-glucana'],interv:['Equinocandina (1a linha)','Remover cateteres','ECO','Fundo de olho','Duracao 14 dias apos clearance']},
{name:'Aspergilose Invasiva',desc:'Infeccao fungica por Aspergillus',assess:['Imunossupressao','TC de torax (sinal do halo)','Galactomanana','LBA'],interv:['Voriconazol (1a linha)','Anfotericina B lipossomal','Cirurgia se localizada']},
{name:'TB em UTI',desc:'TB ativa em paciente critico',assess:['Sintomas','Imagem','Baciloscopia','GeneXpert','Cultura'],interv:['RIPE','Isolamento respiratorio','Ajuste para funcao renal/hepatica','Interacoes medicamentosas']},
{name:'COVID-19 Grave',desc:'Infeccao por SARS-CoV-2 com IRpA',assess:['RT-PCR','TC de torax','D-dimero','Ferritina','IL-6','P/F'],interv:['Dexametasona','Anticoagulacao profilatica/plena','VM protetora','Posicao prona','Tocilizumab se indicado']},
{name:'Neutropenia Febril',desc:'Febre em paciente com neutrofilos < 500',assess:['Contagem de neutrofilos','Foco infeccioso','Culturas','MASCC score'],interv:['ATB anti-pseudomonas em 1h','Antifungico se febre persistente','G-CSF se indicado']}
]},
{id:'metabolic',name:'Endocrino/Metabolico',icon:'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',color:'#fb923c',problems:[
{name:'Cetoacidose Diabetica',desc:'Emergencia hiperglicemica com cetose e acidose',assess:['Glicemia > 250','pH < 7.3','Cetonas +','Anion gap elevado','K inicial'],interv:['Hidratacao vigorosa','Insulina IV','Reposicao de potassio','Monitorizacao horaria','Bicarbonato se pH < 6.9']},
{name:'Estado Hiperglicemico Hiperosmolar',desc:'Hiperglicemia extrema com desidratacao severa',assess:['Glicemia > 600','Osmolaridade > 320','Sem cetose significativa','Desidratacao'],interv:['Hidratacao agressiva','Insulina IV (apos volume)','Correcao de eletrolitos','Prevencao de TEV']},
{name:'Hipoglicemia Grave',desc:'Glicemia baixa com alteracao neurologica',assess:['Glicemia < 40-50 mg/dL','Triade de Whipple','Causa','Medicacoes'],interv:['Glicose IV 25-50g','Glucagon se sem acesso','Alimentacao quando possivel','Investigar causa']},
{name:'Crise Tireotoxica',desc:'Hipertireoidismo descompensado grave',assess:['Score de Burch-Wartofsky','TSH suprimido','T4L elevado','Precipitante'],interv:['Propiltiouracil ou Metimazol','Beta-bloqueador','Corticoide','Solucao de Lugol (apos 1h de PTU)','Suporte']},
{name:'Coma Mixedematoso',desc:'Hipotireoidismo descompensado grave',assess:['TSH elevado','T4L baixo','Hipotermia','Bradicardia','Alteracao de consciencia'],interv:['Levotiroxina IV','Hidrocortisona','Aquecimento passivo','Suporte ventilatorio/hemodinamico']},
{name:'Insuficiencia Adrenal Aguda',desc:'Deficiencia aguda de cortisol',assess:['Hipotensao refrataria','Hiponatremia','Hipercalemia','Cortisol basal','Teste de estimulo'],interv:['Hidrocortisona IV','Ressuscitacao volemica','Tratar precipitante']},
{name:'Hipercalcemia Grave',desc:'Calcio serico elevado com sintomas',assess:['Ca > 14 mg/dL ou sintomatico','PTH','Vitamina D','Malignidade','ECG'],interv:['Hidratacao vigorosa','Furosemida','Bifosfonatos','Calcitonina','Dialise se refratario']},
{name:'Hipocalcemia Grave',desc:'Calcio serico baixo com sintomas',assess:['Ca corrigido < 7.5 ou sintomatico','PTH','Magnesio','Vitamina D','ECG'],interv:['Gluconato de calcio IV','Infusao continua','Corrigir magnesio','Vitamina D']},
{name:'Hipofosfatemia Grave',desc:'Fosforo serico criticamente baixo',assess:['P < 1 mg/dL','Fraqueza muscular','IRpA','Causa'],interv:['Reposicao IV de fosfato','Monitorar calcio','Tratar causa']},
{name:'Hipomagnesemia Grave',desc:'Magnesio serico baixo',assess:['Mg < 1 mEq/L','Arritmias','Tetania','Hipocalemia refrataria'],interv:['Sulfato de magnesio IV','Monitorizacao cardiaca','Tratar causa']}
]},
{id:'gastrointestinal',name:'Sistema Gastrointestinal',icon:'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',color:'#facc15',problems:[
{name:'HDA',desc:'Sangramento acima do angulo de Treitz',assess:['Estabilidade hemodinamica','Glasgow-Blatchford','Hemoglobina','EDA'],interv:['Ressuscitacao volemica','IBP IV','EDA em 24h','Hemostasia endoscopica','Octreotide se varicosa']},
{name:'HDB',desc:'Sangramento abaixo do angulo de Treitz',assess:['Hematoquezia','Estabilidade','Colonoscopia','AngioTC'],interv:['Ressuscitacao','Colonoscopia','Embolizacao','Cirurgia se refratario']},
{name:'Hemorragia Varicosa',desc:'Sangramento por varizes esofagicas',assess:['Estigmas de hepatopatia','Hemodinamica','Child-Pugh','MELD'],interv:['Octreotide/Terlipressina','ATB profilatico','EDA + ligadura elastica','TIPS se refratario','Balao de Sengstaken']},
{name:'Pancreatite Aguda Grave',desc:'Inflamacao pancreatica com disfuncao organica',assess:['Ranson/APACHE II/BISAP','Lipase/Amilase','TC com contraste','Necrose','Colecoes'],interv:['Ressuscitacao volemica agressiva','Analgesia','Nutricao enteral precoce','ATB se necrose infectada','Drenagem/Necrosectomia']},
{name:'Colangite Aguda',desc:'Infeccao das vias biliares',assess:['Triade de Charcot','Pentade de Reynolds','USG/TC','Bilirrubinas'],interv:['ATB de amplo espectro','CPRE para drenagem','Suporte hemodinamico']},
{name:'Insuficiencia Hepatica Aguda',desc:'Falencia hepatica com encefalopatia em figado previamente saudavel',assess:['INR','Bilirrubinas','Amonia','Encefalopatia','Causa (viral, drogas, isquemia)'],interv:['Suporte intensivo','N-acetilcisteina','Manejo de HIC','Transplante hepatico']},
{name:'PBE',desc:'Peritonite bacteriana espontanea',assess:['Paracentese diagnostica','GASA','PMN > 250','Cultura'],interv:['Cefotaxima/Ceftriaxona','Albumina (1.5g/kg D1, 1g/kg D3)','TIPS se refrataria']},
{name:'Ileo Paralitico',desc:'Ausencia de peristalse sem obstrucao mecanica',assess:['Distensao abdominal','Ausencia de RHA','RX/TC','Eletrolitos'],interv:['Jejum','SNG','Correcao de eletrolitos','Mobilizacao','Neostigmina se refratario']},
{name:'Obstrucao Intestinal',desc:'Bloqueio mecanico do transito intestinal',assess:['Dor, distensao, vomitos','RHA aumentados/ausentes','TC de abdome','Sinais de estrangulamento'],interv:['Jejum + SNG','Ressuscitacao volemica','Cirurgia se estrangulamento','Tratamento conservador inicial']},
{name:'Isquemia Mesenterica',desc:'Comprometimento vascular intestinal',assess:['Dor desproporcional ao exame','Lactato','AngioTC','Acidose'],interv:['Ressuscitacao','Anticoagulacao','Cirurgia/Embolectomia','Resseccao de segmento necrotico']},
{name:'Sindrome Compartimental Abdominal',desc:'PIA elevada com disfuncao organica',assess:['PIA > 20 mmHg + disfuncao','Medida vesical','Distensao','Oliguria'],interv:['Posicionamento','Drenagem de colecoes','Descompressao cirurgica','Sedacao/BNM']}
]},
{id:'hematologic',name:'Sistema Hematologico',icon:'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z',color:'#f87171',problems:[
{name:'CIVD',desc:'Ativacao sistemica da coagulacao com consumo',assess:['ISTH DIC Score','Plaquetas','Fibrinogenio','D-dimero','TP/TTPA'],interv:['Tratar causa base','Plasma se sangramento + TP alargado','Plaquetas se < 50k + sangramento','Crioprecipitado se fibrinogenio < 100']},
{name:'HIT',desc:'Trombocitopenia imune por exposicao a heparina',assess:['Escore 4T','Queda > 50% plaquetas','Timing D5-14','Anti-PF4'],interv:['Suspender toda heparina','Anticoagulante alternativo (argatroban, fondaparinux)','Nao transfundir plaquetas']},
{name:'Anemia Hemolitica Aguda',desc:'Destruicao acelerada de hemacias',assess:['Reticulocitos','LDH','Bilirrubina indireta','Haptoglobina','Coombs'],interv:['Transfusao cautelosa','Corticoide se autoimune','Plasmaferese se PTT','Tratar causa base']},
{name:'PTT',desc:'Microangiopatia trombotica com pentade classica',assess:['Anemia hemolitica microangiopatica','Trombocitopenia','Esquizocitos','ADAMTS13'],interv:['Plasmaferese urgente','Corticoide','Rituximab','NAO transfundir plaquetas']},
{name:'Sindrome Hemofagocitica',desc:'Ativacao imune descontrolada',assess:['H-Score','Febre','Esplenomegalia','Citopenias','Ferritina > 500','Triglicerideos'],interv:['Tratar causa base','Dexametasona','Etoposideo','Ciclosporina']},
{name:'Neutropenia Febril',desc:'Febre em paciente com neutrofilos < 500',assess:['Contagem de neutrofilos','Foco infeccioso','Culturas','MASCC score'],interv:['ATB anti-pseudomonas em 1h','Antifungico se febre persistente','G-CSF se indicado']},
{name:'Transfusao Macica',desc:'Reposicao de > 10 CH em 24h ou > 1 volemia',assess:['Coagulopatia','Hipotermia','Hipocalcemia','Hipercalemia','Acidose'],interv:['Protocolo de transfusao macica (1:1:1)','Aquecimento','Calcio','Acido tranexamico']},
{name:'Reacao Transfusional Hemolitica',desc:'Hemolise por incompatibilidade',assess:['Febre','Hemoglobinuria','Dor lombar','Hipotensao','Coombs direto'],interv:['Parar transfusao imediatamente','Hidratacao vigorosa','Manter debito urinario','Suporte']},
{name:'TRALI',desc:'Lesao pulmonar aguda relacionada a transfusao',assess:['Dispneia aguda durante/apos transfusao','Hipoxemia','Infiltrado bilateral','Sem sobrecarga'],interv:['Suporte ventilatorio','Nao ha tratamento especifico','Notificar banco de sangue']},
{name:'TEV',desc:'TVP e/ou TEP',assess:['D-dimero','USG Doppler','AngioTC','Score de Wells'],interv:['Anticoagulacao plena','Trombolise se TEP macico','Filtro de VCI se contraindicacao']}
]},
{id:'functional',name:'Sistema Funcional',icon:'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',color:'#a78bfa',problems:(window.FUNCTIONAL_PROBLEMS||[])},
{id:'trauma',name:'Sistema Trauma/Ortopedia',icon:'M8.25 3v1.5M4.5 8.25H3m3.75 8.25h-.75M3 12h.75M8.25 8.25V12m0-3.75v1.5M12 3v1.5m0 9V21m-3.75-9h.75M12 8.25h.75m-9 3.75h.75M12 12h.75',color:'#fb923c',problems:(window.TRAUMA_PROBLEMS||[])},
{id:'perioperative',name:'Sistema Perioperatorio',icon:'M11.42 15.17L4.277 12.936C3.486 12.7 3 11.94 3 11.11V4.89c0-.83.486-1.59 1.277-1.756l7.14-2.234a.75.75 0 01.477 1.423L4.5 6.11v4.78l6.398 2.034a.75.75 0 11-.476 1.424zM21 3a.75.75 0 00-1.5 0v2.25H18a.75.75 0 000 1.5h1.5v4.25H18a.75.75 0 000 1.5h1.5V21a.75.75 0 001.5 0v-2.25H21a.75.75 0 000-1.5h-1.5V7.5H21a.75.75 0 000-1.5h-1.5V3z',color:'#34d399',problems:(window.PERIOPERATIVE_PROBLEMS||[])},
{id:'infectionsSepsis',name:'Sistema Infeccoes/Sepse',icon:'M15.362 5.214A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751H10.5',color:'#f97316',problems:(window.INFECTIONS_SEPSIS_PROBLEMS||[])},
{id:'populations',name:'Sistema Populacoes Especiais',icon:'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',color:'#e879f9',problems:(window.POPULATIONS_PROBLEMS||[])}
];

var refExpSys=null;
var refExpProb=null;
var refSearch='';

function renderRef(){
  var ct=document.getElementById('icu-content');
  if(!ct)return;
  var total=0;clinicalSystems.forEach(function(s){total+=s.problems.length;});
  var filtered=clinicalSystems.map(function(s){
    var probs=s.problems.filter(function(p){
      if(!refSearch)return true;
      var q=refSearch.toLowerCase();
      return p.name.toLowerCase().indexOf(q)>=0||p.desc.toLowerCase().indexOf(q)>=0;
    });
    return{id:s.id,name:s.name,icon:s.icon,color:s.color,problems:probs};
  }).filter(function(s){return s.problems.length>0;});

  var h='<div class="icu-form-head"><button onclick="ICU.closeRef()" style="background:none;border:none;color:var(--w40);cursor:pointer;font-size:18px;padding:4px">&larr;</button><span style="font-size:14px;font-weight:800;color:var(--silver-l)">Referencia Clinica</span><span style="font-size:11px;color:var(--w40);margin-left:auto">'+total+' problemas &bull; '+clinicalSystems.length+' sistemas</span></div>';
  h+='<div style="position:relative;margin-bottom:12px"><svg viewBox="0 0 24 24" fill="none" stroke="var(--w30)" stroke-width="2" style="width:16px;height:16px;position:absolute;left:12px;top:50%;transform:translateY(-50%)"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Buscar problema clinico..." value="'+refSearch+'" oninput="ICU.refFilter(this.value)" style="width:100%;padding:10px 12px 10px 36px;background:var(--w03);border:1px solid var(--gb);border-radius:12px;color:var(--silver-l);font-family:var(--font);font-size:12px;outline:none"></div>';

  if(!filtered.length){
    h+='<div style="text-align:center;padding:40px;color:var(--w40)">Nenhum problema encontrado para "'+refSearch+'"</div>';
  }else{
    filtered.forEach(function(sys){
      var isExp=refExpSys===sys.id;
      h+='<div class="glass2" style="border-radius:14px;overflow:hidden;margin-bottom:8px;border:1px solid var(--gb)">';
      h+='<button onclick="ICU.refToggleSys(\''+sys.id+'\')" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:none;border:none;color:var(--silver-l);cursor:pointer;font-family:var(--font)">';
      h+='<div style="display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:10px;background:'+sys.color+'15;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="'+sys.color+'" stroke-width="1.5" style="width:18px;height:18px"><path d="'+sys.icon+'"/></svg></div><div style="text-align:left"><div style="font-size:13px;font-weight:700">'+sys.name+'</div><div style="font-size:11px;color:var(--w40)">'+sys.problems.length+' problemas</div></div></div>';
      h+='<svg viewBox="0 0 24 24" fill="none" stroke="var(--w40)" stroke-width="2" style="width:16px;height:16px;transition:transform .2s;transform:rotate('+(isExp?'90':'0')+'deg)"><path d="m9 18 6-6-6-6"/></svg>';
      h+='</button>';
      if(isExp){
        h+='<div style="border-top:1px solid var(--gb);padding:10px;max-height:500px;overflow-y:auto">';
        var lastBlock='';
        sys.problems.forEach(function(prob,idx){
          var pid=sys.id+'-'+idx;
          var pExp=refExpProb===pid;
          if(prob.block&&prob.block!==lastBlock){
            lastBlock=prob.block;
            h+='<div style="font-size:10px;font-weight:800;color:'+sys.color+';letter-spacing:.5px;margin:8px 0 6px 0;padding-bottom:4px;border-bottom:1px solid var(--gb)">'+prob.block+'</div>';
          }
          h+='<div style="background:var(--w03);border-radius:10px;overflow:hidden;margin-bottom:6px">';
          h+='<button onclick="ICU.refToggleProb(\''+pid+'\')" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:none;border:none;color:var(--silver-l);cursor:pointer;font-family:var(--font)">';
          h+='<div style="text-align:left"><div style="font-size:12px;font-weight:600">'+prob.name+'</div><div style="font-size:10px;color:var(--w40)">'+prob.desc+'</div></div>';
          h+='<svg viewBox="0 0 24 24" fill="none" stroke="var(--w40)" stroke-width="2" style="width:14px;height:14px;transition:transform .2s;transform:rotate('+(pExp?'90':'0')+'deg);flex-shrink:0"><path d="m9 18 6-6-6-6"/></svg>';
          h+='</button>';
          if(pExp){
            h+='<div style="border-top:1px solid var(--gb);padding:12px">';
            if(prob.goals&&prob.goals.length){h+='<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:800;color:var(--w40);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Objetivos</div>';prob.goals.forEach(function(g){h+='<div style="font-size:11px;color:var(--w50);padding:2px 0;display:flex;gap:6px"><span style="color:'+sys.color+'">&#8226;</span>'+g+'</div>';});h+='</div>';}
            if(prob.assess&&prob.assess.length){h+='<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:800;color:var(--w40);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Avaliacao</div>';prob.assess.forEach(function(a){h+='<div style="font-size:11px;color:var(--w50);padding:2px 0;display:flex;gap:6px"><span style="color:'+sys.color+'">&#8226;</span>'+a+'</div>';});h+='</div>';}
            if(prob.phases&&prob.phases.length){prob.phases.forEach(function(ph){h+='<div style="margin-bottom:8px"><div style="font-size:10px;font-weight:700;color:'+sys.color+';margin-bottom:4px">&#8987; '+ph.timeframe+'</div>';(ph.interv||[]).forEach(function(v){h+='<div style="font-size:11px;color:var(--w50);padding:2px 0;display:flex;gap:6px"><span style="color:var(--w40)">&#8594;</span>'+v+'</div>';});h+='</div>';});}
            if(prob.interv&&prob.interv.length){h+='<div><div style="font-size:10px;font-weight:800;color:var(--w40);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Condutas / Intervencoes</div>';prob.interv.forEach(function(v){h+='<div style="font-size:11px;color:var(--w50);padding:2px 0;display:flex;gap:6px"><span style="color:'+sys.color+'">&#8226;</span>'+v+'</div>';});h+='</div>';}
            h+='</div>';
          }
          h+='</div>';
        });
        h+='</div>';
      }
      h+='</div>';
    });
  }
  ct.innerHTML=h;
}

var showingRef=false;

function updatePageHdr(){var el=document.getElementById('icu-page-hdr');if(el)el.style.display=editingId?'none':'flex';}

window.ICU={
  render:function(){renderForm();},
  isEditing:function(){return !!editingId;},
  init:function(){try{load();renderICU();}catch(e){showDbg('init: '+e.message+' '+e.stack);}},
  addPatient:function(){try{if(patients.length>=MAX_PATIENTS)return;var p=newPatient();patients.push(p);editingId=p.id;formTab='dados';save();renderForm();updatePageHdr();}catch(e){showDbg('addPatient: '+e.message);}},
  editPatient:function(id){try{editingId=id;formTab='dados';renderForm();updatePageHdr();}catch(e){showDbg('editPatient: '+e.message+' '+e.stack);}},
  closeForm:function(){
    try{
      editingId=null;
      showingRef=false;
      save();
      var ct=document.getElementById('icu-content');
      if(ct)ct.innerHTML='';
      renderICU();
      updatePageHdr();
      var ps=document.querySelector('#page-icu-plantao .page-scroll');
      if(ps)ps.scrollTop=0;
    }catch(e){showDbg('closeForm: '+e.message+' '+e.stack);}
  },
  saveAndClose:function(){
    try{
      var syncP=save();
      editingId=null;
      showingRef=false;
      var ct=document.getElementById('icu-content');
      if(ct)ct.innerHTML='';
      renderICU();
      updatePageHdr();
      var ps=document.querySelector('#page-icu-plantao .page-scroll');
      if(ps)ps.scrollTop=0;
      var isOffline=false;
      try{isOffline=(typeof navigator!=='undefined'&&navigator&&navigator.onLine===false);}catch(e){}
      if(isOffline){
        if(window.showToast)showToast('Paciente salvo!');
        return;
      }
      if(syncP&&typeof syncP.then==='function'){
        syncP.then(function(res){
          if(res&&res.ok===true){
            try{if(window.showToast)showToast('Sincronizado!');}catch(e){}
          }else{
            try{if(window.showToast)showToast('Salvo local (sem sync).');}catch(e){}
          }
        });
      }else{
        if(window.showToast)showToast('Paciente salvo!');
      }
    }catch(e){showDbg('saveAndClose: '+e.message+' '+e.stack);}
  },
  set:function(key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p[key]=val;
      if(key==='altura'||key==='sexo'){var pi=calcPesoIdeal(p.altura,p.sexo);p.pesoIdeal=pi?pi.toFixed(1):'0';}
      if(key==='dataTOT'&&val&&p.viaAereaHist){
        var parts=val.split(/[-T:]/);
        var y=parseInt(parts[0]),m=parseInt(parts[1])-1,dy=parseInt(parts[2]);
        var hr=parts[3]?parseInt(parts[3]):0,mn=parts[4]?parseInt(parts[4]):0;
        var newTs=new Date(y,m,dy,hr,mn,0).toISOString();
        for(var i=0;i<p.viaAereaHist.length;i++){
          if(p.viaAereaHist[i].tipo==='TOT'||p.viaAereaHist[i].tipo==='TNT'||p.viaAereaHist[i].tipo==='RE-IOT'){
            p.viaAereaHist[i].ts=newTs;break;
          }
        }
      }
    }catch(e){showDbg('set: '+e.message);}
  },
  setR:function(key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p[key]=val;
      if(key==='altura'||key==='sexo'){var pi=calcPesoIdeal(p.altura,p.sexo);p.pesoIdeal=pi?pi.toFixed(1):'0';}
      save();renderForm();
    }catch(e){showDbg('setR: '+e.message+' '+e.stack);}
  },
  saveField:function(){try{save();}catch(e){showDbg('saveField: '+e.message);}},
  setIOTDt:function(el,which){
    try{
      var r=el.closest('.icu-row-resp-events');
      var dInp=r?r.querySelector('input.icu-iot-date')||r.querySelector('input[type=date]'):null;
      var tInp=r?r.querySelector('input[type=time]'):null;
      var rawD=dInp&&dInp.value?dInp.value.trim():'';
      var d='';
      if(rawD){
        if(rawD.indexOf('/')>=0){
          var parts=rawD.split('/');
          if(parts.length>=3){var dd=(parts[0].replace(/\D/g,'')||'01');var mm=(parts[1].replace(/\D/g,'')||'01');var yy=parts[2].replace(/\D/g,'');if(yy.length===2)yy='20'+yy;if(dd.length<2)dd='0'+dd;if(mm.length<2)mm='0'+mm;d=yy+'-'+mm+'-'+dd;}
        }else if(rawD.indexOf('-')>=0){d=rawD.substring(0,10);}
      }
      var t=tInp&&tInp.value?tInp.value:'00:00';
      ICU.setIOTDate(d+(d?'T'+t:''));
    }catch(e){showDbg('setIOTDt: '+e.message);}
  },
  setIOTDate:function(val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(val)p.dataTOT=val;
      if(p.viaAereaHist&&p.viaAereaHist.length>0){
        var parts=val.split(/[-T:]/);
        var y=parseInt(parts[0]),m=parseInt(parts[1])-1,dy=parseInt(parts[2]);
        var hr=parts.length>3?parseInt(parts[3]):0,mn=parts.length>4?parseInt(parts[4]):0;
        var newTs=new Date(y,m,dy,hr,mn,0).toISOString();
        for(var i=0;i<p.viaAereaHist.length;i++){
          var t=p.viaAereaHist[i].tipo;
          if(t==='TOT'||t==='TNT'||t==='RE-IOT'){
            p.viaAereaHist[i].ts=newTs;
            break;
          }
        }
      }
      save();renderForm();
    }catch(e){showDbg('setIOTDate: '+e.message);}
  },
  saveVM:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.modoVM)return;
      if(!p.vmHist)p.vmHist=[];
      var modosVol=['VCV','PRVC','HFOV','MMV'];
      var isVol=modosVol.indexOf(p.modoVM)>=0;
      var dpV=calcDP(p.pplato,p.peep);
      var cestV=calcCest(p.vt||p.vc,dpV);
      var rawV=isVol?calcResist(p.ppico,p.pplato,p.fluxo):null;
      var analises=[];
      if(dpV!==null)analises.push('DP:'+dpV.toFixed(1)+(dpV<12?' Ideal':dpV<=15?' Limite':' ALTO'));
      if(cestV!==null)analises.push('Cest:'+cestV.toFixed(1)+(cestV>50?' Normal':cestV>=30?' Reducao':' Baixa'));
      if(rawV!==null)analises.push('RAW:'+rawV.toFixed(1)+(rawV<15?' Normal':rawV<=20?' Elevada':' Alta'));
      var ip=interpP01(p.p01);if(ip)analises.push('P0.1:'+p.p01+' '+ip.t);
      var io=interpPocc(p.pocc);if(io)analises.push('Pocc:'+p.pocc+' '+io.t);
      var pmusCalc=calcPmusc(p.pocc);if(pmusCalc!==null){p.pmusc=pmusCalc.toFixed(1);}
      var im=interpPmusc(p.pmusc);if(im)analises.push('Pmusc:'+p.pmusc+' '+im.t);
      p.vmHist.unshift({
        modo:p.modoVM,vt:p.vt||'',vc:p.vc||'',ve:p.ve||'',fr:p.fr||'',peep:p.peep||'',fio2:p.fio2||'',
        trigger:p.trigger||'',ti:p.ti||'',ie:p.ie||'',ppico:p.ppico||'',pplato:p.pplato||'',fluxo:p.fluxo||'',
        ps:p.ps||'',pc:p.ppico||'',ipap:p.ipap||'',epap:p.epap||'',
        p01:p.p01||'',pocc:p.pocc||'',pmusc:p.pmusc||'',
        dp:dpV!==null?dpV.toFixed(1):'',cest:cestV!==null?cestV.toFixed(1):'',raw:rawV!==null?rawV.toFixed(1):'',
        analise:analises.join(' | '),ts:new Date().toISOString()
      });
      save();renderForm();if(window.showToast)showToast('Parametros VM salvos!');
    }catch(e){showDbg('saveVM: '+e.message);}
  },
  clearVM:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var keys=['vt','vc','ve','fr','peep','fio2','trigger','ti','ie','ppico','pplato','pmean','ps','ciclagem','ipap','epap','p01','pocc','pmusc','fluxo'];
      keys.forEach(function(k){p[k]='';});
      save();renderForm();if(window.showToast)showToast('Parametros limpos!');
    }catch(e){showDbg('clearVM: '+e.message);}
  },
  delVM:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.vmHist)return;
      p.vmHist.splice(i,1);save();renderForm();
    }catch(e){showDbg('delVM: '+e.message);}
  },
  liveDesmame:function(){
    try{
      var box=document.getElementById('desmCalcBox');
      if(!box)return;
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var h='';
      function card(t,v,a,c){return '<div style="flex:1;min-width:80px;padding:6px;border-radius:8px;border:1px solid '+c+'20;background:'+c+'08;text-align:center"><div style="font-size:8px;color:var(--w40)">'+t+'</div><b style="font-size:14px;color:'+c+'">'+v+'</b><div style="font-size:8px;color:'+c+'">'+a+'</div></div>';}
      var pimax=parseFloat(p.dPimax),pemax=parseFloat(p.dPemax),vc=parseFloat(p.dVcDesm),fr=parseFloat(p.dFrDesm),cv=parseFloat(p.dCv);
      var vm=null,rsbi=null;
      if(!isNaN(vc)&&!isNaN(fr))vm=((vc*fr)/1000);
      if(!isNaN(fr)&&!isNaN(vc)&&vc>0)rsbi=Math.round(fr/(vc/1000));
      h+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">';
      if(!isNaN(pimax)){var pc=pimax<=-30?'#4ade80':pimax<=-20?'#facc15':'#f87171';h+=card('PImax',pimax+' cmH2O',pimax<=-30?'Forca adequada (≤-30)':pimax<=-20?'Forca limitrofe (-20 a -30)':'Fraqueza muscular (>-20)',pc);}else{h+=card('PImax','--','Preencha PImax','var(--w40)');}
      if(!isNaN(pemax)){var ec=pemax>=60?'#4ade80':pemax>=40?'#facc15':'#f87171';h+=card('PEmax',pemax+' cmH2O',pemax>=60?'Tosse eficaz (≥60)':pemax>=40?'Tosse limitada (40-60)':'Tosse ineficaz (<40)',ec);}else{h+=card('PEmax','--','Preencha PEmax','var(--w40)');}
      if(vm!==null){var vc2=vm>=4&&vm<=10?'#4ade80':vm<4?'#f87171':'#fb923c';h+=card('VM',vm.toFixed(1)+' L/min',vm<4?'Hipoventilacao (<4)':vm<=10?'Normal (4-10)':'Hiperventilacao (>10)',vc2);}else{h+=card('VM','--','Preencha VC + FR','var(--w40)');}
      if(!isNaN(cv)){var cc=cv>=15?'#4ade80':cv>=10?'#facc15':'#f87171';h+=card('CV',cv+' mL/kg',cv>=15?'Reserva adequada (≥15)':cv>=10?'Reserva limitada (10-15)':'Reserva insuficiente (<10)',cc);}else{h+=card('CV','--','Preencha CV','var(--w40)');}
      if(rsbi!==null){var rc=rsbi<80?'#4ade80':rsbi<=105?'#facc15':'#f87171';h+=card('RSBI (FR/VT)',rsbi,rsbi<80?'Favoravel desmame (<80)':rsbi<=105?'Zona cinza (80-105)':'Desfavoravel (>105)',rc);}else{h+=card('RSBI','--','Preencha VC + FR','var(--w40)');}
      h+='</div>';
      box.innerHTML=h;
    }catch(e){showDbg('liveDesmame: '+e.message);}
  },
  saveDesmame:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.desmHist)p.desmHist=[];
      var pimax=parseFloat(p.dPimax),pemax=parseFloat(p.dPemax),vc=parseFloat(p.dVcDesm),fr=parseFloat(p.dFrDesm),cv=parseFloat(p.dCv);
      var vm=(!isNaN(vc)&&!isNaN(fr))?((vc*fr)/1000).toFixed(1):'';
      var rsbi=(!isNaN(fr)&&!isNaN(vc)&&vc>0)?Math.round(fr/(vc/1000)):'';
      var an=[];
      if(!isNaN(pimax))an.push('PImax:'+(pimax<=-30?'Adequada':'Fraqueza'));
      if(!isNaN(pemax))an.push('PEmax:'+(pemax>=60?'Tosse OK':'Tosse fraca'));
      if(vm)an.push('VM:'+vm+'L/min');
      if(rsbi)an.push('RSBI:'+rsbi+(rsbi<80?' Favoravel':rsbi<=105?' Zona cinza':' Desfavoravel'));
      p.desmHist.unshift({modo:p.modoVM||'',pimax:p.dPimax||'',pemax:p.dPemax||'',vc:p.dVcDesm||'',fr:p.dFrDesm||'',cv:p.dCv||'',vm:vm,rsbi:rsbi+'',analise:an.join(' | '),ts:new Date().toISOString()});
      save();renderForm();if(window.showToast)showToast('Desmame salvo!');
    }catch(e){showDbg('saveDesmame: '+e.message);}
  },
  clearDesmame:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      ['dPimax','dPemax','dVcDesm','dFrDesm','dCv','dPpDesm'].forEach(function(k){p[k]='';});
      save();renderForm();if(window.showToast)showToast('Desmame limpo!');
    }catch(e){showDbg('clearDesmame: '+e.message);}
  },
  delDesm:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.desmHist)return;
      p.desmHist.splice(i,1);save();renderForm();
    }catch(e){showDbg('delDesm: '+e.message);}
  },
  addCurva:function(key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!val)return;
      if(!p[key]||typeof p[key]==='string')p[key]=[];
      if(p[key].indexOf(val)<0)p[key].push(val);
      save();renderForm();
    }catch(e){showDbg('addCurva: '+e.message);}
  },
  rmCurva:function(key,i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p[key])return;
      p[key].splice(i,1);save();renderForm();
    }catch(e){showDbg('rmCurva: '+e.message);}
  },
  setPeepOpt:function(idx,field,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.peepOpt)p.peepOpt=[{peep:'',plato:'',si:''},{peep:'',plato:'',si:''},{peep:'',plato:'',si:''}];
      p.peepOpt[idx][field]=val;save();
    }catch(e){showDbg('setPeepOpt: '+e.message);}
  },
  calcPeepOpt:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.peepOpt)return;
      var nivs=p.peepOpt;var results=[];
      var parseSI=function(s){
        if(!s||s==='')return{val:NaN,txt:'-',ok:false};
        var st=s.toString().trim().replace(/\s/g,'');
        if(st==='=1'||st==='1'||st==='1.0')return{val:1,txt:'=1 (Ideal)',ok:true};
        if(st==='>1'||st==='> 1')return{val:1.2,txt:'>1 (Hiperdistensao)',ok:false};
        if(st==='<1'||st==='< 1')return{val:0.8,txt:'<1 (Colapso/Recrutavel)',ok:false};
        var num=parseFloat(st);
        if(isNaN(num))return{val:NaN,txt:st,ok:false};
        return{val:num,txt:num.toFixed(2),ok:num>=0.9&&num<=1.1};
      };
      for(var i=0;i<3;i++){
        var pe=parseFloat(nivs[i].peep),pl=parseFloat(nivs[i].plato);
        if(isNaN(pe)||isNaN(pl))continue;
        var dp=pl-pe;
        var siR=parseSI(nivs[i].si);
        var dpClass=dp<12?'Otimo':dp<=15?'Aceitavel':'Elevado';
        var score=(dp<12?3:dp<=15?2:1)+(siR.ok?3:!isNaN(siR.val)?1:0);
        results.push({idx:i,peep:pe,plato:pl,dp:dp,siTxt:siR.txt,siOk:siR.ok,dpClass:dpClass,score:score});
      }
      if(results.length===0){p.peepOptResult='Preencha pelo menos 1 nivel completo';save();renderForm();return;}
      results.sort(function(a,b){return b.score-a.score||a.dp-b.dp;});
      var best=results[0];
      var txt='<b style="color:#4ade80">🎯 PEEP IDEAL: '+best.peep+' cmH₂O</b> (Nivel '+(best.idx+1)+')<br>';
      txt+='ΔP: '+best.dp.toFixed(1)+' cmH₂O ('+best.dpClass+')';
      if(best.siTxt!=='-')txt+=' | SI: '+best.siTxt;
      txt+='<br><br>';
      results.forEach(function(r){
        var cor=r===best?'#4ade80':r.dpClass==='Elevado'?'#f87171':'#facc15';
        txt+='<span style="color:'+cor+'">Nivel '+(r.idx+1)+': PEEP '+r.peep+' → ΔP '+r.dp.toFixed(1)+' ('+r.dpClass+')';
        if(r.siTxt!=='-')txt+=' | SI '+r.siTxt;
        txt+=(r===best?' ✓ RECOMENDADO':'')+'</span><br>';
      });
      p.peepOptResult=txt;save();renderForm();
    }catch(e){showDbg('calcPeepOpt: '+e.message);}
  },
  clearPeepOpt:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p.peepOpt=[{peep:'',plato:'',si:''},{peep:'',plato:'',si:''},{peep:'',plato:'',si:''}];
      p.peepOptResult='';save();renderForm();
    }catch(e){showDbg('clearPeepOpt: '+e.message);}
  },
  toggleProna:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(p.pronaAtiva&&p.pronaData&&p.pronaHora&&p.pronaTempo){
        if(!p.pronaHist)p.pronaHist=[];
        var horas=parseInt(p.pronaTempo);
        var ini=new Date(p.pronaData+'T'+p.pronaHora);
        var fim=new Date(ini.getTime()+horas*3600000);
        var dd=String(fim.getDate()).padStart(2,'0')+'/'+String(fim.getMonth()+1).padStart(2,'0')+'/'+fim.getFullYear();
        var hh=String(fim.getHours()).padStart(2,'0')+':'+String(fim.getMinutes()).padStart(2,'0');
        p.pronaHist.push({data:p.pronaData,hora:p.pronaHora,tempo:p.pronaTempo,supina:dd+' '+hh});
      }
      p.pronaAtiva=!p.pronaAtiva;
      if(!p.pronaAtiva){p.pronaData='';p.pronaHora='';p.pronaTempo='16h';}
      save();renderForm();
    }catch(e){showDbg('toggleProna: '+e.message);}
  },
  delPronaHist:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.pronaHist)return;
      p.pronaHist.splice(i,1);save();renderForm();
    }catch(e){showDbg('delPronaHist: '+e.message);}
  },
  setMRA:function(row,key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.mraTab)return;
      p.mraTab[row][key]=val;save();
    }catch(e){showDbg('setMRA: '+e.message);}
  },
  clearMRA:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p.mraTab=[];save();renderForm();
    }catch(e){showDbg('clearMRA: '+e.message);}
  },
  setTit:function(row,key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.titTab)return;
      p.titTab[row][key]=val;save();
    }catch(e){showDbg('setTit: '+e.message);}
  },
  clearTit:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p.titTab=[];save();renderForm();
    }catch(e){showDbg('clearTit: '+e.message);}
  },
  toggleTitBest:function(row){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.titTab)return;
      p.titTab.forEach(function(r,i){r.best=(i===row)?!r.best:false;});
      save();renderForm();
    }catch(e){showDbg('toggleTitBest: '+e.message);}
  },
  calcRecrutab:function(){},
  saveMRC:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});if(!p)return;
      var groups=['mrcOmbroD','mrcOmbroE','mrcCotoveloD','mrcCotoveloE','mrcPunhoD','mrcPunhoE','mrcQuadrilD','mrcQuadrilE','mrcJoelhoD','mrcJoelhoE','mrcTornozeloD','mrcTornozeloE'];
      var total=0;var count=0;
      groups.forEach(function(k){var v=p[k];if(v!==undefined&&v!==''){total+=parseInt(v)||0;count++;}});
      if(count<12)return;
      var interp=total>=48?'Normal':total>=36?'Fraqueza leve':total>=24?'Fraqueza moderada':'Fraqueza grave';
      if(!p.mrcHist)p.mrcHist=[];
      p.mrcHist.unshift({data:new Date().toLocaleDateString('pt-BR')+' '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),total:total,interp:interp});
      save();renderForm();
    }catch(e){showDbg('saveMRC: '+e.message);}
  },
  clearMRC:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});if(!p)return;
      ['mrcOmbroD','mrcOmbroE','mrcCotoveloD','mrcCotoveloE','mrcPunhoD','mrcPunhoE','mrcQuadrilD','mrcQuadrilE','mrcJoelhoD','mrcJoelhoE','mrcTornozeloD','mrcTornozeloE'].forEach(function(k){p[k]='';});
      save();renderForm();
    }catch(e){showDbg('clearMRC: '+e.message);}
  },
  delMRCHist:function(i){
    try{var p=patients.find(function(x){return x.id===editingId;});if(!p||!p.mrcHist)return;p.mrcHist.splice(i,1);save();renderForm();}catch(e){showDbg('delMRCHist: '+e.message);}
  },
  savePerme:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});if(!p)return;
      var keys=['permeEstado','permeBarreira','permeForcaMS','permeForcaMI','permeLeito','permeTransf','permeMarcha'];
      var total=0;var ok=true;
      keys.forEach(function(k){var v=p[k];if(v===undefined||v==='')ok=false;else total+=parseInt(v)||0;});
      if(!ok)return;
      var interp=total>=16?'Alta mobilidade':total>=8?'Mobilidade moderada':'Baixa mobilidade';
      if(!p.permeHist)p.permeHist=[];
      p.permeHist.unshift({data:new Date().toLocaleDateString('pt-BR')+' '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),total:total,interp:interp});
      save();renderForm();
    }catch(e){showDbg('savePerme: '+e.message);}
  },
  clearPerme:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});if(!p)return;
      ['permeEstado','permeBarreira','permeForcaMS','permeForcaMI','permeLeito','permeTransf','permeMarcha'].forEach(function(k){p[k]='';});
      save();renderForm();
    }catch(e){showDbg('clearPerme: '+e.message);}
  },
  delPermeHist:function(i){
    try{var p=patients.find(function(x){return x.id===editingId;});if(!p||!p.permeHist)return;p.permeHist.splice(i,1);save();renderForm();}catch(e){showDbg('delPermeHist: '+e.message);}
  },
  saveIMS:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});if(!p)return;
      var v=p.imsScore;if(v===undefined||v==='')return;
      var s=parseInt(v);
      var interp=s>=7?'Alta mobilidade':s>=4?'Mobilidade moderada':s>=1?'Mobilidade baixa':'Imobilidade';
      if(!p.imsHist)p.imsHist=[];
      p.imsHist.unshift({data:new Date().toLocaleDateString('pt-BR')+' '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),score:s,interp:interp});
      save();renderForm();
    }catch(e){showDbg('saveIMS: '+e.message);}
  },
  clearIMS:function(){
    try{var p=patients.find(function(x){return x.id===editingId;});if(!p)return;p.imsScore='';save();renderForm();}catch(e){showDbg('clearIMS: '+e.message);}
  },
  delIMSHist:function(i){
    try{var p=patients.find(function(x){return x.id===editingId;});if(!p||!p.imsHist)return;p.imsHist.splice(i,1);save();renderForm();}catch(e){showDbg('delIMSHist: '+e.message);}
  },
  toggleEvt:function(key){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p[key]=!p[key];
      save();renderForm();
    }catch(e){showDbg('toggleEvt: '+e.message);}
  },
  toggleTRE:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p.treOK=!p.treOK;
      if(!p.treOK){p.treDt='';p.treTm='';}
      save();renderForm();
    }catch(e){showDbg('toggleTRE: '+e.message);}
  },
  toggleExt:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p.extOK=!p.extOK;
      if(!p.extOK)p.extResult='';
      save();renderForm();
    }catch(e){showDbg('toggleExt: '+e.message);}
  },
  toggleDescVM:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      p.descVM=!p.descVM;
      if(!p.descVM)p.descResult='';
      save();renderForm();
    }catch(e){showDbg('toggleDescVM: '+e.message);}
  },
  saveDesmEtapas:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.desmEtapasHist)p.desmEtapasHist=[];
      p.desmEtapasHist.unshift({
        treOK:p.treOK||false,treDt:p.treDt||'',treTm:p.treTm||'',
        extOK:p.extOK||false,extResult:p.extResult||'',
        descVM:p.descVM||false,descResult:p.descResult||'',
        tipo:p.tipoVia||'',ts:new Date().toISOString()
      });
      save();renderForm();if(window.showToast)showToast('Etapas salvas!');
    }catch(e){showDbg('saveDesmEtapas: '+e.message);}
  },
  delDesmEtapa:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.desmEtapasHist)return;
      p.desmEtapasHist.splice(i,1);save();renderForm();
    }catch(e){showDbg('delDesmEtapa: '+e.message);}
  },
  liveVM:function(){
    try{
      var box=document.getElementById('vmCalcBox');
      if(!box)return;
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var modosVol=['VCV','PRVC','HFOV','MMV'];
      var modosPress=['PCV'];
      var modosEsp=['PSV','TuboT','CPAP','BIPAP','VS','ASV','IntelliVENT','SmartCare','APRV','PAV','NAVA','ATC'];
      var tipo=modosVol.indexOf(p.modoVM)>=0?'vol':modosPress.indexOf(p.modoVM)>=0?'press':modosEsp.indexOf(p.modoVM)>=0?'esp':'';
      var h='';
      function card(titulo,val,an,cor){
        return '<div style="flex:1;min-width:80px;padding:6px;border-radius:8px;border:1px solid '+cor+'20;background:'+cor+'08;text-align:center"><div style="font-size:8px;color:var(--w40)">'+titulo+'</div><b style="font-size:14px;color:'+cor+'">'+val+'</b><div style="font-size:8px;color:'+cor+'">'+an+'</div></div>';
      }
      if(tipo==='vol'||tipo==='press'){
        var dpV=calcDP(p.pplato,p.peep);
        var cestV=calcCest(p.vt||p.vc,dpV);
        var rawV=tipo==='vol'?calcResist(p.ppico,p.pplato,p.fluxo):null;
        h+='<div style="margin-top:8px"><b style="font-size:10px;color:var(--silver-l)">Calculos Automaticos</b></div>';
        h+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">';
        if(dpV!==null){var dc=dpV<12?'#4ade80':dpV<=15?'#facc15':'#f87171';h+=card('DP (Pplato-PEEP)',dpV.toFixed(1),dpV<12?'Ideal (protetor)':dpV<=15?'Limite (atencao)':'ALTO (risco VILI)',dc);}else{h+=card('DP','--','Preencha Plato e PEEP','var(--w40)');}
        if(cestV!==null){var cc=cestV>50?'#4ade80':cestV>=30?'#facc15':'#f87171';h+=card('Cest (Vt/DP)',cestV.toFixed(1)+' ml/cmH2O',cestV>50?'Normal':cestV>=30?'Reducao leve':'Baixa (pulmao rigido)',cc);}else{h+=card('Cest','--','Preencha Vt + Plato + PEEP','var(--w40)');}
        if(tipo==='vol'){if(rawV!==null){var rc=rawV<15?'#4ade80':rawV<=20?'#facc15':'#f87171';h+=card('RAW',rawV.toFixed(1)+' cmH2O/L/s',rawV<15?'Normal':rawV<=20?'Elevada':'Alta (broncoespasmo?)',rc);}else{h+=card('RAW','--','Preencha Pico e Plato','var(--w40)');}}
        h+='</div>';
      }
      if(tipo==='esp'){
        var ip=interpP01(p.p01);
        var io=interpPocc(p.pocc);
        var pmusCalc=calcPmusc(p.pocc);
        if(pmusCalc!==null){p.pmusc=pmusCalc.toFixed(1);var el=document.querySelector('input[oninput*="pmusc"]');if(el)el.value=p.pmusc;}
        var im=interpPmusc(p.pmusc);
        h+='<div style="margin-top:8px"><b style="font-size:10px;color:var(--silver-l)">Calculos Desmame</b></div>';
        h+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">';
        h+=card('P0.1',p.p01||'--',ip?ip.t:'Preencha P0.1',ip?ip.c:'var(--w40)');
        h+=card('Pocc (DeltaPocc)',p.pocc||'--',io?io.t:'Preencha Pocc',io?io.c:'var(--w40)');
        h+=card('Pmusc (0.75×Pocc)',pmusCalc!==null?pmusCalc.toFixed(1):(p.pmusc||'--'),im?im.t:'Preencha Pocc para calcular',im?im.c:'var(--w40)');
        h+='</div>';
      }
      box.innerHTML=h;
      ICU.liveDesmame();
    }catch(e){showDbg('liveVM: '+e.message);}
  },
  deletePatient:function(id){
    try{
      var idx=patients.findIndex(function(x){return x.id===id;});
      if(idx>=0){trashPatients.push(patients.splice(idx,1)[0]);save();renderICU();}
    }catch(e){showDbg('deletePatient: '+e.message);}
  },
  movePatient:function(i,dir){
    try{
      var ni=i+dir;if(ni<0||ni>=patients.length)return;
      var tmp=patients[i];patients[i]=patients[ni];patients[ni]=tmp;save();renderICU();
    }catch(e){showDbg('movePatient: '+e.message);}
  },
  showTrash:function(){
    try{
    var ct=document.getElementById('icu-content');
    if(!ct||!trashPatients.length){if(window.showToast)showToast('Lixeira vazia');return;}
    var h='<div class="icu-trash-overlay">';
    h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><div style="font-size:16px;font-weight:800;color:var(--silver-l)">Lixeira ('+trashPatients.length+')</div><button class="tbtn" onclick="ICU.closeTrash()" style="font-size:12px;color:var(--w40)">Voltar</button></div>';
    trashPatients.forEach(function(p,i){
      var via=p.tipoVia||'';
      var diasTOT=(p.tipoVia==='TOT'||p.tipoVia==='TNT')&&p.dataTOT?calcDias(p.dataTOT):0;
      var diasTQT=p.tipoVia&&p.tipoVia.startsWith('TQT')&&p.dataTQT?calcDias(p.dataTQT):0;
      var viaCor=(p.tipoVia==='TOT'||p.tipoVia==='TNT')?'#f87171':p.tipoVia&&p.tipoVia.startsWith('TQT')?'#c084fc':p.tipoVia&&p.tipoVia.startsWith('RE')?'#4ade80':(p.tipoVia==='VNI'||p.tipoVia==='HFNC'||p.tipoVia==='RPPI')?'#facc15':'#60a5fa';
      var g=calcGlasgow(p.glasgowO,p.glasgowV,p.glasgowM);
      h+='<div class="icu-pcard glass2" style="border-color:rgba(248,113,113,.15);cursor:pointer;padding:4px 8px;border-radius:8px;min-height:0" onclick="ICU.openTrashCard('+i+')">';
      h+='<div class="icu-pcard-row" style="display:flex;align-items:center;gap:4px">';
      h+='<div class="icu-pcard-leito" style="min-width:26px;width:26px;height:26px;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(255,255,255,.06);color:var(--silver-l);flex-shrink:0">'+(p.leito||'--')+'</div>';
      h+='<div class="icu-pcard-info" style="flex:1;min-width:0">';
      h+='<div class="icu-pcard-top" style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;min-height:0">';
      if(p.idade)h+='<span class="icu-pcard-age" style="font-size:8px;padding:1px 3px;border-radius:4px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.4)">'+p.idade+'a</span>';
      h+='<span class="icu-pcard-name" style="font-size:10px;font-weight:700;color:var(--silver-l);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0">'+(p.nome?p.nome.toUpperCase():'SEM NOME')+'</span>';
      h+='<div class="icu-pcard-badges" style="display:flex;gap:2px;flex-wrap:wrap;align-items:center">';
      if(via)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px;background:'+viaCor+'22;color:'+viaCor+';border:1px solid '+viaCor+'44">'+via+'</span>';
      if(diasTOT)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px;background:rgba(251,191,36,.12);color:#fbbf24;border:1px solid rgba(251,191,36,.3)">D'+diasTOT+' TOT</span>';
      if(diasTQT)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px;background:rgba(192,132,252,.12);color:#c084fc;border:1px solid rgba(192,132,252,.3)">D'+diasTQT+' TQT</span>';
      if(p.modoVM)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px;background:rgba(168,85,247,.12);color:#a855f7;border:1px solid rgba(168,85,247,.3)">'+p.modoVM+'</span>';
      if(g.total)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px">Glasgow '+g.total+'</span>';
      if(p.statusClinico)h+='<span class="icu-pbadge" style="font-size:7px;padding:1px 3px">'+p.statusClinico+'</span>';
      h+='</div>';
      h+='<div class="icu-pcard-acts" style="display:flex;gap:2px;align-items:center;margin-left:auto">';
      h+='<button onclick="event.stopPropagation();ICU.restoreOne('+i+')" class="icu-act-btn" title="Restaurar" style="color:#4ade80;width:20px;height:20px;min-width:20px;min-height:20px;padding:0;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg></button>';
      h+='<button onclick="event.stopPropagation();ICU.permaDel('+i+')" class="icu-act-btn icu-del-btn" title="Excluir definitivo" style="width:20px;height:20px;min-width:20px;min-height:20px;padding:0;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M6 18L18 6M6 6l12 12"/></svg></button>';
      h+='</div></div>';
      if(p.diagnostico)h+='<div class="icu-pcard-diag" style="font-size:8px;color:rgba(255,255,255,.4);margin-top:2px;white-space:normal;word-break:break-word;line-height:1.2">'+p.diagnostico+'</div>';
      h+='</div>';
      h+='</div></div>';
    });
    h+='</div>';
    ct.innerHTML=h;
    }catch(e){showDbg('showTrash: '+e.message+' '+e.stack);}
  },
  closeTrash:function(){try{renderICU();}catch(e){showDbg('closeTrash: '+e.message);}},
  openTrashCard:function(i){
    try{
      if(i<0||i>=trashPatients.length)return;
      var p=trashPatients[i];
      patients.push(p);
      trashPatients.splice(i,1);
      save();
      editingId=p.id;
      formTab='dados';
      renderForm();
      updatePageHdr();
    }catch(e){showDbg('openTrashCard: '+e.message+' '+e.stack);}
  },
  restoreOne:function(i){
    try{
    if(i>=0&&i<trashPatients.length){patients.push(trashPatients.splice(i,1)[0]);save();ICU.showTrash();}
    if(!trashPatients.length)renderICU();
    }catch(e){showDbg('restoreOne: '+e.message);}
  },
  permaDel:function(i){
    try{
    if(i>=0&&i<trashPatients.length){trashPatients.splice(i,1);save();ICU.showTrash();}
    if(!trashPatients.length)renderICU();
    }catch(e){showDbg('permaDel: '+e.message);}
  },
  setGasoDt:function(el,which){
    try{
      var p=patients.find(function(x){return x.id===editingId;});if(!p)return;
      var rawD=el&&el.value?el.value.trim():'';
      var d='';
      if(rawD){
        if(rawD.indexOf('/')>=0){
          var parts=rawD.split('/');
          if(parts.length>=3){var dd=(parts[0].replace(/\D/g,'')||'01');var mm=(parts[1].replace(/\D/g,'')||'01');var yy=(parts[2]||'').replace(/\D/g,'');if(yy.length===2)yy='20'+yy;if(dd.length<2)dd='0'+dd;if(mm.length<2)mm='0'+mm;d=yy+'-'+mm+'-'+dd;}
        }else if(rawD.indexOf('-')>=0){d=rawD.substring(0,10);}
      }
      p.gasoData=d||'';
      save();
    }catch(e){showDbg('setGasoDt: '+e.message);}
  },
  clearGaso:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var keys=['gasoData','gasoHora','gasoPH','gasoPaCO2','gasoPaO2','gasoHCO3','gasoBE','gasoSaO2','gasoLactato','gasoFiO2','gasoObs','sfSpO2','sfFiO2'];
      keys.forEach(function(k){p[k]='';});
      save();renderForm();if(window.showToast)showToast('Gasometria limpa!');
    }catch(e){showDbg('clearGaso: '+e.message);}
  },
  saveGaso:function(){
    var p=patients.find(function(x){return x.id===editingId;});
    if(!p||!p.gasoPH)return;
    var pfVal=null,sfVal=null,analise='';
    if(p.gasoPaO2&&p.gasoFiO2)pfVal=Math.round(parseFloat(p.gasoPaO2)/(parseFloat(p.gasoFiO2)/100));
    if(p.sfSpO2&&p.sfFiO2){var sp=parseFloat(p.sfSpO2),fi=parseFloat(p.sfFiO2);if(!isNaN(sp)&&fi>0)sfVal=Math.round(sp/(fi/100));}
    var gasoAn=analisarGaso(p);
    analise=gasoAn?gasoAn.full:'';
    var pfIdx=pfVal?pfVal>300?0:pfVal>200?1:pfVal>100?2:3:0;
    var pfLabels={normal:['Normal','Leve','Moderada','Grave'],berlim:['Sem SDRA','SDRA Leve','SDRA Moderada','SDRA Grave'],global:['Sem SDRA','Leve','Moderada','Grave']};
    var sfIdx=sfVal?sfVal>315?0:sfVal>274?1:sfVal>232?2:3:0;
    var sfLabels={lit:['Normal','Leve','Moderada','Grave'],sofa:['SOFA 0-1','SOFA 2','SOFA 3','SOFA 4']};
    p.gasometrias.push({
      pH:p.gasoPH,paCO2:p.gasoPaCO2,paO2:p.gasoPaO2,hco3:p.gasoHCO3,be:p.gasoBE,sao2:p.gasoSaO2,lactato:p.gasoLactato,fio2:p.gasoFiO2,
      data:p.gasoData||'',hora:p.gasoHora||'',pf:pfVal,sf:sfVal,
      analise:analise,
      pfNormal:pfLabels.normal[pfIdx],pfBerlim:pfLabels.berlim[pfIdx],pfGlobal:pfLabels.global[pfIdx],
      sfLit:sfLabels.lit[sfIdx],sfSofa:sfLabels.sofa[sfIdx],
      ts:new Date().toISOString()
    });
    save();renderForm();if(window.showToast)showToast('Gasometria salva!');
  },
  delGaso:function(i){
    var p=patients.find(function(x){return x.id===editingId;});
    if(p){p.gasometrias.splice(i,1);save();renderForm();}
  },
  changeVia:function(val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var old=p.tipoVia;
      if(!p.viaAereaHist)p.viaAereaHist=[];
      p.tipoVia=val;save();renderForm();
    }catch(e){showDbg('changeVia: '+e.message);}
  },
  syncVADate:function(field){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.viaAereaHist||!p[field])return;
      var val=p[field];
      var tipo=field==='dataTOT'?['TOT','TNT','RE-IOT']:field==='dataTQT'?['TQT-AA','TQT-O2','TQT-VM','TQT-P']:[];
      var found=false;
      for(var i=0;i<p.viaAereaHist.length;i++){
        if(tipo.indexOf(p.viaAereaHist[i].tipo)>=0){
          var parts=val.split(/[-T:]/);
          var y=parseInt(parts[0]),m=parseInt(parts[1])-1,dy=parseInt(parts[2]);
          var hr=parts[3]?parseInt(parts[3]):0,mn=parts[4]?parseInt(parts[4]):0;
          p.viaAereaHist[i].ts=new Date(y,m,dy,hr,mn,0).toISOString();
          found=true;
          break;
        }
      }
      if(found){save();renderForm();}
    }catch(e){showDbg('syncVADate: '+e.message);}
  },
  toggleProtocolo:function(id){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.protocoloVM)p.protocoloVM=[];
      var idx=p.protocoloVM.indexOf(id);
      if(idx>=0)p.protocoloVM.splice(idx,1);else p.protocoloVM.push(id);
      save();renderForm();
    }catch(e){showDbg('toggleProtocolo: '+e.message);}
  },
  saveVAHist:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.tipoVia)return;
      if(!p.viaAereaHist)p.viaAereaHist=[];
      var tipo=p.tipoVia;
      var dataStr='';
      if((tipo==='TOT'||tipo==='TNT')&&p.dataTOT){
        var pt=p.dataTOT.split(/[-T:]/);
        dataStr=pt[2]+'/'+pt[1]+'/'+pt[0]+(pt[3]?', '+pt[3]+':'+(pt[4]||'00'):'');
      }else if(tipo.startsWith('TQT')&&p.dataTQT){
        dataStr=p.dataTQT.split('-').reverse().join('/');
      }else{
        dataStr=new Date().toLocaleString('pt-BR');
      }
      p.viaAereaHist.unshift({tipo:tipo,data:dataStr,ts:new Date().toISOString()});
      save();renderForm();if(window.showToast)showToast('VA salva no historico!');
    }catch(e){showDbg('saveVAHist: '+e.message);}
  },
  delViaHist:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.viaAereaHist)return;
      p.viaAereaHist.splice(i,1);save();renderForm();
    }catch(e){showDbg('delViaHist: '+e.message);}
  },
  toggleIOTTime:function(checked){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(checked){
        if(p.dataTOT&&p.dataTOT.indexOf('T')===-1){
          p.dataTOT=p.dataTOT+'T00:00';
        }
      }else{
        if(p.dataTOT&&p.dataTOT.indexOf('T')!==-1){
          p.dataTOT=p.dataTOT.split('T')[0];
        }
      }
      save();renderForm();
    }catch(e){showDbg('toggleIOTTime: '+e.message);}
  },
  registrarExtubacao:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var agora=new Date();
      var dt=agora.toISOString().slice(0,16);
      p.dataExtubacao=dt;
      if(!p.viaAereaHist)p.viaAereaHist=[];
      save();renderForm();
    }catch(e){showDbg('registrarExtubacao: '+e.message);}
  },
  registrarDecanulacao:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var agora=new Date();
      var dt=agora.toISOString().slice(0,16);
      p.dataDecanulacao=dt;
      if(!p.viaAereaHist)p.viaAereaHist=[];
      save();renderForm();
    }catch(e){showDbg('registrarDecanulacao: '+e.message);}
  },
  registrarDescVM:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var agora=new Date();
      var dt=agora.toISOString().slice(0,16);
      p.dataDescVM=dt;
      if(!p.viaAereaHist)p.viaAereaHist=[];
      save();renderForm();
    }catch(e){showDbg('registrarDescVM: '+e.message);}
  },
  registrarReIOT:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      var agora=new Date();
      var dt=agora.toISOString().slice(0,16);
      p.dataReIOT=dt;
      p.dataTOT=dt;
      p.tipoVia='TOT';
      if(!p.viaAereaHist)p.viaAereaHist=[];
      save();renderForm();
    }catch(e){showDbg('registrarReIOT: '+e.message);}
  },
  liveGaso:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      save();
      var ga=analisarGaso(p);
      var box=document.getElementById('gasoAnaliseBox');
      if(box){
        if(ga)box.innerHTML='<div class="icu-calc-card" style="border-color:'+ga.cor+'30;background:'+ga.cor+'08;margin-top:6px"><div class="icu-calc-row"><span>Analise:</span><b style="color:'+ga.cor+'">'+ga.full+'</b></div></div>';
        else box.innerHTML='';
      }
      var pao2=parseFloat(p.gasoPaO2),fio2g=parseFloat(p.gasoFiO2);
      var pfBox=document.getElementById('pfCriteriosBox');
      if(pfBox){
        if(!isNaN(pao2)&&!isNaN(fio2g)&&fio2g>0){
          var pf=pao2/(fio2g/100);var pfV=Math.round(pf);
          var pi=pfV>300?0:pfV>200?1:pfV>100?2:3;
          var c=['#4ade80','#facc15','#fb923c','#f87171'];
          var hr=function(rng,grav,sel,cor){return '<div style="display:flex;justify-content:space-between;padding:3px 4px;font-size:9px;border-bottom:1px solid var(--gb);'+(sel?'background:'+cor+'15;border-radius:4px':'')+'"><span style="color:var(--w40)">'+rng+'</span><span style="color:'+(sel?cor:'var(--w40)')+';font-weight:'+(sel?'700':'400')+'">'+grav+'</span></div>';};
          var h='<div class="icu-divider" style="margin-top:10px">Criterios de Oxigenacao (P/F)</div>';
          h+='<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:stretch">';
          h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
          h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:4px">CRITERIOS NORMAIS (P/F)</div>';
          h+=hr('> 300','Normal',pi===0,c[0])+hr('200 < P/F ≤ 300','Leve',pi===1,c[1])+hr('100 < P/F ≤ 200','Moderada',pi===2,c[2])+hr('P/F ≤ 100','Grave',pi===3,c[3]);
          h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+c[pi]+'15;text-align:center"><span style="font-size:9px;color:var(--w40)">P/F: </span><b style="font-size:14px;color:'+c[pi]+'">'+pfV+'</b></div></div>';
          h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
          h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:2px">BERLIM 2012 (SDRA)</div>';
          h+='<div style="font-size:7px;color:#fb923c;margin-bottom:4px">⚠️ Requer PEEP ≥ 5</div>';
          h+=hr('> 300','Sem SDRA',pi===0,c[0])+hr('200 < P/F ≤ 300','Leve',pi===1,c[1])+hr('100 < P/F ≤ 200','Moderada',pi===2,c[2])+hr('P/F ≤ 100','Grave',pi===3,c[3]);
          var bl=['Sem SDRA','SDRA Leve','SDRA Moderada','SDRA Grave'];
          h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+c[pi]+'15;text-align:center"><b style="font-size:11px;color:'+c[pi]+'">'+bl[pi]+'</b></div></div>';
          h+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
          h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:2px">GLOBAL 2023</div>';
          h+='<div style="display:flex;justify-content:space-between;font-size:7px;color:var(--w30);padding:2px 4px;border-bottom:1px solid var(--gb)"><span>Grav.</span><span>P/F</span><span>S/F</span><span>PEEP</span></div>';
          var gs;gs=pi===0;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(gs?'background:'+c[0]+'15;border-radius:3px':'')+'"><span style="color:'+(gs?c[0]:'var(--w40)')+'">Sem</span><span style="color:var(--w40)">>300</span><span style="color:var(--w40)">>315</span><span style="color:var(--w40)">-</span></div>';
          gs=pi===1;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(gs?'background:'+c[1]+'15;border-radius:3px':'')+'"><span style="color:'+(gs?c[1]:'var(--w40)')+'">Leve</span><span style="color:var(--w40)">200-300</span><span style="color:var(--w40)">≤315</span><span style="color:var(--w40)">≥5</span></div>';
          gs=pi===2;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(gs?'background:'+c[2]+'15;border-radius:3px':'')+'"><span style="color:'+(gs?c[2]:'var(--w40)')+'">Mod.</span><span style="color:var(--w40)">100-200</span><span style="color:var(--w40)">≤235</span><span style="color:var(--w40)">≥5</span></div>';
          gs=pi===3;h+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;'+(gs?'background:'+c[3]+'15;border-radius:3px':'')+'"><span style="color:'+(gs?c[3]:'var(--w40)')+'">Grave</span><span style="color:var(--w40)">≤100</span><span style="color:var(--w40)">≤148</span><span style="color:var(--w40)">≥5</span></div>';
          var gl=['Sem SDRA','Leve','Moderada','Grave'];
          h+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+c[pi]+'15;text-align:center"><b style="font-size:11px;color:'+c[pi]+'">'+gl[pi]+'</b></div></div>';
          h+='</div>';
          pfBox.innerHTML=h;
        }else pfBox.innerHTML='';
      }
      var sfBox=document.getElementById('sfCriteriosBox');
      if(sfBox){
        var sp=parseFloat(p.sfSpO2),fi=parseFloat(p.sfFiO2)/100;
        if(!isNaN(sp)&&!isNaN(fi)&&fi>0){
          var sv=Math.round(sp/fi);
          var si=sv>315?0:sv>274?1:sv>232?2:3;
          var ss=sv>300?0:sv>250?1:sv>200?2:3;
          var c2=['#4ade80','#facc15','#fb923c','#f87171'];
          var hs=function(rng,grav,sel,cor){return '<div style="display:flex;justify-content:space-between;padding:3px 4px;font-size:9px;border-bottom:1px solid var(--gb);'+(sel?'background:'+cor+'15;border-radius:4px':'')+'"><span style="color:var(--w40)">'+rng+'</span><span style="color:'+(sel?cor:'var(--w40)')+';font-weight:'+(sel?'700':'400')+'">'+grav+'</span></div>';};
          var h2='<div class="icu-divider" style="margin-top:10px">Criterios de Oxigenacao (S/F)</div>';
          h2+='<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:stretch">';
          h2+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
          h2+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:2px">LITERATURA (S/F = 64 + 0.84×P/F)</div>';
          h2+=hs('S/F > 315','P/F > 300',si===0,c2[0])+hs('274 < S/F ≤ 315','P/F 250-300',si===1,c2[1])+hs('232 < S/F ≤ 274','P/F 200-250',si===2,c2[2])+hs('S/F ≤ 232','P/F < 200',si===3,c2[3]);
          h2+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+c2[si]+'15;text-align:center"><span style="font-size:9px;color:var(--w40)">S/F: </span><b style="font-size:14px;color:'+c2[si]+'">'+sv+'</b></div></div>';
          var sl=['SOFA 0-1','SOFA 2','SOFA 3','SOFA 4'];
          h2+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
          h2+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:4px">SOFA-2 (2025)</div>';
          h2+=hs('S/F > 300','SOFA 0-1',ss===0,c2[0])+hs('250 < S/F ≤ 300','SOFA 2 (P/F≤300)',ss===1,c2[1])+hs('200 < S/F ≤ 250','SOFA 3 (P/F≤225)',ss===2,c2[2])+hs('S/F ≤ 200','SOFA 4 (P/F≤150)',ss===3,c2[3]);
          h2+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:'+c2[ss]+'15;text-align:center"><b style="font-size:11px;color:'+c2[ss]+'">'+sl[ss]+'</b></div></div>';
          h2+='<div style="flex:1;min-width:90px;padding:6px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
          h2+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:2px">COMPARACAO S/F → P/F</div>';
          h2+='<div style="display:flex;justify-content:space-between;font-size:7px;color:var(--w30);padding:2px 4px;border-bottom:1px solid var(--gb)"><span>P/F</span><span>Lit. | SOFA-2</span></div>';
          var cs;cs=sv>315;h2+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(cs?'background:'+c2[0]+'15;border-radius:3px':'')+'"><span style="color:var(--w40)">>300</span><span style="color:var(--w40)">>315 | >300</span></div>';
          cs=sv>274&&sv<=315;h2+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(cs?'background:'+c2[1]+'15;border-radius:3px':'')+'"><span style="color:var(--w40)">225-300</span><span style="color:var(--w40)">≤315 | ≤300</span></div>';
          cs=sv>232&&sv<=274;h2+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;border-bottom:1px solid var(--gb);'+(cs?'background:'+c2[2]+'15;border-radius:3px':'')+'"><span style="color:var(--w40)">150-225</span><span style="color:var(--w40)">≤274 | ≤250</span></div>';
          cs=sv<=232;h2+='<div style="display:flex;justify-content:space-between;font-size:8px;padding:2px 4px;'+(cs?'background:'+c2[3]+'15;border-radius:3px':'')+'"><span style="color:var(--w40)">≤150</span><span style="color:var(--w40)">≤232 | ≤200</span></div>';
          h2+='<div style="margin-top:6px;padding:4px;border-radius:6px;background:var(--w03);text-align:center;border:1px solid var(--gb)"><span style="font-size:9px;color:var(--w40)">S/F atual: </span><b style="font-size:12px;color:var(--silver-l)">'+sv+'</b>';
          if(sp>97)h2+='<div style="font-size:7px;color:#fb923c;margin-top:2px">⚠️ SpO₂ >97% reduz precisao</div>';
          h2+='</div></div>';
          h2+='</div>';
          sfBox.innerHTML=h2;
        }else sfBox.innerHTML='';
      }
    }catch(e){showDbg('liveGaso: '+e.message);}
  },
  getProtocolContent:function(id){
    var h='';
    var s=function(t,c){return '<div style="font-size:11px;font-weight:700;color:'+(c||'var(--silver-l)')+';margin:10px 0 6px;border-bottom:1px solid var(--gb);padding-bottom:4px">'+t+'</div>';};
    var r=function(p,v,o){return '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--gb);font-size:10px;gap:4px"><span style="color:var(--w40);flex:1">'+p+'</span><span style="color:var(--silver-l);font-weight:600;flex:1;text-align:center">'+v+'</span>'+(o?'<span style="color:var(--w30);font-size:9px;flex:1;text-align:right">'+o+'</span>':'')+'</div>';};
    var b=function(t){return '<div style="font-size:10px;color:var(--w40);margin:6px 0;padding:8px;border-radius:6px;background:var(--w03);border:1px solid var(--gb);line-height:1.6">'+t+'</div>';};
    var n=function(t){return '<div style="font-size:10px;color:var(--w40);margin:2px 0;line-height:1.5">'+t+'</div>';};

    if(id==='sdra'){
      h+=s('🔴 SDRA - ARDSnet (Ventilacao Protetora)');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo Ventilatorio','VCV ou PCV (A/C)','Sem dif. mortalidade entre modos');
      h+=r('Volume Corrente (VC)','6 ml/kg peso predito','⚠️ NUNCA peso real! Leve: 6ml/kg | Mod/Grave: 4-6ml/kg');
      h+=r('Pressao Plato (Pplato)','≤ 30 cmH₂O','Limite seguranca. Tolerar ate 40 se PEEP>15 (ΔP≤15)');
      h+=r('PEEP','Tabela ARDSNet (FiO₂/PEEP)','Individualizar: ARDx, LOVs, Alveoli, Decremental');
      h+=r('Driving Pressure (ΔP)','≤ 15 cmH₂O','Pplato-PEEP. Melhor preditor mortalidade. ΔP=VC/Cest');
      h+=r('Frequencia Respiratoria','< 45 ipm','Iniciar 20-30 ipm (AMIB 2024). Evitar ↑FR p/ normalizar PaCO₂');
      h+=r('I:E','1:1 ate 1:3','Evitar auto-PEEP (permitir exalacao completa)');
      h+=r('FiO₂','Menor possivel','Alvo: SpO₂ 88-95% ou PaO₂ 55-80 mmHg (Hipoxemia Permissiva)');
      h+=r('PaCO₂ Alvo','≤ 80 mmHg','Hipercapnia permissiva: aceitar ate 80 se tolerancia hemod. adequada');
      h+=r('pH Alvo','7.30-7.45','Aceitar ate 7.15-7.20. Diminuir FR se PaCO₂ < 50');
      h+=s('⚠️ Peso Predito:');
      h+=b('👨 Homem: 50 + 0,91 × (altura cm - 152,4)<br>👩 Mulher: 45,5 + 0,91 × (altura cm - 152,4)');
      h+=s('💊 CONDUTAS ESPECIFICAS:');
      h+=s('💉 Bloqueio Neuromuscular:');
      h+=n('• ACURASYS: Favoravel (48h continuo se P/F < 150)');
      h+=n('• ROSE: Nao mostrou beneficio (uso liberal)');
      h+=n('• Recomendacao: Individualizar conforme assincronia e oxigenacao');
      h+=s('🔄 Posicao Prona:');
      h+=n('• PROSEVA: P/F < 150 → Prona precoce ≥ 16h/dia');
      h+=n('• Beneficio: ↓ Mortalidade em 30-50%');
      h+=n('• Implementar nas primeiras 48h');
      h+=s('🌬️ Manobras de Recrutamento Alveolar (MRA):');
      h+=b('⚠️ Nem toda SDRA e recrutavel! Avaliar recrutabilidade: SDRA pulmonar (primaria) vs extrapulmonar (secundaria)<br><br>• Diversas: Inicio com PEEP 10 + 2min<br>• ART Trial: Inicio com PEEP 25 + 1min (mais agressivo)<br>• OPA: Protocolo Opening Airway Pressure');
      h+=s('⚠️ OBSERVACOES IMPORTANTES:');
      h+=s('🛡️ Ventilacao Ultraprotetora:');
      h+=b('Estrategia extremamente protetora para SDRA grave refrataria, minimizando risco de VILI com suporte extracorporeo.<br><br>• FiO₂: < 60%<br>• PEEP: 10 cmH₂O<br>• Pressao de Controle (PC): 10 cmH₂O<br>• VC: < 4 ml/kg peso predito<br>• FR: 10 rpm<br>• Objetivo: Driving Pressure minimo (ΔP ≈ 10 cmH₂O)<br>• Geralmente requer ECMO para manter oxigenacao');
      h+=s('📋 Atualizacoes AMIB 2024:');
      h+=n('✓ Iniciar com FR 20-30 ipm: Para pacientes com SARA recebendo estrategias de ventilacao com baixos volumes correntes');
      h+=n('✓ Evitar aumento de FR: Com unico intuito de normalizar a PaCO₂, caso a tolerancia hemodinamica a hipercapnia permissiva esteja adequada');
      h+=n('✓ Diminuir FR: Se PaCO₂ esteja abaixo de 50mmHg');
    }
    if(id==='asma'){
      h+=s('🟡 Asma / Broncoespasmo Grave');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','VCV','Controlar volume minuto');
      h+=r('VC','6-8 ml/kg','Minimizar hiperinsuflacao');
      h+=r('FR','10-14 ipm','↑ Tempo expiratorio');
      h+=r('I:E','1:3 a 1:4','Permitir esvaziamento pulmonar');
      h+=r('Pplato','< 30 cmH₂O','Evitar barotrauma');
      h+=r('PEEP','0-5 cmH₂O (baixo)','Evitar perpetuar auto-PEEP');
      h+=r('Fluxo Inspiratorio','80-100 L/min (alto)','Encurtar Ti, ↑ Te');
      h+=r('PaCO₂','Aceitar ate 90 mmHg','pH ≥ 7.20 (hipercapnia permissiva)');
      h+=s('💊 CONDUTAS ESPECIFICAS:');
      h+=s('💊 Tratamento Farmacologico:');
      h+=n('• Broncodilatadores: Salbutamol 2,5-5 mg nebulizado 4/4h');
      h+=n('• Corticoides: Metilprednisolona 40-60 mg IV 6/6h');
      h+=n('• Considerar: Sulfato de Magnesio 2g IV em 20min');
      h+=s('⚠️ OBSERVACOES IMPORTANTES:');
      h+=n('⚠️ Monitorizar:');
      h+=n('• PaCO₂ (esperado elevado), pH');
      h+=n('• Pplato < 30 cmH₂O');
      h+=n('• Auto-PEEP (pausa expiratoria)');
    }
    if(id==='covid'){
      h+=s('🔴 COVID-19 / SDRA Viral');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=b('⚠️ COVID-19 apresenta 2 FENOTIPOS distintos que exigem estrategias diferentes');
      h+=r('Parametro','Fenotipo L (Low)','Fenotipo H (High)');
      h+=r('Complacencia','Normal/Alta (>50 mL/cmH₂O)','Baixa (<40 mL/cmH₂O)');
      h+=r('Elastancia','⬇️ Baixa','⬆️ Alta');
      h+=r('Volume Corrente','6 mL/kg (protecao moderada)','4-6 mL/kg (ultraprotecao)');
      h+=r('PEEP','8-10 cmH₂O (moderada)','12-16 cmH₂O (alta, titular)');
      h+=r('Driving Pressure','< 14 cmH₂O','< 14 cmH₂O');
      h+=r('Recrutabilidade','⬇️ Baixa','⬆️ Alta');
      h+=r('Relacao I:E','1:2 (padrao)','1:1 a 1:1.5');
      h+=r('Posicao Prona','Considerar se P/F<150','Indicada precocemente');
      h+=r('Estrategia','Otimizar V/Q','Recrutamento + Prona + PEEP alta');
      h+=s('💊 CONDUTAS ESPECIFICAS:');
      h+=s('🔄 Protocolo de Posicao Prona - COVID-19:');
      h+=n('📋 Indicacoes:');
      h+=n('✓ PaO₂/FiO₂ < 150 mmHg com FiO₂ ≥ 60%');
      h+=n('✓ PEEP ≥ 5 cmH₂O');
      h+=n('✓ Inicio precoce (primeiras 24-48h de VMI)');
      h+=n('✓ Preferencia para Fenotipo H');
      h+=n('⏱️ Duracao: 12-16 horas/dia em prona. Minimo 12h. Pode estender ate 20h.');
      h+=s('✅ Criterios para Suspender Prona:');
      h+=n('• PaO₂/FiO₂ > 150 com PEEP ≤ 10 e FiO₂ ≤ 60%');
      h+=n('• Melhora sustentada por > 4h em supino');
      h+=n('• Ou complicacoes que impedam continuidade');
      h+=s('🚫 Contraindicacoes:');
      h+=n('Absolutas: Fratura instavel de coluna, Trauma facial/craniano grave, HIC, Gestacao >20 sem');
      h+=n('Relativas: Instabilidade hemod. grave, Hemorragia ativa, DVE recente (<48h), Torax instavel');
      h+=s('💊 Tratamento Farmacologico:');
      h+=n('• Dexametasona 6 mg/dia IV por 10 dias: ↓ mortalidade em 30%');
      h+=n('• Anticoagulacao: Enoxaparina profilatica/terapeutica (monitorar D-dimero)');
      h+=n('• Considerar Tocilizumabe: se IL-6 elevada e piora rapida');
    }
    if(id==='dpoc'){
      h+=s('🟢 DPOC Exacerbado');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','VCV, PCV ou PSV');
      h+=r('VC','6-8 ml/kg');
      h+=r('FR','10-15 ipm (baixa!)');
      h+=r('I:E','1:3 a 1:5','↑ tempo expiratorio');
      h+=r('PEEP','50-85% da PEEPi','4-8 cmH₂O tipico');
      h+=r('FiO₂','SpO₂ 88-92%','Evitar hiperoxemia!');
      h+=s('⚡ Auto-PEEP (PEEPi):');
      h+=n('Causas: Tempo expiratorio insuficiente + Obstrucao ao fluxo aereo');
      h+=n('Consequencias: Hiperinsuflacao dinamica, ↑ trabalho resp, ↓ retorno venoso (hipotensao), barotrauma');
      h+=n('Estrategias: ↓ FR, ↓ Volume Minuto, ↑ Relacao I:E, PEEP extrinseca (50-85% da PEEPi)');
      h+=s('💊 CONDUTAS ESPECIFICAS:');
      h+=n('✅ Fazer: ↓ Vol Minuto, ↑ Tempo Exp (I:E 1:3-1:5), VC 6-8ml/kg, FR baixa 10-15, Hipercapnia permissiva pH≥7.25');
      h+=n('⚠️ Evitar: FR alta, VC alto, I:E invertida, Auto-PEEP excessiva');
      h+=s('⚠️ Cuidados Especiais:');
      h+=n('• DPOC retem CO₂: Aceitar PaCO₂ 50-65 mmHg (habitual do paciente)');
      h+=n('• Meta SpO₂: 88-92% (NAO > 96%, risco retencao CO₂)');
      h+=n('• Despertar e desmame PRECOCE (VNI assim que possivel)');
      h+=n('• Hiperoxemia pode suprimir drive respiratorio');
    }
    if(id==='neuro'){
      h+=s('🧠 Neuroprotecao (TCE/AVC)');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','VCV','Melhor controle de PaCO₂');
      h+=r('Vt','6-8 ml/kg peso predito');
      h+=r('FR','12-16 ipm','Ajustar para PaCO₂ 35-40 mmHg');
      h+=r('PEEP','5-8 cmH₂O','Evitar PEEP > 10 cmH₂O');
      h+=r('FiO₂','SpO₂ 94-98%','Evitar hiperóxia e hipóxia');
      h+=r('Pplato','< 30 cmH₂O');
      h+=r('I:E','1:2','Evitar inversao');
      h+=s('⚠️ Fisiopatologia:');
      h+=n('1. Hipercapnia (PaCO₂ > 45): Vasodilatacao cerebral → ↑ fluxo sanguineo cerebral → ↑ PIC');
      h+=n('2. Hipocapnia (PaCO₂ < 30): Vasoconstricao cerebral excessiva → isquemia cerebral (usar apenas em crises de HIC refrataria)');
      h+=n('3. PEEP elevada (> 10): ↑ pressao intratoracica → ↓ retorno venoso cerebral → ↑ PIC');
      h+=s('💊 Condutas Especificas:');
      h+=n('• Sedacao profunda: RASS -4 a -5 (↓ metabolismo cerebral, ↓ consumo O₂)');
      h+=n('• Osmoterapia: Manitol 0,25-1 g/kg IV em bolus (se PIC > 20 mmHg)');
      h+=n('• Cabeceira elevada: 30-45° (facilita drenagem venosa cerebral, ↓ PIC)');
      h+=n('• PAM: 80-100 mmHg (garantir PPC > 60 mmHg)');
      h+=s('📊 Monitorizacao Essencial:');
      h+=n('• PIC: monitorizacao invasiva (alvo: < 20 mmHg)');
      h+=n('• PPC: PPC = PAM - PIC (alvo: > 60 mmHg)');
      h+=n('• Gasometria: 6/6h ou 8/8h (PaCO₂, PaO₂)');
      h+=n('• Capnografia: EtCO₂ continuo (correlacao com PaCO₂)');
    }
    if(id==='trauma'){
      h+=s('🚨 Trauma Toracico');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','VCV ou PCV (A/C inicialmente)');
      h+=r('VC','6 ml/kg peso predito');
      h+=r('FR','16-20 rpm');
      h+=r('FiO₂','Ajustar para SpO₂ > 92%');
      h+=r('PEEP','5-10 cmH₂O');
      h+=r('Pplato','< 30 cmH₂O');
      h+=b('⚠️ PCV em Fistula Pleural: a utilizacao de PCV e a mais adequada, visto que nessa modalidade o vazamento sera compensado. Em niveis elevados, a PEEP tambem pode perpetuar o trajeto fistuloso.');
      h+=s('💊 CONDUTAS ESPECIFICAS:');
      h+=n('• INVESTIGAR: Pneumotorax, hemotorax, contusao pulmonar');
      h+=n('• Drenagem toracica: Indicar se pneumo > 2cm ou hemotorax');
      h+=n('• RX torax DIARIO: Avaliar progressao de contusao');
      h+=n('• Analgesia RIGOROSA: Bloqueio paravertebral/epidural (permite tosse)');
      h+=n('• Fluidoterapia RESTRITIVA: Edema pulmonar em contusao');
      h+=s('⚠️ Cuidados:');
      h+=n('• Avaliar torax instavel (fratura de costelas multiplas)');
      h+=n('• Monitorar vazamento de ar (dreno toracico)');
      h+=n('• Fisioterapia: Expansao toracica, tosse assistida (apos analgesia)');
      h+=n('• Analgesia adequada = melhor mecanica respiratoria');
    }
    if(id==='intraop'){
      h+=s('🏥 VM Intra-Operatorio (Ventilacao Protetora)');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','VCV ou PCV');
      h+=r('Vt','6-8 ml/kg peso predito','Ventilacao protetora');
      h+=r('PEEP','5-8 cmH₂O','Prevenir atelectasia');
      h+=r('Driving Pressure','≤ 15 cmH₂O');
      h+=r('FiO₂','30-50%','Reduzir progressivamente, evitar 100% prolongada');
      h+=r('FR','10-14 rpm','Ajustar para EtCO₂ 35-40 mmHg');
      h+=b('💡 Ventilacao Protetora Intra-Operatoria baseada em estudos (IMPROVE, PROVHILO, PROBESE) que demonstram reducao de complicacoes pulmonares pos-operatorias (CPP).');
      h+=s('💊 CONDUTAS ESPECIFICAS:');
      h+=s('🔄 Manobras de Recrutamento Alveolar (MRA):');
      h+=n('• Tecnica: CPAP 30-40 cmH₂O por 30 segundos');
      h+=n('• Frequencia: Cada 30-60 minutos');
      h+=n('• Obrigatoria: Ao final da cirurgia (antes de extubar)');
      h+=s('🏥 Tipos de Cirurgia:');
      h+=n('📋 Laparotomia: Vt 6-8ml/kg | PEEP 5-8 | Risco: compressao diafragmatica → atelectasia');
      h+=n('📋 Laparoscopia (pneumoperitonio 12-15mmHg): PEEP 8-10 | FR aumentar (EtCO₂ sobe) | Pplato aceitar ate 35 se ΔP≤15');
      h+=n('🫁 Cirurgia Toracica (monopulmonar): Vt 4-6ml/kg | PEEP 5-10 | FiO₂ 80-100% inicialmente');
      h+=n('❤️ Cirurgia Cardiaca (pos-CEC): MRA OBRIGATORIA apos CEC | PEEP 5-8 (nao prejudica DC)');
      h+=s('📊 Relacao FR x Driving Pressure:');
      h+=b('Ao reduzir Vt para ventilacao protetora (6-8ml/kg), e necessario AUMENTAR a FR para manter volume-minuto adequado e normocapnia.<br><br>Exemplo pratico:<br>• Vt antigo (10ml/kg) + FR 10 = VM 7000ml<br>• Vt novo (7ml/kg) + FR 10 = VM 4900ml → hipercapnia!<br>• Solucao: Vt 7ml/kg + FR 14 = VM 6860ml ✓');
    }
    if(id==='cardio'){
      h+=s('❤️ Cardiopatas (ICC, IAM, Valvopatias)');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','A/C (VCV ou PCV) ou PSV','Conforme estabilidade');
      h+=r('Vt','6-8 ml/kg peso predito');
      h+=r('PEEP','8-12 (ICC) / 5-8 (valvopatias)');
      h+=r('FiO₂','SpO₂ 92-96%','Evitar 100%');
      h+=r('FR','12-20 ipm','Normocapnia: PaCO₂ 35-45');
      h+=r('Pplato','< 30 cmH₂O');
      h+=r('Driving Pressure','< 15 cmH₂O');
      h+=s('⚙️ Principios Gerais - PEEP individualizada:');
      h+=n('• ICC descompensada: PEEP 8-12 (benefica! ↓ pos-carga VE)');
      h+=n('• Cor pulmonale/TEP: PEEP baixa 5-8 (evitar sobrecarga VD)');
      h+=n('• Estenose aortica: PEEP baixa 5-8 (manter pre-carga)');
      h+=s('🌬️ VNI - 1ª Linha em Edema Pulmonar Cardiogenico:');
      h+=n('• CPAP: 8-12 cmH₂O + FiO₂ 50-100%');
      h+=n('• BiPAP: IPAP 15-20 cmH₂O, EPAP 8-10 cmH₂O');
      h+=n('• Reduz intubacao em 50-60%, mortalidade em 40%');
      h+=s('💊 Terapia Adjuvante:');
      h+=n('• Diureticos: Furosemida 40-80 mg IV bolus');
      h+=n('• Vasodilatadores: Nitroglicerina IV 10-200 mcg/min');
      h+=n('• Inotropicos (se choque): Dobutamina 2,5-10 mcg/kg/min');
      h+=s('⚠️ Desmame em Cardiopatas:');
      h+=b('Edema Pulmonar Induzido por Desmame (EPID): 10-20% dos cardiopatas durante TRE<br><br>• Retirada de PEEP → ↑ retorno venoso + ↑ pos-carga VE → congestao<br>• VNI pos-extubacao profilatica (CPAP 8 cmH₂O por 24-48h)');
    }
    if(id==='tep'){
      h+=s('🫀 TEP (Tromboembolismo Pulmonar)');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','A/C (VCV ou PCV)');
      h+=r('Vt','6 ml/kg peso predito');
      h+=r('PEEP','0-5 cmH₂O','MINIMA possivel!');
      h+=r('FiO₂','SpO₂ 88-92%');
      h+=r('FR','PaCO₂ 35-40','Evitar hipercapnia: ↑ RVP');
      h+=r('Pplato','< 30 cmH₂O');
      h+=r('Driving Pressure','< 15 cmH₂O');
      h+=b('💡 IOT quando indicada (hipoxemia, fadiga, choque), mas COM PRECAUCOES!<br>❌ VNI NAO e indicada no TEP (pode atrasar IOT, pressao positiva piora VD)<br>Por que VM e DELETERIA: PEEP comprime capilares → ↑↑ RVP → sobrecarga de VD → colapso hemodinamico');
      h+=s('💊 Tratamento Especifico:');
      h+=n('1. Anticoagulacao (TODOS):');
      h+=n('• HNF IV: 80 U/kg bolus → 18 U/kg/h');
      h+=n('• Enoxaparina SC: 1 mg/kg 12/12h (se estavel)');
      h+=n('2. Trombolitico (TEP de ALTO RISCO):');
      h+=n('• Indicacao: choque ou hipotensao (PAS < 90 mmHg)');
      h+=n('• rtPA: 100 mg IV em 2h OU 50 mg bolus (se PCR)');
      h+=n('• Reduz mortalidade em 50%');
      h+=s('💊 Suporte Hemodinamico:');
      h+=n('• Noradrenalina: 0,1-0,5 mcg/kg/min (↑ perfusao coronaria VD)');
      h+=n('• Dobutamina: 2,5-10 mcg/kg/min (se disfuncao grave VD)');
      h+=s('⚠️ Evitar ABSOLUTAMENTE:');
      h+=n('• PEEP alta (> 8 cmH₂O): colapso de VD garantido');
      h+=n('• Hipercapnia (PaCO₂ > 50): vasoconstricao pulmonar → ↑ RVP');
      h+=n('• Hiperinsuflacao: distensao alveolar → ↑ RVP');
    }
    if(id==='obeso'){
      h+=s('⚖️ Obeso (IMC ≥ 30 kg/m²)');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','VCV ou PCV');
      h+=r('Vt','6-8 ml/kg PESO PREDITO','NAO peso real!');
      h+=r('PEEP (titular conforme IMC)','IMC 30-35: 8-10 | 35-40: 10-12','IMC>40: 12-18 | >50: 15-20');
      h+=r('FiO₂','SpO₂ 92-96%');
      h+=r('FR','12-20 ipm');
      h+=r('Pplato','≤ 30 cmH₂O','Pode aceitar 35-40 SE ΔP < 15');
      h+=r('Driving Pressure','< 15 cmH₂O','MAIS IMPORTANTE que Pplato!');
      h+=r('Posicao','Cabeceira 30-45°','OBRIGATORIA!');
      h+=s('⚖️ Peso Predito (PBW):');
      h+=b('👨 Homem: PBW = 50 + 0,91 × [altura(cm) - 152,4]<br>👩 Mulher: PBW = 45,5 + 0,91 × [altura(cm) - 152,4]<br><br>Exemplo: Homem 180cm, 150kg (IMC 46) → PBW = 75kg → Vt = 450ml (NAO 900ml!)');
      h+=s('💨 PEEP ALTA e benefica no obeso:');
      h+=n('• Recruta alveolos colapsados (atelectasias basais)');
      h+=n('• Mantem CRF acima do volume de fechamento');
      h+=n('• Melhora oxigenacao (reduz shunt)');
      h+=n('• Contrabalanca pressao abdominal');
      h+=s('🔓 Desmame e Extubacao:');
      h+=n('• VNI profilatica pos-extubacao (RECOMENDADA!):');
      h+=n('  - BiPAP: IPAP 10-12, EPAP 8-10 cmH₂O');
      h+=n('  - Iniciar imediatamente, manter 24-48h');
      h+=n('  - Reduz reintubacao em 50%!');
      h+=n('• Posicao semi-sentada (45°), fisioterapia agressiva');
      h+=s('⚠️ Intubacao no Obeso (VIA AEREA DIFICIL!):');
      h+=n('• Desafios: Via aerea dificil, dessaturacao rapida (30-60s), aspiracao');
      h+=n('• Posicionamento RAMPA: Cabeceira 25-30° + travesseiros');
      h+=n('• Pre-oxigenacao: VNI (CPAP 10 + FiO₂ 100%) por 5 min → tempo apneia 30s → 3-4min');
      h+=n('• Medicacoes: Propofol 1,5-2 mg/kg PBW (NAO peso real!)');
    }
    if(id==='pav'){
      h+=s('🦠 PAV (Pneumonia Associada a Ventilacao)');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','VCV ou PSV conforme tolerancia');
      h+=r('Vt','6-8 ml/kg peso predito','Ventilacao protetora');
      h+=r('PEEP','5-10 cmH₂O','Manter recrutamento alveolar');
      h+=r('FiO₂','SpO₂ > 92%');
      h+=r('Pplato','< 30 cmH₂O');
      h+=r('Driving Pressure','< 15 cmH₂O');
      h+=s('💊 Antibioticoterapia:');
      h+=n('• EMPIRICA precoce (primeiras 1h do diagnostico)');
      h+=n('• Colher culturas ANTES de iniciar ATB (aspirado traqueal, hemocultura)');
      h+=n('• ATB empirico: Piperacilina-Tazobactam 4,5g IV 6/6h OU Meropenem 1g IV 8/8h');
      h+=n('• Adicionar cobertura MRSA: Vancomicina 15 mg/kg IV 12/12h (se fatores de risco)');
      h+=n('• Ajustar ATB apos cultura e antibiograma (48-72h)');
      h+=n('• Duracao: 7-8 dias (se boa resposta clinica)');
      h+=s('🛡️ Bundle de Prevencao de PAV:');
      h+=n('• Cabeceira 30-45° sempre');
      h+=n('• Higiene oral com clorexidina 0,12% 2x/dia');
      h+=n('• Aspiracao de secrecao subglotica a cada 2-4h');
      h+=n('• Despertar diario: minimizar tempo de VM');
      h+=n('• Trocar circuito apenas se sujeira visivel (nao rotineiramente)');
    }
    if(id==='me'){
      h+=s('🧠💀 MORTE ENCEFALICA - Protocolo de Manutencao do Potencial Doador');
      h+=b('⚠️ Morte Encefalica (ME) e a CESSACAO IRREVERSIVEL de TODAS as funcoes encefalicas (cortex cerebral + tronco encefalico), resultando em:<br>• Perda total de consciencia (coma aperceptivo)<br>• Ausencia de reflexos de tronco encefalico<br>• Apneia (incapacidade de respirar espontaneamente)');
      h+=b('🎯 OBJETIVO DA VM: Manter OXIGENACAO e PERFUSAO tecidual adequadas para preservar orgaos viaveis para doacao, minimizando VILI.');
      h+=s('📊 PARAMETROS VENTILATORIOS:');
      h+=r('Modo','VCV (Volume Controlado)','Volume minuto estavel e previsivel');
      h+=r('VC','6-8 ml/kg peso predito','Ventilacao protetora. NUNCA peso real!');
      h+=r('FR','12-16 ipm','PaCO₂ 35-45 mmHg (normocapnia)');
      h+=r('PEEP','5-8 cmH₂O','Evitar >10 (↓ retorno venoso → hipotensao)');
      h+=r('FiO₂','≤ 40% (menor possivel)','SpO₂ ≥ 95%. Hiperoxemia causa lesao pulmonar');
      h+=r('Pplato','≤ 30 cmH₂O','Limitar baro/volutrauma');
      h+=r('Driving Pressure','≤ 15 cmH₂O','Melhor preditor de VILI');
      h+=r('I:E','1:2','Evitar auto-PEEP');
      h+=r('PaCO₂ Alvo','35-45 mmHg','Normocapnia');
      h+=r('PaO₂ Alvo','≥ 80 mmHg (SpO₂ ≥ 95%)','Evitar hiperóxia (PaO₂ >300 e prejudicial)');
      h+=r('pH Arterial','7.35 - 7.45','Equilibrio acido-base');
      h+=s('🧪 PROTOCOLO DIAGNOSTICO ME (CFM 2.173/2017):');
      h+=s('📋 PRE-REQUISITOS OBRIGATORIOS:');
      h+=n('✓ Causa conhecida e irreversivel da lesao cerebral (neuroimagem documentada)');
      h+=n('✓ Ausencia de fatores confundidores:');
      h+=n('  - Temperatura corporal ≥ 35°C');
      h+=n('  - PAS ≥ 100 mmHg (adultos) ou PAM adequada para idade');
      h+=n('  - Ausencia de drogas depressoras do SNC');
      h+=n('  - Ausencia de disturbios metabolicos graves');
      h+=n('✓ Observacao clinica de no minimo 6 horas');
      h+=s('🔬 EXAME CLINICO NEUROLOGICO (2x por 2 medicos diferentes):');
      h+=n('1️⃣ Avaliacao do Nivel de Consciencia: Coma aperceptivo (Glasgow 3), ausencia de resposta motora');
      h+=n('2️⃣ Reflexos de Tronco Encefalico:');
      h+=n('• Reflexo fotomotor: Pupilas fixas e nao reativas (mesencefalo)');
      h+=n('• Reflexo corneo-palpebral: Ausente bilateralmente (ponte)');
      h+=n('• Reflexo oculocefalico: Ausente (ponte/mesencefalo)');
      h+=n('• Reflexo oculovestibular: Ausente apos 50ml soro gelado (ponte/mesencefalo)');
      h+=n('• Reflexo de tosse: Ausente (bulbo)');
      h+=s('3️⃣ TESTE DE APNEIA:');
      h+=n('• Pre-oxigenacao: FiO₂ 100% por 10 minutos');
      h+=n('• Gasometria pre-teste: PaCO₂ 35-45 mmHg');
      h+=n('• Desconectar VM: O₂ intratraqueal 6 L/min via TOT');
      h+=n('• Observar 8-10 min: Aguardar PaCO₂ ≥ 55 ou ↑20 acima da baseline');
      h+=n('• POSITIVO (confirma ME): AUSENCIA de mov respiratorios com PaCO₂ ≥ 55');
      h+=n('• NEGATIVO (NAO e ME): Qualquer esforco respiratorio');
      h+=n('• ⚠️ Interromper se: SpO₂ < 85%, arritmias graves, PAS < 90');
      h+=s('🖼️ EXAME COMPLEMENTAR OBRIGATORIO (1):');
      h+=n('• Angiografia Cerebral (4 vasos): Padrao-ouro');
      h+=n('• Doppler Transcraniano: Fluxo reverberante ou ausente');
      h+=n('• Cintilografia Cerebral (Tc-99m): Sinal do cranio vazio');
      h+=n('• EEG: Silencio eletrico cerebral por 30 minutos');
      h+=s('💉 MANEJO HEMODINAMICO DO POTENCIAL DOADOR:');
      h+=n('• Meta PAM: ≥ 65 mmHg (Noradrenalina 0,01-0,5 mcg/kg/min)');
      h+=n('• Meta PVC: 4-10 mmHg');
      h+=n('• Meta Diurese: 0,5-3 ml/kg/h (monitorar Diabetes Insipidus)');
      h+=n('• Reposicao Hormonal (AECISP/ABTO):');
      h+=n('  - Metilprednisolona 15 mg/kg IV bolus');
      h+=n('  - Levotiroxina (T4) 20 mcg IV bolus + 10 mcg/h em BIC');
      h+=n('  - Desmopressina (DDAVP) 1-4 mcg IV se poliuria');
      h+=n('  - Insulina regular: meta glicemia 120-180 mg/dL');
      h+=n('• Temperatura: Manter ≥ 35°C');
      h+=s('🚫 CONTRAINDICACOES ABSOLUTAS DOACAO PULMONAR:');
      h+=n('• Neoplasia maligna (exceto tumores SNC sem metastase)');
      h+=n('• Infeccao ativa nao controlada (sepse multiresistente)');
      h+=n('• HIV+, Hepatite B ou C ativa');
      h+=n('• Aspiracao macica de conteudo gastrico');
      h+=n('• Pneumonia grave bilateral');
      h+=n('• Contusao pulmonar extensa');
      h+=n('• PaO₂/FiO₂ < 300 (relativo)');
      h+=s('✅ CRITERIOS IDEAIS DOACAO PULMONAR:');
      h+=n('• Idade < 55 anos (relativo)');
      h+=n('• Tabagismo < 20 macos/ano');
      h+=n('• RX Torax sem infiltrados significativos');
      h+=n('• PaO₂ > 300 com FiO₂ 100% e PEEP 5');
      h+=n('• Ausencia de secrecao purulenta na broncoscopia');
      h+=n('• Tempo de VM < 5-7 dias');
      h+=s('📚 REFERENCIAS:');
      h+=n('• Resolucao CFM 2.173/2017');
      h+=n('• ABTO/AECISP - Diretrizes manutencao de multiplos orgaos');
      h+=n('• Mascia L et al. JAMA 2010');
    }
    return h;
  },
  addExame:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.examesLabList)p.examesLabList=[];
      var hoje=new Date().toISOString().slice(0,10);
      p.examesLabList.unshift({data:hoje,hb:'',ht:'',leuco:'',plaq:'',creat:'',ureia:'',k:'',na:'',lac:'',pcr:'',bt:'',alb:'',tgo:'',tgp:'',inr:''});
      save();renderForm();
    }catch(e){showDbg('addExame: '+e.message);}
  },
  delExame:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.examesLabList)return;
      p.examesLabList.splice(i,1);save();renderForm();
    }catch(e){showDbg('delExame: '+e.message);}
  },
  setExame:function(i,key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.examesLabList||!p.examesLabList[i])return;
      p.examesLabList[i][key]=val;save();
    }catch(e){showDbg('setExame: '+e.message);}
  },
  addExameImagem:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.examesImagemList)p.examesImagemList=[];
      var hoje=new Date().toISOString().slice(0,10);
      p.examesImagemList.unshift({data:hoje,tipo:'',laudo:''});
      save();renderForm();
    }catch(e){showDbg('addExameImagem: '+e.message);}
  },
  delExameImagem:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.examesImagemList)return;
      p.examesImagemList.splice(i,1);save();renderForm();
    }catch(e){showDbg('delExameImagem: '+e.message);}
  },
  setExameImagem:function(i,key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.examesImagemList||!p.examesImagemList[i])return;
      p.examesImagemList[i][key]=val;save();
    }catch(e){showDbg('setExameImagem: '+e.message);}
  },
  addSedativo:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.sedativos)p.sedativos=[];
      p.sedativos.push({droga:'',inicio:'',atual:'',unidade:'ml/h'});
      save();renderForm();
    }catch(e){showDbg('addSedativo: '+e.message);}
  },
  delSedativo:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.sedativos)return;
      p.sedativos.splice(i,1);save();renderForm();
    }catch(e){showDbg('delSedativo: '+e.message);}
  },
  setSedativo:function(i,key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.sedativos||!p.sedativos[i])return;
      p.sedativos[i][key]=val;save();
    }catch(e){showDbg('setSedativo: '+e.message);}
  },
  addBNM:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.bnmList)p.bnmList=[];
      p.bnmList.push({droga:'',inicio:'',atual:'',unidade:'ml/h'});
      save();renderForm();
    }catch(e){showDbg('addBNM: '+e.message);}
  },
  delBNM:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.bnmList)return;
      p.bnmList.splice(i,1);save();renderForm();
    }catch(e){showDbg('delBNM: '+e.message);}
  },
  setBNM:function(i,key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.bnmList||!p.bnmList[i])return;
      p.bnmList[i][key]=val;save();if(key==='atual')renderForm();
    }catch(e){showDbg('setBNM: '+e.message);}
  },
  addDVA:function(){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p)return;
      if(!p.dvaList)p.dvaList=[];
      p.dvaList.push({droga:'',inicio:'',atual:'',unidade:'ml/h'});
      save();renderForm();
    }catch(e){showDbg('addDVA: '+e.message);}
  },
  delDVA:function(i){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.dvaList)return;
      p.dvaList.splice(i,1);save();renderForm();
    }catch(e){showDbg('delDVA: '+e.message);}
  },
  setDVA:function(i,key,val){
    try{
      var p=patients.find(function(x){return x.id===editingId;});
      if(!p||!p.dvaList||!p.dvaList[i])return;
      p.dvaList[i][key]=val;save();if(key==='atual')renderForm();
    }catch(e){showDbg('setDVA: '+e.message);}
  },
  showRef:function(){showingRef=true;refExpSys=null;refExpProb=null;refSearch='';renderRef();},
  closeRef:function(){showingRef=false;renderICU();},
  refFilter:function(v){refSearch=v;renderRef();},
  refToggleSys:function(id){refExpSys=refExpSys===id?null:id;refExpProb=null;renderRef();},
  refToggleProb:function(pid){refExpProb=refExpProb===pid?null:pid;renderRef();},
  setTab:function(t){try{formTab=t;save();renderForm();var ps=document.querySelector('#page-icu-plantao .page-scroll');if(ps)ps.scrollTop=0;}catch(e){showDbg('setTab: '+e.message+' '+e.stack);}},
  nextTab:function(){
    try{
      var order=['dados','neuro','cardio','resp','motora','percepcao'];
      var i=order.indexOf(formTab);
      if(i<order.length-1){formTab=order[i+1];save();renderForm();var ps=document.querySelector('#page-icu-plantao .page-scroll');if(ps)ps.scrollTop=0;}
    }catch(e){showDbg('nextTab: '+e.message+' '+e.stack);}
  },
  prevTab:function(){
    try{
      var order=['dados','neuro','cardio','resp','motora','percepcao'];
      var i=order.indexOf(formTab);
      if(i>0){formTab=order[i-1];save();renderForm();var ps=document.querySelector('#page-icu-plantao .page-scroll');if(ps)ps.scrollTop=0;}
    }catch(e){showDbg('prevTab: '+e.message+' '+e.stack);}
  }
};
})();
