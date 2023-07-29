const nome = localStorage.getItem('nome');
const segundos = localStorage.getItem('tempo');
const continuar = document.getElementById('continuar');
const texto = document.getElementById('texto');

texto.textContent = `Você fez em ${segundos} segundos! Parabéns ${nome}!`;
setTimeout(() => {
    texto.style.display = 'block';
}, 1000);

setTimeout(() => {
    continuar.style.display = 'block';
}, 3000);