document.addEventListener('DOMContentLoaded', () => {
    const nome = localStorage.getItem('nome');
});

const tela = document.getElementById('tela');
const elNerd = document.getElementById('nerd');
const camera = document.getElementById('camera');
const coracoes = document.querySelectorAll('.coracao');

const largTela = window.innerWidth;
const velocidade = 2;

const tempoDeInvencibilidade = 2 * 1000;
const tempoDePulo = 1.2 * 1000;
const intervaloSpawnBillyJoe = 5 * 1000;

let xAtual = parseFloat(elNerd.style.left) || 0;

let segundos = 0;
let estaPulando = false;
let estaAndandoDireita = false;
let estaAndandoEsquerda = false;


function salvarTempoNoLocalStorage() {
    localStorage.setItem('tempo', segundos);
}

function apagarClasses(classe){
    const quantClasses = classe.classList.length;
    let i = 0;
    for(i=0; i < quantClasses; i++){
        if (classe.classList.item(i) != 'nerd-pulando'){
            classe.classList.remove(classe.classList.item(i));
        }   
    }
}

function atualizarPosicao() {
    if (estaAndandoDireita) {
        xAtual += velocidade;
    } else if (estaAndandoEsquerda) {
        xAtual -= velocidade;
    }
    if (estaPulando) {
        if (estaAndandoDireita) {
            apagarClasses(elNerd);
            elNerd.classList.add('nerd-direita');
        } 
        else if (estaAndandoEsquerda) {
            apagarClasses(elNerd);
            elNerd.classList.add('nerd-esquerda');
        }
    }
    
    camera.style.left = `${xAtual}px`;
}

window.addEventListener('unload', salvarTempoNoLocalStorage);

requestAnimationFrame(() => {
    document.addEventListener('keydown', (event) => {

        if(!estaAndandoEsquerda){
            if (event.key == 'ArrowLeft'){
                andarEsquerda();
                console.log('andou p esquerda');
            }
        }
        if(!estaAndandoDireita){
            if (event.key == 'ArrowRight'){
                andarDireita();
                console.log('andou p direita');
            }
        }
        if(!estaPulando){
            if (event.key == 'ArrowUp'){
                pular();
            }
        }
        if (event.key == 'ArrowDown'){
            console.log('parou');
            pararAndar();
        }
        else{
            console.log(event.key);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key == 'ArrowLeft') {
            estaAndandoEsquerda = false;
            if (estaAndandoDireita) {
                andarDireita();
            } else {
                pararAndar();
            }
        }
        if (event.key == 'ArrowRight') {
            estaAndandoDireita = false;
            if (estaAndandoEsquerda) {
                andarEsquerda();
            } else {
                pararAndar();
            }
        }
    });

    // touches...

    document.addEventListener('touchstart', (event) => {
        const touchX = event.touches[0].clientX; // posição X do primeiro toque
  
        // se o toque ocorreu na metade direita da tela
        if (touchX > largTela / 2) {
          estaAndandoDireita = true;
          andarDireita();
          console.log('andou p direita');
        } else {
          estaAndandoEsquerda = true;
          andarEsquerda();
          console.log('andou p esquerda');
        }
    });

    document.addEventListener('touchend', () => {
        estaAndandoEsquerda = false;
        estaAndandoDireita = false;
        pararAndar();
        console.log('parou o movimento');
    });

    // fim dos touches

    function andarDireita(){
        estaAndandoDireita = true;
        estaAndandoEsquerda = false;
        apagarClasses(elNerd);
        elNerd.classList.add('nerd-direita');
    }
    function andarEsquerda(){
        estaAndandoDireita = false;
        estaAndandoEsquerda = true;
        apagarClasses(elNerd);
        elNerd.classList.add('nerd-esquerda');
    }
    function pararAndar(){
        apagarClasses(elNerd);
        elNerd.classList.add('nerd-parado');
    }
    function pular(){
        if (estaPulando) {
            return;
        }
        estaPulando = true;
        apagarClasses(elNerd);
        elNerd.classList.add("nerd-pulando");
    
        setTimeout(() => {
            estaPulando = false;
            elNerd.classList.remove('nerd-pulando');
            elNerd.classList.add("nerd-parado");
        }, tempoDePulo);
    }


    function animar() {
        atualizarPosicao();
        requestAnimationFrame(animar);
    }

    animar();
});

