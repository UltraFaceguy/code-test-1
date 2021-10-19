let home = `
    <div class="navbar-background">
        <div class="full-width">
            <nav class="navbar-elements">
                <a class="site-logo" href="#" onclick="onNavigate('/'); return false;">My ZIP Finder</a>

                <ul class="navbar-options">
                    <li class="navbar-item"><a href="#" onclick="onNavigate('/'); return false;">Home</a></li>
                    <li class="navbar-item"><a href="#" onclick="onNavigate('/about'); return false;">About</a></li>
                    <li class="navbar-item"><a href="#" onclick="onNavigate('/search'); return false;">Business Locator</a></li>
                </ul>
            </nav>
        </div>
    </div>
    <div class="intro-area">
        <div class="full-width">
            <div class="glider">
                <div class="glider-panel">
                    <img class="glider-image" src="../../../public/img_1.jpg" alt="img1">
                    <div class="glider-title">Find Businesses Near You</div>
                    <div class="glider-subtitle">Finally, a better solution than Google or talking to people</div>
                </div>
                <div class="glider-panel">
                    <img class="glider-image" src="../../../public/img_2.jpg" alt="img2">
                    <div class="glider-title">Premium Quality ZIP Codes</div>
                    <div class="glider-subtitle">Accept no substitutes. Our ZIP codes are made from top of the shelf numerals like "3", "7", and even the coveted "2"</div>
                </div>
                <div class="glider-panel">
                    <img class="glider-image" src="../../../public/img_3.jpg" alt="img3">
                    <div class="glider-title">Find More Places To Love</div>
                    <div class="glider-subtitle">Our patented random business generation software guarantees you'll find somewhere you've never been before - because it doesn't exist</div>
                </div>
            </div>
        </div>
    </div>
`

let slides;
let currentSlide = 0;
let glider;
let gliderChangeTask;

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
    currentSlide = 0;
    if (gliderChangeTask) {
        clearTimeout(gliderChangeTask);
    }
    autoScroll();

}

function autoScroll() {
    glider.scrollItem(currentSlide, false);
    currentSlide++;
    if (currentSlide >= slides) {
        currentSlide = 0;
    }
    gliderChangeTask = setTimeout(autoScroll, 10000)
}
