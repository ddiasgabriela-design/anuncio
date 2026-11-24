document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('leadForm');
    if (!form) return; // Só roda na Landing Page

    // 1. Captura o parâmetro 'origem' da URL (ex: ?origem=banner_artigo)
    const urlParams = new URLSearchParams(window.location.search);
    const origem = urlParams.get('origem') || 'acesso_direto';
    document.getElementById('origemLead').value = origem;

    // 2. Máscara automática para WhatsApp
    const whatsInput = document.getElementById('whatsapp');
    whatsInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        if (value.length > 10) value = `${value.slice(0, 10)}-${value.slice(10)}`;
        e.target.value = value;
    });

    // 3. Validação e envio
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const whatsapp = whatsInput.value.trim();
        const destino = document.getElementById('destino').value;

        let isValid = true;
        ['erroNome', 'erroEmail', 'erroWhats'].forEach(id => {
            document.getElementById(id).textContent = '';
        });

        if (nome.length < 3) {
            document.getElementById('erroNome').textContent = 'Digite seu nome completo.';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('erroEmail').textContent = 'Digite um e-mail válido.';
            isValid = false;
        }

        if (whatsapp.length < 14) {
            document.getElementById('erroWhats').textContent = 'Digite um WhatsApp válido com DDD.';
            isValid = false;
        }

        if (!isValid) return;

        const novoLead = {
            nome, email, whatsapp, destino, origem,
            dataCadastro: new Date().toLocaleString('pt-BR')
        };

        // Salva no localStorage (simulando envio para um CRM)
        try {
            const leadsSalvos = JSON.parse(localStorage.getItem('leads_capturados')) || [];
            leadsSalvos.push(novoLead);
            localStorage.setItem('leads_capturados', JSON.stringify(leadsSalvos));
        } catch (err) {
            console.warn('Não foi possível salvar no localStorage:', err);
        }

        console.log('Lead capturado com sucesso:', novoLead);

        // Tela de agradecimento
        form.classList.add('hidden');
        document.querySelector('.lp-form-box h2').classList.add('hidden');
        document.getElementById('userNameSuccess').textContent = nome.split(' ')[0];
        document.getElementById('successBox').classList.remove('hidden');
    });
});
