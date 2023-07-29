window.onload = () => {
    const input = document.getElementById('nome');
    const button = document.getElementById('botao');
    const link = "jogo.html";

    button.addEventListener('click', () => {
        const nome = input.value;
        localStorage.setItem('nome', nome);
        window.location.href = link;
    });
};