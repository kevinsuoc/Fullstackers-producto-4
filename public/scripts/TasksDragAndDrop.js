// Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
// Icons source. https://www.flaticon.com/
import { changeTaskColumn } from './querisFr.js';
import { socket } from './socket.js';

let dropTargetTask = null;
let dropTargetColumn = null;
let draggedTask = null;

// ondragstart event listener: sets dragged if a "task" is being drag
// ondragstart ="dragStartHandler(event)"
function dragStartHandler(event){
    draggedTask = event.target

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

    if (dropTargetColumn)
        dropTargetColumn.style.borderColor = "#242424";

    dropTargetColumn = event.target.closest(".tasks")
    dropTargetTask = event.target.closest(".task")
    let target = event.target

    dropTargetColumn.style.borderColor = "#007bff"

    if (target.classList.contains("tasks")) {
        target.appendChild(draggedTask)
    } else if (dropTargetTask && dropTargetTask != draggedTask){
        dropTargetTask.insertAdjacentElement("beforebegin", draggedTask)
    }
}
window.dragEnterHandler = dragEnterHandler

// ondragleave="dragLeaveHandler(event)"
function dragLeaveHandler(event){
    event.preventDefault()

    const dropZone = event.target.closest(".tasks");

    if (dropZone && !dropZone.contains(event.relatedTarget)) {
        dropZone.style.borderColor = "#242424";
        if (document.getElementById("taskSeparator"))
            document.getElementById("taskSeparator").remove()
    }
}
window.dragLeaveHandler = dragLeaveHandler

// ondragend ="dragEndHandler(event)"
function dragEndHandler(event) {
    event.target.style.backgroundColor = '#1170dd';

    document.getElementById('todo-tasks').style.borderColor  = '#242424';
    document.getElementById('doing-tasks').style.borderColor  = '#242424';
    document.getElementById('done-tasks').style.borderColor  = '#242424';

    let lineaBreak = document.getElementById("taskSeparator")
    if (lineaBreak){
        lineaBreak.remove()
    }

    draggedTask = null;
}
window.dragEndHandler = dragEndHandler

// ondragdrop="dropHandler(event)"
function dropHandler(event) {
    // Necessary to override browser default
    event.preventDefault();

    // DOM element variable
    let dropTarget = event.target;

    // Searchs the tree upwards until it finds a "task" or tasks column, "tasks".
    while (dropTarget && dropTarget.classList && !(dropTarget.classList.contains("tasks") || dropTarget.classList.contains("task"))) {
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