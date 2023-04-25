const login_form = document.getElementById('login_form');

login_form.addEventListener('submit', evt=>{
    evt.preventDefault();

    const data = new URLSearchParams();
    for (const pair of new FormData(evt.target)) {
        data.append(pair[0], pair[1]);
    }

    fetch('http://localhost:8080/api/sessions/login', {
        method: 'POST',
        body: data
    })
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'error'){
                location.href = `/login?validation=${data.message.valCode}`;
            }else{
                location.href = '/';
            }
        })
})