let home = `
<div class="intro-area">
    <div class="full-width">
        <div class="glider">
            <div><img class="glider-image" src="../../assets/img_1.jpg" alt="img1"></div>
            <div><img class="glider-image" src="../../assets/img_2.jpg" alt="img2"></div>
            <div><img class="glider-image" src="../../assets/img_3.jpg" alt="img3"></div>
        </div>
    </div>
</div>
`

let glider;
// Important to update this to reflect glider slide quantity
// TODO: detect number of children instead
let slides;
let currentSlide = 0;

setTimeout(function () {
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
}, 1500);

function autoScroll() {
    glider.scrollItem(currentSlide, false);
    currentSlide++;
    if (currentSlide >= slides) {
        currentSlide = 0;
    }
    setTimeout(autoScroll, 7000)
}