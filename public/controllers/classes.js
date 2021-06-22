//Fetch Headers
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//Fetch GET requestOptions
const requestOptions = {
    mode: 'cors',
    method: 'GET',
    headers: myHeaders,
    credentials: 'include'
};

//Fetch POST requestOptions
const requestOptionsPOST = (data) => {
    return {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
        credentials: 'include'
    }
};

//Fetch PUT requestOptions
const requestOptionsPUT = (data) => {
    return {
        mode: 'cors',
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(data),
        credentials: 'include'
    }
};

//Fetch DELETE requestOptions
const requestOptionsDELETE = {
    mode: 'cors',
    method: 'DELETE',
    headers: myHeaders,
    credentials: 'include'
};

//Load Data
loadClasses();
async function loadClasses() {
    try {
        //Variables
        let conteudo = [];

        //Fetch
        const response = await fetch(url + "/classes", requestOptions);
        const classesList = await response.json();

        //Data to send to the table
        for (const classe of classesList) {
            conteudo.push(["<div id='" + classe._id + "'>" + classe.name + "</div>",
            classe.course,
            classe.description,
            classe.year,
            `<a id=${classe._id} onclick=loadClassModal(this.id) data-toggle="modal"
            data-target="#updateClassModal"><i class="fa fa-pen text-primary" aria-hidden="true"></i></a>`,
            `<a id=${classe._id} onclick=deleteClass(this.id)><i class="fa fa-trash text-danger" aria-hidden="true"></i></a>`
            ])
        }

        //Load data in table
        $(document).ready(function () {
            $('#dataTable').DataTable({
                data: conteudo,
                bDestroy: true
            });
        });

    } catch (error) {
        console.log("Erro: " + error);
    }
}

async function loadClassModal(id) {
    try {
        document.getElementById("updateClassBtn").id = id;

        //Fetch
        const response = await fetch(url + "/classes/" + id, requestOptions);
        const classe = await response.json();
        console.log(classe.class)
        document.getElementById('updateClassName').value = classe.class.name;
        document.getElementById('updateClassCourse').value = classe.class.course;
        document.getElementById('updateClassDesc').value = classe.class.description;
        document.getElementById('updateClassYear').value = classe.class.year;

    } catch (error) {
        console.log("Erro: " + error);
    }
}

//Event Listeners
const addNewClassEv = document.getElementById("addClassBtn");
addNewClassEv.addEventListener("click", evt => {
    createClass()
    async function createClass() {
        evt.preventDefault()
        try {
            //Variables
            const newClass = {
                name: document.getElementById('className').value,
                course: document.getElementById('classCourse').value,
                description: document.getElementById('classDesc').value,
                year: document.getElementById('classYear').value,
            }
            console.log(newClass)
            //Fetch
            await fetch(url + "/classes", requestOptionsPOST(newClass)).then(response => response.text())
                .then(result => {
                    const tresult = JSON.parse(result)
                    if (tresult.status >= 200 && tresult.status < 300) {
                        Swal.fire({
                            icon: 'success',
                            title: tresult.msg,
                            showConfirmButton: false,
                            timer: 1600,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        }).then(() => {
                            location.reload()
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: tresult.msg,
                            showConfirmButton: false,
                            timer: 1600,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                    }
                }).catch(error => console.log('error', error))
        } catch (error) {
            console.log("Erro: " + error);
        }
    }
});

//OTHERS
async function updateClass(id) {
    try {
        //Variables
        const updateClass = {
            name: document.getElementById('updateClassName').value,
            course: document.getElementById('updateClassCourse').value,
            description: document.getElementById('updateClassDesc').value,
            year: document.getElementById('updateClassYear').value,
        }
        //Fetch
        await fetch(url + "/classes/" + id, requestOptionsPUT(updateClass)).then(response => response.text())
            .then(result => {
                const tresult = JSON.parse(result)
                if (tresult.status >= 200 && tresult.status < 300) {
                    Swal.fire({
                        icon: 'success',
                        title: tresult.msg,
                        showConfirmButton: false,
                        timer: 1600,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    }).then(() => {
                        location.reload()
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: tresult.msg,
                        showConfirmButton: false,
                        timer: 1600,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                }
            }).catch(error => console.log('error', error))
    } catch (error) {
        console.log("Erro: " + error);
    }
}

async function deleteClass(id) {
    await fetch(url + "/classes/" + id, requestOptionsDELETE).then(response => response.text())
        .then(result => {
            const tresult = JSON.parse(result)
            if (tresult.status >= 200 && tresult.status < 300) {
                Swal.fire({
                    icon: 'success',
                    title: tresult.msg,
                    showConfirmButton: false,
                    timer: 1600,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                }).then(() => {
                    location.reload()
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: tresult.msg,
                    showConfirmButton: false,
                    timer: 1600,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
            }
        }).catch(error => console.log('error', error))
}