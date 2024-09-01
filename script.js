//OBJECTIVES : Handle the local storage for the to do list.

const notesBtn = document.getElementById('notes-btn');
const todoBtn = document.getElementById('todo-btn');
const displayArea = document.querySelector('.container');

function clearContents() {
    //Clears the content of the display area.
    document.querySelector('.container').innerHTML = '';
}

function addIndications(btnName) {
    //adding indications to the passed button.
    btnName.style.backgroundColor = 'cornflowerblue';
    btnName.style.color = 'cornsilk';
    btnName.style.cursor = 'none';
}

function removeIndications(btnName) {
    //removing indications for the passed button.
    btnName.style.backgroundColor = `rgb(218, 218, 199)`;
    btnName.style.color = 'black';
    btnName.style.cursor = 'pointer';
}

function initialTriggers(addBtn, remBtn) {
    //Triggers the common functionality when the button is clicked.
    clearContents();
    addIndications(addBtn);
    removeIndications(remBtn);
    displayArea.classList.add('functional');
}

//This function is not working as expected.
function checkValues(inputArray, instructArray, errorString) {
    //checks if the element reference in the array is empty or not.
    //If empty, prompts for the new values as inputs.
    const totalInputs = inputArray.length;

    for (let i = 0; i < totalInputs; i++) {
        if (inputArray[i].textContent === '') {
            alert(`ERROR encountered as : ${errorString}`);
            let newInput = '';
            while (1) {
                newInput = prompt(`${instructArray[i]} : `);
                if (newInput !== '') {
                    inputArray[i].textContent = newInput;
                    break;
                }
            }
        }
    }

    for (let i = 0; i < totalInputs; i++) {
        if (inputArray[i].textContent === '') {
            return 1;
        }
    }
    return 0;
}

//Function to add data for the new note to the localStorage
function addNoteToLocal(newObject){
    //Why this function is giving error?
    let notesData = JSON.parse(localStorage.getItem("notesData")) || [];
    notesData.push(newObject);
    localStorage.setItem("notesData", JSON.stringify(notesData));
}

//Function to edit the note card data to the local storage.
function editLocalStorage(prevNoteTitle, prevNoteContent, newNoteTitle, newNoteContent){
    let notesData = JSON.parse(localStorage.getItem("notesData")) || [];
    for(let i = 0; i < notesData.length; i++){
        // Logging the values being compared
        console.log(`Comparing Titles: "${notesData[i].noteTitle}" === "${prevNoteTitle}"`);
        console.log(`Comparing Contents: "${notesData[i].noteContent}" === "${prevNoteContent}"`);

        //The below if statement never satisfy.
        if((notesData[i].noteTitle === prevNoteTitle) && (notesData[i].noteContent === prevNoteContent)){
            notesData[i].noteTitle = newNoteTitle;
            notesData[i].noteContent = newNoteContent;
            break;
        }
    }

    localStorage.setItem("notesData", JSON.stringify(notesData));
}

//Function to remove the data from the localStorage.
function removeFromLocal(noteTitle, noteContent){
    let notesData = JSON.parse(localStorage.getItem("notesData")) || [];
    let index;
    
    //Finding out the index of the note to be removed.
    for(let i = 0; i < notesData.length; i++){
        if(notesData[i].noteTitle === noteTitle && notesData[i].noteContent === noteContent){
            index = i;
            break;
        }
    }

    if(index > -1){
        notesData.splice(index, 1);
    }

    localStorage.setItem("notesData", JSON.stringify(notesData));
}

//Function to create a new note element.
function createNewNoteCard(parentElement, notesTitle, notesContent){
    const notesCard = document.createElement('div');
    notesCard.className = 'notesCard';
    notesCard.innerHTML = `
    <h3>${notesTitle}</h3>
    <p>${notesContent}</p>
    <div class="btn-controls">
        <i class="fa-solid fa-trash removeBtn"></i>
        <i class="fa-solid fa-pen-to-square editBtn"></i>
    </div>
    `

    const removeBtn = notesCard.querySelector('.removeBtn');
    const editBtn = notesCard.querySelector('.editBtn');

    removeBtn.addEventListener('click', function () {
        const targetElement = (removeBtn.parentElement).parentElement;
        parentElement.removeChild(targetElement);
        notesTitle = ((removeBtn.parentElement).previousElementSibling).previousElementSibling;
        notesContent = (removeBtn.parentElement).previousElementSibling;
        removeFromLocal(notesTitle.textContent, notesContent.textContent);
    })

    editBtn.addEventListener('click', function () {
        const newTitle = prompt('Enter the new title : ');
        const newContent = prompt('Enter the new content : ');

        const title = notesCard.querySelector('h3');
        const content = notesCard.querySelector('p');

        const prevTitle = title.textContent;
        const prevContent = content.textContent;

        title.textContent = newTitle;
        content.textContent = newContent;
        let InputStatus = checkValues([title, content], ['Enter the new title', 'Enter the new content'], 'Values cannot be null.');

        if (InputStatus === 1) {
            const targetElement = (removeBtn.parentElement).parentElement;
            parentElement.removeChild(targetElement);
            removeFromLocal(prevTitle, prevContent);
        }
        else{
            editLocalStorage(prevTitle, prevContent, newTitle, newContent);
        }
    })

    parentElement.appendChild(notesCard);
}

//Function to return an object that contains information of the local notes data.
function getLocalStorageData(){
    const localData = JSON.parse(localStorage.getItem('notesData')) || [];
    if(localData.length > 0){
        return localData;
    }
    return false;
}