let invencivel = false;
let tamanho = coracoes.length - 1; 
function causarDanoAoNerd(){
    if (tamanho <= 0){   
        window.location.href = "gameover.html";
    }
    coracoes[tamanho].remove();  // retirar coração
    --tamanho;
    invencivel = true;

    console.log('removi um coraçao');
    setTimeout(() => {invencivel = false;}, tempoDeInvencibilidade);
}

function verificarColisao(el1, el2){
    if (!el1 || !el2){
        return false;
    }
    const ret1 = el1.getBoundingClientRect();
    const ret2 = el2.getBoundingClientRect();

    const colisaoX = ret1.left < ret2.right - 20 && ret1.right > ret2.left + 20;
    const colisaoY = ret1.top < ret2.bottom - 20 && ret1.bottom > ret2.top + 20;

    const colisao = colisaoX && colisaoY;
    return colisao;
}

function verificarTodasColisoes(){
    // todos os elementos a serem verificados
    const elBillyJoe = tela.querySelectorAll('.billyjoe');
    const elTiro = tela.querySelector('.tiro');

    // actual verification
    const colisaoTiro = verificarColisao(elNerd, elTiro);
    const colisaoBillyjoes = () => {
        for(let i=0; i < elBillyJoe.length; i++){
            if (verificarColisao(elNerd, elBillyJoe[i])){
                return true;
            }
        }
        return false;
    };

    if (!invencivel)
    {   if (colisaoTiro){
            console.log('colidiu com o tiro!');
            causarDanoAoNerd();
        }
        if (colisaoBillyjoes()){
            console.log('colidiu com o esqueleto!');
            causarDanoAoNerd();
        }
    }
    requestAnimationFrame(verificarTodasColisoes);
}


function spawnarInimigo(){
    const numeroAleatorio = Math.floor(Math.random() * largTela);
    console.log('o numero aleatorio é', numeroAleatorio); // ok

    let esqueletao = document.createElement('div');
    esqueletao.classList.add('billyjoe');
    esqueletao.style.left = `${numeroAleatorio}px`;

    tela.appendChild(esqueletao);
}

function spawnarBoss(){

    const msc = new Audio('godofwar2.mp3');
    let pimentao = document.createElement('div');
    pimentao.id = 'boss';

    tela.appendChild(pimentao);
    
    tela.style.backgroundImage = 'url(bg2.jpg)';
    document.body.style.backgroundColor = 'red';
    msc.play();
    
    // atira a cada 2s
    setInterval(() => {
        bossAtirar(pimentao);
    }, 2000);


    // spawna um billyjoe a cada x segundos
    const intervalo = setInterval(spawnarInimigo, intervaloSpawnBillyJoe);
    setTimeout(() => {
        clearInterval(intervalo);
      }, 25000); // 25 segundos depois ele para (5 billys spawnados)


    // começa um timer
    function atualizarTimer() {
        segundos++;
        const contadorElemento = document.getElementById('contador');
        contadorElemento.textContent = segundos + ' Segundos';
    }
    setInterval(atualizarTimer, 1000);
    
}

function bossAtirar(boss){
    const elTiro = document.createElement('div');

    let leftValor = boss.offsetLeft;
    elTiro.classList.add('tiro');
    elTiro.style.left = `${leftValor}px`;

    tela.appendChild(elTiro);

    setTimeout(() => {
        elTiro.remove(); 
        // vai esperar 2 segundos e apagar a div
    }, 2000);
}

// Código Foreal

requestAnimationFrame(verificarTodasColisoes);
