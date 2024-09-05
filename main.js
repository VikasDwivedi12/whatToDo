function clearContents(){
    //Function to clear the contents that are already presented to the main display.
    const container = document.querySelector('.main-display');
    container.innerHTML = '';
}

function showIndications(btn1, btn2){
    //Function to show the indications for the buttons provided in the arguments.
    btn1.style.backgroundColor = "cornflowerblue";
    btn1.style.color = "white";
    btn1.style.cursor = "none";

    btn2.style.backgroundColor = "rgb(205, 205, 205)";
    btn2.style.color = "black";
    btn2.style.cursor = "pointer";
}

function generateError(inputArray, paragraph){
    //Function to generate the error
    for(let i = 0; i < inputArray.length; i++){
        if(inputArray[i].value === ''){
            paragraph.innerHTML = 'Inputs cannot be null';
            return 1;
        }
    }
    paragraph.innerHTML = '';
    return 0;
}

function checkExisting(localStorageName, userTitle, errorElement){
    //Function to check if the parameter already exists in the local Storage.
    let targetData = JSON.parse(localStorage.getItem(localStorageName)) || [];

    if(targetData.length > 0){
        for(let i = 0; i < targetData.length; i++){
            if(targetData[i].task === userTitle){
                errorElement.innerHTML = 'Title already existing';
                return 1;
            }
            errorElement.innerHTML = '';
        }
        return 0;
    }
    return 0;
}

function addTaskToLocal(taskName){
    //Function to add task data to the local storage.
    let targetData = JSON.parse(localStorage.getItem('toDoData')) || [];
    let newTaskObject = {"task" : taskName, "status" : 0};
    targetData.push(newTaskObject);

    localStorage.setItem("toDoData", JSON.stringify(targetData));
}

function toggleCheckUncheck(taskName){
    //Function to toggle check uncheck.
    let localData = JSON.parse(localStorage.getItem("toDoData")) || [];
    for(let i = 0; i < localData.length; i++){
        if(localData[i].task === taskName){
            if(localData[i].status === 1){
                localData[i].status = 0;
            }
            else{
                localData[i].status = 1;
            }
            break;
        }
    }
    localStorage.setItem("toDoData", JSON.stringify(localData));
}

function delTaskFromLocal(taskName){
    //Function to delete task from local storage.
    let localData = JSON.parse(localStorage.getItem("toDoData")) || [];
    let index;

    for(let i = 0; i < localData.length; i++){
        if(localData[i].task === taskName){
            index = i;
            break;
        }
    }

    if(index !== -1){
        localData.splice(index, 1);
    }
    localStorage.setItem("toDoData", JSON.stringify(localData));
}

function checkExistingTaskWhileEdit(taskName){
    //Function to check for the existing task for the edit.
    let localData = JSON.parse(localStorage.getItem('toDoData')) || [];

    if(localData.length > 0){
        for(let i = 0; i < localData.length; i++){
            if(localData[i].task === taskName){
                return 1;
            }
        }
        return 0;
    }
    return 0;
}

function deleteNullTaskFromLocal(){
    //Function to delete the null task.
    let localData = JSON.parse(localStorage.getItem("toDoData")) || [];

    for(let i = 0; i < localData.length; i++){
        if(localData[i].task === null){
            localData.splice(i, 1);
        }
    }

    localStorage.setItem("toDoData", JSON.stringify(localData));
}

function editTaskToLocalStorage(taskName){
    //Function to edit the task to the local storage.
    let localData = JSON.parse(localStorage.getItem('toDoData')) || [];

    for(let i = 0; i < localData.length; i++){
        if(localData[i].task === taskName){
            while(1){
                const newName = prompt("Enter the new task name : ");
                if(newName === localData[i].task){
                    localData[i].task = newName;
                    break;
                }
                else if(newName !== ''){
                    const existsStatus = checkExistingTaskWhileEdit(newName);
                    if(existsStatus === 0){
                        localData[i].task = newName;
                        break;
                    }
                    else{
                        alert("Task already exists.");
                    }
                }
                else{
                    alert("Task cannot be null.");
                }
            }
            break;
        }
    }
    
    localStorage.setItem("toDoData", JSON.stringify(localData));
    deleteNullTaskFromLocal();
}

