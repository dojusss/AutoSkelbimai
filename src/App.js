import { useState, useMemo } from "react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#F5F6FA", surface:"#FFFFFF", surfaceAlt:"#F0F2F8", border:"#E2E6F0",
  text:"#111827", textSub:"#6B7280", textMuted:"#9CA3AF",
  accent:"#3B6FE8", accentLight:"#EEF2FF", accentDark:"#2952C4",
  featured:"#F59E0B", danger:"#EF4444", success:"#10B981", warning:"#F97316",
  shadow:"0 1px 4px rgba(0,0,0,0.07)", shadowMd:"0 4px 16px rgba(0,0,0,0.10)", shadowLg:"0 8px 32px rgba(0,0,0,0.14)",
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  {id:"cars",   label:"Automobiliai",        icon:"🚗"},
  {id:"moto",   label:"Motociklai",          icon:"🏍️"},
  {id:"trucks", label:"Sunkvežimiai",        icon:"🚛"},
  {id:"vans",   label:"Mikroautobusai",      icon:"🚐"},
  {id:"boats",  label:"Vandens transportas", icon:"⛵"},
  {id:"agri",   label:"Žemės ūkio technika", icon:"🚜"},
  {id:"parts",  label:"Atsarginės dalys",    icon:"🔧"},
  {id:"other",  label:"Kita technika",       icon:"⚙️"},
];

const CAT_FILTERS = {
  cars:[
    {key:"make",label:"Markė",type:"select",options:["Audi","BMW","Mercedes","Toyota","Volkswagen","Ford","Opel","Renault","Skoda","Volvo","Honda","Hyundai","Kia","Mazda","Nissan"]},
    {key:"body",label:"Kėbulo tipas",type:"select",options:["Sedanas","Universalas","Hečbekas","SUV","Kupė","Kabrioletas","Minivenas","Pikapas"]},
    {key:"fuel",label:"Kuras",type:"select",options:["Dyzelinas","Benzinas","Elektra","Hibridas","Dujos"]},
    {key:"transmission",label:"Pavarų dėžė",type:"select",options:["Automatinė","Mechaninė","Pusiau automatinė"]},
    {key:"drive",label:"Pavara",type:"select",options:["Priekinė","Galinė","4x4"]},
    {key:"color",label:"Spalva",type:"select",options:["Balta","Juoda","Pilka","Sidabrinė","Mėlyna","Raudona","Žalia","Ruda"]},
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"year",label:"Metai",type:"range",keyMin:"yearMin",keyMax:"yearMax"},
    {key:"mileage",label:"Rida (km)",type:"range",keyMin:"mileMin",keyMax:"mileMax"},
    {key:"city",label:"Miestas",type:"select",options:["Vilnius","Kaunas","Klaipėda","Šiauliai","Panevėžys","Alytus","Marijampolė"]},
  ],
  moto:[
    {key:"make",label:"Markė",type:"select",options:["Honda","Yamaha","Kawasaki","Suzuki","BMW","Ducati","Harley-Davidson","KTM","Triumph"]},
    {key:"body",label:"Tipas",type:"select",options:["Sportinis","Turizmas","Kruizeris","Enduro","Skuteris","Naked","Adventure","Chopper"]},
    {key:"fuel",label:"Kuras",type:"select",options:["Benzinas","Elektra"]},
    {key:"transmission",label:"Pavarų dėžė",type:"select",options:["Mechaninė","Automatinė"]},
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"year",label:"Metai",type:"range",keyMin:"yearMin",keyMax:"yearMax"},
    {key:"mileage",label:"Rida (km)",type:"range",keyMin:"mileMin",keyMax:"mileMax"},
    {key:"city",label:"Miestas",type:"select",options:["Vilnius","Kaunas","Klaipėda","Šiauliai","Panevėžys"]},
  ],
  trucks:[
    {key:"make",label:"Markė",type:"select",options:["Volvo","Scania","MAN","DAF","Mercedes","Iveco","Renault","Ford"]},
    {key:"body",label:"Kėbulo tipas",type:"select",options:["Tentinis","Cisternas","Savivarčius","Šaldytuvas","Platforma","Konteineris"]},
    {key:"fuel",label:"Kuras",type:"select",options:["Dyzelinas","Dujos","Elektra"]},
    {key:"transmission",label:"Pavarų dėžė",type:"select",options:["Automatinė","Mechaninė"]},
    {key:"euro",label:"Euro norma",type:"select",options:["Euro 3","Euro 4","Euro 5","Euro 6"]},
    {key:"axles",label:"Ašių skaičius",type:"select",options:["2","3","4","5+"]},
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"year",label:"Metai",type:"range",keyMin:"yearMin",keyMax:"yearMax"},
    {key:"mileage",label:"Rida (km)",type:"range",keyMin:"mileMin",keyMax:"mileMax"},
    {key:"city",label:"Miestas",type:"select",options:["Vilnius","Kaunas","Klaipėda","Šiauliai"]},
  ],
  vans:[
    {key:"make",label:"Markė",type:"select",options:["Mercedes Sprinter","Ford Transit","Volkswagen Crafter","Renault Master","Peugeot Boxer","Iveco Daily","Fiat Ducato"]},
    {key:"body",label:"Tipas",type:"select",options:["Keleivinis","Krovininis","Su skydeliu","Platforma","Šaldytuvas"]},
    {key:"fuel",label:"Kuras",type:"select",options:["Dyzelinas","Benzinas","Elektra"]},
    {key:"transmission",label:"Pavarų dėžė",type:"select",options:["Mechaninė","Automatinė"]},
    {key:"seats",label:"Sėdimų vietų",type:"select",options:["2-3","4-6","7-9","10-17","18+"]},
    {key:"payload",label:"Keliamoji galia",type:"select",options:["iki 500 kg","500-1000 kg","1000-2000 kg","2000+ kg"]},
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"year",label:"Metai",type:"range",keyMin:"yearMin",keyMax:"yearMax"},
    {key:"mileage",label:"Rida (km)",type:"range",keyMin:"mileMin",keyMax:"mileMax"},
    {key:"city",label:"Miestas",type:"select",options:["Vilnius","Kaunas","Klaipėda","Šiauliai"]},
  ],
  boats:[
    {key:"make",label:"Markė",type:"select",options:["Yamaha","Mercury","Bayliner","Zodiac","Quicksilver","Buster","Linder"]},
    {key:"body",label:"Tipas",type:"select",options:["Motorinė","Burinė","Guminė","Katamaranas","Jachta","Kateris","Žvejybinė"]},
    {key:"motorType",label:"Variklio tipas",type:"select",options:["Vidinis","Laivagalis","Elektrinis","Be variklio"]},
    {key:"material",label:"Medžiaga",type:"select",options:["Plienas","Aliuminis","Stiklo pluoštas","PVC","Mediena"]},
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"year",label:"Metai",type:"range",keyMin:"yearMin",keyMax:"yearMax"},
    {key:"city",label:"Miestas",type:"select",options:["Vilnius","Kaunas","Klaipėda","Neringa","Trakai"]},
  ],
  agri:[
    {key:"make",label:"Markė",type:"select",options:["John Deere","Case","New Holland","Claas","Fendt","Deutz-Fahr","Massey Ferguson","Kubota","Valtra"]},
    {key:"body",label:"Tipas",type:"select",options:["Traktorius","Kombaintas","Sėjamoji","Purkštuvas","Plūgas","Akėčios","Presavimo mašina","Kultivatorius"]},
    {key:"fuel",label:"Kuras",type:"select",options:["Dyzelinas","Elektra"]},
    {key:"transmission",label:"Pavarų dėžė",type:"select",options:["Mechaninė","Automatinė","Hidraulinė"]},
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"year",label:"Metai",type:"range",keyMin:"yearMin",keyMax:"yearMax"},
    {key:"city",label:"Rajonas",type:"select",options:["Vilnius","Kaunas","Klaipėda","Šiauliai","Panevėžys","Alytus","Marijampolė","Telšiai","Utena","Tauragė"]},
  ],
  parts:[
    {key:"partCat",label:"Dalies kategorija",type:"select",options:["Variklio dalys","Transmisija","Stabdžiai","Pakaba","Kėbulo dalys","Žibintai","Elektronika","Padangos ir ratai","Salono dalys","Kita"]},
    {key:"vehicleType",label:"Transporto tipas",type:"select",options:["Automobilis","Motociklas","Sunkvežimis","Mikroautobusas","Kita"]},
    {key:"make",label:"Tinkama markei",type:"select",options:["Audi","BMW","Mercedes","Toyota","Volkswagen","Ford","Opel","Renault","Skoda","Volvo","Universal"]},
    {key:"condition",label:"Būklė",type:"select",options:["Nauja","Naudota — puiki","Naudota — gera","Naudota — patenkinama"]},
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"city",label:"Miestas",type:"select",options:["Vilnius","Kaunas","Klaipėda","Šiauliai","Panevėžys"]},
  ],
  other:[
    {key:"body",label:"Tipas",type:"select",options:["Ekskavatorius","Buldozeris","Kranas","Šakinė krautuvė","Kelių technika","Komunalinė technika","Generatorius","Kompresorius","Kita"]},
    {key:"make",label:"Markė",type:"select",options:["Caterpillar","Komatsu","JCB","Hitachi","Volvo","Liebherr","Manitou","Kita"]},
    {key:"fuel",label:"Kuras",type:"select",options:["Dyzelinas","Elektra","Benzinas","Dujos"]},
    {key:"condition",label:"Būklė",type:"select",options:["Nauja","Naudota — puiki","Naudota — gera","Naudota — patenkinama"]},
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"year",label:"Metai",type:"range",keyMin:"yearMin",keyMax:"yearMax"},
    {key:"city",label:"Miestas",type:"select",options:["Vilnius","Kaunas","Klaipėda","Šiauliai","Panevėžys"]},
  ],
};

