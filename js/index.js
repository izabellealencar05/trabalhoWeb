function getWeekDay() {
    const date = new Date();
    let days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[date.getDay()];
}

function getCurrentDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const locale = navigator.language;

    let formattedDate;
    switch (locale) {
        case 'en-US':
            formattedDate = `${month}/${day}/${year}`;
            break;
        case 'ja-JP':
            formattedDate = `${year}.${month}.${day}`;
            break;
        default:
            formattedDate = `${day}/${month}/${year}`;
    }

    return formattedDate;
}

function getCurrentTime() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function saveRegisterLocalStorage(register) {


    registerLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registerLocalStorage));
}
function getRegisterLocalStorage() {
    let registers = localStorage.getItem("register");

    if (!registers) {
        return [];
    }

    return JSON.parse(registers);
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationContent = document.getElementById("notification-content");


    notificationContent.textContent = message;

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentTime();
}

const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano"); 
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
const dialogPonto = document.getElementById("dialog-ponto");

const btnDialogFechar = document.getElementById("btn-dialog-fechar");

const btnDialogBaterPonto = document.getElementById("btn-dialog-bater-ponto");

const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

let dialogInterval;

let registerLocalStorage = getRegisterLocalStorage();

btnBaterPonto.addEventListener("click", function() {
    dialogPonto.showModal();

});

btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();

});

btnDialogBaterPonto.addEventListener("click", () => {

    let typeRegister = document.getElementById("tipos-ponto").value;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let info = {
                data: getCurrentDate(),
                hora: getCurrentTime(),
                id: 1,
                tipo: typeRegister,
                localizacao: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            };

            console.log(info); 

            saveRegisterLocalStorage(info);

            localStorage.setItem("lastTypeRegister", typeRegister);
            
            let message = `Ponto batido com sucesso às ${info.hora} no dia ${info.data} no momento ${info.tipo}`;
            showNotification(message);

            dialogPonto.close();
        });
    } else {
        console.log("Geolocalização não é suportada por este navegador.");
    }

});


dialogData.textContent = "Data: " + getCurrentDate();
dialogHora.textContent = "Hora: " + getCurrentTime();

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();
horaMinSeg.textContent = getCurrentTime();

setInterval(() => {
    printCurrentHour();
    
    if (dialogPonto.open) {
        dialogData.textContent = "Data: " + getCurrentDate();
        dialogHora.textContent = "Hora: " + getCurrentTime();
    }
}, 1000);
const inputData = document.getElementById("input-data");
inputData.max = getCurrentDate(); 

btnDialogBaterPonto.addEventListener("click", () => {
    let typeRegister = document.getElementById("tipos-ponto").value;
    let selectedDate = inputData.value || getCurrentDate(); 

    if (new Date(selectedDate) > new Date()) {
        alert("Não é permitido registrar pontos em datas futuras.");
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let info = {
                data: selectedDate, 
                hora: getCurrentTime(),
                id: 1,
                tipo: typeRegister,
                localizacao: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            };

            console.log(info); 

            saveRegisterLocalStorage(info);

            localStorage.setItem("lastTypeRegister", typeRegister);
            
            let message = `Ponto batido com sucesso às ${info.hora} no dia ${info.data} no momento ${info.tipo}`;
            showNotification(message);

            dialogPonto.close();
        });
    } else {
        console.log("Geolocalização não é suportada por este navegador.");
    }
});

function exibirRegistros() {
    const registros = getRegisterLocalStorage();
    const registrosContainer = document.getElementById("registros");
    registrosContainer.innerHTML = ''; 

    registros.forEach((registro) => {
        const divRegistro = document.createElement("div");
        divRegistro.className = registro.data === getCurrentDate() ? "registro-atual" : "registro-passado"; 

        divRegistro.innerHTML = `
            <p>Data: ${registro.data}</p>
            <p>Hora: ${registro.hora}</p>
            <p>Tipo: ${registro.tipo}</p>
            <p>Localização: ${registro.localizacao.latitude}, ${registro.localizacao.longitude}</p>
        `;
        
        registrosContainer.appendChild(divRegistro);
    });
}

document.addEventListener("DOMContentLoaded", exibirRegistros);
