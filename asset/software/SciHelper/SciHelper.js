if (document.getElementById('sci-restore')) {document.getElementById('sci-restore').remove();}
var restoreBtn = document.createElement('div');
restoreBtn.id = 'sci-restore';
restoreBtn.textContent = '⌬';
restoreBtn.classList.add('no-select');
restoreBtn.rcdx = 100; restoreBtn.rcdy = 100;

let startTime;
restoreBtn.addEventListener('mousedown', function() {
    startTime = Date.now(); // Record the exact start time
});

restoreBtn.addEventListener('mouseup', function() {
    let duration = Date.now() - startTime;

       if (duration < 150) { 
        initSciHelper(this.rcdx, this.rcdy);
        this.style.display = 'none';
    } 
});

makeDraggable(restoreBtn, restoreBtn);

document.body.appendChild(restoreBtn);