function createTaskCards(mainContainer){
    //Function to create task cards by the data in localstorage.
    mainContainer.innerHTML = '';
    const taskHolder = document.createElement('div');
    taskHolder.className = 'taskHolder';
    mainContainer.appendChild(taskHolder);

    let targetData = JSON.parse(localStorage.getItem('toDoData')) || [];

    for(let i = 0; i < targetData.length; i++){
        const taskCard = document.createElement('div');
        taskCard.className = 'taskCard';
        let option;
        let background;

        if(targetData[i].status === 0){
            background = 'cornflowerblue';
            option = '<i class="fa-solid fa-check checkUncheckBtn"></i>';
        }
        else if(targetData[i].status === 1){
            background = 'lightgreen';
            option = '<i class="fa-solid fa-xmark checkUncheckBtn"></i>';
        }

        taskCard.innerHTML = `
        <h2>${targetData[i].task}</h2>
        <div class="btn-container">
        ${option}
        <i class="fa-solid fa-trash delBtn"></i>
        <i class="fa-solid fa-pen-to-square editBtn"></i>
        </div>
        `;

        const checkUncheckBtn = taskCard.querySelector('.checkUncheckBtn');
        const delBtn = taskCard.querySelector('.delBtn');
        const editBtn = taskCard.querySelector('.editBtn');

        checkUncheckBtn.addEventListener('click', function(){
            toggleCheckUncheck(targetData[i].task);
            mainContainer.innerHTML = '';
            createTaskCards(mainContainer);
        })

        delBtn.addEventListener('click', function(){
            delTaskFromLocal(targetData[i].task);
            mainContainer.innerHTML = '';
            createTaskCards(mainContainer);
        })

        editBtn.addEventListener('click', function(){
            editTaskToLocalStorage(targetData[i].task);
            mainContainer.innerHTML = '';
            createTaskCards(mainContainer);
        })

        taskCard.style.backgroundColor = background;
        taskHolder.appendChild(taskCard);
    }
}

const notesBtn = document.querySelector('#notesBtn');
const toDoBtn = document.querySelector('#toDoBtn');
const container = document.querySelector('.main-display');

toDoBtn.addEventListener('click', function(){
    clearContents();
    showIndications(toDoBtn, notesBtn);

    //Code to add to do Input section.
    const todoInput = document.createElement('div');
    todoInput.className = 'todoInput';
    todoInput.innerHTML = `
    <input type="text" placeholder="Enter the task" id="taskName">
    <button id="submitBtn" class="btnStyle">Add Task</button>
    <p id="error"></p>
    <div class="taskContainer"></div>
    `;
    container.appendChild(todoInput);
    const taskContainer = todoInput.querySelector('.taskContainer');
    createTaskCards(taskContainer);

    //Adding functionality to the submit button.
    const submitBtn = document.querySelector('#submitBtn');

    submitBtn.addEventListener('click', function(){
        const errorElement = document.querySelector('#error');
        const taskName = document.querySelector('#taskName');
        const voidStatus = generateError([taskName], errorElement);

        if(voidStatus === 0){
            const existStatus = checkExisting("toDoData", taskName.value, errorElement);
            if(existStatus === 0){
                addTaskToLocal(taskName.value);
                createTaskCards(taskContainer);
                taskName.value = '';
            }
        }
    })
})

//---------------------------------- Operation with Notes starts here ------------------------------

function checkExistingNote(localStorageName, userTitle, errorElement){
    //Function to check if the parameter already exists in the local Storage.
    let targetData = JSON.parse(localStorage.getItem(localStorageName)) || [];

    if(targetData.length > 0){
        for(let i = 0; i < targetData.length; i++){
            if(targetData[i].title === userTitle){
                errorElement.innerHTML = 'Title already existing';
                return 1;
            }
            errorElement.innerHTML = '';
        }
        return 0;
    }
    return 0;
}

function addNotesToLocal(title, content){
    //Function to add notes to local storage.
    let notesData = JSON.parse(localStorage.getItem("notesData")) || [];
    let newNote = {"title": title, "content": content};

    notesData.push(newNote);
    localStorage.setItem("notesData", JSON.stringify(notesData));
}

function deleteNotesFromLocal(title){
    //Function to delete notes from the local storage.
    let localData = JSON.parse(localStorage.getItem("notesData")) || [];
    let index;

    for(let i = 0; i < localData.length; i++){
        if(localData[i].title === title){
            index = i;
            break;
        }
    }

    if(index !== -1){
        localData.splice(index, 1);
    }

    localStorage.setItem("notesData", JSON.stringify(localData));
}

function checkExistingWhileEdit(localStorageName, userTitle){
    //Function to check if the title exists in the local storage.
    let targetData = JSON.parse(localStorage.getItem(localStorageName)) || [];

    if(targetData.length > 0){
        for(let i = 0; i < targetData.length; i++){
            if(targetData[i].title === userTitle){
                return 1;
            }
        }
        return 0;
    }
    return 0;
}

