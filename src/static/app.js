// Interface DOM nodes
const nodes = {
    kanaLabel: document.querySelector('#kana'),
    romajiLabel: document.querySelector('#romaji'),
    showAnswerButton: document.querySelector('#answer'),
    nextTaskButton: document.querySelector('#next'),
    loadingLabel: document.querySelector('#loading'),
    writingLabel: document.querySelector('#writing'),
    translationLabel: document.querySelector('#translation'),
}

// Load and show task
function loadTask() {
    nodes.loadingLabel.classList.remove('hidden');

    fetch('/task')
        .then((response) => response.json())
        .then((data) => {
            const {readings, romaji, writings, meanings} = data;
            nodes.loadingLabel.classList.add('hidden');

            nodes.kanaLabel.innerHTML = readings;

            nodes.romajiLabel.classList.add('hidden');
            nodes.romajiLabel.innerHTML = romaji;

            nodes.translationLabel.classList.add('hidden');
            nodes.translationLabel.innerHTML = meanings;

            nodes.writingLabel.classList.add('hidden');
            nodes.writingLabel.innerHTML = writings;

            nodes.showAnswerButton.classList.remove('hidden');
            nodes.nextTaskButton.classList.add('hidden');
        });
}

// Reveal answer
function onShowAnswerButtonClick() {
    nodes.romajiLabel.classList.remove('hidden');
    nodes.translationLabel.classList.remove('hidden');
    nodes.writingLabel.classList.remove('hidden');
    nodes.nextTaskButton.classList.remove('hidden');
    nodes.showAnswerButton.classList.add('hidden');
}

// Add event listeners
nodes.nextTaskButton.addEventListener('click', () => loadTask());
nodes.showAnswerButton.addEventListener('click', onShowAnswerButtonClick);

// Get first task
loadTask();
