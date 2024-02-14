var imgContainer = document.getElementById('imgContainer');
var imgUpload = document.getElementById('imgUpload');
var colorPicker = document.getElementById('colorPicker');
var currentText;

imgUpload.addEventListener('change', function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        var img = document.createElement('img');
        img.src = reader.result;
        img.style.maxWidth = '60%'; 
        imgContainer.innerHTML = '';
        imgContainer.appendChild(img);
    }
    if (file) {
        reader.readAsDataURL(file);
    }
});

var imgUrl = document.getElementById('imgUrl');
var loadImgBtn = document.getElementById('loadImgBtn');

loadImgBtn.addEventListener('click', function() {
    var url = imgUrl.value;
    var img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '70%'; 
    imgContainer.innerHTML = '';
    imgContainer.appendChild(img);
});


function addText() {
    var text = document.createElement('div');
    text.contentEditable = true;
    text.style.position = 'absolute';
    text.style.color = 'white';
    text.style.fontSize = '25px';
    text.innerText = 'Drag me';
    imgContainer.appendChild(text);
    text.style.top = '5px';  // Adjust as needed
    text.style.left = '5px';  // Adjust as needed

    text.addEventListener('mousedown', function(event) {
        var shiftX = event.clientX - text.getBoundingClientRect().left;
        var shiftY = event.clientY - text.getBoundingClientRect().top;
        text.style.position = 'absolute';
        text.style.zIndex = 1000;

        function moveAt(pageX, pageY) {
            text.style.left = pageX - shiftX + 'px';
            text.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);
        text.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            text.onmouseup = null;
        };
    });

    text.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        var confirmDelete = confirm("Do you want to delete this text?");
        if (confirmDelete) {
            imgContainer.removeChild(text);
        }
    });

    currentText = text;
}



document.getElementById('downloadBtn').addEventListener('click', function() {
    html2canvas(imgContainer).then(function(canvas) {
        var link = document.createElement('a');
        link.download = 'image.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

colorPicker.addEventListener('input', function() {
    if (currentText) {
        currentText.style.color = this.value;
    }
});

document.getElementById('fontSelect').addEventListener('change', function() {
    var font = this.value;
    if (currentText) {
        currentText.style.fontFamily = font;
    }
});

document.getElementById('textSize').addEventListener('input', function() {
    var size = this.value;
    if (currentText) {
        currentText.style.fontSize = size + 'px';
    }
});

var boldBtn = document.getElementById('boldBtn');
var italicBtn = document.getElementById('italicBtn');
var underlineBtn = document.getElementById('underlineBtn');

boldBtn.addEventListener('click', function() {
    if (currentText) {
        currentText.style.fontWeight = currentText.style.fontWeight === 'bold' ? 'normal' : 'bold';
    }
});

italicBtn.addEventListener('click', function() {
    if (currentText) {
        currentText.style.fontStyle = currentText.style.fontStyle === 'italic' ? 'normal' : 'italic';
    }
});

underlineBtn.addEventListener('click', function() {
    if (currentText) {
        currentText.style.textDecoration = currentText.style.textDecoration === 'underline' ? 'none' : 'underline';
    }
});


var shadowBtn = document.getElementById('shadowBtn');

shadowBtn.addEventListener('click', function() {
    if (currentText) {
        currentText.style.textShadow = currentText.style.textShadow ? '' : '2px 2px 2px rgba(0, 0, 0, 0.5)';
    }
});

