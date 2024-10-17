const headerText = document.querySelector(".header-text");
const mainList = document.querySelector(".main-list");
const inputTodo = document.querySelector("#input-todo");
const addBtn = document.querySelector("#add-button");
const deleteBtn = document.querySelector("#delete-button");


// todo list 만들기

function makeTodoList (inputText, isDone) {
    const list = document.createElement('div');
    const listButtons = document.createElement('div');
    list.className = "list";
    listButtons.className = "list-buttons";

    inputText = inputText || inputTodo.value; // 로컬 스토리지에서 불러올 때 사용

    if (isDone) { // 로컬 스토리지에서 불러올 때
        list.classList.add('done-list');
    }

    const todoText = document.createElement('p');
    todoText.textContent = inputText;
    todoText.className = "todo-text";
    console.log(todoText.textContent)

    const checkBtn = document.createElement('button');
    checkBtn.textContent = "Done!";
    checkBtn.className = "done-button";

    const deleteListBtn = document.createElement('button');
    deleteListBtn.textContent = "Delete";
    deleteListBtn.className = "delete-button";

    list.appendChild(todoText);
    listButtons.appendChild(checkBtn);
    listButtons.appendChild(deleteListBtn);

    list.appendChild(listButtons);

    mainList.appendChild(list);

    // 버튼들 이벤트리스너

    // 하나의 리스트 삭제하기
    deleteListBtn.addEventListener('click', function() {
        mainList.removeChild(list);

        saveList();
    }) 
    
    // 완료 처리하기
    checkBtn.addEventListener('click', function() {
        let firstChild = mainList.firstChild;

        mainList.removeChild(list);
        list.classList.contains('done-list') ? mainList.insertBefore(list, firstChild) : mainList.appendChild(list);
        list.classList.toggle('done-list');

        saveList();
    }) 
}

// 전체 삭제
deleteBtn.addEventListener('click', function() {
    mainList.innerHTML = '';
    localStorage.removeItem('todos'); // 로컬 스토리지에서 삭제
})

// 리스트 추가
addBtn.addEventListener('click', function() {
    if(inputTodo.value.trim()) {
        makeTodoList();
        saveList(); // 추가 후 로컬 스토리지 업데이트
        inputTodo.value = '';
    }
})

inputTodo.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if(inputTodo.value) {
            makeTodoList();
            saveList(); // 추가 후 로컬 스토리지 업데이트
            inputTodo.value = '';
        }
    }
})

// 로컬 스토리지에 리스트 저장
function saveList() {
    const todos = [];
    const lists = document.querySelectorAll('.list'); // list 내용을 노드 리스트 형태로 넣음
    lists.forEach(list => {
        todos.push({
            text: list.children[0].textContent,
            done: list.classList.contains('done-list')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 로컬 스토리지에서 리스트 불러오기
function loadList() {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach(todo => {
        makeTodoList(todo.text, todo.done); // 완료 여부를 전달하여 취소선 적용
    });
}

// 페이지 로드 시 저장된 리스트 불러오기
window.addEventListener('load', loadList);