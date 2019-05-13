//Init
showTasks(getDb());

document.querySelector('#task-data').addEventListener('submit', function (e) {
    e.preventDefault();


    var request = confirm("Are u sure ?");
    if (request == true) {
        let formData = new FormData(this);
        var task = {};
        let dbSize = 0;
        let taskAppStore = getDb();

        for (var pair of formData.entries()) {
            task[pair[0]] = pair[1];
        }

        var reader = new FileReader();
        reader.readAsBinaryString(task.picture);
        reader.onload = function (e) {
            task.picture = e.target.result;

            taskAppStore.length().then(function (numberOfKeys) {
                dbSize = numberOfKeys + 1;
                taskAppStore.setItem(JSON.stringify(dbSize), task);
            }).then(() => {
                showTasks(taskAppStore);
                document.querySelector('#task-data').reset();
            }).catch(err => {
                console.log(err);
            });
        }
    }
});

function showTasks(db) {
    document.querySelector('#tasks-container').innerHTML = '';
    db.keys().then(function (keys) {
        for (let key in keys) {
            db.getItem(keys[key]).then(function (value) {
                let task = value;
                let removeButton = createElement('button', null, ['button', 'danger', 'small', 'hollow', 'right']);
                let container = createElement('div');
                let taskName = createElement('div');
                let taskDescription = createElement('div');
                let img = createElement('img', keys[key], null, getImageFromBinary(task.picture));

                taskName.innerHTML = `<strong>${task.task_name.toUpperCase()}</strong>`;
                taskDescription.innerHTML = `${task.task_descripcion}`;

                img.setAttribute('width', '100px');
                img.setAttribute('heigh', '100px');

                removeButton.setAttribute('onclick', `removeTask(${keys[key]})`);
                removeButton.textContent = 'Remove';

                container.appendChild(taskName);
                container.appendChild(taskDescription);
                container.appendChild(img);
                container.appendChild(removeButton);
                document.querySelector('#tasks-container').appendChild(container);
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
}

function getImageFromBinary(imageData) {
    return 'data:image/jpeg;base64,' + btoa(imageData);
}

function getDb() {
    return localforage.createInstance({
        name: "taskApp",
        version: 1,
        driver: localforage.INDEXEDDB
    });
}

function removeTask(key) {
    db = getDb();
    db.removeItem(JSON.stringify(key)).then(function () {
        showTasks(db);
    }).catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
    });
}

function createElement(tagName, id = null, __class = null, src = null) {
    let element = document.createElement(tagName);
    element.setAttribute('id', (id == null) ? '' : id);

    if (Array.isArray(__class)) {
        __class.forEach(item => {
            element.classList.add(item);
        });
    } else {
        element.classList.add((__class == null) ? 'none' : __class);
    }

    if (tagName == 'img') {
        element.src = src;
    }

    return element;
}