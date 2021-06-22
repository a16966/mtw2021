const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//Fetch GET requestOptions
const requestOptions = {
    mode: 'cors',
    method: 'GET',
    headers: myHeaders,
    credentials: 'include'
};

//Load Data
loadStudents();
async function loadStudents() {
    try {
        //Variables
        let conteudo = [];

        //Fetch
        const response = await fetch(url + "/students", requestOptions);
        const studentList = await response.json();

        //Data to send to the table
        for (const student of studentList) {
            conteudo.push(["<a id=" + student._id + " onclick=loadStudentClasses(this.id)><div id='" + student._id + "'>" + student.student_number + "</div></a>",
            student.name,
            student.email
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

loadStudentClasses()
async function loadStudentClasses(id) {
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
        const response = await fetch(url + "/students/" + id, requestOptions);
        const student = await response.json();

        document.getElementById("studentName").innerHTML = "UCs do aluno: [" + student.student.student_number + "] " + student.student.name

        //Data to send to the table
        for (const classe of student.classes) {
            conteudo.push(["<div id='" + classe._id + "'>" + classe.name + "</div>",
            classe.course,
            classe.year
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
            conteudo += `<option id=${classe._id}>${classe.name}</option>`
        }

        document.getElementById("fillClassesBox").innerHTML = conteudo

    } catch (error) {
        console.log("Erro: " + error);
    }
}

// Event handler executed when a file is selected
const onSelectFile = () => refreshBD(document.getElementById("csvStudent").files[0]);
// RefreshStudentDB
const refreshBDs = document.getElementById("uptadeBDBtn");
refreshBDs.addEventListener("click", onSelectFile);

async function refreshBD(ficheiro) {
    const formData = new FormData();
    formData.append('students', ficheiro);

    const classId = document.getElementById("fillClassesBox").childNodes[0].id

    fetch(url + '/classes/' + classId + "/upload-students", {
        method: 'POST',
        body: formData
    })
        .then(function (response) {
            console.log(response);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(async function (result) {
            console.log(result.status)
            if (result.status >= 200 && result.status < 300) {
                Swal.fire({
                    icon: 'success',
                    title: result.msg,
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
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: result.msg,
                    showConfirmButton: false,
                    timer: 1600,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

            }
        });
}