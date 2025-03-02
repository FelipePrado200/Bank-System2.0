class ContaBancaria {
    constructor(titular, saldo = 0) {
        this.titular = titular;
        this.saldo = saldo;
        this.historico = [];
    }

    depositar(valor) {
        if (valor > 0) {
            this.saldo += valor;
            this.historico.push(`Depósito: +R$${valor.toFixed(2)}`);
            return `Você fez o depósito de R$${valor.toFixed(2)} na sua conta.`;
        } else {
            return 'Seu depósito deve ser positivo.';
        }
    }

    sacar(valor) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            this.historico.push(`Saque: -R$${valor.toFixed(2)}`);
            return `Você sacou R$${valor.toFixed(2)} da sua conta.`;
        } else if (valor <= 0) {
            return 'O valor do saque deve ser positivo e maior que zero.';
        } else {
            return 'Você não tem saldo suficiente em sua conta bancária.';
        }
    }

    transferir(valor, contaDestino) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor; 
            contaDestino.saldo += valor; 
            this.historico.push(`Transferência para ${contaDestino.titular}: -R$${valor.toFixed(2)}`);
            contaDestino.historico.push(`Transferência de ${this.titular}: +R$${valor.toFixed(2)}`);
            return `Transferência de R$${valor.toFixed(2)} para ${contaDestino.titular} realizada.`;
        } else if (valor <= 0) {
            return 'O valor da transferência deve ser positivo e maior que zero.';
        } else {
            return 'Você não tem saldo suficiente para realizar a transferência.';
        }
    }

    mostrarValor() {
        if (this.saldo < 0) {
            return `Seu saldo está negativo: R$ ${this.saldo.toFixed(2)}`;
        } else {
            return `O valor em sua conta é de R$ ${this.saldo.toFixed(2)}`;
        }
    }

    mostrarHistorico() {
        return this.historico;
    }
}

let contaUsuario;
let contas = {};

function criarUsuario() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        if (contas[username]) {
            alert('Usuário já existe. Faça login ou escolha outro nome de usuário.');
            return;
        }

        contas[username] = new ContaBancaria(username);
        alert(`Usuário ${username} criado com sucesso!`);

        login();
    } else {
        alert('Por favor, insira um nome de usuário e uma senha.');
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        if (!contas[username]) {
            alert('Usuário não encontrado. Crie uma conta primeiro.');
            return;
        }

        contaUsuario = contas[username];
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        document.getElementById('titular-nome').innerText = username;
        atualizarHistorico();
    } else {
        alert('Por favor, insira usuário e senha.');
    }
}
function logout() {

    contaUsuario = null;

    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('resultado').innerText = '';
    document.getElementById('historico').innerHTML = '';

    alert('Você foi deslogado com sucesso!');
}

function sacar() {
    const valor = parseFloat(document.getElementById('valor').value);
    if (!isNaN(valor)) {
        document.getElementById('resultado').innerText = contaUsuario.sacar(valor);
        atualizarHistorico();
    } else {
        alert('Por favor, insira um valor válido.');
    }
}

function depositar() {
    const valor = parseFloat(document.getElementById('valor').value);
    if (!isNaN(valor)) {
        document.getElementById('resultado').innerText = contaUsuario.depositar(valor);
        atualizarHistorico();
    } else {
        alert('Por favor, insira um valor válido.');
    }
}

function transferir() {
    const valor = parseFloat(document.getElementById('valor').value);

    if (isNaN(valor)) {
        alert('Por favor, insira um valor válido para a transferência.');
        return;
    }

    if (valor <= 0) {
        alert('O valor da transferência deve ser maior que zero.');
        return;
    }

    const destinatariosValidos = Object.keys(contas).filter(nome => nome !== contaUsuario.titular);
    if (destinatariosValidos.length === 0) {
        alert('Não há destinatários disponíveis para transferência.');
        return;
    }

    alert(`Destinatários válidos: ${destinatariosValidos.join(', ')}`);
    const destinatario = prompt('Digite o nome do destinatário:');

    if (!destinatario || !contas[destinatario]) {
        alert('Destinatário inválido. Verifique o nome e tente novamente.');
        return;
    }

    if (valor > contaUsuario.saldo) {
        alert('Você não tem saldo suficiente para realizar essa transferência.');
        return;
    }

    const mensagem = contaUsuario.transferir(valor, contas[destinatario]);
    document.getElementById('resultado').innerText = mensagem;
    atualizarHistorico();
}

function consultarSaldo() {
    document.getElementById('resultado').innerText = contaUsuario.mostrarValor();
}

function atualizarHistorico() {
    const historico = contaUsuario.mostrarHistorico();
    const historicoLista = document.getElementById('historico');
    historicoLista.innerHTML = historico.map(item => `<li>${item}</li>`).join('');
}