function deleteNullNotesFromLocalStorage(){
    //Function to delete the nodes whose content is null from the local storage.
    let localData = JSON.parse(localStorage.getItem("notesData")) || [];

    for(let i = 0; i < localData.length; i++){
        if((!localData[i].title) || (!localData[i].content)){
            localData.splice(i, 1);
        }
    }

    localStorage.setItem("notesData", JSON.stringify(localData));
}

function editNoteToLocal(title){
    //Function to edit notes and contents to the local storage.
    let localData = JSON.parse(localStorage.getItem("notesData")) || [];

    for(let i = 0; i < localData.length; i++){
        if(localData[i].title === title){
            ///Checking if the input values are not null.
            while(1){
                const newTitle = prompt("Enter the new title : ");
                if(newTitle !== ''){
                    const existsStatus = checkExistingWhileEdit("notesData", newTitle);
                    if((localData[i].title === newTitle) && (existsStatus === 1)){
                        localData[i].title = newTitle;
                        while(1){
                            const newContent = prompt("Enter the new content : ");
                            if(newContent !== ''){
                                localData[i].content = newContent;
                                break;
                            }
                            else{
                                alert("Content cannot be null");
                            }
                        }
                        break;
                    }
                    else if(existsStatus === 0){
                        localData[i].title = newTitle;
                        while(1){
                            const newContent = prompt("Enter the new content : ");
                            if(newContent !== ''){
                                localData[i].content = newContent;
                                break;
                            }
                            else{
                                alert("Content cannot be null");
                            }
                        }
                        break;
                    }
                    else{
                        alert("Title already exists.");
                    }
                }
                else{
                    alert("Title cannot be null.");
                }
            }
        }
    }

    localStorage.setItem("notesData", JSON.stringify(localData));
    deleteNullNotesFromLocalStorage();
}

function createNoteCard(mainContainer){
    mainContainer.innerHTML = '';

    let localData = JSON.parse(localStorage.getItem("notesData")) || [];

    for(let i = 0; i < localData.length; i++){
        const newTaskCard = document.createElement("div");
        newTaskCard.className = "newTaskCard";
        newTaskCard.innerHTML = `
        <div class="dataContainer">
        <h3>${localData[i].title}</h3>
        <p>${localData[i].content}</p>
        </div>
        <div class="buttonControls">
        <i class="fa-solid fa-trash delBtn"></i>
        <i class="fa-solid fa-pen-to-square editBtn"></i>
        </div>
        `;

        const delBtn = newTaskCard.querySelector(".delBtn");
        const editBtn = newTaskCard.querySelector(".editBtn");

        //Adding functionality to the delete button
        delBtn.addEventListener('click', function(){
            deleteNotesFromLocal(localData[i].title);
            createNoteCard(mainContainer);
        })

        //Adding functionality to edit button
        editBtn.addEventListener('click', function(){
            editNoteToLocal(localData[i].title);
            createNoteCard(mainContainer);
        })

        mainContainer.appendChild(newTaskCard);
    }
}

notesBtn.addEventListener('click', function(){
    clearContents();
    showIndications(notesBtn, toDoBtn);

    //Code to add notes input section.
    const notesInput = document.createElement('div');
    notesInput.className = 'notesInput';
    notesInput.innerHTML = `
    <input type="text" placeholder="Enter the title" id="notesTitle"><br>
    <textarea rows="7" cols="20" placeholder="Enter the notes content" id="notesContent"></textarea><br>
    <p id="error"></p>
    <button id="submitBtn" class="btnStyle">Create Note</button>
    <div class="notesContainer"></div>
    `;
    container.appendChild(notesInput);

    //code to generate notes card for the local storage data.
    let mainContainer = document.querySelector('.notesContainer');
    createNoteCard(mainContainer); 

    const submitBtn = document.querySelector('#submitBtn');

    submitBtn.addEventListener('click', function(){
        const errorElement = document.querySelector("#error");
        const noteTitle = document.querySelector("#notesTitle");
        const noteContent = document.querySelector("#notesContent");
        const voidStatus = generateError([noteTitle, noteContent], errorElement);
        
        if(voidStatus === 0){
            const existStatus = checkExistingNote("notesData", noteTitle.value, errorElement);
            if(existStatus === 0){
                addNotesToLocal(noteTitle.value, noteContent.value);
                createNoteCard(mainContainer);
                noteTitle.value = '';
                noteContent.value = '';
            }
        }
    })
})