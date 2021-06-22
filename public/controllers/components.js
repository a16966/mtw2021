const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//Fetch GET requestOptions
const requestOptions = {
    mode: 'cors',
    method: 'GET',
    headers: myHeaders,
    credentials: 'include'
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

const requestOptionsPOST = (data) => {
    return {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
        credentials: 'include'
    }
};

//Load Data
loadComponents();
async function loadComponents() {
        //Variables
        let conteudo = [];

        //Fetch
        const response = await fetch(url + "/components", requestOptions);
        const componentsList = await response.json();

        //Data to send to the table
        for (const component of componentsList) {
            const name = "[" + component.classCourse + "] " + component.className 
            conteudo.push([`<a id='${component._id}' name='${name}' onclick=loadComponentsClasses(this.id)><div id='${component._id}'>${name}</div></a>`,
            component.name,
            component.description,
            `<a id=${component._id} onclick=loadClassModal(this.id) data-toggle="modal"
            data-target="#updateClassModal"><i class="fa fa-pen text-primary" aria-hidden="true"></i></a>`,
            `<a id=${component._id} onclick=deleteClass(this.id)><i class="fa fa-trash text-danger" aria-hidden="true"></i></a>`
            ])
        }

        //Load data in table
        $(document).ready(function () {
            $('#dataTable').DataTable({
                data: conteudo,
                bDestroy: true
            });
        });

}

async function loadClassModal(id) {
    try {
        document.getElementById("updateClassBtn").id = id;
        //Fetch
        const response = await fetch(url + "/components/" + id, requestOptions);
        const classe = await response.json();
        document.getElementById('updateClassName').value = classe.name;
        document.getElementById('updateClassDesc').value = classe.description;
    } catch (error) {
        console.log("Erro: " + error);
    }
}



async function loadComponentsClasses(id) {
    try {
        //Variables
        let conteudo = [];

        if (!id) {
            $(document).ready(function () {
                $('#dataTable2').DataTable({
                    data: conteudo,
                    bDestroy: true
                });
            });
            return
        }

        //Fetch
        const response = await fetch(url + "/components/" + id, requestOptions);
        const components = await response.json();
        document.getElementById("studentName").innerHTML = "Avaliações da UC: " + document.getElementById(id).name

        //Data to send to the table
        for (const grade of components.grade) {
            console.log(grade)
            conteudo.push(["<div id='" + grade._id + "'>" + grade.student_number + "</div>",
            grade.name,
            grade.email,
            grade.grade
            ])
        }

        //Load data in table
        $(document).ready(function () {
            $('#dataTable2').DataTable({
                data: conteudo,
                bDestroy: true
            });
        });

        //Variables
        let conteudo2 = "";

        //Fetch
        const response2 = await fetch(url + "/classes/" + components.classId + "/students" , requestOptions);
        const students = await response2.json();
        //Data to send to combobox
        console.log(students)
        for (const student of students) {
            conteudo2 += `<option id=${student._id}>[${student.student_number}] ${student.name}</option>`
        }

        document.getElementById("fillStudentsBox").innerHTML = conteudo2

        //Variables
        let conteudo3 = "";

        //Fetch
        const response3 = await fetch(url + "/classes/" + components.classId + "/components" , requestOptions);
        const components2 = await response3.json();
        //Data to send to combobox
        console.log(components2)
        for (const component of components2) {
            conteudo3 += `<option id=${component._id}> ${component.name}</option>`
        }

        document.getElementById("fillComponentsBox").innerHTML = conteudo3

    } catch (error) {
        console.log("Erro: " + error);
    }
}


async function updateClass(id) {
    try {
        //Variables
        const updateClass = {
            name: document.getElementById('updateClassName').value,
            description: document.getElementById('updateClassDesc').value,
        }
        //Fetch
        await fetch(url + "/components/" + id, requestOptionsPUT(updateClass)).then(response => response.text())
            .then(result => {
                const tresult = JSON.parse(result)
                console.log(tresult)
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
    await fetch(url + "/components/" + id, requestOptionsDELETE).then(response => response.text())
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

const addNewClassEv = document.getElementById("addClassBtn");
addNewClassEv.addEventListener("click", evt => {
    createClass()
    async function createClass() {
        evt.preventDefault()
        try {
            //Variables
            const newClass = {
                name: document.getElementById('className').value,
                classId: document.getElementById("fillClassesBox").childNodes[0].id,
                description: document.getElementById('classDesc').value,
            }
            console.log(newClass)
            //Fetch
            await fetch(url + "/components", requestOptionsPOST(newClass)).then(response => response.text())
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


const avaliarClassEv = document.getElementById("avaliarBtn");
avaliarClassEv.addEventListener("click", evt => {
    createClass()
    async function createClass() {
        evt.preventDefault()
        try {
            //Variables
            const newClass = {
                grade: document.getElementById('studentGrade').value,
            }
            console.log(document.getElementById("fillStudentsBox").childNodes[0].id)
            const studentId = document.getElementById("fillStudentsBox").childNodes[0].id
            const componentId = document.getElementById("fillComponentsBox").childNodes[0].id
            //Fetch
            await fetch(url + "/components/" + componentId + "/student/" + studentId + "/grades" , requestOptionsPOST(newClass)).then(response => response.text())
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