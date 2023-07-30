window.onload = () => {
    const input = document.getElementById('nome');
    const popup = document.getElementById('popup');
    const button = document.getElementById('botao');
    const iniciar = document.getElementById('botao2');
    const link = "jogo.html";
    let ja = false;

    button.addEventListener('click', () => {
        const nome = input.value;
        localStorage.setItem('nome', nome);
        window.location.href = link;
    });
    iniciar.addEventListener('click', () => {
        if (popup.style.display == 'none'){
            popup.style.display = 'block';
        }
        else{
            popup.style.display = 'none';
        }
    });
};