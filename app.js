const routes = {
    '/' : { html: home, setup: () => setupHome() },
    '/search' : { html: search, setup: () => setupSearch() },
    '/about' : { html: about, setup: () => setupAbout() },
};

const rootDiv = document.getElementById('root');
rootDiv.innerHTML = routes[window.location.pathname];

const onNavigate = (pathname) => {
    window.history.pushState(
        {},
        pathname,
        window.location.origin + pathname
    )
    rootDiv.innerHTML = routes[pathname].html
    routes[pathname].setup();
}

window.onpopstate = () => {
    rootDiv.innerHTML = routes[window.location.pathname]
}