(function(){
  'use strict';
  var state={
    openCard:null,
    // Compliance por modo
    modoVCV:true,
    pico:'',plato:'',peep:'',vt:'',fluxo:'',
    // PEEP / SI
    peepOpt:[{peep:'',plato:'',si:''},{peep:'',plato:'',si:''},{peep:'',plato:'',si:''}],
    peepOptResult:'',
    // Recrutabilidade volumes
    recVolInsp:'',recVolExp:'',
    // Recrutabilidade loop P-V
    lip:'',uip:'',volLip:'',volUip:'',
    // RSBI
    rsbiFr:'',rsbiVc:'',
    // Updated HACOR (VNI) - componentes HACOR + SOFA (6 órgãos, 0-4 cada)
    hacorFC:'',hacorPH:'',hacorGCS:'',hacorOxig:'',hacorFR:'',hacorDx:'',
    sofaResp:'',sofaCNS:'',sofaCardio:'',sofaCoag:'',sofaLiver:'',sofaRenal:'',
    // ROX
    roxSpO2:'',roxFio2:'',roxFr:'',
    // Índice Assincronia
    iaEventos:'',iaTotal:'',
    // Mechanical Power
    mpVc:'',mpDp:'',mpF:'',
    // Volume corrente por peso (kg) — altura retirada do cálculo automático para VC
    vcPeso:'',
    // Glasgow
    glasgowO:'',glasgowV:'',glasgowM:'',
    // Gasometria arterial (P/F, S/F, BE)
    gasoPH:'',gasoPaCO2:'',gasoHCO3:'',gasoPaO2:'',gasoFiO2:'',gasoSpO2:'',gasoBE:'',
    // S/F (Sat do monitor + FiO2 da VM) - separado da gaso
    sfMonSpO2:'',sfVmFiO2:'',
    // MRC (6 grupos D/E)
    mrcOmbroD:'',mrcOmbroE:'',mrcCotoveloD:'',mrcCotoveloE:'',mrcPunhoD:'',mrcPunhoE:'',mrcQuadrilD:'',mrcQuadrilE:'',mrcJoelhoD:'',mrcJoelhoE:'',mrcTornozeloD:'',mrcTornozeloE:'',
    // PERME (0-21)
    permeEstado:'',permeBarreira:'',permeForcaMS:'',permeForcaMI:'',permeLeito:'',permeTransf:'',permeMarcha:'',
    // IMS (0-10)
    imsScore:'',
    // P0.1 / Pocc / Pmusc
    p01:'',pocc:'',
    // Eficiência ventilatoria / desmame
    vdvtPaCO2:'',vdvtPetCO2:'',
    vrVe:'',vrPaCO2:'',vrAltura:'',vrSex:'',
    gapPaCO2:'',gapEtCO2:'',
    weanPiMax:'',weanPeMax:'',weanCvMlKg:''
  };
  function parseSI(s){
    if(!s||s==='')return{val:NaN,txt:'-',ok:false};
    var st=String(s).trim().replace(/\s/g,'');
    if(st==='=1'||st==='1'||st==='1.0')return{val:1,txt:'=1 (Ideal)',ok:true};
    if(st==='>1'||st==='> 1')return{val:1.2,txt:'>1 (Hiperdistensao)',ok:false};
    if(st==='<1'||st==='< 1')return{val:0.8,txt:'<1 (Colapso/Recrutavel)',ok:false};
    var num=parseFloat(st);
    if(isNaN(num))return{val:NaN,txt:st,ok:false};
    return{val:num,txt:num.toFixed(2),ok:num>=0.9&&num<=1.1};
  }
  function calcPeepBest(){
    var nivs=state.peepOpt;var results=[];
    for(var i=0;i<3;i++){
      var pe=parseFloat(nivs[i].peep),pl=parseFloat(nivs[i].plato);
      if(isNaN(pe)||isNaN(pl))continue;
      var dp=pl-pe;
      var siR=parseSI(nivs[i].si);
      var dpClass=dp<12?'Otimo':dp<=15?'Aceitavel':'Elevado';
      var score=(dp<12?3:dp<=15?2:1)+(siR.ok?3:!isNaN(siR.val)?1:0);
      results.push({idx:i,peep:pe,plato:pl,dp:dp,siTxt:siR.txt,siOk:siR.ok,dpClass:dpClass,score:score});
    }
    if(results.length===0)return null;
    results.sort(function(a,b){return b.score-a.score||a.dp-b.dp;});
    return results;
  }
  function toggleCard(id){
    state.openCard=state.openCard===id?null:id;
    render();
  }
  function render(){
    var el=document.getElementById('vm-calcs-content');
    if(!el)return;
    try {
    var s=state;
    var dp=typeof calcDP==='function'?calcDP(s.plato,s.peep):(parseFloat(s.plato)-parseFloat(s.peep));
    if(dp!=null&&isNaN(dp))dp=null;
    var cest=(dp!=null&&dp!==0&&s.vt)?(typeof calcCest==='function'?calcCest(s.vt,dp):parseFloat(s.vt)/dp):null;
    var pico=parseFloat(s.pico),peep=parseFloat(s.peep),vt=parseFloat(s.vt),fluxo=parseFloat(s.fluxo);
    var cdyn=(s.modoVCV&&!isNaN(pico)&&!isNaN(peep)&&pico>peep&&vt)?vt/(pico-peep):null;
    var raw=(s.modoVCV&&!isNaN(pico)&&s.plato&&fluxo>0)?(pico-parseFloat(s.plato))/(fluxo/60):null;
    var rsbi=(s.rsbiFr&&s.rsbiVc)?(typeof calcRSBI==='function'?calcRSBI(s.rsbiFr,s.rsbiVc):(function(){var v=parseFloat(s.rsbiFr),vc=parseFloat(s.rsbiVc);return(!isNaN(v)&&!isNaN(vc)&&vc!==0)?v/(vc/1000):null;})()):null;
    var rInterp=(rsbi!=null&&!isNaN(rsbi)&&typeof interpRSBI==='function')?interpRSBI(rsbi):(rsbi!=null?{t:'RSBI '+Number(rsbi).toFixed(0),c:'#60a5fa'}:null);
    var lip=parseFloat(s.lip),uip=parseFloat(s.uip),vLip=parseFloat(s.volLip),vUip=parseFloat(s.volUip);
    var complPV=(lip!=null&&!isNaN(lip)&&uip!=null&&!isNaN(uip)&&vLip!=null&&!isNaN(vLip)&&vUip!=null&&!isNaN(vUip)&&(uip-lip)>0)?(vUip-vLip)/(uip-lip):null;
    var rox=(s.roxSpO2&&s.roxFio2&&s.roxFr)?(function(){var spo=parseFloat(s.roxSpO2),fio=parseFloat(s.roxFio2),fr=parseFloat(s.roxFr);if(isNaN(spo)||isNaN(fio)||isNaN(fr)||fio===0||fr===0)return null;return(spo/fio)*100/fr;})():null;
    var ia=(s.iaEventos&&s.iaTotal)?(function(){var e=parseFloat(s.iaEventos),t=parseFloat(s.iaTotal);if(isNaN(e)||isNaN(t)||t===0)return null;return(e/t)*100;})():null;
    var mp=(s.mpVc&&s.mpDp&&s.mpF)?(function(){var vc=parseFloat(s.mpVc),dp=parseFloat(s.mpDp),f=parseFloat(s.mpF);if(isNaN(vc)||isNaN(dp)||isNaN(f))return null;return 0.098*(vc/1000)*dp*f;})():null;
    var pesoIdeal=(s.vcPeso&&!isNaN(parseFloat(s.vcPeso)))?parseFloat(s.vcPeso):null;
    var glasgowResult=(s.glasgowO||s.glasgowV||s.glasgowM)?(typeof calcGlasgow==='function'?calcGlasgow(s.glasgowO,s.glasgowV,s.glasgowM):null):null;
    var gasoObj={gasoPH:s.gasoPH,gasoPaCO2:s.gasoPaCO2,gasoHCO3:s.gasoHCO3};
    var gasoAnalise=(s.gasoPH&&s.gasoPaCO2&&s.gasoHCO3)?(typeof analisarGaso==='function'?analisarGaso(gasoObj):null):null;
    var pfVal=(s.gasoPaO2&&s.gasoFiO2)?(typeof calcPF==='function'?calcPF(s.gasoPaO2,s.gasoFiO2):parseFloat(s.gasoPaO2)/(parseFloat(s.gasoFiO2)/100)):null;
    var sfVal=((s.sfMonSpO2||s.gasoSpO2)&&(s.sfVmFiO2||s.gasoFiO2))?(function(){
      var sp=parseFloat(s.sfMonSpO2||s.gasoSpO2),f=parseFloat(s.sfVmFiO2||s.gasoFiO2);
      if(isNaN(sp)||isNaN(f)||f===0)return null;
      return sp/(f/100);
    })():null;
    var pfInterp=(pfVal!=null&&typeof interpPF==='function')?interpPF(pfVal):null;
    var mrcKeys=['mrcOmbroD','mrcOmbroE','mrcCotoveloD','mrcCotoveloE','mrcPunhoD','mrcPunhoE','mrcQuadrilD','mrcQuadrilE','mrcJoelhoD','mrcJoelhoE','mrcTornozeloD','mrcTornozeloE'];
    var mrcTotal=0,mrcCount=0;
    mrcKeys.forEach(function(k){var v=s[k];if(v!==''){mrcTotal+=parseInt(v,10)||0;mrcCount++;}});
    var mrcInterp=(mrcCount===12)?(mrcTotal>=48?{txt:'Normal (>=48)',cor:'#4ade80'}:mrcTotal>=36?{txt:'Fraqueza leve (36-47)',cor:'#facc15'}:mrcTotal>=24?{txt:'Fraqueza mod. (24-35)',cor:'#fb923c'}:{txt:'Grave (<24) ICU-AW',cor:'#f87171'}):null;

    // PERME
    var permeItems=[
      {label:'Estado Mental',key:'permeEstado',opts:['Nao responde (0)','Resp. dor (1)','Resp. voz (2)','Alerta/orientado (3)'],vals:[0,1,2,3]},
      {label:'Barreiras a Mobilidade',key:'permeBarreira',opts:['2+ barreiras (0)','1 barreira (1)','Nenhuma (2)'],vals:[0,1,2]},
      {label:'Forca Funcional MMSS',key:'permeForcaMS',opts:['Sem mov. (0)','Sem vencer grav. (1)','Vence grav. (2)','Resist. moderada (3)'],vals:[0,1,2,3]},
      {label:'Forca Funcional MMII',key:'permeForcaMI',opts:['Sem mov. (0)','Sem vencer grav. (1)','Vence grav. (2)','Resist. moderada (3)'],vals:[0,1,2,3]},
      {label:'Mobilidade no Leito',key:'permeLeito',opts:['Nao realiza (0)','Assist. total (1)','Assist. parcial (2)','Independente (3)'],vals:[0,1,2,3]},
      {label:'Transferencia Sentado',key:'permeTransf',opts:['Nao realiza (0)','Assist. total (1)','Assist. parcial (2)','Independente (3)'],vals:[0,1,2,3]},
      {label:'Capacidade de Marcha',key:'permeMarcha',opts:['Nao deambula (0)','Assist. total/esteira (1)','Assist. parcial (2)','Independente (3)'],vals:[0,1,2,3]}
    ];
    var permeTotal=0,permeOk=true;
    permeItems.forEach(function(it){
      var v=s[it.key];
      if(v===undefined||v===''){permeOk=false;}
      else{permeTotal+=parseInt(v,10)||0;}
    });
    var permeInterp=permeOk?(permeTotal>=16?{txt:'Alta (16-21)',cor:'#4ade80'}:permeTotal>=8?{txt:'Moderada (8-15)',cor:'#facc15'}:{txt:'Baixa (0-7)',cor:'#f87171'}):null;

    // IMS
    var imsOpts=[
      {val:0,txt:'Nenhuma mobilidade (acamado)'},
      {val:1,txt:'Exercicios no leito'},
      {val:2,txt:'Passivo para cadeira'},
      {val:3,txt:'Sentado beira-leito'},
      {val:4,txt:'Ortostatismo'},
      {val:5,txt:'Transferencia leito-cadeira'},
      {val:6,txt:'Marcha estacionaria'},
      {val:7,txt:'Deambulacao assistida (2+)'},
      {val:8,txt:'Deambulacao assistida (1)'},
      {val:9,txt:'Deambulacao com dispositivo'},
      {val:10,txt:'Deambulacao independente'}
    ];
    var imsVal=s.imsScore;
    var imsN=(imsVal!==undefined&&imsVal!=='')?parseInt(imsVal,10):null;
    var imsInterp=(imsN!==null&&!isNaN(imsN))?(imsN>=7?{txt:'Alta (7-10)',cor:'#4ade80'}:imsN>=4?{txt:'Moderada (4-6)',cor:'#facc15'}:imsN>=1?{txt:'Baixa (1-3)',cor:'#fb923c'}:{txt:'Imobilidade (0)',cor:'#f87171'}):null;

    // P0.1 / Pocc / Pmusc
    var p01Interp=(s.p01&&typeof interpP01==='function')?interpP01(s.p01):null;
    var poccInterp=(s.pocc&&typeof interpPocc==='function')?interpPocc(s.pocc):null;
    var pmuscVal=(s.pocc&&typeof calcPmusc==='function')?calcPmusc(s.pocc):null;
    var pmuscInterp=(pmuscVal!=null&&typeof interpPmusc==='function')?interpPmusc(pmuscVal):null;

    // VD/VT, VR, Gap CO2, desmame (PImax/PEmax/CV)
    var vdvtVal=(s.vdvtPaCO2&&s.vdvtPetCO2)?(function(){var pa=parseFloat(s.vdvtPaCO2),pet=parseFloat(s.vdvtPetCO2);if(isNaN(pa)||isNaN(pet)||pa===0)return null;return (pa-pet)/pa;})():null;
    var vrAlt=s.vrAltura;var vrSx=s.vrSex;
    var vrPeso=(s.vcPeso&&!isNaN(parseFloat(s.vcPeso)))?parseFloat(s.vcPeso):(vrAlt&&vrSx&&typeof calcPesoIdeal==='function'?calcPesoIdeal(vrAlt,vrSx):null);
    var vrVal=(s.vrVe&&s.vrPaCO2&&vrPeso!=null)?(function(){var ve=parseFloat(s.vrVe),paco=parseFloat(s.vrPaCO2);if(isNaN(ve)||isNaN(paco)||ve===0)return null;var vePred=0.1*vrPeso;return (ve*paco)/(vePred*40);})():null;
    var gapVal=(s.gapPaCO2&&s.gapEtCO2)?(function(){var pa2=parseFloat(s.gapPaCO2),et2=parseFloat(s.gapEtCO2);if(isNaN(pa2)||isNaN(et2))return null;return pa2-et2;})():null;
    var piMax=(s.weanPiMax!=='')?Math.abs(parseFloat(s.weanPiMax)):null;
    var peMax=(s.weanPeMax!=='')?Math.abs(parseFloat(s.weanPeMax)):null;
    var cvMlKg=(s.weanCvMlKg!=='')?parseFloat(s.weanCvMlKg):null;


    var hacorBaseScore=(function(){
      var fc={'leq120':0,'ge121':1}[s.hacorFC];
      var ph={'ge735':0,'730_734':2,'725_729':3,'lt725':4}[s.hacorPH];
      var gcs={'15':0,'13_14':2,'11_12':5,'le10':10}[s.hacorGCS];
      var ox={'ge201':0,'176_200':2,'151_175':3,'126_150':4,'101_125':5,'le100':6}[s.hacorOxig];
      var fr={'le30':0,'31_35':1,'36_40':2,'41_45':3,'ge46':4}[s.hacorFR];
      if(fc===undefined&&ph===undefined&&gcs===undefined&&ox===undefined&&fr===undefined)return null;
      return (fc||0)+(ph||0)+(gcs||0)+(ox||0)+(fr||0);
    })();
    var sofaTotal=(function(){
      var r=[s.sofaResp,s.sofaCNS,s.sofaCardio,s.sofaCoag,s.sofaLiver,s.sofaRenal];
      var n=0;for(var i=0;i<6;i++){var v=parseInt(r[i],10);if(!isNaN(v)&&v>=0&&v<=4)n+=v;}
      return n;
    })();
    var hacor=(function(){
      if(hacorBaseScore===null)return null;
      var dx=String(s.hacorDx||'').trim();
      var dxAdj=0;
      if(dx==='pneumonia')dxAdj=2.5;
      else if(dx==='choque_septico')dxAdj=2.5;
      else if(dx==='ards')dxAdj=3.0;
      else if(dx==='edema_cardiogenico')dxAdj=-4.0;
      return hacorBaseScore+dxAdj+(0.5*sofaTotal);
    })();

    var h='<div class="vm-calcs-column" style="display:flex;flex-direction:column;gap:10px">';

    // ---- Card 1: Compliance e Driving Pressure (por modo) ----
    var open1=s.openCard==='compliance';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(34,211,238,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'compliance\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(34,211,238,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open1?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#22d3ee">Compliance e Driving Pressure</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(VCV: Pico, Plato, Cest, Cdyn, Raw | PCV: Plato, Cest)</span></button>';
    if(open1){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(34,211,238,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px">ΔP = Pplato − PEEP. Cest = Vt/ΔP (complacência estática). VCV: Cdyn = Vt/(Pico−PEEP); Raw = (Pico−Plato)/(Fluxo L/min÷60). PCV: apenas Plato, PEEP e Vt.</div>';
      h+='<div class="icu-field" style="margin-bottom:8px"><label>Modo</label><select onchange="VMCalcs.set(\'modoVCV\',this.value===\'VCV\');VMCalcs.render()">';
      h+='<option value="VCV"'+(s.modoVCV?' selected':'')+'>VCV (Volume Controlado)</option><option value="PCV"'+(!s.modoVCV?' selected':'')+'>PCV (Pressão Controlada)</option></select></div>';
      h+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(85px,1fr));gap:8px;margin-bottom:10px">';
      if(s.modoVCV){
        h+='<div class="icu-field"><label>P.Pico (cmH₂O)</label><input type="number" placeholder="28" value="'+s.pico+'" oninput="VMCalcs.set(\'pico\',this.value)" onblur="VMCalcs.render()"></div>';
      }
      h+='<div class="icu-field"><label>P.Plato (cmH₂O)</label><input type="number" placeholder="22" value="'+s.plato+'" oninput="VMCalcs.set(\'plato\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>PEEP (cmH₂O)</label><input type="number" placeholder="8" value="'+s.peep+'" oninput="VMCalcs.set(\'peep\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>Vt (mL)</label><input type="number" placeholder="450" value="'+s.vt+'" oninput="VMCalcs.set(\'vt\',this.value)" onblur="VMCalcs.render()"></div>';
      if(s.modoVCV)h+='<div class="icu-field"><label>Fluxo (L/min)</label><input type="number" placeholder="60" value="'+s.fluxo+'" oninput="VMCalcs.set(\'fluxo\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(dp!=null&&!isNaN(dp)){
        var dpOk=dp<12;var dpCor=dpOk?'#4ade80':dp<=15?'#facc15':'#f87171';
        h+='<div style="padding:8px;border-radius:8px;border:1px solid '+dpCor+'30;background:'+dpCor+'08;font-size:11px;margin-bottom:6px"><b style="color:'+dpCor+'">ΔP = '+Number(dp).toFixed(1)+' cmH₂O</b> '+(dp<12?'(Ótimo)':dp<=15?'(Aceitável)':'(Elevado)')+'</div>';
        if(cest!=null&&!isNaN(cest))h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:11px;margin-bottom:6px"><b>Cest</b> = '+Number(cest).toFixed(1)+' mL/cmH₂O (complacência estática)</div>';
        if(cdyn!=null&&!isNaN(cdyn))h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:11px;margin-bottom:6px"><b>Cdyn</b> = '+Number(cdyn).toFixed(1)+' mL/cmH₂O (complacência dinâmica)</div>';
        if(raw!=null&&!isNaN(raw))h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:11px"><b>Raw</b> = '+Number(raw).toFixed(2)+' cmH₂O/(L/s) (resistência)</div>';
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearCompliance()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 2: Otimização PEEP / Stress Index ----
    var open2=s.openCard==='peep';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(96,165,250,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'peep\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(96,165,250,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open2?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#60a5fa">Otimização de PEEP e Stress Index</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(3 níveis: ΔP e SI)</span></button>';
    if(open2){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(96,165,250,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:8px">Insira 3 níveis de PEEP / Plato / SI (curva P×tempo em VCV). ΔP &lt; 12 ideal; SI 0,9–1,1 ideal.</div>';
      h+='<div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px">';
      for(var ni=0;ni<3;ni++){
        var nv=s.peepOpt[ni]||{peep:'',plato:'',si:''};
        h+='<div style="flex:1;min-width:100px;padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
        h+='<div style="font-size:9px;font-weight:700;color:var(--w50);margin-bottom:6px">Nível '+(ni+1)+'</div>';
        h+='<div style="display:flex;flex-direction:column;gap:4px">';
        h+='<div><span style="font-size:8px;color:var(--w40)">PEEP</span><input type="number" placeholder="5" value="'+(nv.peep||'')+'" oninput="VMCalcs.setPeepOpt('+ni+',\'peep\',this.value)" onblur="VMCalcs.render()" style="padding:4px;font-size:10px;width:100%;box-sizing:border-box"></div>';
        h+='<div><span style="font-size:8px;color:var(--w40)">Plato</span><input type="number" placeholder="22" value="'+(nv.plato||'')+'" oninput="VMCalcs.setPeepOpt('+ni+',\'plato\',this.value)" onblur="VMCalcs.render()" style="padding:4px;font-size:10px;width:100%;box-sizing:border-box"></div>';
        h+='<div><span style="font-size:8px;color:var(--w40)">SI</span><input type="text" placeholder="=1, &lt;1, &gt;1" value="'+(nv.si||'')+'" oninput="VMCalcs.setPeepOpt('+ni+',\'si\',this.value)" onblur="VMCalcs.render()" style="padding:4px;font-size:10px;width:100%;box-sizing:border-box"></div>';
        h+='</div></div>';
      }
      h+='</div>';
      h+='<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="icu-small-btn" onclick="VMCalcs.calcPeepOpt()">Calcular PEEP Ideal</button><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearPeepOpt()">Limpar</button></div>';
      if(s.peepOptResult)h+='<div style="margin-top:10px;padding:10px;border-radius:8px;border:1px solid #4ade8030;background:#4ade8008;font-size:10px;color:var(--w50);line-height:1.6">'+s.peepOptResult+'</div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 3: Recrutabilidade (volumes + loop P-V) ----
    var open3=s.openCard==='recrut';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(34,211,238,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'recrut\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(34,211,238,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open3?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#22d3ee">Recrutabilidade Pulmonar</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(volumes e loop P-V)</span></button>';
    if(open3){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(34,211,238,.15)">';
      h+='<div style="font-size:10px;font-weight:700;color:#22d3ee;margin-bottom:6px">Por diferença de volume (manobra de recrutamento)</div>';
      h+='<div style="font-size:8px;color:var(--w30);margin-bottom:6px">Vol.Insp − Vol.Exp &gt; 500 mL = recrutável. Passo 20 cmH₂O na manobra.</div>';
      h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">';
      h+='<div class="icu-field"><label>Vol. Insp. (mL)</label><input type="number" placeholder="1200" value="'+s.recVolInsp+'" oninput="VMCalcs.set(\'recVolInsp\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>Vol. Exp. (mL)</label><input type="number" placeholder="600" value="'+s.recVolExp+'" oninput="VMCalcs.set(\'recVolExp\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      var recDiff=parseFloat(s.recVolInsp)-parseFloat(s.recVolExp);
      if(s.recVolInsp&&s.recVolExp&&!isNaN(recDiff)){
        var recOk=recDiff>500;
        h+='<div style="padding:10px;border-radius:8px;border:1px solid '+(recOk?'#4ade8030':'#f8717130')+';background:'+(recOk?'#4ade8008':'#f8717108')+';font-size:11px;font-weight:700;color:'+(recOk?'#4ade80':'#f87171')+';margin-bottom:12px">Diferença: '+recDiff+' mL - '+(recOk?'✅ Recrutável':'❌ Pouco recrutável')+'</div>';
      }
      h+='<div style="font-size:10px;font-weight:700;color:#22d3ee;margin-bottom:6px">Por loop Pressão-Volume (P-V)</div>';
      h+='<div style="font-size:8px;color:var(--w30);margin-bottom:6px">LIP = ponto de inflexão inferior; UIP = ponto de inflexão superior. Complacência da fase linear = ΔV/ΔP entre LIP e UIP. PEEP ótima ≈ LIP + 2 cmH₂O.</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>LIP (cmH₂O)</label><input type="number" placeholder="10" value="'+s.lip+'" oninput="VMCalcs.set(\'lip\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>UIP (cmH₂O)</label><input type="number" placeholder="28" value="'+s.uip+'" oninput="VMCalcs.set(\'uip\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>Vol. em LIP (mL)</label><input type="number" placeholder="200" value="'+s.volLip+'" oninput="VMCalcs.set(\'volLip\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>Vol. em UIP (mL)</label><input type="number" placeholder="800" value="'+s.volUip+'" oninput="VMCalcs.set(\'volUip\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(complPV!=null&&!isNaN(complPV))h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:11px;margin-bottom:6px"><b>Complacência (slope P-V)</b> = '+Number(complPV).toFixed(1)+' mL/cmH₂O</div>';
      if(s.lip&&!isNaN(parseFloat(s.lip)))h+='<div style="font-size:9px;color:var(--w40)">PEEP sugerida (LIP+2) ≈ '+(parseFloat(s.lip)+2)+' cmH₂O</div>';
      h+='<button type="button" class="icu-small-btn" style="margin-top:8px;background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearRecrut()">Limpar</button>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 4: RSBI (especificado) ----
    var open4=s.openCard==='rsbi';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(74,222,128,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'rsbi\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(74,222,128,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open4?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#4ade80">RSBI - Índice de Respiração Rápida Superficial</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(Desmame)</span></button>';
    if(open4){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(74,222,128,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px;line-height:1.5"><b>Fórmula:</b> RSBI = FR / VC(L). <b>Yang & Tobin (1991)</b> - preditor de resultado do desmame. <b>Critérios:</b> &lt; 80 favorável ao desmame; 80–105 zona cinzenta (avaliar outros parâmetros); &gt; 105 alto risco de falha (recomenda-se manter VM ou revisar causa). VC = volume corrente em litros (ex.: 350 mL = 0,35 L).</div>';
      h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>FR (rpm)</label><input type="number" placeholder="25" value="'+s.rsbiFr+'" oninput="VMCalcs.set(\'rsbiFr\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>VC (mL)</label><input type="number" placeholder="350" value="'+s.rsbiVc+'" oninput="VMCalcs.set(\'rsbiVc\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(rsbi!=null&&!isNaN(rsbi)&&rInterp){
        h+='<div style="padding:10px;border-radius:8px;border:1px solid '+(rInterp.c||'#60a5fa')+'30;background:'+(rInterp.c||'#60a5fa')+'08;font-size:11px;margin-bottom:8px"><b style="color:'+(rInterp.c||'#60a5fa')+'">RSBI = '+Number(rsbi).toFixed(0)+'</b> - '+(rInterp.t||'')+'</div>';
        h+='<div style="font-size:8px;color:var(--w30);line-height:1.5"><b>Referência:</b> Yang KL, Tobin MJ. A prospective study of indexes predicting the outcome of trials of weaning from mechanical ventilation. N Engl J Med. 1991;324(21):1445-1450.</div>';
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearRSBI()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 5: Updated HACOR (VNI) ----
    var open5=s.openCard==='hacor';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(236,72,153,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'hacor\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(236,72,153,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open5?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#ec4899">(Updated HACOR) - risco de falha da VNI</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(1–2 h de tratamento)</span></button>';
    if(open5){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(236,72,153,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px;line-height:1.6">(Updated HACOR Score), que agora estratifica o risco de falha da Ventilação Não Invasiva (VNI) em quatro níveis distintos, baseando-se na pontuação obtida após 1 a 2 horas de tratamento. Diferente do escore original, a nova versão incorpora variáveis extras como o escore SOFA (gravidade sistêmica) e o diagnóstico específico do paciente (como pneumonia ou insuficiência cardíaca).</div>';

      h+='<div style="padding:10px;border-radius:10px;border:1px solid var(--gb);background:var(--w03);margin-bottom:10px">';
      h+='<div style="font-size:10px;font-weight:700;color:var(--silver-l);margin-bottom:6px">Categorias de Risco (Updated HACOR)</div>';
      h+='<div style="font-size:9px;color:var(--w40);line-height:1.55">';
      h+='≤ 7,0 - <b>Baixo</b> - Cerca de 12,4%<br>';
      h+='7,5 – 10,5 - <b>Moderado</b> - Cerca de 38,2%<br>';
      h+='11,0 – 14,0 - <b>Alto</b> - Cerca de 67,1%<br>';
      h+='&gt; 14,0 - <b>Muito Alto (Super Alto)</b> - Superior a 83,7%';
      h+='</div></div>';

      h+='<div style="font-size:10px;font-weight:700;color:#ec4899;margin-bottom:6px">O que mudou na avaliação?</div>';
      h+='<div style="font-size:9px;color:var(--w40);line-height:1.6;margin-bottom:10px">Além do escore básico (FC, pH, consciência, oxigenação, FR abaixo), somam-se: <b>Diagnóstico</b> - pneumonia (+2,5), choque séptico (+2,5), ARDS (+3,0), edema cardiogênico (-4,0). <b>SOFA:</b> +0,5 por ponto.</div>';
      h+='<div style="font-size:10px;font-weight:700;color:#ec4899;margin-bottom:6px">Escore HACOR (marque uma opção por linha)</div>';
      h+='<div style="font-size:9px;color:var(--w40);line-height:1.5;margin-bottom:10px">Selecione a faixa que corresponde ao paciente. O score básico é calculado automaticamente.</div>';

      function rad(name,val,label){return '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:10px;color:var(--w60)"><input type="radio" name="'+name+'" value="'+val+'"'+(s[name]===val?' checked':'')+' onchange="VMCalcs.set(\''+name+'\',\''+val+'\');VMCalcs.render()"><span>'+label+'</span></label>';}
      h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;margin-bottom:12px">';
      h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)"><div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:6px">Frequência cardíaca (bpm)</div>'+rad('hacorFC','leq120','≤120 → 0')+rad('hacorFC','ge121','≥121 → +1')+'</div>';
      h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)"><div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:6px">Acidose (pH)</div>'+rad('hacorPH','ge735','≥7,35 → 0')+rad('hacorPH','730_734','7,30–7,34 → +2')+rad('hacorPH','725_729','7,25–7,29 → +3')+rad('hacorPH','lt725','&lt;7,25 → +4')+'</div>';
      h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)"><div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:6px">Consciência (GCS)</div>'+rad('hacorGCS','15','15 → 0')+rad('hacorGCS','13_14','13–14 → +2')+rad('hacorGCS','11_12','11–12 → +5')+rad('hacorGCS','le10','≤10 → +10')+'</div>';
      h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)"><div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:6px">Oxigenação (PaO₂/FiO₂ mmHg)</div>'+rad('hacorOxig','ge201','≥201 → 0')+rad('hacorOxig','176_200','176–200 → +2')+rad('hacorOxig','151_175','151–175 → +3')+rad('hacorOxig','126_150','126–150 → +4')+rad('hacorOxig','101_125','101–125 → +5')+rad('hacorOxig','le100','≤100 → +6')+'</div>';
      h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)"><div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:6px">Frequência respiratória (rpm)</div>'+rad('hacorFR','le30','≤30 → 0')+rad('hacorFR','31_35','31–35 → +1')+rad('hacorFR','36_40','36–40 → +2')+rad('hacorFR','41_45','41–45 → +3')+rad('hacorFR','ge46','≥46 → +4')+'</div>';
      h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03)">';
      h+='<div style="font-size:9px;font-weight:700;color:var(--silver-l);margin-bottom:6px">Diagnóstico (pontos extras)</div><select onchange="VMCalcs.set(\'hacorDx\',this.value);VMCalcs.render()" style="width:100%;padding:4px;font-size:10px">';
      h+='<option value=""'+(!s.hacorDx?' selected':'')+'>--</option>';
      h+='<option value="pneumonia"'+(s.hacorDx==='pneumonia'?' selected':'')+'>Pneumonia (+2,5)</option>';
      h+='<option value="choque_septico"'+(s.hacorDx==='choque_septico'?' selected':'')+'>Choque séptico (+2,5)</option>';
      h+='<option value="ards"'+(s.hacorDx==='ards'?' selected':'')+'>ARDS (+3,0)</option>';
      h+='<option value="edema_cardiogenico"'+(s.hacorDx==='edema_cardiogenico'?' selected':'')+'>Edema cardiogênico (-4,0)</option>';
      h+='</select></div></div>';

      h+='<div style="font-size:10px;font-weight:700;color:#ec4899;margin:12px 0 6px">SOFA (calculado automaticamente - 6 órgãos, 0–4 pts cada)</div>';
      h+='<div style="font-size:8px;color:var(--w40);margin-bottom:8px">Marque a faixa de cada sistema. Total SOFA 0–24; no HACOR atualizado soma-se +0,5 por ponto SOFA.</div>';
      function radSofa(key,val,lab){return '<label style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;font-size:9px;color:var(--w50);margin-right:8px"><input type="radio" name="sofa_'+key+'" value="'+val+'"'+(s[key]===val||s[key]===String(val)?' checked':'')+' onchange="VMCalcs.set(\''+key+'\',\''+val+'\');VMCalcs.render()"><span>'+lab+'</span></label>';}
      var sofaRows=[
        {key:'sofaResp',titulo:'Respiratório (PaO₂/FiO₂ mmHg)',opts:[['0','≥400'],['1','<400'],['2','<300'],['3','<200 c/ suporte'],['4','<100 c/ suporte']]},
        {key:'sofaCNS',titulo:'Neurológico (GCS)',opts:[['0','15'],['1','13-14'],['2','10-12'],['3','6-9'],['4','<6']]},
        {key:'sofaCardio',titulo:'Cardiovascular (MAP/vasopressores)',opts:[['0','MAP≥70'],['1','MAP<70'],['2','dopa≤5 ou dobu'],['3','dopa>5 ou noradr≤0,1'],['4','dopa>15 ou noradr>0,1']]},
        {key:'sofaCoag',titulo:'Coagulação (plaquetas ×10³/μL)',opts:[['0','≥150'],['1','<150'],['2','<100'],['3','<50'],['4','<20']]},
        {key:'sofaLiver',titulo:'Hepático (bilirrubina mg/dL)',opts:[['0','<1,2'],['1','1,2-1,9'],['2','2-5,9'],['3','6-11,9'],['4','>12']]},
        {key:'sofaRenal',titulo:'Renal (creat. mg/dL ou diurese)',opts:[['0','<1,2'],['1','1,2-1,9'],['2','2-3,4'],['3','3,5-4,9 ou <500mL/d'],['4','>5 ou <200mL/d']]}
      ];
      h+='<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px">';
      for(var sr=0;sr<sofaRows.length;sr++){
        var row=sofaRows[sr];
        h+='<div style="padding:6px 8px;border-radius:6px;border:1px solid var(--gb);background:var(--w02)">';
        h+='<div style="font-size:8px;font-weight:700;color:var(--w50);margin-bottom:4px">'+row.titulo+'</div>';
        for(var o=0;o<row.opts.length;o++)h+=radSofa(row.key,row.opts[o][0],row.opts[o][1]);
        h+='</div>';
      }
      h+='</div>';
      h+='<div style="padding:6px 8px;border-radius:6px;border:1px solid rgba(236,72,153,.25);background:rgba(236,72,153,.06);font-size:10px"><b style="color:#ec4899">SOFA total = '+sofaTotal+'</b> (0–24). No Updated HACOR: +'+(0.5*sofaTotal).toFixed(1)+' pts.</div>';

      if(hacorBaseScore!=null){h+='<div style="padding:8px;border-radius:8px;border:1px solid rgba(236,72,153,.3);background:rgba(236,72,153,.08);font-size:11px;margin-bottom:8px"><b style="color:#ec4899">HACOR básico (soma dos 5 itens) = '+hacorBaseScore+'</b></div>';}

      if(hacor!=null&&!isNaN(hacor)){
        var lvl='',prob='',cor='#60a5fa';
        if(hacor<=7.0){lvl='Baixo';prob='~12,4%';cor='#4ade80';}
        else if(hacor<7.5){lvl='Entre faixas (7,0–7,5)';prob='';cor='#facc15';}
        else if(hacor<=10.5){lvl='Moderado';prob='~38,2%';cor='#facc15';}
        else if(hacor<11.0){lvl='Entre faixas (10,5–11,0)';prob='';cor='#fb923c';}
        else if(hacor<=14.0){lvl='Alto';prob='~67,1%';cor='#fb923c';}
        else{lvl='Muito Alto (Super Alto)';prob='>83,7%';cor='#f87171';}
        h+='<div style="padding:10px;border-radius:8px;border:1px solid '+cor+'30;background:'+cor+'08;font-size:11px;margin-bottom:10px"><b style="color:'+cor+'">Updated HACOR = '+Number(hacor).toFixed(1)+'</b> - '+lvl+(prob?(' - '+prob):'')+'</div>';
      }

      h+='<div style="font-size:9px;color:var(--w40);line-height:1.6;margin-bottom:10px"><b>Conclusão Clínica:</b> Se o paciente antes tinha um HACOR de 7 (limite) e agora foi reclassificado nessas novas faixas, um valor acima de 11 pontos na escala atualizada é um indicativo muito forte de que a VNI não terá sucesso e a intubação pode ser necessária em breve.</div>';
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearHACOR()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 6: Índice ROX ----
    var open6=s.openCard==='rox';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(168,85,247,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'rox\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(168,85,247,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open6?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#a855f7">Índice ROX</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(CNAF - risco de intubação)</span></button>';
    if(open6){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(168,85,247,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px;line-height:1.5"><b>Fórmula:</b> ROX = (SpO₂/FiO₂)×100 / FR. Índice ROX ≥ 4,88 (2, 6 ou 12 h após início da CNAF) associa-se a menor risco de intubação. ROX &lt; 3,85 = alto risco de falha de CNAF. Entre 3,85 e &lt; 4,88: repetir em 1–2 h.</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>SpO₂ (%)</label><input type="number" placeholder="95" value="'+s.roxSpO2+'" oninput="VMCalcs.set(\'roxSpO2\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>FiO₂ (%)</label><input type="number" placeholder="50" value="'+s.roxFio2+'" oninput="VMCalcs.set(\'roxFio2\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>FR (rpm)</label><input type="number" placeholder="24" value="'+s.roxFr+'" oninput="VMCalcs.set(\'roxFr\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(rox!=null&&!isNaN(rox)){
        var roxOk=rox>=4.88;var roxRisk=rox<3.85;var roxCor=roxOk?'#4ade80':roxRisk?'#f87171':'#facc15';
        h+='<div style="padding:10px;border-radius:8px;border:1px solid '+roxCor+'30;background:'+roxCor+'08;font-size:11px;margin-bottom:6px"><b style="color:'+roxCor+'">ROX = '+Number(rox).toFixed(2)+'</b></div>';
        h+='<div style="font-size:10px;color:var(--w50);line-height:1.5">'+(rox>=4.88?'✅ Menor risco de intubação (≥ 4,88).':rox<3.85?'❌ Alto risco de falha de CNAF (&lt; 3,85).':'⚠️ Zona intermediária (3,85 a &lt; 4,88). Repetir em 1–2 h.')+'</div>';
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearROX()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 7: Índice de Assincronia (%) ----
    var open7=s.openCard==='assincronia';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(251,146,60,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'assincronia\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(251,146,60,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open7?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#fb923c">Índice de Assincronia (%)</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(eventos assincrônicos / ciclos totais)</span></button>';
    if(open7){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(251,146,60,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px;line-height:1.5"><b>Fórmula:</b> IA = (número de eventos assincrônicos / total de ciclos) × 100. Ciclos = disparados ou não. <b>IA &gt; 10%</b> considerado grave.</div>';
      h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>Eventos assincrônicos</label><input type="number" placeholder="5" value="'+s.iaEventos+'" oninput="VMCalcs.set(\'iaEventos\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>Total de ciclos</label><input type="number" placeholder="50" value="'+s.iaTotal+'" oninput="VMCalcs.set(\'iaTotal\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(ia!=null&&!isNaN(ia)){
        var iaGrave=ia>10;var iaCor=iaGrave?'#f87171':'#4ade80';
        h+='<div style="padding:10px;border-radius:8px;border:1px solid '+iaCor+'30;background:'+iaCor+'08;font-size:11px;margin-bottom:6px"><b style="color:'+iaCor+'">IA = '+Number(ia).toFixed(1)+'%</b></div>';
        h+='<div style="font-size:10px;color:var(--w50)">'+(ia>10?'❌ Grave (&gt; 10%).':'✅ Abaixo de 10%.')+'</div>';
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearAssincronia()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 8: Mechanical Power (J/min) ----
    var open8=s.openCard==='mpower';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(34,211,238,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'mpower\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(34,211,238,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open8?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#22d3ee">Mechanical Power (J/min)</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(energia transferida ao pulmão)</span></button>';
    if(open8){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(34,211,238,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px;line-height:1.5"><b>Fórmula:</b> MP = 0,098 × (VC/1000) × ΔP × f. Energia transferida pelo ventilador. &lt; 12 normal; 13–17 injúria; 18–22 SDRA leve; 23–24 moderada; 25–27 severa; &gt; 27 indicação ECMO.</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>VC (mL)</label><input type="number" placeholder="450" value="'+s.mpVc+'" oninput="VMCalcs.set(\'mpVc\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>ΔP (cmH₂O)</label><input type="number" placeholder="12" value="'+s.mpDp+'" oninput="VMCalcs.set(\'mpDp\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>f (FR rpm)</label><input type="number" placeholder="20" value="'+s.mpF+'" oninput="VMCalcs.set(\'mpF\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(mp!=null&&!isNaN(mp)){
        var mpTxt='';var mpCor='#60a5fa';
        if(mp<12){mpTxt='Normal';mpCor='#4ade80';}else if(mp<=17){mpTxt='Injúria pulmonar';mpCor='#facc15';}else if(mp<=22){mpTxt='SDRA leve';mpCor='#fb923c';}else if(mp<=24){mpTxt='SDRA moderada';mpCor='#f87171';}else if(mp<=27){mpTxt='SDRA severa';mpCor='#f87171';}else{mpTxt='Indicação de ECMO';mpCor='#dc2626';}
        h+='<div style="padding:10px;border-radius:8px;border:1px solid '+mpCor+'30;background:'+mpCor+'08;font-size:11px;margin-bottom:6px"><b style="color:'+mpCor+'">MP = '+Number(mp).toFixed(1)+' J/min</b> - '+mpTxt+'</div>';
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearMPower()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 9: Volume corrente por peso (kg) — altura retirada do cálculo automático para VC ----
    var open9=s.openCard==='vcpeso';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(34,211,238,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'vcpeso\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(34,211,238,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open9?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#22d3ee">Volume corrente por peso</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(peso em kg — sem altura)</span></button>';
    if(open9){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(34,211,238,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px">Informe o peso (kg) do paciente. VC protetor 4–6 mL/kg; convencional 6–8 mL/kg. Altura não entra no cálculo.</div>';
      h+='<div style="display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>Peso (kg)</label><input type="number" placeholder="70" value="'+s.vcPeso+'" oninput="VMCalcs.set(\'vcPeso\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(pesoIdeal!=null&&pesoIdeal>0){
        var vc4_6=Math.round(pesoIdeal*4)+'-'+Math.round(pesoIdeal*6);
        var vc6_8=Math.round(pesoIdeal*6)+'-'+Math.round(pesoIdeal*8);
        h+='<div style="padding:10px;border-radius:8px;border:1px solid #22d3ee30;background:#22d3ee08;font-size:11px;margin-bottom:6px"><b style="color:#22d3ee">Peso</b> = '+Number(pesoIdeal).toFixed(1)+' kg</div>';
        h+='<div style="font-size:10px;color:var(--w50);line-height:1.5"><b>VC protetor (4–6 mL/kg):</b> '+vc4_6+' mL<br><b>VC convencional (6–8 mL/kg):</b> '+vc6_8+' mL</div>';
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearVcPeso()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 10: Escala de Glasgow ----
    var open10=s.openCard==='glasgow';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(96,165,250,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'glasgow\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(96,165,250,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open10?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#60a5fa">Escala de Glasgow (GCS)</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(O + V + M)</span></button>';
    if(open10){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(96,165,250,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px">Abertura ocular (O), resposta verbal (V), resposta motora (M). V = T se intubado.</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>O</label><select onchange="VMCalcs.set(\'glasgowO\',this.value);VMCalcs.render()"><option value="">--</option><option value="4"'+(s.glasgowO==='4'?' selected':'')+'>4</option><option value="3"'+(s.glasgowO==='3'?' selected':'')+'>3</option><option value="2"'+(s.glasgowO==='2'?' selected':'')+'>2</option><option value="1"'+(s.glasgowO==='1'?' selected':'')+'>1</option></select></div>';
      h+='<div class="icu-field"><label>V</label><select onchange="VMCalcs.set(\'glasgowV\',this.value);VMCalcs.render()"><option value="">--</option><option value="5"'+(s.glasgowV==='5'?' selected':'')+'>5</option><option value="4"'+(s.glasgowV==='4'?' selected':'')+'>4</option><option value="3"'+(s.glasgowV==='3'?' selected':'')+'>3</option><option value="2"'+(s.glasgowV==='2'?' selected':'')+'>2</option><option value="1"'+(s.glasgowV==='1'?' selected':'')+'>1</option><option value="T"'+(s.glasgowV==='T'?' selected':'')+'>T (intub.)</option></select></div>';
      h+='<div class="icu-field"><label>M</label><select onchange="VMCalcs.set(\'glasgowM\',this.value);VMCalcs.render()"><option value="">--</option><option value="6"'+(s.glasgowM==='6'?' selected':'')+'>6</option><option value="5"'+(s.glasgowM==='5'?' selected':'')+'>5</option><option value="4"'+(s.glasgowM==='4'?' selected':'')+'>4</option><option value="3"'+(s.glasgowM==='3'?' selected':'')+'>3</option><option value="2"'+(s.glasgowM==='2'?' selected':'')+'>2</option><option value="1"'+(s.glasgowM==='1'?' selected':'')+'>1</option></select></div>';
      h+='</div>';
      if(glasgowResult&&glasgowResult.total){h+='<div style="padding:10px;border-radius:8px;border:1px solid '+(glasgowResult.cor||'#60a5fa')+'30;background:'+(glasgowResult.cor||'#60a5fa')+'08;font-size:11px"><b style="color:'+(glasgowResult.cor||'#60a5fa')+'">GCS = '+glasgowResult.total+'</b> - '+glasgowResult.interp+'</div>';}
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearGlasgow()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 11: Gasometria arterial (P/F, S/F, análise) ----
    var open11=s.openCard==='gaso';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(74,222,128,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'gaso\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(74,222,128,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open11?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#4ade80">Gasometria arterial</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(P/F, S/F, análise ácido-base)</span></button>';
    if(open11){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(74,222,128,.15)">';
      h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>pH</label><input type="number" step="0.01" placeholder="7.40" value="'+s.gasoPH+'" oninput="VMCalcs.set(\'gasoPH\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>PaCO₂ (mmHg)</label><input type="number" placeholder="40" value="'+s.gasoPaCO2+'" oninput="VMCalcs.set(\'gasoPaCO2\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>HCO₃ (mEq/L)</label><input type="number" placeholder="24" value="'+s.gasoHCO3+'" oninput="VMCalcs.set(\'gasoHCO3\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>PaO₂ (mmHg)</label><input type="number" placeholder="85" value="'+s.gasoPaO2+'" oninput="VMCalcs.set(\'gasoPaO2\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>FiO₂ (gasometria) (%)</label><input type="number" placeholder="40" value="'+s.gasoFiO2+'" oninput="VMCalcs.set(\'gasoFiO2\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>SpO₂ (gasometria) (%)</label><input type="number" placeholder="96" value="'+s.gasoSpO2+'" oninput="VMCalcs.set(\'gasoSpO2\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>Sat monitor (%)</label><input type="number" placeholder="96" value="'+s.sfMonSpO2+'" oninput="VMCalcs.set(\'sfMonSpO2\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>FiO₂ VM (%)</label><input type="number" placeholder="40" value="'+s.sfVmFiO2+'" oninput="VMCalcs.set(\'sfVmFiO2\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>BE (mEq/L)</label><input type="number" placeholder="-1" value="'+s.gasoBE+'" oninput="VMCalcs.set(\'gasoBE\',this.value)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(gasoAnalise){h+='<div style="padding:8px;border-radius:8px;border:1px solid '+gasoAnalise.cor+'30;background:'+gasoAnalise.cor+'08;font-size:11px;margin-bottom:6px"><b style="color:'+gasoAnalise.cor+'">Análise:</b> '+gasoAnalise.full+'</div>';}
      if(pfVal!=null){h+='<div style="padding:8px;border-radius:8px;border:1px solid '+(pfInterp?pfInterp.c+'30':'var(--gb)')+';background:'+(pfInterp?pfInterp.c+'08':'var(--w03)')+';font-size:11px;margin-bottom:6px"><b>P/F</b> = '+Number(pfVal).toFixed(0)+(pfInterp?' - '+pfInterp.t:'')+'</div>';}
      if(sfVal!=null){h+='<div style="padding:8px;border-radius:8px;border:1px solid var(--gb);background:var(--w03);font-size:11px;margin-bottom:6px"><b>S/F</b> = '+Number(sfVal).toFixed(0)+' (Sat monitor/FiO₂ VM)</div>';}
      if(s.gasoBE!==''){var beVal=parseFloat(s.gasoBE);if(!isNaN(beVal)){var beTxt=beVal<-2?'Excesso ácido (BE < -2)':beVal>2?'Excesso base (BE > 2)':'Normal (-2 a +2)';var beCor=beVal>=-2&&beVal<=2?'#4ade80':'#facc15';h+='<div style="padding:8px;border-radius:8px;border:1px solid '+beCor+'30;background:'+beCor+'08;font-size:11px;margin-bottom:6px"><b>BE (Eh)</b> = '+beVal+' - '+beTxt+'</div>';}}
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearGaso()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 12: MRC (força muscular) ----
    var open12=s.openCard==='mrc';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(251,146,60,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'mrc\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(251,146,60,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open12?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#fb923c">MRC - Força muscular</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(0-5 por grupo, 12 grupos, total /60)</span></button>';
    if(open12){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(251,146,60,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px">Escala Medical Research Council. Selecione 0–5 para cada grupo (D=direita, E=esquerda). Total 12 itens = /60.</div>';
      var mrcGroups=[{l:'Abdução Ombro',d:'mrcOmbroD',e:'mrcOmbroE'},{l:'Flexão Cotovelo',d:'mrcCotoveloD',e:'mrcCotoveloE'},{l:'Extensão Punho',d:'mrcPunhoD',e:'mrcPunhoE'},{l:'Flexão Quadril',d:'mrcQuadrilD',e:'mrcQuadrilE'},{l:'Extensão Joelho',d:'mrcJoelhoD',e:'mrcJoelhoE'},{l:'Dorsiflexão Tornozelo',d:'mrcTornozeloD',e:'mrcTornozeloE'}];
      h+='<div style="display:grid;grid-template-columns:1fr auto auto;gap:6px 12px;align-items:center;font-size:9px;margin-bottom:8px">';
      h+='<div style="font-weight:700;color:var(--w50)">Grupo</div><div style="font-weight:700;color:var(--w50)">D</div><div style="font-weight:700;color:var(--w50)">E</div>';
      mrcGroups.forEach(function(g){
        h+='<div style="color:var(--w60)">'+g.l+'</div>';
        h+='<select onchange="VMCalcs.set(\''+g.d+'\',this.value);VMCalcs.render()" style="padding:4px;font-size:10px"><option value="">-</option>';
        for(var mi=0;mi<=5;mi++)h+='<option value="'+mi+'"'+(s[g.d]===String(mi)?' selected':'')+'>'+mi+'</option>';
        h+='</select>';
        h+='<select onchange="VMCalcs.set(\''+g.e+'\',this.value);VMCalcs.render()" style="padding:4px;font-size:10px"><option value="">-</option>';
        for(var mj=0;mj<=5;mj++)h+='<option value="'+mj+'"'+(s[g.e]===String(mj)?' selected':'')+'>'+mj+'</option>';
        h+='</select>';
      });
      h+='</div>';
      if(mrcCount===12){
        var _mc=mrcInterp?mrcInterp.cor:"#888";
        var _mt=mrcInterp?mrcInterp.txt:"";
        h+='<div style="padding:10px;border-radius:8px;border:1px solid '+_mc+'30;background:'+_mc+'08;font-size:11px"><b style="color:'+_mc+'">MRC = '+mrcTotal+'/60</b>'+(_mt?' - '+_mt:'')+'</div>';
      }
      else{h+='<div style="font-size:9px;color:var(--w40)">Preencha os 12 grupos para ver o total.</div>';}
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearMRC()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 13: PERME ----
    var open13=s.openCard==='perme';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(168,85,247,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'perme\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(168,85,247,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open13?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#a855f7">PERME - Mobilidade</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(0-21)</span></button>';
    if(open13){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(168,85,247,.15)">';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:10px">Score PERME adaptado. Some os 7 itens (0-21).</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">';
      permeItems.forEach(function(it){
        var v=s[it.key];
        h+='<div class="icu-field"><label>'+it.label+'</label><select onchange="VMCalcs.set(\''+it.key+'\',this.value);VMCalcs.render()"><option value="">-</option>';
        it.opts.forEach(function(o,oi){h+='<option value="'+it.vals[oi]+'"'+(v===''+it.vals[oi]?' selected':'')+'>'+o+'</option>';});
        h+='</select></div>';
      });
      h+='</div>';
      if(permeOk){
        var pc=permeInterp?permeInterp.cor:'#a855f7';
        h+='<div style="margin-top:10px;padding:10px;border-radius:8px;border:1px solid '+pc+'30;background:'+pc+'08;font-size:11px"><b style="color:'+pc+'">PERME = '+permeTotal+'/21</b>'+(permeInterp?' - '+permeInterp.txt:'')+'</div>';
      }else{
        h+='<div style="margin-top:10px;font-size:9px;color:var(--w40)">Preencha todos os itens para ver o total.</div>';
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearPerme()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 14: IMS ----
    var open14=s.openCard==='ims';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(74,222,128,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'ims\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(74,222,128,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open14?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#4ade80">IMS - ICU Mobility Scale</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(0-10)</span></button>';
    if(open14){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(74,222,128,.15)">';
      h+='<div class="icu-field"><label>IMS</label><select onchange="VMCalcs.set(\'imsScore\',this.value);VMCalcs.render()"><option value="">-</option>';
      imsOpts.forEach(function(o){h+='<option value="'+o.val+'"'+(imsVal===''+o.val?' selected':'')+'>'+o.val+' - '+o.txt+'</option>';});
      h+='</select></div>';
      if(imsInterp){
        h+='<div style="margin-top:10px;padding:10px;border-radius:8px;border:1px solid '+imsInterp.cor+'30;background:'+imsInterp.cor+'08;font-size:11px"><b style="color:'+imsInterp.cor+'">IMS = '+imsN+'/10</b> - '+imsInterp.txt+'</div>';
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearIMS()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 15: P0.1 / Pocc / Pmusc ----
    var open15=s.openCard==='drive';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(96,165,250,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'drive\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(96,165,250,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open15?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#60a5fa">P0.1, Pocc e Pmusc</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(drive e esforco)</span></button>';
    if(open15){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(96,165,250,.15)">';
      h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:10px">';
      h+='<div class="icu-field"><label>P0.1 (cmH2O)</label><input type="number" step="0.1" placeholder="2.0" value="'+s.p01+'" data-vm-key="p01" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>Pocc (cmH2O)</label><input type="number" step="0.1" placeholder="8" value="'+s.pocc+'" data-vm-key="pocc" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(p01Interp){h+='<div style="padding:8px;border-radius:8px;border:1px solid '+p01Interp.c+'30;background:'+p01Interp.c+'08;font-size:11px;margin-bottom:6px"><b>P0.1</b> - '+p01Interp.t+'</div>';}
      if(poccInterp){h+='<div style="padding:8px;border-radius:8px;border:1px solid '+poccInterp.c+'30;background:'+poccInterp.c+'08;font-size:11px;margin-bottom:6px"><b>Pocc</b> - '+poccInterp.t+'</div>';}
      if(pmuscVal!=null&&!isNaN(pmuscVal)){var pmc=pmuscInterp?pmuscInterp.c:'#60a5fa';h+='<div style="padding:8px;border-radius:8px;border:1px solid '+pmc+'30;background:'+pmc+'08;font-size:11px"><b>Pmusc</b> = '+pmuscVal.toFixed(1)+' - '+(pmuscInterp?pmuscInterp.t:'')+'</div>';}
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearDrive()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    // ---- Card 16: Eficiência ventilatoria / Desmame ----
    var open16=s.openCard==='wean';
    h+='<div class="vm-calc-card glass2" style="border-radius:12px;border:1px solid rgba(251,146,60,.25);overflow:hidden">';
    h+='<button type="button" onclick="VMCalcs.toggle(\'wean\')" style="width:100%;text-align:left;padding:12px 14px;display:flex;align-items:center;gap:8px;background:rgba(251,146,60,.06);border:none;color:var(--silver-l);cursor:pointer;font-size:12px;font-weight:700">';
    h+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;transition:transform .2s;transform:rotate('+(open16?'90':'0')+'deg)"><path d="M9 18l6-6-6-6"/></svg>';
    h+='<span style="color:#fb923c">Eficiência / Desmame</span><span style="font-size:9px;color:var(--w40);font-weight:400;margin-left:4px">(VD/VT, VR, Gap CO2, PImax/PEmax/CV)</span></button>';
    if(open16){
      h+='<div style="padding:12px 14px;border-top:1px solid rgba(251,146,60,.15)">';
      h+='<div style="font-size:10px;font-weight:700;color:var(--w50);margin-bottom:6px">Fração de Espaço Morto (VD/VT)</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:8px">';
      h+='<div class="icu-field"><label>PaCO2 (mmHg)</label><input type="number" placeholder="40" value="'+s.vdvtPaCO2+'" data-vm-key="vdvtPaCO2" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>PetCO2 (mmHg)</label><input type="number" placeholder="35" value="'+s.vdvtPetCO2+'" data-vm-key="vdvtPetCO2" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(vdvtVal!=null){var vdc=vdvtVal<=0.4?'#4ade80':vdvtVal<=0.6?'#facc15':'#f87171';h+='<div style="padding:8px;border-radius:8px;border:1px solid '+vdc+'30;background:'+vdc+'08;font-size:11px;margin-bottom:10px"><b>VD/VT</b> = '+vdvtVal.toFixed(2)+' (normal 0.25-0.40; >0.60 grave)</div>';}

      h+='<div style="font-size:10px;font-weight:700;color:var(--w50);margin-bottom:6px">Ventilatory Ratio (VR)</div>';
      h+='<div style="font-size:9px;color:var(--w40);margin-bottom:6px">Usa o <b>peso (kg)</b> do card Volume por peso acima.</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:8px">';
      h+='<div class="icu-field"><label>VE atual (L/min)</label><input type="number" step="0.1" placeholder="8" value="'+s.vrVe+'" data-vm-key="vrVe" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>PaCO2 atual (mmHg)</label><input type="number" placeholder="40" value="'+s.vrPaCO2+'" data-vm-key="vrPaCO2" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(vrVal!=null){var vrc=vrVal<=1.2?'#4ade80':vrVal<=2.0?'#facc15':'#f87171';h+='<div style="padding:8px;border-radius:8px;border:1px solid '+vrc+'30;background:'+vrc+'08;font-size:11px;margin-bottom:10px"><b>VR</b> = '+vrVal.toFixed(2)+' (1 = troca CO2 ideal; >1 = ineficiente)</div>';}

      h+='<div style="font-size:10px;font-weight:700;color:var(--w50);margin-bottom:6px">Gap de CO2 (Pa - EtCO2)</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:8px">';
      h+='<div class="icu-field"><label>PaCO2 (mmHg)</label><input type="number" placeholder="40" value="'+s.gapPaCO2+'" data-vm-key="gapPaCO2" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>EtCO2 (mmHg)</label><input type="number" placeholder="37" value="'+s.gapEtCO2+'" data-vm-key="gapEtCO2" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(gapVal!=null){var gc=gapVal<=5?'#4ade80':gapVal<=10?'#facc15':'#f87171';h+='<div style="padding:8px;border-radius:8px;border:1px solid '+gc+'30;background:'+gc+'08;font-size:11px;margin-bottom:10px"><b>Gap</b> = '+gapVal.toFixed(0)+' mmHg (fisiologico 2-5; >5 alto; >10 grave)</div>';}

      h+='<div style="font-size:10px;font-weight:700;color:var(--w50);margin-bottom:6px">Desmame (PImax, PEmax, CV)</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">';
      h+='<div class="icu-field"><label>PImax (cmH2O)</label><input type="number" placeholder="30" value="'+s.weanPiMax+'" data-vm-key="weanPiMax" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>PEmax (cmH2O)</label><input type="number" placeholder="40" value="'+s.weanPeMax+'" data-vm-key="weanPeMax" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='<div class="icu-field"><label>CV (mL/kg)</label><input type="number" step="0.1" placeholder="12" value="'+s.weanCvMlKg+'" data-vm-key="weanCvMlKg" oninput="VMCalcs.setFromInput(this)" onblur="VMCalcs.render()"></div>';
      h+='</div>';
      if(piMax!=null||peMax!=null||cvMlKg!=null){
        var ok=0,tot=0;
        if(piMax!=null&&!isNaN(piMax)){tot++;if(piMax>=30)ok++;}
        if(peMax!=null&&!isNaN(peMax)){tot++;if(peMax>=40)ok++;}
        if(cvMlKg!=null&&!isNaN(cvMlKg)){tot++;if(cvMlKg>=10)ok++;}
        if(tot>0){
          var wc=(ok===tot)?'#4ade80':(ok>=tot-1)?'#facc15':'#f87171';
          h+='<div style="padding:8px;border-radius:8px;border:1px solid '+wc+'30;background:'+wc+'08;font-size:11px"><b>Desmame:</b> '+ok+'/'+tot+' criterios basicos (PImax>=30, PEmax>=40, CV>=10 mL/kg)</div>';
        }
      }
      h+='<div style="margin-top:8px"><button type="button" class="icu-small-btn" style="background:#f8717120;color:#f87171;border:1px solid #f8717130" onclick="VMCalcs.clearWean()">Limpar</button></div>';
      h+='</div>';
    }
    h+='</div>';

    h+='</div>';
    el.innerHTML=h;
    } catch(e){ console.error('VMCalcs.render:',e); el.innerHTML='<div class="vm-calcs-column" style="padding:20px;color:var(--silver-l)"><p style="color:#f87171">Erro ao carregar as calculadoras.</p><button type="button" class="icu-small-btn" onclick="VMCalcs.render()">Tentar novamente</button></div>'; }
  }
  window.VMCalcs={
    set:function(k,v){state[k]=v;render();},
    setFromInput:function(el){var k=el.getAttribute('data-vm-key');if(k)state[k]=el.value;render();},
    toggle:function(id){toggleCard(id);},
    setPeepOpt:function(idx,field,val){
      if(!state.peepOpt[idx])state.peepOpt[idx]={peep:'',plato:'',si:''};
      state.peepOpt[idx][field]=val;
    },
    calcPeepOpt:function(){
      var results=calcPeepBest();
      if(!results||results.length===0){state.peepOptResult='Preencha pelo menos 1 nível completo (PEEP + Plato).';render();return;}
      var best=results[0];
      var txt='<b style="color:#4ade80">🎯 PEEP IDEAL: '+best.peep+' cmH₂O</b> (Nível '+(best.idx+1)+')<br>';
      txt+='ΔP: '+best.dp.toFixed(1)+' cmH₂O ('+best.dpClass+')';
      if(best.siTxt!=='-')txt+=' | SI: '+best.siTxt;
      txt+='<br><br>';
      results.forEach(function(r){
        var cor=r===best?'#4ade80':r.dpClass==='Elevado'?'#f87171':'#facc15';
        txt+='<span style="color:'+cor+'">Nível '+(r.idx+1)+': PEEP '+r.peep+' → ΔP '+r.dp.toFixed(1)+' ('+r.dpClass+')';
        if(r.siTxt!=='-')txt+=' | SI '+r.siTxt;
        txt+=(r===best?' ✓ RECOMENDADO':'')+'</span><br>';
      });
      state.peepOptResult=txt;
      render();
    },
    clearPeepOpt:function(){
      state.peepOpt=[{peep:'',plato:'',si:''},{peep:'',plato:'',si:''},{peep:'',plato:'',si:''}];
      state.peepOptResult='';
      render();
    },
    clearRecrut:function(){
      state.recVolInsp=state.recVolExp=state.lip=state.uip=state.volLip=state.volUip='';
      render();
    },
    clearCompliance:function(){
      state.pico=state.plato=state.peep=state.vt=state.fluxo='';
      render();
    },
    clearRSBI:function(){
      state.rsbiFr=state.rsbiVc='';
      render();
    },
    clearHACOR:function(){
      state.hacorFC=state.hacorPH=state.hacorGCS=state.hacorOxig=state.hacorFR=state.hacorDx='';
      state.sofaResp=state.sofaCNS=state.sofaCardio=state.sofaCoag=state.sofaLiver=state.sofaRenal='';
      render();
    },
    clearROX:function(){
      state.roxSpO2=state.roxFio2=state.roxFr='';
      render();
    },
    clearAssincronia:function(){
      state.iaEventos=state.iaTotal='';
      render();
    },
    clearMPower:function(){
      state.mpVc=state.mpDp=state.mpF='';
      render();
    },
    clearVcPeso:function(){
      state.vcPeso='';
      render();
    },
    clearGlasgow:function(){
      state.glasgowO=state.glasgowV=state.glasgowM='';
      render();
    },
    clearGaso:function(){
      state.gasoPH=state.gasoPaCO2=state.gasoHCO3=state.gasoPaO2=state.gasoFiO2=state.gasoSpO2=state.gasoBE='';
      state.sfMonSpO2=state.sfVmFiO2='';
      render();
    },
    clearMRC:function(){
      state.mrcOmbroD=state.mrcOmbroE=state.mrcCotoveloD=state.mrcCotoveloE=state.mrcPunhoD=state.mrcPunhoE=state.mrcQuadrilD=state.mrcQuadrilE=state.mrcJoelhoD=state.mrcJoelhoE=state.mrcTornozeloD=state.mrcTornozeloE='';
      render();
    },
    clearPerme:function(){
      state.permeEstado=state.permeBarreira=state.permeForcaMS=state.permeForcaMI=state.permeLeito=state.permeTransf=state.permeMarcha='';
      render();
    },
    clearIMS:function(){
      state.imsScore='';
      render();
    },
    clearDrive:function(){
      state.p01=state.pocc='';
      render();
    },
    clearWean:function(){
      state.vdvtPaCO2=state.vdvtPetCO2='';
      state.vrVe=state.vrPaCO2=state.vrAltura=state.vrSex='';
      state.gapPaCO2=state.gapEtCO2='';
      state.weanPiMax=state.weanPeMax=state.weanCvMlKg='';
      render();
    },
    render:render,
    init:function(){ render(); }
  };
})();
