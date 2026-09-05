//app.js
//edited from the original application version, specified for demonstration purpose(features disabled, preset file etc.)
(function() {
    const selectOutputDir = document.getElementById('selectOutputDirBtn');
    const fileInput = document.getElementById('fileInput');
    const fileListEl = document.getElementById('fileList');
    const resInput = document.getElementById('resInput')
    const resToggle = document.getElementById('resToggle');
    const markBtn = document.getElementById('markBtn');
    const expandSetting = document.getElementById('expandSetting')
    
    let fileItems = [];
    const filePath = "../pdf_demo.pdf"
    const name = filePath.split(/[\\/]/).pop();
            fileItems.push({
                name: name,
                path: filePath,
                refcode: crypto.randomUUID()
            });

    // --- Expand or Collapse Settings
    let expandedSettings = true;
    function updateExpandButton() {
        const arrowDown = document.getElementById('arrow-down');
        const arrowUp = document.getElementById('arrow-up');
        const buttonText = document.getElementById('expand-setting-text');

        if (!expandedSettings) {
            arrowDown.classList.remove('hidden');
            arrowUp.classList.add('hidden');
            buttonText.textContent = "Show more";
        }
        else {
            arrowDown.classList.add('hidden');
            arrowUp.classList.remove('hidden');
            buttonText.textContent = "Show less";
        }
    }

    function expandOrCollapseSettings() {
        const advanced = document.getElementById('advanced-setting')

        if (!expandedSettings) advanced.classList.remove('hidden');
        else advanced.classList.add('hidden');
        expandedSettings = !expandedSettings;
        updateExpandButton();
    }
    expandOrCollapseSettings();
    expandSetting.addEventListener('click', expandOrCollapseSettings);
    
    // --- File display ---
    function renderFileList() {
        fileListEl.innerHTML = '';

        fileItems = fileItems.filter(item => !(item.refcode === undefined || item.refcode === null));
        if (fileItems.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-message';
            empty.textContent = 'No files';
            fileListEl.appendChild(empty);
            return;
        }

        fileItems.forEach((item, index) => {
            const li = document.createElement('li');

            const nameSpan = document.createElement('span');
            nameSpan.setAttribute("class", 'file-name');
            nameSpan.textContent = `${item.name}`;
            li.appendChild(nameSpan);

            const actionBtns = document.createElement('div');
            actionBtns.className = 'file-actions';

            const upBtn = document.createElement('button');
            upBtn.setAttribute('class', 'action-button')
            upBtn.textContent = '▲';
            upBtn.title = 'up';
            upBtn.disabled = index === 0;
            upBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (index > 0) {
                    [fileItems[index], fileItems[index - 1]] = [fileItems[index - 1], fileItems[index]];
                    renderFileList();
                }
            });
            upBtn.disabled = true;
            actionBtns.appendChild(upBtn);

            const downBtn = document.createElement('button');
            downBtn.setAttribute('class', 'action-button')
            downBtn.textContent = '▼';
            downBtn.title = 'down';
            downBtn.disabled = index === fileItems.length - 1;
            downBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (index < fileItems.length - 1) {
                    [fileItems[index], fileItems[index + 1]] = [fileItems[index + 1], fileItems[index]];
                    renderFileList();
                }
            });
            downBtn.disabled = true;
            actionBtns.appendChild(downBtn);

            const delBtn = document.createElement('button');
            delBtn.setAttribute('class', 'del-button')
            delBtn.textContent = '✖';
            delBtn.title = 'delete';   
            delBtn.refcode = item.refcode;
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileItems = fileItems.filter(item => !(item.refcode === delBtn.refcode));
                renderFileList();
            })
            delBtn.disabled = true;
            actionBtns.appendChild(delBtn);

            li.appendChild(actionBtns);
            fileListEl.appendChild(li);
        });
    }

    resToggle.addEventListener('input', function() {
        resInput.value = this.value;
    });

    resInput.addEventListener('change', function() {
        let val = parseInt(this.value, 10);
        if (isNaN(val)) return;
        if (val < parseInt(this.min, 10)) val = parseInt(this.min, 10);
        if (val > parseInt(this.max, 10)) val = parseInt(this.max, 10);
        resToggle.value = val;
        this.value = val;
    });

    selectOutputDir.disabled = true;

    // ----- File selection -----
    fileInput.disabled = true;
    markBtn.disabled = true;

    // ----- Mark button -----
    markBtn.addEventListener('click', async () => {
       // Notify that the process is only available at actual version
    });

    renderFileList();
})();