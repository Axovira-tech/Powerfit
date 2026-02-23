document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navbar ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // --- Scroll Progress Bar ---
            const progressBar = document.getElementById("progressBar");
            if (progressBar) {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + "%";
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // --- Smooth Scrolling for Anchor Links (index page) ---
    // Only apply if the link is an anchor on the current page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            // If we are on a different page and clicking a hash link for home sections, default behavior (jump) is fine, 
            // or we might need to handle cross-page hash linking. 
            // For this simple site, we assume sections are usually on the same page OR we use full page loads.
            // But if the element exists on THIS page, scroll to it.
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Testimonial Slider ---
    const track = document.getElementById('track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('nextBtn');
        const prevButton = document.getElementById('prevBtn');
        const dotsNav = document.getElementById('dotsNav');
        
        if (slides.length > 0 && dotsNav) {
            // Create dots
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active-dot');
                dot.dataset.index = index;
                dotsNav.appendChild(dot);
            });
            
            const dots = Array.from(dotsNav.children);
            
            const getSlideWidth = () => slides[0].getBoundingClientRect().width;
            
            const setSlidePosition = (slide, index) => {
                slide.style.left = getSlideWidth() * index + 'px';
            };
            slides.forEach(setSlidePosition);

            // Resize listener
            window.addEventListener('resize', () => {
                slides.forEach(setSlidePosition);
                const currentSlide = track.querySelector('.current-slide') || slides[0];
                const targetIndex = slides.findIndex(slide => slide === currentSlide);
                moveToSlide(track, currentSlide, slides[targetIndex]);
            });

            const moveToSlide = (track, currentSlide, targetSlide) => {
                if (!targetSlide) return;
                track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
                if (currentSlide) currentSlide.classList.remove('current-slide');
                targetSlide.classList.add('current-slide');
            };

            const updateDots = (currentDot, targetDot) => {
                if (currentDot) currentDot.classList.remove('active-dot');
                if (targetDot) targetDot.classList.add('active-dot');
            };

            // Buttons
            if (nextButton) {
                nextButton.addEventListener('click', e => {
                    const currentSlide = track.querySelector('.current-slide') || slides[0];
                    let nextSlide = currentSlide.nextElementSibling;
                    const currentDot = dotsNav.querySelector('.active-dot');
                    let nextDot = currentDot ? currentDot.nextElementSibling : dots[0];

                    if (!nextSlide) {
                        nextSlide = slides[0];
                        nextDot = dots[0];
                    }

                    moveToSlide(track, currentSlide, nextSlide);
                    updateDots(currentDot, nextDot);
                });
            }

            if (prevButton) {
                prevButton.addEventListener('click', e => {
                    const currentSlide = track.querySelector('.current-slide') || slides[0];
                    let prevSlide = currentSlide.previousElementSibling;
                    const currentDot = dotsNav.querySelector('.active-dot');
                    let prevDot = currentDot ? currentDot.previousElementSibling : dots[dots.length - 1];

                    if (!prevSlide) {
                        prevSlide = slides[slides.length - 1];
                        prevDot = dots[dots.length - 1];
                    }

                    moveToSlide(track, currentSlide, prevSlide);
                    updateDots(currentDot, prevDot);
                });
            }

            // Dot Indicators
            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');
                if (!targetDot) return;

                const currentSlide = track.querySelector('.current-slide') || slides[0];
                const currentDot = dotsNav.querySelector('.active-dot');
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                const targetSlide = slides[targetIndex];

                moveToSlide(track, currentSlide, targetSlide);
                updateDots(currentDot, targetDot);
            });

            // Auto-slide
            setInterval(() => {
                const currentSlide = track.querySelector('.current-slide') || slides[0];
                let nextSlide = currentSlide.nextElementSibling;
                const currentDot = dotsNav.querySelector('.active-dot');
                let nextDot = currentDot ? currentDot.nextElementSibling : dots[0];

                if (!nextSlide) {
                    nextSlide = slides[0];
                    nextDot = dots[0];
                }
                moveToSlide(track, currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
            }, 5000);
        }
    }

    // --- Form Submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for contacting POWERFIT! We will get back to you shortly.');
            e.target.reset();
        });
    }
    // --- Smart Global Loader System ---
    
    // Embedded Animation Data (Peso.json)
    const animationData = {"v":"5.6.1","fr":29.9700012207031,"ip":0,"op":64.0000026067734,"w":1000,"h":1000,"nm":"gym","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Layer 5 Outlines","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.046,"y":0},"t":19,"s":[1103,497.838,0],"to":[-66.667,0,0],"ti":[66.667,0,0]},{"t":49.0000019958109,"s":[703,497.838,0]}],"ix":2},"a":{"a":0,"k":[703,497.838,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[18.777,0],[0,0],[0,18.777],[0,0],[-18.777,0],[0,-18.778],[0,0]],"o":[[0,0],[-18.777,0],[0,0],[0,-18.778],[18.777,0],[0,0],[0,18.777]],"v":[[0,136],[0,136],[-34,102],[-34,-102],[0,-136],[34,-102],[34,102]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.302,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[703,497.838],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":64.0000026067734,"st":-30.0000012219251,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"Layer 6 Outlines","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0,"y":0},"t":17,"s":[-52.059,497.838,0],"to":[63.333,0,0],"ti":[-63.333,0,0]},{"t":47.0000019143492,"s":[327.941,497.838,0]}],"ix":2},"a":{"a":0,"k":[327.941,497.838,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[20.955,0],[0,0],[0,20.954],[0,0],[-20.955,0],[0,-20.955],[0,0]],"o":[[0,0],[-20.955,0],[0,0],[0,-20.955],[20.955,0],[0,0],[0,20.954]],"v":[[0,187.176],[0,187.176],[-37.941,149.235],[-37.941,-149.234],[0,-187.176],[37.941,-149.234],[37.941,149.235]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.302,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[327.941,497.838],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":64.0000026067734,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"Layer 3 Outlines","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0,"y":0},"t":17,"s":[1044.941,497.838,0],"to":[-66.667,0,0],"ti":[66.667,0,0]},{"t":47.0000019143492,"s":[644.941,497.838,0]}],"ix":2},"a":{"a":0,"k":[644.941,497.838,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[20.954,0],[0,0],[0,20.954],[0,0],[-20.954,0],[0,-20.955],[0,0]],"o":[[0,0],[-20.954,0],[0,0],[0,-20.955],[20.954,0],[0,0],[0,20.954]],"v":[[0,187.176],[0,187.176],[-37.941,149.235],[-37.941,-149.234],[0,-187.176],[37.941,-149.234],[37.941,149.235]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.302,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[644.941,497.838],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":64.0000026067734,"st":-15.0000006109625,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"Layer 4 Outlines","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0,"y":0},"t":19,"s":[-112,497.838,0],"to":[63.333,0,0],"ti":[-63.333,0,0]},{"t":49.0000019958109,"s":[268,497.838,0]}],"ix":2},"a":{"a":0,"k":[268,497.838,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[18.778,0],[0,0],[0,18.777],[0,0],[-18.778,0],[0,-18.778],[0,0]],"o":[[0,0],[-18.778,0],[0,0],[0,-18.778],[18.778,0],[0,0],[0,18.777]],"v":[[0,136],[0,136],[-34,102],[-34,-102],[0,-136],[34,-102],[34,102]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.302,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[268,497.838],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":64.0000026067734,"st":-30.0000012219251,"bm":0},{"ddd":0,"ind":5,"ty":4,"nm":"Layer 2 Outlines","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[485.056,492.522,0],"ix":2},"a":{"a":0,"k":[485.056,492.522,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.028,0.028,0.667],"y":[1,1,1]},"o":{"x":[0.261,0.261,0.333],"y":[0,0,0]},"t":0,"s":[0,0,100]},{"t":17.0000006924242,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[18.225,0],[0,0],[0,18.226],[-18.226,0],[0,0],[0,-18.225]],"o":[[0,0],[-18.226,0],[0,-18.225],[0,0],[18.225,0],[0,18.226]],"v":[[296.901,33],[-296.9,33],[-329.9,0],[-296.9,-33],[296.901,-33],[329.9,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.302,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[485.056,492.522],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":64.0000026067734,"st":0,"bm":0}],"markers":[]};

    window.addEventListener("load", function() {
        // Initialize Lottie Player
        const player = document.getElementById("lottie-loader");
        if (player) {
            player.load(animationData);
        }

        const loader = document.getElementById("loader");
        if (!loader) return;

        // Smart Logic: Check Session
        const isFirstVisit = !sessionStorage.getItem('hasVisited');
        sessionStorage.setItem('hasVisited', 'true');

        // Configuration based on visit type
        // First visit: 2s branding display + 1.5s fade (Premium)
        // Subsequent: 0.5s interaction buffer + 0.5s fade (Fast)
        const delay = isFirstVisit ? 2000 : 500;
        const transitionDuration = isFirstVisit ? '1.5s' : '0.2s';

        // Apply dynamic transition duration
        loader.style.transition = `opacity ${transitionDuration} ease-in-out, visibility ${transitionDuration} ease-in-out`;

        // Trigger Fade Out
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
            
            // Remove from display after transition completes
            const cleanupDelay = isFirstVisit ? 1500 : 500;
            setTimeout(() => {
                loader.style.display = "none";
            }, cleanupDelay);

        }, delay);
    });
    // --- Hero Particles Animation ---
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        // Create Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Random direction and speed
                this.directionX = (Math.random() * 1) - 0.5; 
                this.directionY = (Math.random() * 1) - 0.5;
                this.size = (Math.random() * 3) + 1;
                this.color = '#FF4D00'; // Secondary Color
            }

            // Method to draw individual particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.6; // Opacity
                ctx.fill();
            }

            // Method to update particle position
            update() {
                // Check if particle is still within canvas
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;

                // Draw particle
                this.draw();
            }
        }

        // Create particle array
        function init() {
            particlesArray = [];
            // Density of particles
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Connect particles with lines if they are close enough
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    // Connection distance threshold
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(255, 77, 0,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Resize event
        window.addEventListener('resize', () => {
             canvas.width = window.innerWidth;
             canvas.height = window.innerHeight;
             init();
        });
        
        init();
        animate();
    }
});

