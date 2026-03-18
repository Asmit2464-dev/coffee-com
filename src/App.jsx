import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Josefin+Sans:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream: #F7F0E3; --cream2: #EFE5D0; --parchment: #E8D9BC;
    --gold: #C9963A; --gold2: #E8B45A;
    --espresso: #1A0F06; --brown: #3D2010; --brown2: #5C3520;
    --muted: #8B6E52; --light-muted: #B89878;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'Josefin Sans', sans-serif; background: var(--cream); color: var(--espresso); overflow-x: hidden; }
  body::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.3;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
  }
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 60px; height: 72px; transition: all 0.5s ease;
  }
  nav.scrolled {
    background: rgba(247,240,227,0.93); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--parchment); box-shadow: 0 4px 30px rgba(60,20,0,0.07);
  }
  .logo { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase; color: var(--espresso); }
  .logo em { font-style: normal; color: var(--gold); }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a { font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.25s; position: relative; }
  .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; right: 100%; height: 1px; background: var(--gold); transition: right 0.3s ease; }
  .nav-links a:hover { color: var(--espresso); }
  .nav-links a:hover::after { right: 0; }
  .nav-btn { background: var(--espresso); color: var(--cream); border: none; padding: 11px 28px; font-family: 'Josefin Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
  .nav-btn:hover { background: var(--gold); color: var(--espresso); }
  .hero { min-height: 100vh; display: grid; grid-template-columns: 55% 45%; overflow: hidden; }
  .hero-l { padding: 130px 70px 80px; display: flex; flex-direction: column; justify-content: center; position: relative; }
  .eyebrow { display: flex; align-items: center; gap: 14px; font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 28px; }
  .eyebrow::before, .eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }
  h1.big { font-family: 'Cormorant Garamond', serif; font-size: clamp(68px, 7.5vw, 110px); font-weight: 300; line-height: 0.9; letter-spacing: -0.025em; color: var(--espresso); margin-bottom: 32px; }
  h1.big em { font-style: italic; color: var(--gold); display: block; }
  .hero-desc { font-size: 14px; font-weight: 300; letter-spacing: 0.04em; color: var(--muted); line-height: 1.95; max-width: 390px; margin-bottom: 48px; }
  .btns { display: flex; gap: 20px; align-items: center; }
  .btn-fill { background: var(--espresso); color: var(--cream); border: none; padding: 17px 42px; font-family: 'Josefin Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
  .btn-fill::after { content: ''; position: absolute; inset: 0; background: var(--gold); transform: translateX(-102%); transition: transform 0.4s cubic-bezier(.4,0,.2,1); }
  .btn-fill:hover::after { transform: translateX(0); }
  .btn-fill > span { position: relative; z-index: 1; }
  .btn-fill:hover > span { color: var(--espresso); }
  .btn-text { background: none; border: none; color: var(--muted); font-family: 'Josefin Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: color 0.25s; padding: 0; }
  .btn-text:hover { color: var(--espresso); }
  .hero-r { background: var(--espresso); position: relative; overflow: hidden; display: flex; flex-direction: column; }
  .cup-stage { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; }
  .ring { position: absolute; border-radius: 50%; border: 1px solid rgba(201,150,58,0.12); top: 50%; left: 50%; transform: translate(-50%,-50%); }
  .cup-body { width: 200px; height: 220px; background: linear-gradient(160deg, #4A2010 0%, #2A1008 100%); border-radius: 8px 8px 32px 32px; position: relative; box-shadow: 0 30px 80px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.05); overflow: hidden; }
  .cup-liquid { position: absolute; bottom: 0; left: 0; right: 0; height: 72%; background: radial-gradient(ellipse at 35% 20%, #9B5020 0%, #5C2A10 40%, #2A1008 100%); }
  .cup-foam { position: absolute; top: 0; left: 0; right: 0; height: 32%; background: linear-gradient(to bottom, rgba(230,190,140,0.25) 0%, transparent 100%); }
  .cup-shine { position: absolute; top: 12px; left: 12px; width: 20px; height: 60px; background: rgba(255,255,255,0.06); border-radius: 10px; transform: rotate(-15deg); }
  .saucer { width: 240px; height: 24px; background: linear-gradient(to bottom, #5C3520, #3D2010); border-radius: 50%; margin-top: -8px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
  .steam-wrap { position: absolute; top: 20%; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; }
  .stm { width: 2px; border-radius: 1px; background: rgba(247,240,227,0.3); animation: stm 2.8s ease-in-out infinite; transform-origin: bottom; }
  @keyframes stm { 0%{transform:scaleY(0) translateY(10px);opacity:0} 40%{opacity:1} 100%{transform:scaleY(1.3) translateY(-40px);opacity:0} }
  .hero-stats { display: grid; grid-template-columns: repeat(3,1fr); border-top: 1px solid rgba(201,150,58,0.18); }
  .stat { padding: 22px 16px; text-align: center; border-right: 1px solid rgba(201,150,58,0.12); }
  .stat:last-child { border-right: none; }
  .stat-n { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: var(--gold2); line-height: 1; }
  .stat-l { font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(247,240,227,0.35); margin-top: 4px; }
  .marquee-bar { background: var(--espresso); padding: 17px 0; overflow: hidden; border-top: 1px solid #2A1A0A; border-bottom: 1px solid #2A1A0A; }
  .marquee-inner { display: flex; animation: mq 24s linear infinite; }
  .mq-item { font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); padding: 0 36px; display: flex; align-items: center; gap: 14px; white-space: nowrap; }
  .mq-dot { color: var(--gold); font-size: 12px; }
  @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .about { display: grid; grid-template-columns: 1fr 1fr; }
  .about-img { background: var(--espresso); position: relative; min-height: 600px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .beans-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 10px; padding: 60px; }
  .bean { border-radius: 50%; background: radial-gradient(ellipse at 30% 25%, #7A4A20 0%, #3D1A08 60%, #1A0803 100%); position: relative; box-shadow: 2px 3px 10px rgba(0,0,0,0.6); transition: transform 0.3s; }
  .bean::after { content: ''; position: absolute; top: 50%; left: 50%; width: 1.5px; height: 55%; background: rgba(0,0,0,0.45); transform: translate(-50%,-50%); border-radius: 1px; }
  .beans-grid:hover .bean { transform: rotate(var(--r)); }
  .about-txt { padding: 80px 70px; display: flex; flex-direction: column; justify-content: center; }
  .section-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; display: flex; align-items: center; gap: 14px; }
  .section-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--gold); }
  h2.big { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px,4vw,62px); font-weight: 300; line-height: 1.1; color: var(--espresso); margin-bottom: 24px; letter-spacing: -0.01em; }
  h2.big em { font-style: italic; color: var(--gold); }
  .body-txt { font-size: 14px; font-weight: 300; color: var(--muted); line-height: 1.95; margin-bottom: 14px; letter-spacing: 0.02em; }
  .features-list { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
  .feat { display: flex; align-items: flex-start; gap: 18px; padding: 20px 22px; background: var(--cream2); border-left: 3px solid var(--gold); transition: all 0.3s; cursor: default; }
  .feat:hover { background: var(--parchment); transform: translateX(6px); }
  .feat-ico { font-size: 18px; margin-top: 1px; }
  .feat-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--espresso); margin-bottom: 3px; }
  .feat-sub { font-size: 12px; color: var(--muted); line-height: 1.65; letter-spacing: 0.02em; }
  .menu-section { padding: 100px 60px; background: var(--cream); }
  .menu-header { text-align: center; margin-bottom: 56px; }
  h2.menu-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(48px,5vw,80px); font-weight: 300; color: var(--espresso); letter-spacing: -0.02em; line-height: 1; margin-bottom: 14px; }
  h2.menu-title em { font-style: italic; color: var(--gold); }
  .menu-sub { font-size: 12px; color: var(--muted); letter-spacing: 0.06em; font-weight: 300; }
  .tabs { display: flex; justify-content: center; border-bottom: 1px solid var(--parchment); margin-bottom: 52px; }
  .tab { padding: 14px 26px; font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; position: relative; transition: color 0.25s; }
  .tab::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 100%; height: 2px; background: var(--gold); transition: right 0.3s ease; }
  .tab:hover { color: var(--espresso); }
  .tab.active { color: var(--espresso); }
  .tab.active::after { right: 0; }
  .mgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px,1fr)); gap: 2px; max-width: 1280px; margin: 0 auto; }
  .mcard { background: var(--cream2); padding: 34px 30px; position: relative; overflow: hidden; cursor: default; transition: all 0.4s cubic-bezier(.25,.8,.25,1); border: 1px solid transparent; }
  .mcard::before { content: ''; position: absolute; inset: 0; background: var(--espresso); transform: translateY(104%); transition: transform 0.5s cubic-bezier(.77,0,.175,1); z-index: 0; }
  .mcard:hover { border-color: var(--gold); }
  .mcard:hover::before { transform: translateY(0); }
  .mcard > * { position: relative; z-index: 1; }
  .ctop { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .cico { font-size: 30px; transition: transform 0.35s; }
  .mcard:hover .cico { transform: scale(1.18) rotate(-6deg); }
  .cbadge { font-size: 8px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; padding: 5px 12px; background: var(--espresso); color: var(--gold); transition: all 0.4s; }
  .mcard:hover .cbadge { background: var(--gold); color: var(--espresso); }
  .cname { font-family: 'Cormorant Garamond', serif; font-size: 23px; font-weight: 600; color: var(--espresso); margin-bottom: 8px; transition: color 0.4s; line-height: 1.2; }
  .mcard:hover .cname { color: var(--cream); }
  .cdesc { font-size: 12px; font-weight: 300; color: var(--muted); line-height: 1.8; letter-spacing: 0.02em; margin-bottom: 22px; transition: color 0.4s; }
  .mcard:hover .cdesc { color: rgba(247,240,227,0.55); }
  .cfoot { display: flex; justify-content: space-between; align-items: center; padding-top: 18px; border-top: 1px solid var(--parchment); transition: border-color 0.4s; }
  .mcard:hover .cfoot { border-color: rgba(201,150,58,0.25); }
  .cprice { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: var(--gold); }
  .cadd { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--parchment); background: transparent; color: var(--muted); font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; line-height: 1; }
  .mcard:hover .cadd { background: var(--gold); border-color: var(--gold); color: var(--espresso); }
  .testimonials { background: var(--espresso); padding: 100px 60px; position: relative; overflow: hidden; }
  .testimonials::before { content: '"'; font-family: 'Cormorant Garamond', serif; position: absolute; top: -60px; left: 30px; font-size: 500px; color: rgba(201,150,58,0.04); line-height: 1; pointer-events: none; font-weight: 300; }
  .test-hd { text-align: center; margin-bottom: 60px; }
  h2.test-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px,4vw,66px); font-weight: 300; color: var(--cream); letter-spacing: -0.02em; }
  h2.test-title em { font-style: italic; color: var(--gold); }
  .tgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; max-width: 1200px; margin: 0 auto; }
  .tcard { background: rgba(247,240,227,0.04); padding: 34px 30px; border: 1px solid rgba(201,150,58,0.14); transition: all 0.35s; }
  .tcard:hover { background: rgba(247,240,227,0.07); border-color: rgba(201,150,58,0.32); transform: translateY(-5px); }
  .tstars { color: var(--gold); font-size: 13px; letter-spacing: 3px; margin-bottom: 16px; }
  .tquote { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; font-style: italic; color: var(--cream2); line-height: 1.7; margin-bottom: 26px; }
  .tauthor { display: flex; align-items: center; gap: 14px; }
  .tavatar { width: 42px; height: 42px; border-radius: 50%; background: var(--brown2); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--gold2); font-weight: 600; flex-shrink: 0; }
  .tname { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: var(--light-muted); text-transform: uppercase; }
  .trole { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .visit-sec { display: grid; grid-template-columns: 1fr 1fr; }
  .visit-l { background: var(--espresso); padding: 80px 70px; display: flex; flex-direction: column; justify-content: center; }
  h2.visit-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(38px,4vw,60px); font-weight: 300; color: var(--cream); line-height: 1.1; margin-bottom: 44px; letter-spacing: -0.01em; }
  h2.visit-title em { font-style: italic; color: var(--gold); }
  .vlist { display: flex; flex-direction: column; gap: 22px; }
  .vitem { display: flex; gap: 18px; align-items: flex-start; }
  .vico { width: 42px; height: 42px; border: 1px solid rgba(201,150,58,0.3); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .vlabel { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
  .vval { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--cream2); font-weight: 300; }
  .visit-r { background: var(--cream2); display: flex; align-items: center; justify-content: center; padding: 60px; }
  .map-box { width: 100%; max-width: 400px; aspect-ratio: 1; background: var(--cream); border: 1px solid var(--parchment); position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .map-lines { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg,transparent,transparent 39px,var(--parchment) 40px), repeating-linear-gradient(90deg,transparent,transparent 39px,var(--parchment) 40px); }
  .map-road-h { position: absolute; height: 6px; background: var(--parchment); left: 0; right: 0; top: 50%; transform: translateY(-50%); }
  .map-road-v { position: absolute; width: 6px; background: var(--parchment); top: 0; bottom: 0; left: 40%; }
  .pin-wrap { position: relative; z-index: 2; text-align: center; }
  .pin-dot { width: 18px; height: 18px; background: var(--gold); border-radius: 50%; margin: 0 auto 10px; box-shadow: 0 0 0 8px rgba(201,150,58,0.18); animation: pulse 2.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 8px rgba(201,150,58,0.18)} 50%{box-shadow:0 0 0 18px rgba(201,150,58,0.06)} }
  .pin-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--espresso); }
  .pin-addr { font-size: 11px; color: var(--muted); margin-top: 3px; }
  footer { background: #100A03; padding: 60px 60px 28px; border-top: 1px solid #1E1008; }
  .ft { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 48px; padding-bottom: 40px; border-bottom: 1px solid #1E1008; }
  .fbrand { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cream2); margin-bottom: 14px; }
  .fbrand em { font-style: normal; color: var(--gold); }
  .fdesc { font-size: 12px; color: var(--muted); line-height: 1.85; font-weight: 300; max-width: 260px; }
  .fctitle { font-size: 9px; font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase; color: var(--gold); margin-bottom: 18px; }
  .flinks { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .flinks a { font-size: 12px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .flinks a:hover { color: var(--cream2); }
  .fb { display: flex; justify-content: space-between; align-items: center; }
  .fcopy { font-size: 11px; color: #3A2510; letter-spacing: 0.05em; }
  .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.25,.8,.25,1); }
  .fade-up.in { opacity: 1; transform: translateY(0); }
  @media (max-width: 900px) {
    .hero, .about, .visit-sec { grid-template-columns: 1fr; }
    nav { padding: 0 20px; }
    .nav-links { display: none; }
    .hero-l, .about-txt, .visit-l { padding: 100px 24px 60px; }
    .menu-section, .testimonials { padding: 70px 20px; }
    .tgrid { grid-template-columns: 1fr; }
    .ft { grid-template-columns: 1fr 1fr; }
    footer { padding: 48px 20px 24px; }
  }
`;

const CATS = ["All","Espresso","Cold Brew","Seasonal","Tea","Food"];
const MENU = [
  {id:1,cat:"Espresso",name:"Signature Espresso",desc:"Double ristretto, velvety crema, dark chocolate on the finish.",price:3.5,badge:"House Fav",ico:"☕"},
  {id:2,cat:"Espresso",name:"Flat White",desc:"Micro-foamed whole milk over tight ristretto pulls. Silky perfection.",price:5.0,badge:null,ico:"🥛"},
  {id:3,cat:"Espresso",name:"Caramel Macchiato",desc:"Vanilla, steamed milk, espresso layered, golden caramel drizzle.",price:6.0,badge:"Popular",ico:"☕"},
  {id:4,cat:"Espresso",name:"Cortado",desc:"Equal parts espresso and warm milk — the purist's choice.",price:4.5,badge:null,ico:"☕"},
  {id:5,cat:"Cold Brew",name:"Classic Cold Brew",desc:"Steeped 18 hours. Smooth, low-acid, over ice.",price:5.5,badge:"Best Seller",ico:"🧊"},
  {id:6,cat:"Cold Brew",name:"Nitro Cold Brew",desc:"Nitrogen-charged for a cascading creamy pour. No ice needed.",price:6.5,badge:"New",ico:"🫧"},
  {id:7,cat:"Cold Brew",name:"Vanilla Sweet Cream",desc:"Cold brew topped with our house vanilla sweet cream foam.",price:7.0,badge:"Popular",ico:"🧊"},
  {id:8,cat:"Seasonal",name:"Honey Lavender Latte",desc:"Espresso, oat milk, wildflower honey, French lavender.",price:7.5,badge:"Spring",ico:"🌸"},
  {id:9,cat:"Seasonal",name:"Brown Sugar Oat",desc:"Iced espresso, brown sugar syrup, oat milk, cinnamon.",price:7.0,badge:"Limited",ico:"🍂"},
  {id:10,cat:"Tea",name:"Matcha Latte",desc:"Ceremonial grade matcha whisked with steamed oat milk.",price:6.0,badge:null,ico:"🍵"},
  {id:11,cat:"Tea",name:"Chai Latte",desc:"House spiced chai, steamed milk, star anise garnish.",price:5.5,badge:"Cozy",ico:"🫖"},
  {id:12,cat:"Food",name:"Almond Croissant",desc:"Twice-baked, frangipane-filled, powdered sugar dusted.",price:5.0,badge:"Fresh Daily",ico:"🥐"},
  {id:13,cat:"Food",name:"Avocado Toast",desc:"Sourdough, smashed avocado, chili flakes, everything seasoning.",price:9.0,badge:null,ico:"🥑"},
  {id:14,cat:"Food",name:"Banana Walnut Loaf",desc:"Moist banana bread, toasted walnuts, honey glaze.",price:4.5,badge:"House Made",ico:"🍌"},
];
const TESTS=[
  {q:"The single-origin Ethiopian — I didn't know coffee could taste like blueberry jam. Life-changing doesn't cover it.",a:"Priya S.",r:"Regular since 2020",i:"PS"},
  {q:"More than a coffee shop. It's where I wrote two novel chapters, sealed three deals, and made real friends.",a:"Marcus T.",r:"Architect & Writer",i:"MT"},
  {q:"Nitro cold brew before a big pitch. The only ritual that actually works. Brûlée gets it.",a:"Leila K.",r:"Marketing Director",i:"LK"},
];
const MQ=["Single Origin Beans","In-House Roasting","Specialty Espresso","Cold Brew Craft","Artisan Pastries","Community Space","Direct Trade","Est. 2019"];

function Animate({children,delay=0}){
  const ref=useRef();const[v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.12});
    if(ref.current)o.observe(ref.current);return()=>o.disconnect();
  },[]);
  return <div ref={ref} className={`fade-up${v?" in":""}`} style={{transitionDelay:`${delay}ms`}}>{children}</div>;
}

function Card({item,i}){
  const ref=useRef();const[v,setV]=useState(false);const[added,setAdded]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.1});
    if(ref.current)o.observe(ref.current);return()=>o.disconnect();
  },[]);
  return(
    <div ref={ref} className="mcard fade-up" style={{transitionDelay:`${(i%4)*75}ms`,opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)"}}>
      <div className="ctop">
        <span className="cico">{item.ico}</span>
        {item.badge&&<span className="cbadge">{item.badge}</span>}
      </div>
      <div className="cname">{item.name}</div>
      <div className="cdesc">{item.desc}</div>
      <div className="cfoot">
        <span className="cprice">${item.price.toFixed(2)}</span>
        <button className="cadd" onClick={()=>setAdded(!added)}>{added?"✓":"+"}</button>
      </div>
    </div>
  );
}

const beans=Array.from({length:24},(_,i)=>({w:18+Math.random()*14,r:Math.random()*360,o:0.45+Math.random()*0.55}));

export default function App(){
  const[scrolled,setScrolled]=useState(false);
  const[tab,setTab]=useState("All");
  const menuRef=useRef();
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);
  },[]);
  const items=tab==="All"?MENU:MENU.filter(x=>x.cat===tab);
  return(
    <>
      <style>{style}</style>
      <nav className={scrolled?"scrolled":""}>
        <div className="logo">Brûl<em>é</em>e</div>
        <ul className="nav-links">
          <li><a href="#menu">Menu</a></li>
          <li><a href="#about">Story</a></li>
          <li><a href="#visit">Visit</a></li>
        </ul>
        <button className="nav-btn" onClick={()=>menuRef.current?.scrollIntoView({behavior:"smooth"})}>Order Now</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-l">
          <div className="eyebrow">Specialty Coffee House</div>
          <h1 className="big">Crafted<br/>for the<br/><em>Ritual.</em></h1>
          <p className="hero-desc">Every cup begins with intention — single-origin beans, roasted in small batches, brewed with precision. This is not just coffee. This is your moment.</p>
          <div className="btns">
            <button className="btn-fill" onClick={()=>menuRef.current?.scrollIntoView({behavior:"smooth"})}><span>Explore Menu</span></button>
            <button className="btn-text">Our Story →</button>
          </div>
        </div>
        <div className="hero-r">
          <div className="cup-stage">
            {[560,440,320,200].map((s,i)=><div key={i} className="ring" style={{width:s,height:s}}/>)}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",zIndex:2}}>
              <div className="steam-wrap">
                {[{h:38,d:0},{h:50,d:0.5},{h:42,d:0.25}].map((s,i)=>(
                  <div key={i} className="stm" style={{height:s.h,animationDelay:`${s.d}s`}}/>
                ))}
              </div>
              <div className="cup-body">
                <div className="cup-liquid"/>
                <div className="cup-foam"/>
                <div className="cup-shine"/>
              </div>
              <div className="saucer"/>
            </div>
          </div>
          <div className="hero-stats">
            {[["5+","Origins"],["100%","Arabica"],["18h","Cold Brew"]].map(([n,l])=>(
              <div key={l} className="stat"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-bar">
        <div className="marquee-inner">
          {[...MQ,...MQ,...MQ].map((t,i)=>(
            <span key={i} className="mq-item">{t}<span className="mq-dot">✦</span></span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-img">
          <div className="beans-grid">
            {beans.map((b,i)=>(
              <div key={i} className="bean" style={{width:b.w,height:b.w*1.5,transform:`rotate(${b.r}deg)`,opacity:b.o,"--r":`${b.r+20}deg`}}/>
            ))}
          </div>
        </div>
        <div className="about-txt">
          <Animate>
            <div className="section-eyebrow">Our Philosophy</div>
            <h2 className="big">Coffee is a<br/><em>conversation</em><br/>worth having.</h2>
            <p className="body-txt">We trace every bean back to the farmer who grew it. We cup every roast before it reaches you. We believe that what you put into a cup matters as much as the moment you sit down to drink it.</p>
            <p className="body-txt">Since 2019, we've been roasting on-site, building relationships with farms across Ethiopia, Colombia, and Guatemala.</p>
          </Animate>
          <Animate delay={150}>
            <div className="features-list">
              {[
                {ico:"◈",t:"Small Batch Roasting",s:"Roasted in-house every Tuesday & Friday. Never more than 72 hours old."},
                {ico:"✦",t:"Direct Trade",s:"We pay above fair-trade for beans from 7 carefully chosen partner farms."},
                {ico:"⊕",t:"Community First",s:"Communal tables, free wifi, private nooks. Stay as long as you like."},
              ].map((f,i)=>(
                <div key={i} className="feat">
                  <span className="feat-ico">{f.ico}</span>
                  <div><div className="feat-title">{f.t}</div><div className="feat-sub">{f.s}</div></div>
                </div>
              ))}
            </div>
          </Animate>
        </div>
      </section>

      {/* MENU */}
      <section className="menu-section" id="menu" ref={menuRef}>
        <Animate>
          <div className="menu-header">
            <div className="section-eyebrow" style={{justifyContent:"center"}}>What We Brew</div>
            <h2 className="menu-title">The <em>Full</em> Menu</h2>
            <p className="menu-sub">From the first pull of the morning to the last pour of evening</p>
          </div>
        </Animate>
        <div className="tabs">
          {CATS.map(c=><button key={c} className={`tab${tab===c?" active":""}`} onClick={()=>setTab(c)}>{c}</button>)}
        </div>
        <div className="mgrid">
          {items.map((item,i)=><Card key={item.id} item={item} i={i}/>)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <Animate>
          <div className="test-hd">
            <div className="section-eyebrow" style={{justifyContent:"center",color:"var(--gold)"}}>Real Regulars</div>
            <h2 className="test-title">Heard at the <em>counter</em></h2>
          </div>
        </Animate>
        <div className="tgrid">
          {TESTS.map((t,i)=>(
            <Animate key={i} delay={i*110}>
              <div className="tcard">
                <div className="tstars">★★★★★</div>
                <p className="tquote">"{t.q}"</p>
                <div className="tauthor">
                  <div className="tavatar">{t.i}</div>
                  <div><div className="tname">{t.a}</div><div className="trole">{t.r}</div></div>
                </div>
              </div>
            </Animate>
          ))}
        </div>
      </section>

      {/* VISIT */}
      <section className="visit-sec" id="visit">
        <div className="visit-l">
          <Animate>
            <div className="section-eyebrow" style={{color:"var(--gold)"}}>Find Us</div>
            <h2 className="visit-title">Always a<br/>seat <em>waiting</em><br/>for you.</h2>
            <div className="vlist">
              {[
                {ico:"📍",l:"Address",v:"12 Roast Lane, Brewton District"},
                {ico:"🕗",l:"Hours",v:"Mon–Fri 7am–8pm · Weekends 8am–6pm"},
                {ico:"📞",l:"Phone",v:"+1 (555) 987-3210"},
                {ico:"✉",l:"Email",v:"hello@brulee.coffee"},
              ].map((d,i)=>(
                <div key={i} className="vitem">
                  <div className="vico">{d.ico}</div>
                  <div><div className="vlabel">{d.l}</div><div className="vval">{d.v}</div></div>
                </div>
              ))}
            </div>
          </Animate>
        </div>
        <div className="visit-r">
          <div className="map-box">
            <div className="map-lines"/>
            <div className="map-road-h"/>
            <div className="map-road-v"/>
            <div className="pin-wrap">
              <div className="pin-dot"/>
              <div className="pin-name">Brûlée Coffee</div>
              <div className="pin-addr">12 Roast Lane</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="ft">
          <div>
            <div className="fbrand">Brûl<em>é</em>e</div>
            <p className="fdesc">Specialty coffee roasted in-house. A space to think, connect, and savour the moment. Est. 2019.</p>
          </div>
          {[
            {t:"Menu",ls:["Espresso","Cold Brew","Seasonal","Tea & Matcha","Food"]},
            {t:"Company",ls:["Our Story","Roastery","Sustainability","Press"]},
            {t:"Connect",ls:["Instagram","Newsletter","Wholesale","Careers"]},
          ].map(col=>(
            <div key={col.t}>
              <div className="fctitle">{col.t}</div>
              <ul className="flinks">{col.ls.map(l=><li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="fb">
          <span className="fcopy">© 2025 Brûlée Coffee. All rights reserved.</span>
          <span className="fcopy">Crafted with care ✦</span>
        </div>
      </footer>
    </>
  );
}