const CITIES = ["Vilnius","Kaunas","Klaipėda","Šiauliai","Panevėžys","Alytus","Marijampolė","Telšiai","Utena","Tauragė"];

const SAMPLE_LISTINGS = [
  {id:1,category:"cars",make:"BMW",model:"5 Series",year:2019,price:32500,mileage:87000,fuel:"Dyzelinas",transmission:"Automatinė",city:"Vilnius",body:"Sedanas",color:"Juoda",engine:"2.0",power:190,image:"🚗",featured:true,description:"Puikios būklės, vienas savininkas, pilna BMW istorija. Odinis salonas, panoraminis stogas, navigacija.",views:342,posted:"2025-06-01",sellerId:"u2",seller:"AutoSalonas LT",sellerRating:4.9,sellerSales:87,phone:"+370 698 76543"},
  {id:2,category:"cars",make:"Audi",model:"A6",year:2020,price:41000,mileage:62000,fuel:"Dyzelinas",transmission:"Automatinė",city:"Kaunas",body:"Universalas",color:"Pilka",engine:"2.0",power:204,image:"🚗",featured:true,description:"Audi A6 Avant S-Line paketas. Panoraminis stogas, B&O garso sistema.",views:218,posted:"2025-06-03",sellerId:"u2",seller:"AutoSalonas LT",sellerRating:4.9,sellerSales:87,phone:"+370 698 76543"},
  {id:3,category:"cars",make:"Toyota",model:"RAV4",year:2021,price:38900,mileage:45000,fuel:"Hibridas",transmission:"Automatinė",city:"Klaipėda",body:"SUV",color:"Balta",engine:"2.5",power:222,image:"🚗",featured:false,description:"Hibridinis RAV4 4x4. Žemas kuro suvartojimas, JBL garso sistema.",views:189,posted:"2025-06-05",sellerId:"u3",seller:"Rūta K.",sellerRating:5.0,sellerSales:3,phone:"+370 655 11223"},
  {id:4,category:"cars",make:"Volkswagen",model:"Golf",year:2018,price:18500,mileage:112000,fuel:"Benzinas",transmission:"Mechaninė",city:"Šiauliai",body:"Hečbekas",color:"Mėlyna",engine:"1.4",power:125,image:"🚗",featured:false,description:"Golf 7 R-Line. Garažuotas, nesurūdijęs.",views:421,posted:"2025-05-28",sellerId:"u4",seller:"Mindaugas P.",sellerRating:4.5,sellerSales:6,phone:"+370 677 99001"},
  {id:5,category:"moto",make:"Honda",model:"CB500F",year:2020,price:6900,mileage:12000,fuel:"Benzinas",transmission:"Mechaninė",city:"Vilnius",body:"Sportinis",color:"Raudona",engine:"0.5",power:47,image:"🏍️",featured:true,description:"Idealus motociklas pradedantiesiems ir ne tik. Techniškai tvarkingas.",views:156,posted:"2025-06-07",sellerId:"u5",seller:"Gintaras M.",sellerRating:4.7,sellerSales:4,phone:"+370 611 22334"},
  {id:6,category:"trucks",make:"Volvo",model:"FH 460",year:2017,price:68000,mileage:780000,fuel:"Dyzelinas",transmission:"Automatinė",city:"Vilnius",body:"Tentinis",color:"Balta",engine:"13.0",power:460,image:"🚛",featured:false,description:"Euro 6, I-Save paketas. Rida patvirtinta serviso knygoje.",views:87,posted:"2025-05-20",sellerId:"u6",seller:"UAB Translit",sellerRating:4.6,sellerSales:23,phone:"+370 522 11000"},
  {id:7,category:"cars",make:"Mercedes",model:"E-Class",year:2022,price:58000,mileage:28000,fuel:"Dyzelinas",transmission:"Automatinė",city:"Vilnius",body:"Sedanas",color:"Sidabrinė",engine:"2.0",power:194,image:"🚗",featured:true,description:"AMG Line paketas. Panoraminis stogas. Be jokių defektų.",views:302,posted:"2025-06-08",sellerId:"u2",seller:"AutoSalonas LT",sellerRating:4.9,sellerSales:87,phone:"+370 699 88776"},
  {id:8,category:"vans",make:"Mercedes Sprinter",model:"315 CDI",year:2019,price:24500,mileage:185000,fuel:"Dyzelinas",transmission:"Mechaninė",city:"Kaunas",body:"Krovininis",color:"Balta",engine:"2.2",power:150,image:"🚐",featured:false,description:"Ilgas, aukštas. Šoninės durys, sandėlys.",views:134,posted:"2025-06-02",sellerId:"u7",seller:"Petras L.",sellerRating:4.3,sellerSales:8,phone:"+370 644 55667"},
  {id:9,category:"cars",make:"Skoda",model:"Octavia",year:2020,price:22000,mileage:76000,fuel:"Benzinas",transmission:"Automatinė",city:"Panevėžys",body:"Universalas",color:"Žalia",engine:"1.5",power:150,image:"🚗",featured:false,description:"Octavia Combi Scout. Pilnas komplektavimas.",views:267,posted:"2025-05-31",sellerId:"u8",seller:"Andrius J.",sellerRating:4.6,sellerSales:5,phone:"+370 666 33445"},
  {id:10,category:"moto",make:"Yamaha",model:"MT-07",year:2021,price:9200,mileage:8500,fuel:"Benzinas",transmission:"Mechaninė",city:"Klaipėda",body:"Naked",color:"Juoda",engine:"0.7",power:73,image:"🏍️",featured:false,description:"Yamaha MT-07 Moto Cage. Akrapovič išmetimas.",views:198,posted:"2025-06-06",sellerId:"u9",seller:"Karolis B.",sellerRating:4.8,sellerSales:2,phone:"+370 622 77889"},
  {id:11,category:"agri",make:"John Deere",model:"6130R",year:2018,price:87000,mileage:0,fuel:"Dyzelinas",transmission:"Automatinė",city:"Alytus",body:"Traktorius",color:"Žalia",engine:"6.8",power:130,image:"🚜",featured:false,description:"Galingas traktorius su visais priedais.",views:45,posted:"2025-05-15",sellerId:"u10",seller:"ŽŪ Technika",sellerRating:4.7,sellerSales:18,phone:"+370 533 22100"},
  {id:12,category:"cars",make:"Ford",model:"Focus",year:2017,price:13900,mileage:134000,fuel:"Dyzelinas",transmission:"Mechaninė",city:"Marijampolė",body:"Universalas",color:"Pilka",engine:"1.5",power:120,image:"🚗",featured:false,description:"Gerai išlaikytas. Techninė apžiūra iki 2026.",views:189,posted:"2025-05-25",sellerId:"u1",seller:"Jūs",sellerRating:5.0,sellerSales:1,phone:"+370 688 00112"},
  {id:13,category:"boats",make:"Yamaha",model:"F115",year:2019,price:14900,mileage:0,fuel:"Benzinas",transmission:"Mechaninė",city:"Klaipėda",body:"Motorinė",color:"Balta",engine:"1.8",power:115,image:"⛵",featured:false,description:"115AG variklis, GPS, echoskautovas.",views:62,posted:"2025-06-01",sellerId:"u11",seller:"Jūrinis Centras",sellerRating:4.8,sellerSales:31,phone:"+370 466 55000"},
  {id:14,category:"parts",make:"BMW",model:"N47 dantratis",year:2015,price:85,mileage:0,fuel:"",transmission:"",city:"Vilnius",body:"",color:"",engine:"",power:0,image:"🔧",featured:false,description:"Originalus BMW N47 grandinės dantratis. Tinka 2008-2015 m.",views:34,posted:"2025-06-09",sellerId:"u12",seller:"Dalys LT",sellerRating:4.9,sellerSales:145,phone:"+370 5 234 5678"},
  {id:15,category:"cars",make:"Hyundai",model:"Tucson",year:2021,price:29500,mileage:52000,fuel:"Hibridas",transmission:"Automatinė",city:"Kaunas",body:"SUV",color:"Pilka",engine:"1.6",power:230,image:"🚗",featured:false,description:"Tucson Plug-in Hybrid. Elektra 60 km. Pilnas komplektavimas.",views:143,posted:"2025-06-04",sellerId:"u13",seller:"Rima S.",sellerRating:4.5,sellerSales:2,phone:"+370 655 43210"},
  {id:16,category:"cars",make:"BMW",model:"3 Series",year:2020,price:36000,mileage:71000,fuel:"Dyzelinas",transmission:"Automatinė",city:"Vilnius",body:"Sedanas",color:"Juoda",engine:"2.0",power:190,image:"🚗",featured:false,description:"BMW 320d M-Sport. Pianinų juoda, odinis salonas.",views:211,posted:"2025-06-02",sellerId:"u2",seller:"AutoSalonas LT",sellerRating:4.9,sellerSales:87,phone:"+370 698 76543"},
];

