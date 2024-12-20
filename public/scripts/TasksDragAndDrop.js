// Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
// Icons source. https://www.flaticon.com/
import { changeTaskColumn } from './querisFr.js';
import { socket } from './socket.js';

// ondragstart event listener: sets dragged if a "task" is being drag
// ondragstart ="dragStartHandler(event)"
function dragStartHandler(event){
    event.dataTransfer.setData("text/plain", event.target.id)
    event.dataTransfer.effectAllowed = "move";
    event.target.style.backgroundColor = '#242424';

    const img = new Image();
    img.src = "../assets/drag.png";
    img.style.width = "50px";
    img.style.height = "50px";

    document.body.appendChild(img);

    event.dataTransfer.setDragImage(img, 25, 25)

    setTimeout(() => img.remove(), 0);
}
window.dragStartHandler = dragStartHandler

// ondragover="dragOverHandler(event)"
function dragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}
window.dragOverHandler = dragOverHandler

// ondragenter="dragEnterHandler(event)"
function dragEnterHandler(event){
    event.preventDefault()
    event.dataTransfer.dropEffect = "move";

    if(event.target.classList.contains("tasks")){
        event.target.style.borderColor = "#007bff"
    }
    if(event.target.classList.contains("task")){
        event.target.parentNode.style.borderColor = "#007bff"
    }
}
window.dragEnterHandler = dragEnterHandler

// ondragleave="dragLeaveHandler(event)"
function dragLeaveHandler(event){
    event.preventDefault()

    if(event.target.classList.contains("tasks")){
        event.target.style.borderColor = "#242424"
    }
}
window.dragLeaveHandler = dragLeaveHandler

// ondragenter="dragEndHandler(event)"
function dragEndHandler(event) {
    event.target.style.backgroundColor = '#1170dd';
}
window.dragEndHandler = dragEndHandler

// ondragdrop="dropHandler(event)"
function dropHandler(event) {
    // Necessary to override browser default
    event.preventDefault();

    const draggedTask = document.getElementById(event.dataTransfer.getData("text/plain"))

    // DOM element variable
    let dropTarget = event.target;

    // Searchs the tree upwards until it finds a "task" or tasks column, "tasks".
    while (dropTarget && !(dropTarget.classList.contains("tasks") || dropTarget.classList.contains("task"))) {
        dropTarget = dropTarget.parentNode;
    }

    // If not found or it's the dragged element, exits
    if (!dropTarget || dropTarget === draggedTask) {
        return ;
    }

    let targetColumn;
    if (dropTarget.classList.contains("tasks")) {
        targetColumn = dropTarget.id
        draggedTask.parentNode.removeChild(draggedTask);
        dropTarget.appendChild(draggedTask);
    } else if (dropTarget.classList.contains("task")) {
        targetColumn = dropTarget.parentNode.id
        draggedTask.parentNode.removeChild(draggedTask);
        dropTarget.insertAdjacentElement("beforebegin", draggedTask);
    }
    
    document.getElementById(targetColumn).style.borderColor = "#242424"

    moverLS(draggedTask.id, targetColumn, dropTarget);
};
window.dropHandler = dropHandler

async function moverLS(taskId, targetColumn, dropTarget){
    const para = new URLSearchParams(window.location.search);
    const urlId = para.get('id');

    let idColumna=1;
    if(targetColumn=="todo-tasks"){
        idColumna=1;
    }else if(targetColumn=="doing-tasks"){
        idColumna=2;
    }else if(targetColumn=="done-tasks"){
        idColumna=3;
    }
    
    const result = await changeTaskColumn(urlId, taskId, idColumna, dropTarget.id);
}  

socket.on("taskColumnChanged", (arg) => {
    let dropTarget = document.getElementById(arg.topTaskID)
    let task = document.getElementById(arg.id)
    if (task){
        if (dropTarget.classList.contains("tasks")) {
            task.parentNode.removeChild(task);
            dropTarget.appendChild(task);
        } else if (dropTarget.classList.contains("task")) {
            task.parentNode.removeChild(task);
            dropTarget.insertAdjacentElement("beforebegin", task);
        }
    }
})