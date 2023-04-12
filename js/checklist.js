;(function(){
    "use strict"

    const itemInput = document.getElementById("item-input")
    const checkAddForm = document.getElementById("check-add")
    const ul = document.getElementById("check-list")
    const lis = ul.getElementsByTagName("li")

    let arrTasks = getSavedData()

    function getSavedData() {
        let tasksData = localStorage.getItem("tasks")
        tasksData = JSON.parse(tasksData)

        return tasksData && tasksData.length ? tasksData : [
            {
                name: "Example",
                createAt: Date.now(),
                completed: false
            }
        ]
    }

    function setNewData() {
        localStorage.setItem("tasks", JSON.stringify(arrTasks))
    }
    setNewData()

    function generateLiTasks(obj) {
        const li = document.createElement("li")
        const p = document.createElement("p")
        const checkBtn = document.createElement("button")
        const editBtn = document.createElement("i")
        const deleteBtn = document.createElement("i")
        const containerEdit = document.createElement("div")
        const inputEdit = document.createElement("input")
        const containerEditBtn = document.createElement("button")
        const containerCancelBtn = document.createElement("button")

        li.className = 'check-item'
        p.className = 'task-name'
        checkBtn.className = 'button-check'
        checkBtn.innerHTML = `
        <i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkBtn"></i>`
        checkBtn.setAttribute("data-action", "checkBtn")
        editBtn.className = 'fas fa-edit'
        editBtn.setAttribute("data-action", "editBtn")
        deleteBtn.className = 'fas fa-trash-alt'
        deleteBtn.setAttribute("data-action", "deleteBtn")


        containerEdit.className = 'editContainer'
        inputEdit.setAttribute("type", "text")
        inputEdit.className = 'editInput'
        inputEdit.value = obj.name
        containerEdit.appendChild(inputEdit)

        containerEditBtn.className = 'editButton'
        containerEditBtn.textContent = 'Edit'
        containerEditBtn.setAttribute("data-action", "containerEditBtn")
        containerEdit.appendChild(containerEditBtn)

        containerCancelBtn.className = 'cancelButton'
        containerCancelBtn.textContent = 'Cancel'
        containerCancelBtn.setAttribute("data-action", "containerCancelBtn")
        containerEdit.appendChild(containerCancelBtn)


        p.textContent = obj.name

        li.appendChild(checkBtn)
        li.appendChild(p)
        li.appendChild(editBtn)
        li.appendChild(deleteBtn)
        li.appendChild(containerEdit)
        // addEventLi(li)
        return li
    }

    function renderTaks() {
        ul.innerHTML = ""
        arrTasks.forEach(taskObj => {
            ul.appendChild(generateLiTasks(taskObj))
        })
    }

    function addTask(task) {
        arrTasks.push({
            name: task,
            createAt: Date.now(),
            completed: false
        })
        setNewData()
    }

    function clickedUl(e) {
        const dataAction = e.target.getAttribute("data-action")

        if (!dataAction) return

        let currentLi = e.target
        while (currentLi.nodeName !== "LI") {
            currentLi = currentLi.parentElement
        }

        const currentLiIndex = [...lis].indexOf(currentLi)


        const actions = {
            editBtn: function () {
                const containerInputEdit = currentLi.querySelector(".editInput")
                const editContainer = currentLi.querySelector(".editContainer");
                [...ul.querySelectorAll(".editContainer")].forEach(container => {
                    container.removeAttribute("style")
                });
                editContainer.style.display = "flex"
                containerInputEdit.focus()
            },
            containerEditBtn: function () {
                const val = currentLi.querySelector(".editInput").value
                if (val !== "") {
                    arrTasks[currentLiIndex].name = val
                }
                renderTaks()
                setNewData()
            },
            containerCancelBtn: function () {
                currentLi.querySelector(".editContainer").removeAttribute("style")
            },
            deleteBtn: function() {
                arrTasks.splice(currentLiIndex, 1)
                renderTaks()
                setNewData()
                // currentLi.remove()
                // currentLi.parentElement.removeChild(currentLi)

            },
            checkBtn: function(){
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed

                if (arrTasks[currentLiIndex].completed) {
                    currentLi.querySelector(".fa-check").classList.remove("displayNone")
                } else {
                    currentLi.querySelector(".fa-check").classList.add("displayNone")
                }
                renderTaks()
                setNewData()
            }
        }

        if (actions[dataAction]) {
            actions[dataAction]()
        }
    }

    checkAddForm.addEventListener("submit", function (e) {
        e.preventDefault()
        console.log(itemInput.value)
        if (itemInput.value !== "") {
            addTask(itemInput.value)
        }
        renderTaks()

       itemInput.value = ""
       itemInput.focus()
    });

    ul.addEventListener("click", clickedUl)

    renderTaks()
})()