const SAMPLE_MESSAGES = [
  {id:1,fromId:"u3",fromName:"Rūta K.",toId:"u1",listingId:1,listingTitle:"BMW 5 Series 2019",text:"Sveiki, ar dar parduodate? Galėtumėte nuleisti kainą?",time:"2025-06-10 09:14",read:false},
  {id:2,fromId:"u4",fromName:"Mindaugas P.",toId:"u1",listingId:1,listingTitle:"BMW 5 Series 2019",text:"Labas, kokia tikroji rida? Ar yra serviso knygelė?",time:"2025-06-10 11:32",read:false},
  {id:3,fromId:"u1",fromName:"Jūs",toId:"u3",listingId:1,listingTitle:"BMW 5 Series 2019",text:"Taip, dar parduodame. Kaina galutinė.",time:"2025-06-10 12:00",read:true},
  {id:4,fromId:"u5",fromName:"Gintaras M.",toId:"u1",listingId:12,listingTitle:"Ford Focus 2017",text:"Ar galima atvažiuoti apžiūrėti šį savaitgalį?",time:"2025-06-11 08:45",read:false},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt    = n => n?.toLocaleString("lt-LT") ?? "—";
const fmtEur = n => n ? `${n.toLocaleString("lt-LT")} €` : "—";
const stars  = r => "★".repeat(Math.round(r))+"☆".repeat(5-Math.round(r));
function timeAgo(d){
  const diff=Math.floor((Date.now()-new Date(d))/86400000);
  if(diff===0)return"Šiandien"; if(diff===1)return"Vakar";
  if(diff<7)return`Prieš ${diff} d.`;
  return new Date(d).toLocaleDateString("lt-LT");
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const S={
  app:{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter',system-ui,sans-serif"},
  header:{background:C.surface,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:200,boxShadow:C.shadow},
  headerIn:{maxWidth:1200,margin:"0 auto",height:58,display:"flex",alignItems:"center",gap:10,padding:"0 16px"},
  logo:{fontWeight:900,fontSize:20,letterSpacing:-0.5,cursor:"pointer",color:C.text,userSelect:"none",flexShrink:0},
  logoAcc:{color:C.accent},
  srchWrap:{flex:1,position:"relative",maxWidth:460},
  srchIn:{width:"100%",background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 14px 9px 38px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"},
  srchIco:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.textMuted,fontSize:15},
  btnP:(sz="md")=>({background:C.accent,border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:sz==="sm"?12:13,padding:sz==="sm"?"6px 12px":"9px 18px",cursor:"pointer",whiteSpace:"nowrap"}),
  btnO:(sz="md")=>({background:"transparent",border:`1.5px solid ${C.border}`,borderRadius:10,color:C.textSub,fontWeight:600,fontSize:sz==="sm"?12:13,padding:sz==="sm"?"5px 12px":"8px 14px",cursor:"pointer",whiteSpace:"nowrap"}),
  btnDanger:{background:C.danger,border:"none",borderRadius:10,color:"#fff",fontWeight:600,fontSize:12,padding:"6px 12px",cursor:"pointer"},
  catBar:{background:C.surface,borderBottom:`1px solid ${C.border}`,overflowX:"auto",scrollbarWidth:"none"},
  catIn:{maxWidth:1200,margin:"0 auto",padding:"0 16px",display:"flex",gap:2,height:46,alignItems:"center"},
  catChip:a=>({background:a?C.accentLight:"transparent",border:a?`1.5px solid ${C.accent}`:"1.5px solid transparent",borderRadius:8,color:a?C.accent:C.textSub,fontSize:12,fontWeight:a?700:500,padding:"5px 12px",cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5,transition:"all 0.12s"}),
  content:{maxWidth:1200,margin:"0 auto",padding:"20px 16px"},
  layout:{display:"grid",gridTemplateColumns:"240px 1fr",gap:20},
  sidebar:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px",height:"fit-content",position:"sticky",top:78,boxShadow:C.shadow},
  fSec:{marginBottom:16},
  fLabel:{color:C.textMuted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6,display:"block"},
  fInput:{width:"100%",background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"8px 10px",color:C.text,fontSize:12,outline:"none",boxSizing:"border-box"},
  fSelect:{width:"100%",background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"8px 10px",color:C.text,fontSize:12,outline:"none",boxSizing:"border-box",appearance:"none",cursor:"pointer"},
  rangeRow:{display:"flex",gap:8},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(268px,1fr))",gap:14},
  card:h=>({background:C.surface,border:`1.5px solid ${h?C.accent:C.border}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"all 0.15s",boxShadow:h?C.shadowMd:C.shadow,transform:h?"translateY(-2px)":"none"}),
  cardImg:{height:168,background:`linear-gradient(135deg,${C.surfaceAlt} 0%,#E8ECF8 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:62,position:"relative"},
  cardFeat:{position:"absolute",top:10,left:10,background:C.featured,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:5},
  cardBody:{padding:"12px 14px 14px"},
  cardMeta:{color:C.textMuted,fontSize:11,marginBottom:4},
  cardTitle:{color:C.text,fontWeight:700,fontSize:15,marginBottom:6},
  cardPrice:{color:C.accent,fontWeight:800,fontSize:18,marginBottom:8},
  cardTags:{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8},
  tag:{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:5,color:C.textSub,fontSize:10,fontWeight:500,padding:"3px 7px"},
  cardFoot:{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${C.border}`},
  resBar:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8},
  overlay:{position:"fixed",inset:0,background:"rgba(17,24,39,0.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(3px)"},
  modal:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:18,width:"100%",maxWidth:720,maxHeight:"92vh",overflowY:"auto",boxShadow:C.shadowLg},
  modalImg:{height:220,background:`linear-gradient(135deg,${C.surfaceAlt} 0%,#DDE3F8 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:90,position:"relative"},
  modalBody:{padding:"24px 26px 28px"},
  specGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20},
  specItem:{background:C.surfaceAlt,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.border}`},
  specLabel:{color:C.textMuted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2},
  specValue:{color:C.text,fontSize:13,fontWeight:600},
  fRow:{marginBottom:14},
  fLab:{color:C.textSub,fontSize:12,fontWeight:600,marginBottom:5,display:"block"},
  fInp:{width:"100%",background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"},
  fSel:{width:"100%",background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",appearance:"none"},
  fTA:{width:"100%",background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",minHeight:80,resize:"vertical"},
  fg2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14},
  pageTitle:{fontWeight:800,fontSize:20,color:C.text,marginBottom:20},
  badge:bg=>({background:bg,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:11,marginLeft:4,fontWeight:700}),
};

// ─── FILTER SIDEBAR ───────────────────────────────────────────────────────────
function FilterSidebar({category,filters,onChange,onReset}){
  const defs=category?(CAT_FILTERS[category]||[]):[
    {key:"price",label:"Kaina (€)",type:"range",keyMin:"priceMin",keyMax:"priceMax"},
    {key:"year",label:"Metai",type:"range",keyMin:"yearMin",keyMax:"yearMax"},
    {key:"city",label:"Miestas",type:"select",options:CITIES},
  ];
  const set=(k,v)=>onChange({...filters,[k]:v});
  const active=Object.values(filters).filter(Boolean).length;
  return(
    <div style={S.sidebar}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={{color:C.text,fontWeight:700,fontSize:14}}>Filtrai{active>0&&<span style={S.badge(C.accent)}>{active}</span>}</span>
        {active>0&&<button onClick={onReset} style={{background:"none",border:"none",color:C.accent,fontSize:12,cursor:"pointer",fontWeight:600}}>Išvalyti</button>}
      </div>
      {defs.map(d=>(
        <div key={d.key} style={S.fSec}>
          <label style={S.fLabel}>{d.label}</label>
          {d.type==="select"&&<select style={S.fSelect} value={filters[d.key]||""} onChange={e=>set(d.key,e.target.value)}><option value="">Visi</option>{d.options.map(o=><option key={o}>{o}</option>)}</select>}
          {d.type==="range"&&<div style={S.rangeRow}><input style={S.fInput} type="number" placeholder="Nuo" value={filters[d.keyMin]||""} onChange={e=>set(d.keyMin,e.target.value)}/><input style={S.fInput} type="number" placeholder="Iki" value={filters[d.keyMax]||""} onChange={e=>set(d.keyMax,e.target.value)}/></div>}
        </div>
      ))}
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({mode:init,onClose,onAuth}){
  const[mode,setMode]=useState(init);
  const[form,setForm]=useState({name:"",email:"",password:"",phone:""});
  const[err,setErr]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{
    if(!form.email||!form.password){setErr("Užpildykite visus privalomus laukus.");return;}
    if(mode==="register"&&!form.name){setErr("Įveskite vardą.");return;}
    if(form.password.length<6){setErr("Slaptažodis — mažiausiai 6 simboliai.");return;}
    onAuth({id:"u1",name:form.name||form.email.split("@")[0],email:form.email,phone:form.phone,joined:"2025-01-15",rating:5.0,sales:0});
  };
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:420,padding:"32px 28px",borderRadius:18}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <div style={{fontWeight:900,fontSize:20,color:C.text}}>{mode==="login"?"Prisijungti":"Registruotis"}</div>
            <div style={{color:C.textMuted,fontSize:12,marginTop:2}}>
              {mode==="login"?"Dar neturite paskyros? ":"Jau turite paskyrą? "}
              <span style={{color:C.accent,cursor:"pointer",fontWeight:600}} onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}}>
                {mode==="login"?"Registruotis":"Prisijungti"}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:16,color:C.textSub}}>✕</button>
        </div>
        {mode==="register"&&<div style={S.fRow}><label style={S.fLab}>Vardas ir pavardė *</label><input style={S.fInp} placeholder="Jonas Jonaitis" value={form.name} onChange={e=>set("name",e.target.value)}/></div>}
        <div style={S.fRow}><label style={S.fLab}>El. paštas *</label><input style={S.fInp} type="email" placeholder="jonas@gmail.com" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
        <div style={S.fRow}><label style={S.fLab}>Slaptažodis *</label><input style={S.fInp} type="password" placeholder="Mažiausiai 6 simboliai" value={form.password} onChange={e=>set("password",e.target.value)}/></div>
        {mode==="register"&&<div style={S.fRow}><label style={S.fLab}>Telefono numeris</label><input style={S.fInp} placeholder="+370 600 00000" value={form.phone} onChange={e=>set("phone",e.target.value)}/></div>}
        {err&&<div style={{color:C.danger,fontSize:12,marginBottom:12,background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,padding:"8px 12px"}}>{err}</div>}
        <button onClick={submit} style={{...S.btnP(),width:"100%",padding:"12px",fontSize:15,borderRadius:12,marginTop:4}}>
          {mode==="login"?"Prisijungti →":"Sukurti paskyrą →"}
        </button>
        <div style={{textAlign:"center",color:C.textMuted,fontSize:11,marginTop:14}}>
          Tęsdami sutinkate su <span style={{color:C.accent,cursor:"pointer"}}>naudojimo sąlygomis</span>
        </div>
      </div>
    </div>
  );
}

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
function ListingCard({item,onClick,saved,onSave,compared,onCompare,user,onRequireAuth,showActions,onEdit,onDelete}){
  const[hov,setHov]=useState(false);
  return(
    <div style={S.card(hov)} onClick={()=>onClick(item)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={S.cardImg}>
        <span>{item.image}</span>
        {item.featured&&<div style={S.cardFeat}>⭐ REKOMENDUOJAMAS</div>}
        {!showActions&&<>
          <button style={{position:"absolute",top:8,right:8,background:saved?"#FEE2E2":"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,boxShadow:C.shadow}} onClick={e=>{e.stopPropagation();if(!user){onRequireAuth();return;}onSave(item.id);}}>
            {saved?"❤️":"🤍"}
          </button>
          <button style={{position:"absolute",bottom:10,right:10,background:compared?C.accent:"rgba(255,255,255,0.9)",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:10,fontWeight:700,color:compared?"#fff":C.textSub,boxShadow:C.shadow}} onClick={e=>{e.stopPropagation();onCompare(item.id);}}>
            {compared?"✓ Lyginti":"+ Lyginti"}
          </button>
        </>}
      </div>
      <div style={S.cardBody}>
        <div style={S.cardMeta}>{item.year} · {item.city} · {timeAgo(item.posted)}</div>
        <div style={S.cardTitle}>{item.make} {item.model}</div>
        <div style={S.cardPrice}>{fmtEur(item.price)}</div>
        <div style={S.cardTags}>
          {item.mileage>0&&<span style={S.tag}>🛣 {fmt(item.mileage)} km</span>}
          {item.fuel&&<span style={S.tag}>{item.fuel}</span>}
          {item.transmission&&<span style={S.tag}>{item.transmission}</span>}
          {item.engine&&<span style={S.tag}>{item.engine}L</span>}
        </div>
        <div style={S.cardFoot}>
          <span style={{color:C.textMuted,fontSize:11}}>👁 {item.views}</span>
          <span style={{color:C.featured,fontSize:11}}>{stars(item.sellerRating)} {item.sellerRating}</span>
        </div>
        {showActions&&<div style={{display:"flex",gap:8,marginTop:10}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>onEdit(item)} style={{...S.btnO("sm"),flex:1}}>✏️ Redaguoti</button>
          <button onClick={()=>onDelete(item.id)} style={{...S.btnDanger,flex:1}}>🗑 Šalinti</button>
        </div>}
      </div>
    </div>
  );
}

// ─── LOAN CALCULATOR ──────────────────────────────────────────────────────────
function LoanCalc({price}){
  const[down,setDown]=useState(Math.round(price*0.2));
  const[months,setMonths]=useState(60);
  const[rate,setRate]=useState(6.5);
  const loan=price-down;
  const mo=rate/100/12;
  const pmt=mo>0?loan*(mo*Math.pow(1+mo,months))/(Math.pow(1+mo,months)-1):loan/months;
  const total=pmt*months;
  return(
    <div style={{background:C.accentLight,border:`1px solid ${C.accent}33`,borderRadius:12,padding:"16px",marginBottom:20}}>
      <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:12}}>🧮 Paskolos skaičiuoklė</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
        <div><label style={{...S.fLabel,fontSize:10}}>Pradinis įnašas (€)</label><input style={{...S.fInput,fontSize:12}} type="number" value={down} onChange={e=>setDown(+e.target.value)}/></div>
        <div><label style={{...S.fLabel,fontSize:10}}>Laikotarpis (mėn.)</label><select style={{...S.fSelect,fontSize:12}} value={months} onChange={e=>setMonths(+e.target.value)}>{[12,24,36,48,60,72,84,96].map(m=><option key={m} value={m}>{m}</option>)}</select></div>
        <div><label style={{...S.fLabel,fontSize:10}}>Palūkanos (%)</label><input style={{...S.fInput,fontSize:12}} type="number" step="0.1" value={rate} onChange={e=>setRate(+e.target.value)}/></div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1,background:C.surface,borderRadius:8,padding:"10px",textAlign:"center",border:`1px solid ${C.border}`}}>
          <div style={{color:C.textMuted,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>Mėnesinė įmoka</div>
          <div style={{color:C.accent,fontWeight:900,fontSize:18}}>{Math.round(pmt).toLocaleString("lt-LT")} €</div>
        </div>
        <div style={{flex:1,background:C.surface,borderRadius:8,padding:"10px",textAlign:"center",border:`1px solid ${C.border}`}}>
          <div style={{color:C.textMuted,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>Iš viso</div>
          <div style={{color:C.text,fontWeight:700,fontSize:16}}>{Math.round(total).toLocaleString("lt-LT")} €</div>
        </div>
        <div style={{flex:1,background:C.surface,borderRadius:8,padding:"10px",textAlign:"center",border:`1px solid ${C.border}`}}>
          <div style={{color:C.textMuted,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>Palūkanos</div>
          <div style={{color:C.warning,fontWeight:700,fontSize:16}}>{Math.round(total-loan).toLocaleString("lt-LT")} €</div>
        </div>
      </div>
    </div>
  );
}

// ─── SIMILAR ──────────────────────────────────────────────────────────────────
function SimilarListings({item,all,onClick}){
  const sim=all.filter(l=>l.id!==item.id&&l.category===item.category&&Math.abs(l.price-item.price)/item.price<0.4).slice(0,3);
  if(!sim.length) return null;
  return(
    <div>
      <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:12}}>🔍 Panašūs skelbimai</div>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
        {sim.map(l=>(
          <div key={l.id} onClick={()=>onClick(l)} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",minWidth:160,flexShrink:0}}>
            <div style={{fontSize:28,textAlign:"center",marginBottom:6}}>{l.image}</div>
            <div style={{fontWeight:700,fontSize:12,color:C.text}}>{l.make} {l.model}</div>
            <div style={{color:C.accent,fontWeight:800,fontSize:13}}>{fmtEur(l.price)}</div>
            <div style={{color:C.textMuted,fontSize:11}}>{l.year} · {fmt(l.mileage)} km</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SELLER PROFILE MODAL ─────────────────────────────────────────────────────
function SellerModal({sellerId,sellerName,sellerRating,sellerSales,all,onClose,onOpenListing}){
  const listings=all.filter(l=>l.sellerId===sellerId);
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:600}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"24px 24px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:C.accentLight,border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:C.accent}}>
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{fontWeight:800,fontSize:18,color:C.text}}>{sellerName}</div>
                <div style={{color:C.featured,fontSize:14}}>{stars(sellerRating)} <span style={{color:C.textSub,fontWeight:600}}>{sellerRating} · {sellerSales} parduota</span></div>
                <div style={{color:C.textMuted,fontSize:12,marginTop:2}}>✅ Patvirtintas pardavėjas · 📍 Vilnius</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:16,color:C.textSub}}>✕</button>
          </div>
          <div style={{display:"flex",gap:12,marginBottom:20}}>
            {[["📋 Skelbimai",listings.length],["⭐ Įvertinimas",sellerRating],["🏆 Parduota",sellerSales]].map(([l,v])=>(
              <div key={l} style={{flex:1,background:C.surfaceAlt,borderRadius:10,padding:"10px",textAlign:"center",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:18,fontWeight:800,color:C.accent}}>{v}</div>
                <div style={{fontSize:11,color:C.textMuted,fontWeight:600}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"0 24px 24px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>Aktyvūs skelbimai</div>
          {listings.length===0
            ?<div style={{textAlign:"center",color:C.textMuted,padding:"20px 0"}}>Nėra aktyvių skelbimų</div>
            :<div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:320,overflowY:"auto"}}>
              {listings.map(l=>(
                <div key={l.id} onClick={()=>{onClose();onOpenListing(l);}} style={{display:"flex",gap:12,background:C.surfaceAlt,borderRadius:10,padding:"10px 12px",cursor:"pointer",border:`1px solid ${C.border}`,alignItems:"center"}}>
                  <span style={{fontSize:28}}>{l.image}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{l.make} {l.model} {l.year}</div>
                    <div style={{color:C.textMuted,fontSize:11}}>{l.city} · {fmt(l.mileage)} km</div>
                  </div>
                  <div style={{color:C.accent,fontWeight:800,fontSize:15}}>{fmtEur(l.price)}</div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({item,onClose,user,onRequireAuth,saved,onSave,all,onOpenSeller}){
  const[showPhone,setShowPhone]=useState(false);
  const[tab,setTab]=useState("info");
  const[msg,setMsg]=useState("");
  const[sent,setSent]=useState(false);
  if(!item) return null;
  const tabStyle=a=>({padding:"8px 16px",border:"none",background:"none",fontWeight:a?700:500,color:a?C.accent:C.textSub,borderBottom:a?`2px solid ${C.accent}`:"2px solid transparent",cursor:"pointer",fontSize:13,flexShrink:0});
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e=>e.stopPropagation()}>
        <div style={S.modalImg}>
          <span>{item.image}</span>
          {item.featured&&<div style={{...S.cardFeat,top:14,left:14,fontSize:11}}>⭐ REKOMENDUOJAMAS</div>}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:16,color:C.textSub}}>✕</button>
          <button onClick={()=>{if(!user){onClose();onRequireAuth();return;}onSave(item.id);}} style={{position:"absolute",top:12,right:54,background:saved?"#FEE2E2":"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:18}}>
            {saved?"❤️":"🤍"}
          </button>
        </div>
        <div style={S.modalBody}>
          <div style={{fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>{item.make} {item.model} {item.year}</div>
          <div style={{color:C.textMuted,fontSize:13,marginBottom:10}}>📍 {item.city} · {timeAgo(item.posted)} · 👁 {item.views} peržiūrų</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div onClick={()=>onOpenSeller(item)} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.accent}}>{item.seller.charAt(0)}</div>
              <span style={{fontWeight:600,color:C.text}}>{item.seller}</span>
              <span style={{color:C.featured}}>{stars(item.sellerRating)}</span>
              <span style={{color:C.textMuted}}>{item.sellerRating} · {item.sellerSales} parduota</span>
            </div>
          </div>
          <div style={{color:C.accent,fontWeight:900,fontSize:30,marginBottom:18}}>{fmtEur(item.price)}</div>
          <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:18,overflowX:"auto"}}>
            {["info","calc","message"].map(t=>(
              <button key={t} style={tabStyle(tab===t)} onClick={()=>setTab(t)}>
                {t==="info"?"📋 Informacija":t==="calc"?"🧮 Paskola":"✉️ Žinutė"}
              </button>
            ))}
          </div>
          {tab==="info"&&<>
            <div style={S.specGrid}>
              {[["Metai",item.year],["Rida",item.mileage>0?`${fmt(item.mileage)} km`:"—"],["Variklis",item.engine?`${item.engine}L`:"—"],["Galia",item.power?`${item.power} AG`:"—"],["Kuras",item.fuel],["Pavarų dėžė",item.transmission],["Kėbulas",item.body],["Spalva",item.color]].filter(([,v])=>v).map(([l,v])=>(
                <div key={l} style={S.specItem}><div style={S.specLabel}>{l}</div><div style={S.specValue}>{v}</div></div>
              ))}
            </div>
            {item.description&&<div style={{marginBottom:20}}><div style={{...S.fLabel,marginBottom:8}}>Aprašymas</div><p style={{color:C.textSub,fontSize:13,lineHeight:1.65,margin:0}}>{item.description}</p></div>}
            <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:12,color:"#92400E"}}>
              🔍 Rekomenduojame patikrinti per <span style={{color:C.accent,cursor:"pointer"}}>Regitra.lt</span> arba <span style={{color:C.accent,cursor:"pointer"}}>Carvertical.com</span>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:20}}>
              <button style={{...S.btnP(),flex:1,padding:"13px",fontSize:14,borderRadius:12}} onClick={()=>{if(!user){onClose();onRequireAuth();}else setShowPhone(p=>!p);}}>
                {user?(showPhone?`📞 ${item.phone}`:"📞 Rodyti telefoną"):"🔒 Prisijunkite norėdami matyti"}
              </button>
              <button style={{...S.btnO(),padding:"13px 16px",borderRadius:12}}>↗️</button>
            </div>
            <SimilarListings item={item} all={all} onClick={()=>{}}/>
          </>}
          {tab==="calc"&&<LoanCalc price={item.price}/>}
          {tab==="message"&&(user
            ?sent
              ?<div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:10,padding:"16px",color:C.success,fontWeight:600,textAlign:"center"}}>✅ Žinutė išsiųsta! Pardavėjas susisieks el. paštu.</div>
              :<div>
                <textarea style={{...S.fTA,marginBottom:10}} placeholder={`Sveiki, domina ${item.make} ${item.model}...`} value={msg} onChange={e=>setMsg(e.target.value)}/>
                <button onClick={()=>{if(msg.trim())setSent(true);}} style={{...S.btnP(),padding:"10px 24px",borderRadius:10}}>Siųsti žinutę</button>
              </div>
            :<div style={{textAlign:"center",padding:"30px 0"}}>
              <div style={{fontSize:40,marginBottom:10}}>🔒</div>
              <div style={{fontWeight:700,color:C.text,marginBottom:6}}>Prisijunkite norėdami rašyti</div>
              <div style={{color:C.textMuted,fontSize:13,marginBottom:16}}>Sukurkite nemokamą paskyrą</div>
              <button style={{...S.btnP(),padding:"10px 24px"}} onClick={()=>{onClose();onRequireAuth();}}>Prisijungti / Registruotis</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPARE PANEL ────────────────────────────────────────────────────────────
function ComparePanel({ids,all,onRemove,onClear}){
  if(!ids.length) return null;
  const items=ids.map(id=>all.find(l=>l.id===id)).filter(Boolean);
  const rows=[["Kaina",i=>fmtEur(i.price)],["Metai",i=>i.year],["Rida",i=>i.mileage>0?`${fmt(i.mileage)} km`:"—"],["Variklis",i=>i.engine?`${i.engine}L`:"—"],["Galia",i=>i.power?`${i.power} AG`:"—"],["Kuras",i=>i.fuel||"—"],["Pavarų dėžė",i=>i.transmission||"—"],["Kėbulas",i=>i.body||"—"],["Spalva",i=>i.color||"—"]];
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:250,background:C.surface,borderTop:`2px solid ${C.accent}`,boxShadow:"0 -4px 20px rgba(0,0,0,0.12)"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"10px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontWeight:700,color:C.text,fontSize:13}}>⚖️ Lyginimas ({items.length}/3)</span>
          <button onClick={onClear} style={{...S.btnO("sm")}}>Išvalyti</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr>
                <td style={{width:100,padding:"4px 8px",color:C.textMuted,fontWeight:600}}></td>
                {items.map(l=>(
                  <td key={l.id} style={{padding:"4px 8px",textAlign:"center",minWidth:130}}>
                    <div style={{fontWeight:700,color:C.text}}>{l.image} {l.make} {l.model}</div>
                    <div style={{color:C.accent,fontWeight:800}}>{fmtEur(l.price)}</div>
                    <button onClick={()=>onRemove(l.id)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:11}}>✕ Pašalinti</button>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label,fn])=>(
                <tr key={label} style={{borderTop:`1px solid ${C.border}`}}>
                  <td style={{padding:"4px 8px",color:C.textMuted,fontWeight:600,whiteSpace:"nowrap"}}>{label}</td>
                  {items.map(l=><td key={l.id} style={{padding:"4px 8px",textAlign:"center",color:C.text,fontWeight:500}}>{fn(l)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGES PAGE ────────────────────────────────────────────────────────────
function MessagesPage({user,messages,setMessages}){
  const[activeThread,setActiveThread]=useState(null);
  const[reply,setReply]=useState("");
  const threads=[];
  const seen=new Set();
  [...messages].sort((a,b)=>b.id-a.id).forEach(m=>{
    const key=m.listingId+"-"+(m.fromId===user.id?m.toId:m.fromId);
    if(!seen.has(key)){seen.add(key);threads.push(m);}
  });
  const unread=messages.filter(m=>m.toId===user.id&&!m.read).length;
  const threadMsgs=activeThread?messages.filter(m=>m.listingId===activeThread.listingId&&((m.fromId===user.id&&m.toId===activeThread.otherId)||(m.toId===user.id&&m.fromId===activeThread.otherId))):[];

  const openThread=(m)=>{
    const otherId=m.fromId===user.id?m.toId:m.fromId;
    const otherName=m.fromId===user.id?m.toName||"—":m.fromName;
    setActiveThread({listingId:m.listingId,listingTitle:m.listingTitle,otherId,otherName});
    setMessages(ms=>ms.map(x=>x.toId===user.id&&x.listingId===m.listingId?{...x,read:true}:x));
  };

  const sendReply=()=>{
    if(!reply.trim()) return;
    setMessages(ms=>[...ms,{id:Date.now(),fromId:user.id,fromName:user.name,toId:activeThread.otherId,listingId:activeThread.listingId,listingTitle:activeThread.listingTitle,text:reply,time:new Date().toLocaleString("lt-LT"),read:true}]);
    setReply("");
  };

  return(
    <div>
      <div style={S.pageTitle}>✉️ Žinutės{unread>0&&<span style={S.badge(C.danger)}>{unread}</span>}</div>
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,height:500}}>
        {/* Thread list */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",boxShadow:C.shadow}}>
          {threads.length===0
            ?<div style={{padding:20,textAlign:"center",color:C.textMuted,fontSize:13}}>Nėra žinučių</div>
            :threads.map(m=>{
              const otherId=m.fromId===user.id?m.toId:m.fromId;
              const otherName=m.fromId===user.id?m.toName||m.fromName:m.fromName;
              const isActive=activeThread?.listingId===m.listingId&&activeThread?.otherId===otherId;
              const hasUnread=messages.some(x=>x.listingId===m.listingId&&x.toId===user.id&&!x.read);
              return(
                <div key={m.id} onClick={()=>openThread({...m,toName:otherName})} style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:isActive?C.accentLight:"transparent",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:C.accentLight,border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:C.accent,fontSize:14,flexShrink:0}}>{otherName.charAt(0)}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontWeight:hasUnread?700:500,fontSize:13,color:C.text}}>{otherName}</span>
                      {hasUnread&&<span style={{width:8,height:8,borderRadius:"50%",background:C.accent,display:"inline-block",flexShrink:0}}/>}
                    </div>
                    <div style={{color:C.textMuted,fontSize:11,marginBottom:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{m.listingTitle}</div>
                    <div style={{color:C.textSub,fontSize:12,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{m.text}</div>
                  </div>
                </div>
              );
            })
          }
        </div>
        {/* Chat window */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,display:"flex",flexDirection:"column",boxShadow:C.shadow}}>
          {!activeThread
            ?<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.textMuted,fontSize:13}}>Pasirinkite pokalbį</div>
            :<>
              <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,color:C.text,fontSize:14}}>
                {activeThread.otherName} · <span style={{color:C.textMuted,fontWeight:400,fontSize:12}}>{activeThread.listingTitle}</span>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
                {threadMsgs.map(m=>{
                  const mine=m.fromId===user.id;
                  return(
                    <div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}>
                      <div style={{background:mine?C.accent:C.surfaceAlt,color:mine?"#fff":C.text,borderRadius:mine?"12px 12px 2px 12px":"12px 12px 12px 2px",padding:"8px 12px",maxWidth:"70%",fontSize:13}}>
                        <div>{m.text}</div>
                        <div style={{fontSize:10,opacity:0.7,marginTop:3,textAlign:mine?"right":"left"}}>{m.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
                <input style={{...S.fInp,flex:1}} placeholder="Rašyti žinutę..." value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply()}/>
                <button onClick={sendReply} style={{...S.btnP(),padding:"10px 16px",borderRadius:10}}>Siųsti</button>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

// ─── MY LISTINGS PAGE ─────────────────────────────────────────────────────────
function MyListingsPage({user,listings,onDelete,onEdit,onOpen}){
  const mine=listings.filter(l=>l.sellerId===user.id);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={S.pageTitle}>📋 Mano skelbimai <span style={{color:C.textMuted,fontWeight:400,fontSize:14}}>({mine.length})</span></div>
      </div>
      {mine.length===0
        ?<div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:48,marginBottom:12}}>📋</div>
          <div style={{fontSize:15,fontWeight:600,color:C.textSub,marginBottom:6}}>Dar neturite skelbimų</div>
          <div style={{fontSize:13,color:C.textMuted}}>Spaudžiate „+ Skelbti" norėdami paskelbti pirmąjį</div>
        </div>
        :<div style={S.grid}>
          {mine.map(item=>(
            <ListingCard key={item.id} item={item} onClick={onOpen} saved={false} onSave={()=>{}} compared={false} onCompare={()=>{}} user={user} onRequireAuth={()=>{}} showActions onEdit={onEdit} onDelete={onDelete}/>
          ))}
        </div>
      }
      {mine.length>0&&(
        <div style={{marginTop:20,background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px"}}>
          <div style={{fontWeight:700,color:C.text,marginBottom:10,fontSize:14}}>📊 Statistika</div>
          <div style={{display:"flex",gap:16}}>
            {[["Iš viso skelbimų",mine.length],["Bendros peržiūros",mine.reduce((s,l)=>s+l.views,0)],["Vidutinė kaina",fmtEur(Math.round(mine.reduce((s,l)=>s+l.price,0)/mine.length))]].map(([l,v])=>(
              <div key={l} style={{flex:1,background:C.surfaceAlt,borderRadius:10,padding:"10px 14px",border:`1px solid ${C.border}`}}>
                <div style={{color:C.accent,fontWeight:800,fontSize:18}}>{v}</div>
                <div style={{color:C.textMuted,fontSize:11,fontWeight:600}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SAVED PAGE ───────────────────────────────────────────────────────────────
function SavedPage({savedIds,all,onOpen,onUnsave}){
  const items=all.filter(l=>savedIds.includes(l.id));
  return(
    <div>
      <div style={S.pageTitle}>❤️ Išsaugoti skelbimai <span style={{color:C.textMuted,fontWeight:400,fontSize:14}}>({items.length})</span></div>
      {items.length===0
        ?<div style={{textAlign:"center",padding:"60px 0",color:C.textMuted}}>
          <div style={{fontSize:48,marginBottom:10}}>🤍</div>
          <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>Nėra išsaugotų skelbimų</div>
          <div style={{fontSize:13}}>Spaudžiate širdutę ant skelbimo</div>
        </div>
        :<div style={S.grid}>
          {items.map(item=>(
            <ListingCard key={item.id} item={item} onClick={onOpen} saved={true} onSave={onUnsave} compared={false} onCompare={()=>{}} user={{}} onRequireAuth={()=>{}}/>
          ))}
        </div>
      }
    </div>
  );
}

// ─── ADD / EDIT MODAL ─────────────────────────────────────────────────────────
function AddModal({onClose,onAdd,editItem,user}){
  const[form,setForm]=useState(editItem||{category:"cars",make:"",model:"",year:"",price:"",mileage:"",fuel:"",transmission:"",city:"",description:"",color:"",engine:"",power:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const defs=CAT_FILTERS[form.category]||[];
  const opts=k=>defs.find(d=>d.key===k)?.options||[];
  const submit=()=>{
    if(!form.make||!form.model||!form.price) return;
    onAdd({...(editItem||{}),id:editItem?.id||Date.now(),...form,year:+form.year,price:+form.price,mileage:+form.mileage,power:+form.power,image:CATEGORIES.find(c=>c.id===form.category)?.icon||"🚗",featured:editItem?.featured||false,views:editItem?.views||0,posted:editItem?.posted||new Date().toISOString().slice(0,10),sellerId:user.id,seller:user.name,sellerRating:user.rating||5.0,sellerSales:user.sales||0,phone:user.phone||""});
    onClose();
  };
  const Inp=({k,label,placeholder,type="text"})=><div><label style={S.fLab}>{label}</label><input style={S.fInp} type={type} placeholder={placeholder} value={form[k]||""} onChange={e=>set(k,e.target.value)}/></div>;
  const Sel=({k,label,os})=><div><label style={S.fLab}>{label}</label><select style={S.fSel} value={form[k]||""} onChange={e=>set(k,e.target.value)}><option value="">—</option>{os.map(x=><option key={x}>{x}</option>)}</select></div>;
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:560,padding:"26px 24px"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontWeight:900,fontSize:19,color:C.text}}>{editItem?"Redaguoti skelbimą":"Pridėti skelbimą"}</div>
          <button onClick={onClose} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:16,color:C.textSub}}>✕</button>
        </div>
        <div style={S.fRow}><label style={S.fLab}>Kategorija</label>
          <select style={S.fSel} value={form.category} onChange={e=>set("category",e.target.value)}>
            {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div style={S.fg2}>{opts("make").length?<Sel k="make" label="Markė *" os={opts("make")}/>:<Inp k="make" label="Markė *" placeholder="Markė"/>}<Inp k="model" label="Modelis *" placeholder="Modelis"/></div>
        <div style={S.fg2}><Inp k="year" label="Metai" placeholder="2020" type="number"/><Inp k="price" label="Kaina (€) *" placeholder="15000" type="number"/></div>
        <div style={S.fg2}><Inp k="mileage" label="Rida (km)" placeholder="80000" type="number"/><Inp k="engine" label="Variklis (l)" placeholder="2.0"/></div>
        <div style={S.fg2}>
          {opts("fuel").length>0&&<Sel k="fuel" label="Kuras" os={opts("fuel")}/>}
          {opts("transmission").length>0&&<Sel k="transmission" label="Pavarų dėžė" os={opts("transmission")}/>}
        </div>
        <div style={S.fg2}>
          {opts("body").length>0&&<Sel k="body" label="Kėbulo tipas" os={opts("body")}/>}
          <Sel k="city" label="Miestas" os={CITIES}/>
        </div>
        <div style={S.fRow}><label style={S.fLab}>Aprašymas</label><textarea style={S.fTA} placeholder="Aprašykite transporto priemonę..." value={form.description||""} onChange={e=>set("description",e.target.value)}/></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{...S.btnO(),flex:1,padding:"12px",borderRadius:12}}>Atšaukti</button>
          <button onClick={submit} style={{...S.btnP(),flex:2,padding:"12px",fontSize:14,borderRadius:12}}>{editItem?"💾 Išsaugoti":"✅ Paskelbti"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── RECENT BAR ───────────────────────────────────────────────────────────────
function RecentBar({ids,all,onClick}){
  const items=ids.map(id=>all.find(l=>l.id===id)).filter(Boolean).slice(0,6);
  if(!items.length) return null;
  return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 16px",marginBottom:14,boxShadow:C.shadow}}>
      <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:10}}>🕐 Neseniai žiūrėti</div>
      <div style={{display:"flex",gap:10,overflowX:"auto"}}>
        {items.map(l=>(
          <div key={l.id} onClick={()=>onClick(l)} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",minWidth:130,flexShrink:0,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:20}}>{l.image}</span>
            <div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{l.make} {l.model}</div><div style={{color:C.accent,fontSize:12,fontWeight:700}}>{fmtEur(l.price)}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const[listings,setListings]=useState(SAMPLE_LISTINGS);
  const[messages,setMessages]=useState(SAMPLE_MESSAGES);
  const[selected,setSelected]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const[editItem,setEditItem]=useState(null);
  const[showAuth,setShowAuth]=useState(false);
  const[authMode,setAuthMode]=useState("login");
  const[user,setUser]=useState(null);
  const[page,setPage]=useState("home");
  const[sellerModal,setSellerModal]=useState(null);
  const[search,setSearch]=useState("");
  const[activeCategory,setActiveCategory]=useState(null);
  const[filters,setFilters]=useState({});
  const[sortBy,setSortBy]=useState("featured");
  const[saved,setSaved]=useState([]);
  const[compareIds,setCompareIds]=useState([]);
  const[recentIds,setRecentIds]=useState([]);

  const openAuth=(m="login")=>{setAuthMode(m);setShowAuth(true);};
  const handleAuth=u=>{setUser(u);setShowAuth(false);};
  const toggleSave=id=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[id,...s]);
  const toggleCompare=id=>setCompareIds(c=>c.includes(id)?c.filter(x=>x!==id):c.length>=3?c:[...c,id]);
  const openItem=item=>{
    setSelected(item);
    setRecentIds(r=>[item.id,...r.filter(x=>x!==item.id)].slice(0,10));
    setListings(ls=>ls.map(l=>l.id===item.id?{...l,views:l.views+1}:l));
  };
  const handleDelete=id=>setListings(ls=>ls.filter(l=>l.id!==id));
  const handleAdd=item=>{
    if(editItem){setListings(ls=>ls.map(l=>l.id===item.id?item:l));}
    else{setListings(ls=>[item,...ls]);}
    setEditItem(null);
  };

  const unreadCount=messages.filter(m=>m.toId===user?.id&&!m.read).length;

  const filtered=useMemo(()=>{
    let list=listings.filter(item=>{
      if(activeCategory&&item.category!==activeCategory) return false;
      const q=search.toLowerCase();
      if(q&&!`${item.make} ${item.model} ${item.city} ${item.year}`.toLowerCase().includes(q)) return false;
      for(const[k,v] of Object.entries(filters)){
        if(!v) continue;
        if(k==="priceMin"&&item.price<+v) return false;
        if(k==="priceMax"&&item.price>+v) return false;
        if(k==="yearMin"&&item.year<+v) return false;
        if(k==="yearMax"&&item.year>+v) return false;
        if(k==="mileMin"&&item.mileage<+v) return false;
        if(k==="mileMax"&&item.mileage>+v) return false;
        if(["make","fuel","transmission","body","city","drive","color","euro","axles","seats","payload","motorType","material","partCat","vehicleType","condition"].includes(k)&&item[k]!==v) return false;
      }
      return true;
    });
    if(sortBy==="featured")    list=[...list].sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));
    else if(sortBy==="price_asc")  list=[...list].sort((a,b)=>a.price-b.price);
    else if(sortBy==="price_desc") list=[...list].sort((a,b)=>b.price-a.price);
    else if(sortBy==="year_desc")  list=[...list].sort((a,b)=>b.year-a.year);
    else if(sortBy==="newest")     list=[...list].sort((a,b)=>new Date(b.posted)-new Date(a.posted));
    return list;
  },[listings,activeCategory,search,filters,sortBy]);

  const navBtn=(p,label)=>(
    <button onClick={()=>setPage(p)} style={{...page===p?S.btnP("sm"):{...S.btnO("sm"),border:"none"},padding:"7px 12px",borderRadius:8,position:"relative"}}>
      {label}
      {p==="messages"&&unreadCount>0&&<span style={{position:"absolute",top:-4,right:-4,background:C.danger,color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{unreadCount}</span>}
    </button>
  );

  return(
    <div style={{...S.app,paddingBottom:compareIds.length>0?170:0}}>
      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerIn}>
          <div style={S.logo} onClick={()=>{setPage("home");setActiveCategory(null);setSearch("");setFilters({});}}>
            Auto<span style={S.logoAcc}>Skelbimai</span>
          </div>
          <div style={S.srchWrap}>
            <span style={S.srchIco}>🔍</span>
            <input style={S.srchIn} placeholder="Ieškoti: markė, modelis, miestas..." value={search} onChange={e=>{setSearch(e.target.value);setPage("home");}}/>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {user?(
              <>
                {navBtn("home","🏠")}
                {navBtn("saved","❤️"+(saved.length>0?` ${saved.length}`:""))}
                {navBtn("messages","✉️")}
                {navBtn("mylistings","📋")}
                <button style={{...S.btnP(),padding:"7px 14px"}} onClick={()=>{setEditItem(null);setShowAdd(true);}}>+ Skelbti</button>
                <div style={{display:"flex",alignItems:"center",gap:6,background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:"5px 10px",cursor:"pointer"}} onClick={()=>setUser(null)}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:800}}>{user.name.charAt(0).toUpperCase()}</div>
                  <span style={{fontSize:12,fontWeight:600,color:C.text}}>{user.name.split(" ")[0]}</span>
                </div>
              </>
            ):(
              <>
                <button style={S.btnO()} onClick={()=>openAuth("login")}>Prisijungti</button>
                <button style={S.btnP()} onClick={()=>openAuth("register")}>Registruotis</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* CATEGORY BAR — tik pagrindiniame puslapyje */}
      {page==="home"&&(
        <div style={S.catBar}>
          <div style={S.catIn}>
            <button style={S.catChip(!activeCategory)} onClick={()=>{setActiveCategory(null);setFilters({});}}>🏠 Visi</button>
            {CATEGORIES.map(c=>(
              <button key={c.id} style={S.catChip(activeCategory===c.id)} onClick={()=>{setActiveCategory(c.id);setFilters({});}}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={S.content}>
        {page==="saved"&&<SavedPage savedIds={saved} all={listings} onOpen={openItem} onUnsave={toggleSave}/>}
        {page==="messages"&&user&&<MessagesPage user={user} messages={messages} setMessages={setMessages}/>}
        {page==="mylistings"&&user&&<MyListingsPage user={user} listings={listings} onDelete={handleDelete} onEdit={item=>{setEditItem(item);setShowAdd(true);}} onOpen={openItem}/>}
        {page==="home"&&(
          <div style={S.layout}>
            <FilterSidebar category={activeCategory} filters={filters} onChange={setFilters} onReset={()=>setFilters({})}/>
            <div>
              {!user&&(
                <div style={{background:C.accentLight,border:`1px solid ${C.accent}33`,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                  <span style={{color:C.accent,fontSize:13,fontWeight:500}}>🔒 Prisijunkite norėdami skelbti, išsaugoti ir rašyti žinutes</span>
                  <div style={{display:"flex",gap:8}}>
                    <button style={S.btnO("sm")} onClick={()=>openAuth("login")}>Prisijungti</button>
                    <button style={S.btnP("sm")} onClick={()=>openAuth("register")}>Registruotis</button>
                  </div>
                </div>
              )}
              <RecentBar ids={recentIds} all={listings} onClick={openItem}/>
              <div style={S.resBar}>
                <span style={{color:C.textSub,fontSize:13}}><b style={{color:C.text}}>{filtered.length}</b> skelbim{filtered.length===1?"as":"ų"}{activeCategory&&` · ${CATEGORIES.find(c=>c.id===activeCategory)?.label}`}</span>
                <select style={{...S.fSelect,width:"auto",fontSize:12}} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                  <option value="featured">Rekomenduojami pirmiau</option>
                  <option value="newest">Naujausi pirmiau</option>
                  <option value="price_asc">Kaina ↑</option>
                  <option value="price_desc">Kaina ↓</option>
                  <option value="year_desc">Metai: naujausi</option>
                </select>
              </div>
              {filtered.length===0
                ?<div style={{textAlign:"center",padding:"60px 0"}}>
                  <div style={{fontSize:48,marginBottom:12}}>🔍</div>
                  <div style={{fontSize:16,fontWeight:600,color:C.textSub,marginBottom:6}}>Skelbimų nerasta</div>
                  <div style={{fontSize:13,color:C.textMuted}}>Pabandykite pakeisti filtrus</div>
                </div>
                :<div style={S.grid}>
                  {filtered.map(item=>(
                    <ListingCard key={item.id} item={item} onClick={openItem} saved={saved.includes(item.id)} onSave={toggleSave} compared={compareIds.includes(item.id)} onCompare={toggleCompare} user={user} onRequireAuth={()=>openAuth("login")}/>
                  ))}
                </div>
              }
            </div>
          </div>
        )}
      </div>

      {/* COMPARE */}
      <ComparePanel ids={compareIds} all={listings} onRemove={id=>setCompareIds(c=>c.filter(x=>x!==id))} onClear={()=>setCompareIds([])}/>

      {/* MODALS */}
      {selected&&<DetailModal item={selected} onClose={()=>setSelected(null)} user={user} onRequireAuth={()=>openAuth("login")} saved={saved.includes(selected?.id)} onSave={toggleSave} all={listings} onOpenSeller={item=>setSellerModal(item)}/>}
      {sellerModal&&<SellerModal sellerId={sellerModal.sellerId} sellerName={sellerModal.seller} sellerRating={sellerModal.sellerRating} sellerSales={sellerModal.sellerSales} all={listings} onClose={()=>setSellerModal(null)} onOpenListing={item=>{setSellerModal(null);openItem(item);}}/>}
      {showAdd&&<AddModal onClose={()=>{setShowAdd(false);setEditItem(null);}} onAdd={handleAdd} editItem={editItem} user={user}/>}
      {showAuth&&<AuthModal mode={authMode} onClose={()=>setShowAuth(false)} onAuth={handleAuth}/>}
    </div>
  );
}