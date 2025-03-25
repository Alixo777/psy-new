let currentImageIndex = 1;
const images = [
    'Pasted image.png',
    'Pasted image (2).png',
    'Pasted image (3).png', // You can add more image paths
    'Pasted image (4).png',
    'Pasted image (5).png',
    'Pasted image (6).png'
];

// Function to change the image
function changeImage() {
    currentImageIndex++;

    if (currentImageIndex >= images.length) {
        currentImageIndex = 0; // Loop back to the first image
    }

    const imgElement = document.getElementById('carousel-img');
    imgElement.src = images[currentImageIndex];
}

// Change image every 3 seconds (3000 milliseconds)
setInterval(changeImage, 3000);

// Optional: You can also keep the manual navigation buttons for user interaction
function changeImageManual(direction) {
    currentImageIndex += direction;

    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }

    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    }

    const imgElement = document.getElementById('carousel-img');
    imgElement.src = images[currentImageIndex];
}