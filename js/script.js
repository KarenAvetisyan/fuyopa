document.addEventListener('DOMContentLoaded', function(){
        /*Easy selector helper function */
        const select = (el, all = false) => {
                if (!el || typeof el !== 'string') return null;
                el = el.trim();
                if (all) {
                        return [...document.querySelectorAll(el)];
                } else {
                        return document.querySelector(el);
                }
        }
        /* Easy event listener function */
        const on = (type, el, listener, all = false) => {
                let selectEl = select(el, all)
                if (selectEl) {
                if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
                } else {
                selectEl.addEventListener(type, listener)
                }
                }
        }
        /* Easy on scroll event listener  */
        const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
        }

        // burger 
        const burger = select('.js-burger');
        const nav = select('.js-nav');

        document.addEventListener('click', (e) => {
            const isBurger = e.target.closest('.js-burger');
            const isNav = e.target.closest('.js-nav');

            if (isBurger) {
                burger.classList.toggle('clicked');
                nav.classList.toggle('show');
                return; 
            }
            if (e.target.matches('.js-nav .js-scrollTo')) {
                e.preventDefault();
                burger.classList.remove('clicked');
                nav.classList.remove('show');
                return;
            }
            if (!isNav) {
                burger.classList.remove('clicked');
                nav.classList.remove('show');
            }
        });

        
        // хедер при при скролле 
        let selectHeader = select('.header')
        if (selectHeader) {
        const headerScrolled = () => {
        if (window.scrollY > 50) {
                selectHeader.classList.add('scrolling')
        } else {
                selectHeader.classList.remove('scrolling')
        }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(window, headerScrolled)
        }

        // якоря при клике
        on('click', '.js-scrollTo', function(e) {
        const href = this.getAttribute("href");
        if (href && href.startsWith('#')) {
                const targetElement = select(href);
                if (targetElement) {
                e.preventDefault();
                const rect = targetElement.getBoundingClientRect();
                const offsetTop = rect.top + window.scrollY - select('.header').offsetHeight;
                scroll({
                        top: offsetTop,
                        behavior: "smooth"
                });
                }
        }
        }, true);
     
        //  якоря при скролле 
        let navbarlinks = select('.js-scrollActive', true)
        const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('_active')
        } else {
                navbarlink.classList.remove('_active')
        }
        })
        }
        window.addEventListener('load', navbarlinksActive)
        onscroll(document, navbarlinksActive)

        // dynamic swiper appear 
        function loadSwiperScript() {
                return new Promise((resolve) => {
                    const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"]');
                    if (existingScript) {
                        resolve(); 
                        return;
                    }
                    const swiperScript = document.createElement('script');
                    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
                    swiperScript.async = true;
            
                    swiperScript.onload = () => {
                        resolve(); 
                    };
            
                    document.body.appendChild(swiperScript);
                });
        }
        const swiperObserverCallback = (entries) => {
                entries.forEach(entry => {
                if (entry.isIntersecting) {
                        loadSwiperScript().then(() => {
                                var swiperPlans = document.querySelector('.swiperPlans');
                                if(swiperPlans){
                                        new Swiper(swiperPlans, {
                                                loop: false,
                                                speed: 400,
                                                slidesPerView: 'auto',
                                                spaceBetween: 40,
                                                autoHeight: true,
                                                slidesPerGroup: 1,   
                                                pagination: {
                                                        el: swiperPlans.querySelector('.swiper-pagination'),
                                                        clickable: true,
                                                },
                                        });
                                }
                        
                        });
                        swiperObserver.disconnect(); 
                }
                });
        };
        const swiperObserver = new IntersectionObserver(swiperObserverCallback);
        const swiperContainer = document.querySelectorAll('.swiper'); 
        swiperContainer.forEach(EL => {
                swiperObserver.observe(EL);
        });

        // observer, анимация на скролле 
        const inViewport = (element, observer) => {
        element.forEach(entry => {
                entry.target.classList.toggle("is-inViewport", entry.isIntersecting);
                element.forEach(item => {
                if(item.target.classList.contains('is-inViewport') && !item.target.classList.contains('watched')){
                item.target.classList.add("watched");
                }
                })
        });
        };
        let ioConfiguration = {
        rootMargin: '0% 0% 0% 0%',
        threshold: 0.2
        };
        const Obs = new IntersectionObserver(inViewport, ioConfiguration);
        const obsOptions = {}; //See: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options
        const ELs_inViewport = document.querySelectorAll('[data-inviewport]');
        ELs_inViewport.forEach(EL => {
        Obs.observe(EL, obsOptions);
        });

})
