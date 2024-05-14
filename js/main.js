let name = '';

let game = {
    game: []
}

let panel = "start"
let nav = () => {               
    document.onclick = (e) => {
        e.preventDefault();
        switch (e.target.id) {
        case "startGame":
            go('fight', 'd-block');
            break;
        case "restart":
            go('fight', 'd-block');
            $('.elements').remove();
            $('#fight').append(`<div class="elements"></div>`)
            break;
        }
    }
}

let go = (page, attribute) => {
    let pages = ['select', 'fight', 'results'];
    panel = page;
    $(`#${page}`).attr('class', attribute);
    pages.forEach(e => {
        if (page != e)
            $(`#${e}`).attr('class', 'd-none');
    })
}

let checkName = () => {
    name = $(`#nameInput`).val().trim();
    if (name != ""){
        localStorage.setItem('userName', name)
        $(`#startGame`).attr('disabled', false);
    } else {
        $(`#startGame`).attr('disabled', true)
    }
}

let startLoop = () => {
    let inter = setInterval(()=>{
        if(panel !== "start"){
            clearInterval(inter);
        }
        //checkName();
    }, 100);
}

let checkStorage = () => {
    if(localStorage.getItem('userName') != null){
        $(`#nameInput`).val(localStorage.getItem('userName'));
    }
}