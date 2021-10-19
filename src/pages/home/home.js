let home = `
    <div class="intro-area">
        <div class="full-width">
            <div class="glider">
                <div><img class="glider-image" src="../../../public/img_1.jpg" alt="img1"></div>
                <div><img class="glider-image" src="../../../public/img_2.jpg" alt="img2"></div>
                <div><img class="glider-image" src="../../../public/img_3.jpg" alt="img3"></div>
            </div>
        </div>
    </div>
`

let glider;
let slides;
let currentSlide = 0;

let setupHome = function () {
    const gliderElement = document.querySelector('.glider');
    slides = gliderElement.childElementCount;
    glider = new Glider(gliderElement, {
        slidesToShow: 1,
        dots: '#dots',
        draggable: false,
        rewind: true,
        scrollLock: true,
        duration: 0.6,
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
        }
    });
    autoScroll();
}

function autoScroll() {
    glider.scrollItem(currentSlide, false);
    currentSlide++;
    if (currentSlide >= slides) {
        currentSlide = 0;
    }
    setTimeout(autoScroll, 7000)
}