let errorStatus = 0;
notesBtn.addEventListener('click', function () {
    initialTriggers(notesBtn, todoBtn);
    let errorElement;

    //Creating an Input area for the Notes
    const inputField = document.createElement('div');
    inputField.className = 'notes-style';
    inputField.innerHTML = `
        <form>
            <input type="text" placeholder="Enter the title" id="titleInput"><br>
            <textarea rows="30" columns="10" placeholder="Enter the notes content" id="contentInput"></textarea><br>
            <button id="submit-btn">Create Note</button>
        </form>
    `
    displayArea.appendChild(inputField);

    const notesBox = document.createElement('div');
    notesBox.className = 'notesBox';
    displayArea.appendChild(notesBox);

    //Generating the NoteCards for the data already present in localStorage.
    let localStorageData = getLocalStorageData();

    if(localStorageData){
        for(let i = 0; i < localStorageData.length; i++){
            createNewNoteCard(notesBox, localStorageData[i].noteTitle, localStorageData[i].noteContent);
        }
    }

    //Adding functionality to the submit-btn
    const submitBtn = inputField.querySelector('#submit-btn');
    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();
        
        const notesTitleInput = inputField.querySelector('#titleInput');
        const notesContentInput = inputField.querySelector('#contentInput');

        const notesTitle = notesTitleInput.value;
        const notesContent = notesContentInput.value;

        if(notesTitle !== '' && notesContent !== ''){
            createNewNoteCard(notesBox, notesTitle, notesContent);
            addNoteToLocal({"noteTitle": notesTitle, "noteContent": notesContent});

            notesTitleInput.value = '';
            notesContentInput.value = '';

            if(errorStatus === 1){
                inputField.removeChild(errorElement);
                errorStatus = 0;
            }
        }        
        else {
            if(errorStatus === 0){
                console.error('Error : Values cannot be null.');
                errorElement = document.createElement('p');
                errorElement.className = 'errorElement';
                errorElement.textContent = 'Note title and content cannot be null.';
                inputField.appendChild(errorElement);
                errorStatus = 1
            }
        }
    })
})

todoBtn.addEventListener('click', function () {
    initialTriggers(todoBtn, notesBtn);

    //Creating an input area for the TODO list.
    const inputField = document.createElement('div');
    inputField.classList.add('todoInput');
    inputField.classList.add('input-styles');
    inputField.innerHTML = `
    <form>
        <input type="text" placeholder="Enter the new task" id="userInput">
        <button id="submit-btn">Add</button>
    </form>
    `
    displayArea.appendChild(inputField);

    //creating a container to hold the taskCards.
    const taskContainer = document.createElement('div');
    taskContainer.className = 'taskContainer';
    displayArea.appendChild(taskContainer);

    //Adding functionality to the add button.
    let errorStatus = 0;

    inputField.querySelector('#submit-btn').addEventListener('click', function (event) {
        event.preventDefault();
        let errorElement;

        const inputArea = inputField.querySelector('#userInput');
        inputArea.addEventListener('input', function () {
            if (errorStatus === 1) {
                inputField.removeChild(errorElement);
                errorStatus = 0;
            }
        })

        const task = inputArea.value;
        inputArea.value = '';

        //handling if the users enter nothing
        if (task === '' && errorStatus === 0) {
            errorElement = document.createElement('p');
            errorElement.className = 'errorElement';
            errorElement.innerHTML = 'Please write the task before submit.';
            inputField.appendChild(errorElement);
            errorStatus = 1;
        }

        //Creating the new task card to hold the value of newly generated task.
        //The below code has to be used for creation of a new function
        //that takes the values from the local storage.
        else if (task !== '') {
            errorStatus = 0;
            let doneStatus = 0;

            const newTaskCard = document.createElement('div');
            newTaskCard.className = 'taskCard';
            newTaskCard.innerHTML = `
            <h3>${task}</h3>
            <div>
                <i class="fa-solid fa-check doneBtn"></i>
                <i class="fa-solid fa-pen-to-square editBtn"></i>
                <i class="fa-duotone fa-solid fa-trash removeBtn"></i>
            </div>
            `
            taskContainer.appendChild(newTaskCard);

            const removeBtn = newTaskCard.querySelector('.removeBtn');
            const editBtn = newTaskCard.querySelector('.editBtn');
            const doneBtn = newTaskCard.querySelector('.doneBtn');

            removeBtn.addEventListener('click', function () {
                const targetElement = (removeBtn.parentElement).parentElement;
                taskContainer.removeChild(targetElement);
            })
            editBtn.addEventListener('click', function () {
                const targetElement = (editBtn.parentElement).previousElementSibling;

                const newTaskName = prompt("Enter the new task name : ");
                targetElement.textContent = newTaskName;

                const checkStatus = checkValues([targetElement], ['Enter the new task name'], 'Task name cannot be null');
                if(checkStatus === 1){
                    taskContainer.removeChild(newTaskCard);
                }
            })
            doneBtn.addEventListener('click', function () {
                if(doneStatus === 0){
                    newTaskCard.style.backgroundColor = 'lightgreen';
                    doneBtn.classList.remove('fa-check');
                    doneBtn.classList.add('fa-circle-xmark');
                    doneStatus = 1;
                }
                else{
                    newTaskCard.style.backgroundColor = 'rgb(191, 187, 195)';
                    doneBtn.classList.add('fa-check');
                    doneBtn.classList.remove('fa-circle-xmark');
                    doneStatus = 0;
                }
            })
        }
    })
})