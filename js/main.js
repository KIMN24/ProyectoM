const reflections=[
{title:"Un verano invencible",author:"Albert Camus",quote:"En medio del invierno, descubrí que había en mí un verano invencible.",body:"No todos los días tienen que ser bonitos para que la vida siga siendo hermosa. Incluso en tus días más grises, hay algo en ti que ninguna tristeza puede apagar, aunque ahora te cueste reconocerlo."},
{title:"Lo que sí está en nuestras manos",author:"Marco Aurelio",quote:"No siempre podemos controlar lo que sucede a nuestro alrededor, pero podemos aprender a decidir cómo enfrentarlo."},
{title:"Las cosas pequeñas",author:"Epicuro",quote:"La felicidad no consiste en tenerlo todo, sino en aprender a disfrutar de aquello que hace valiosa nuestra existencia.",body:"A veces buscamos una gran razón para vivir y olvidamos que la vida también está hecha de cosas pequeñas: una conversación inesperada, una canción que nos conmueve, una tarde tranquila o la compañía de alguien con quien podemos ser nosotros mismos."},
{title:"Vivir, incluso sin respuestas",author:"Søren Kierkegaard",quote:"La vida no es un problema que deba resolverse, sino una realidad que debe experimentarse."}
,
{title:"A tu propio ritmo",author:"Para ti",quote:"También estás avanzando cuando te das tiempo para respirar.",body:"No tienes que resolverlo todo hoy. Puedes ir despacio, cambiar de rumbo y descansar cuando lo necesites. Tu camino no pierde valor por llevar un ritmo distinto al de los demás."}
];function shuffle(items){for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}return items}const items=shuffle([...Array.from({length:15},(_,i)=>({kind:"imagen",title:"Un pedacito para ti",src:"assets/images/recuerdo-"+String(i+1).padStart(2,"0")+".jpg"})),...reflections.map(r=>({kind:"reflexión",...r}))]);const field=document.querySelector("#papers"),overlay=document.querySelector("#overlay"),content=document.querySelector("#paper-content"),heading=document.querySelector("#paper-title"),kind=document.querySelector("#paper-kind");let active=0,lastFocus=null;items.forEach((item,i)=>{const paper=document.createElement("button");paper.className="paper";paper.type="button";paper.style.setProperty("--angle",((i*13)%11-5)+"deg");paper.style.setProperty("--delay",(-i*.37)+"s");paper.style.setProperty("--paper",["#fff9ef","#f0e5f6","#e6eadf","#fceaf0"][i%4]);paper.style.zIndex=i%4+1;paper.setAttribute("aria-label","Abrir "+(item.kind==="imagen"?"imagen "+(i+1):item.title));if(item.src){const img=document.createElement("img");img.src=item.src;img.alt="Imagen con mensaje para ti";img.loading="lazy";img.onerror=()=>{img.style.display="none";const s=document.createElement("span");s.className="mini-title";s.textContent="Recuerdo "+(i+1);paper.append(s)};paper.append(img)}else{const s=document.createElement("span");s.className="symbol";s.textContent="✿";const label=document.createElement("span");label.className="mini-label";label.textContent=item.author;const t=document.createElement("span");t.className="mini-title";t.textContent=item.title;paper.append(s,label,t)}paper.addEventListener("click",()=>open(i));field.append(paper)});function open(i){active=(i+items.length)%items.length;const item=items[active];if(overlay.hidden)lastFocus=document.activeElement;kind.textContent=item.kind==="imagen"?"Un pequeño recuerdo":item.author;heading.textContent=item.kind==="imagen"?"Para ti ♡":item.title;content.replaceChildren();if(item.src){const img=document.createElement("img");img.src=item.src;img.alt="Mensaje visual "+(active+1);content.append(img)}else{const q=document.createElement("blockquote");q.textContent="«"+item.quote+"»";content.append(q);if(item.body){const p=document.createElement("p");p.textContent=item.body;content.append(p)}}overlay.hidden=false;document.body.classList.add("modal-open");document.querySelector("#close").focus({preventScroll:true});document.querySelector(".reading-paper").scrollTop=0}function close(){overlay.hidden=true;document.body.classList.remove("modal-open");lastFocus?.focus()}document.querySelector("#random-paper").addEventListener("click",()=>open(Math.floor(Math.random()*items.length)));document.querySelector("#close").addEventListener("click",close);document.querySelector("[data-close]").addEventListener("click",close);document.querySelector("#previous").addEventListener("click",()=>open(active-1));document.querySelector("#next").addEventListener("click",()=>open(active+1));document.addEventListener("keydown",e=>{if(overlay.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowRight")open(active+1);if(e.key==="ArrowLeft")open(active-1);if(e.key==="Tab"){const controls=[...overlay.querySelectorAll("button")];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});

const audio = document.querySelector("#background-music");
const musicHint = document.querySelector("#music-hint");
audio.volume = .55;
let waitingForInteraction = true;

function stopAutomaticStart() {
  waitingForInteraction = false;
  document.removeEventListener("pointerdown", startOnInteraction);
  document.removeEventListener("keydown", startOnInteraction);
}

function startOnInteraction(event) {
  if (!waitingForInteraction) return;
  // Let the native player handle its own controls.
  if (event.target === audio) {
    stopAutomaticStart();
    return;
  }
  if (event.type === "keydown" && !["Enter", " "].includes(event.key)) return;
  audio.play().catch(() => {});
}

audio.addEventListener("play", stopAutomaticStart);
audio.addEventListener("playing", () => {
  musicHint.textContent = "Puedes pausar la música desde el reproductor ♡";
});
audio.addEventListener("pause", () => {
  musicHint.textContent = "Música en pausa. Pulsa reproducir cuando quieras ♡";
});
audio.addEventListener("error", () => {
  stopAutomaticStart();
  musicHint.textContent = "No se pudo cargar la música. Puedes seguir explorando las hojas ♡";
});
document.addEventListener("pointerdown", startOnInteraction);
document.addEventListener("keydown", startOnInteraction);
audio.play().catch(() => {
  if (waitingForInteraction && !audio.error) {
    musicHint.textContent = "Toca la página o pulsa reproducir para escuchar la música ♡";
  }
});