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
loadStudentsNotes();
async function loadStudentsNotes() {
    try {
        //Variables
        let conteudo = [];

        //Fetch
        const response = await fetch(url + "/students-notes", requestOptions);
        const studentsNotes = await response.json();

        //Data to send to the table
        for (const studentNote of studentsNotes) {
            const firstRow = "[" + studentNote.studentNumber + "] " + studentNote.studentName
            conteudo.push(["<div id='" + studentNote._id + "'>" + firstRow + "</div>",
            studentNote.description,
            studentNote.date,
            `<a id=${studentNote._id} onclick=loadNoteModal(this.id) data-toggle="modal"
            data-target="#updateNoteModal"><i class="fa fa-pen text-primary" aria-hidden="true"></i></a>`,
            `<a id=${studentNote._id} onclick=deleteNote(this.id)><i class="fa fa-trash text-danger" aria-hidden="true"></i></a>`
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

loadClassesNotes();
async function loadClassesNotes() {
    try {
        //Variables
        let conteudo = [];

        //Fetch
        const response = await fetch(url + "/classes-notes", requestOptions);
        const classesNotes = await response.json();

        //Data to send to the table
        for (const classNote of classesNotes) {
            const firstRow = "[" + classNote.classCourse + "] " + classNote.className
            conteudo.push(["<div id='" + classNote._id + "'>" + firstRow + "</div>",
            classNote.description,
            classNote.date,
            `<a id=${classNote._id} onclick=loadNoteModal(this.id) data-toggle="modal"
            data-target="#updateNoteModal"><i class="fa fa-pen text-primary" aria-hidden="true"></i></a>`,
            `<a id=${classNote._id} onclick=deleteNote(this.id)><i class="fa fa-trash text-danger" aria-hidden="true"></i></a>`
            ])
        }

        //Load data in table
        $(document).ready(function () {
            $('#dataTable2').DataTable({
                data: conteudo,
                bDestroy: true
            });
        });

    } catch (error) {
        console.log("Erro: " + error);
    }
}

async function loadNoteModal(id) {
    try {
        console.log(id)
        document.getElementById("updateNoteBtn").id = id;

        //Fetch
        const response = await fetch(url + "/notes/" + id, requestOptions);
        const note = await response.json();
        document.getElementById('updateNoteDesc').value = note.description;

    } catch (error) {
        console.log("Erro: " + error);
    }
}

loadComboClasses()
async function loadComboClasses() {
    try {
        //Variables
        let conteudo = "";

        //Fetch
        const response = await fetch(url + "/classes", requestOptions);
        const classes = await response.json();

        //Data to send to combobox
        for (const classe of classes) {
            conteudo += `<option id=${classe._id}>[${classe.course}] ${classe.name}</option>`
        }

        document.getElementById("fillClassesBox").innerHTML = conteudo

    } catch (error) {
        console.log("Erro: " + error);
    }
}

loadComboStudents()
async function loadComboStudents() {
    try {
        //Variables
        let conteudo = "";

        //Fetch
        const response = await fetch(url + "/students", requestOptions);
        const students = await response.json();
        //Data to send to combobox
        for (const student of students) {
            conteudo += `<option id=${student._id}>[${student.student_number}] ${student.name}</option>`
        }

        document.getElementById("fillStudentsBox").innerHTML = conteudo

    } catch (error) {
        console.log("Erro: " + error);
    }
}

//Event Listeners
const addNewSNoteEv = document.getElementById("addSNoteBtn");
addNewSNoteEv.addEventListener("click", evt => {
    createClass()
    async function createClass() {
        evt.preventDefault()
        try {
            //Variables
            const newSNote = {
                description: document.getElementById('sNoteDesc').value,
            }
            const studentId = document.getElementById("fillStudentsBox").childNodes[0].id
            //Fetch
            await fetch(url + "/students/" + studentId + "/notes", requestOptionsPOST(newSNote)).then(response => response.text())
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

const addNewCNoteEv = document.getElementById("addCNoteBtn");
addNewCNoteEv.addEventListener("click", evt => {
    createClass()
    async function createClass() {
        evt.preventDefault()
        try {
            //Variables
            const newCNote = {
                description: document.getElementById('cNoteDesc').value,
            }
            const classId = document.getElementById("fillClassesBox").childNodes[0].id
            //Fetch
            await fetch(url + "/classes/" + classId + "/notes", requestOptionsPOST(newCNote)).then(response => response.text())
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
async function updateNote(id) {
    try {
        //Variables
        const updateNote = {
            description: document.getElementById('updateNoteDesc').value
        }
        console.log(updateNote)
        //Fetch
        await fetch(url + "/notes/" + id, requestOptionsPUT(updateNote)).then(response => response.text())
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

async function deleteNote(id) {
    await fetch(url + "/notes/" + id, requestOptionsDELETE).then(response => response.text())
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