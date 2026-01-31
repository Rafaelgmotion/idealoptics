// APP PRINCIPAL DA I-DEAL OPTICS
// Estrutura modular e otimizada para performance

class IdealOpticsApp {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar todos os módulos
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initProdutosSlider();
        this.initDepoimentosSlider();
        this.initStatsCounter();
        this.initGoogleMaps();
        this.initLazyLoading();
        this.initAnimations();
        this.loadDynamicContent();
        
        // Event listeners globais
        this.addEventListeners();
        
        console.log('i-deal optics - Site carregado com sucesso!');
    }

    // ============================================
    // MÓDULO: MENU MOBILE
    // ============================================
    initMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // MÓDULO: SCROLL SUAVE
    // ============================================
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || href.startsWith('#!')) return;
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Atualizar link ativo
                    this.updateActiveNavLink(href);
                }
            });
        });

        // Atualizar link ativo durante o scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLinkOnScroll();
        });
    }

    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNavLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.updateActiveNavLink(`#${sectionId}`);
            }
        });
    }

    // ============================================
    // MÓDULO: SLIDER DE PRODUTOS
    // ============================================
    initProdutosSlider() {
        const slider = document.getElementById('produtosSlider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('sliderDots');

        if (!slider) return;

        let currentSlide = 0;
        let autoSlideInterval;
        const slideCount = Math.ceil(this.getProducts().length / this.getSlidesPerView());

        // Criar dots
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = document.querySelectorAll('.slider-dot');

        // Função para ir para slide específico
        this.goToSlide = (index) => {
            currentSlide = index;
            const translateX = -currentSlide * 100;
            slider.querySelector('.produtos-track').style.transform = `translateX(${translateX}%)`;

            // Atualizar dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };

        // Event listeners
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            this.goToSlide(currentSlide);
            this.resetAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slideCount;
            this.goToSlide(currentSlide);
            this.resetAutoSlide();
        });

        // Slider automático
        this.startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slideCount;
                this.goToSlide(currentSlide);
            }, 5000);
        };

        this.resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            this.startAutoSlide();
        };

        // Pausar slider ao interagir
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        slider.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });

        // Responsividade
        window.addEventListener('resize', () => {
            this.goToSlide(0);
        });

        // Iniciar
        this.startAutoSlide();
        this.renderProducts();
    }

    getSlidesPerView() {
        if (window.innerWidth < 576) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    // ============================================
    // MÓDULO: SLIDER DE DEPOIMENTOS
    // ============================================
    initDepoimentosSlider() {
        const slider = document.getElementById('depoimentosSlider');
        if (!slider) return;

        const track = slider.querySelector('.depoimentos-track');
        const depoimentos = this.getDepoimentos();
        let currentDepoimento = 0;
        let depoimentoInterval;

        // Renderizar depoimentos
        track.innerHTML = depoimentos.map(depoimento => `
            <div class="depoimento-card">
                <div class="depoimento-texto">${depoimento.texto}</div>
                <div class="depoimento-cliente">
                    <div class="cliente-foto">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="cliente-info">
                        <h4>${depoimento.nome}</h4>
                        <p>${depoimento.info}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // Criar dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'depoimentos-dots';
        slider.appendChild(dotsContainer);

        for (let i = 0; i < depoimentos.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                currentDepoimento = i;
                updateDepoimentoSlider();
                resetDepoimentoInterval();
            });
            dotsContainer.appendChild(dot);
        }

        const dots = document.querySelectorAll('.depoimentos-dots .slider-dot');

        const updateDepoimentoSlider = () => {
            const translateX = -currentDepoimento * 100;
            track.style.transform = `translateX(${translateX}%)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentDepoimento);
            });
        };

        const nextDepoimento = () => {
            currentDepoimento = (currentDepoimento + 1) % depoimentos.length;
            updateDepoimentoSlider();
        };

        const resetDepoimentoInterval = () => {
            clearInterval(depoimentoInterval);
            depoimentoInterval = setInterval(nextDepoimento, 6000);
        };

        // Iniciar slider automático
        resetDepoimentoInterval();

        // Pausar ao interagir
        slider.addEventListener('mouseenter', () => {
            clearInterval(depoimentoInterval);
        });

        slider.addEventListener('mouseleave', () => {
            resetDepoimentoInterval();
        });
    }

    // ============================================
    // MÓDULO: CONTADOR ESTATÍSTICAS
    // ============================================
    initStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const target = parseInt(stat.dataset.count);
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target;
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, 16);
                    
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
    }

    // ============================================
    // MÓDULO: GOOGLE MAPS
    // ============================================
    initGoogleMaps() {
        if (typeof google === 'undefined') return;

        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const location = { lat: -22.154357, lng: -43.204801 };

        const map = new google.maps.Map(mapElement, {
            zoom: 16,
            center: location,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.icon",
                    "stylers": [{ "visibility": "off" }]
                }
            ],
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: false,
            zoomControl: false
        });

        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: "i-deal optics",
            icon: {
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: "#0A2463",
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 1.5,
                anchor: new google.maps.Point(12, 24)
            }
        });

        // Controles de zoom personalizados
        const zoomInBtn = document.createElement('button');
        zoomInBtn.innerHTML = '<i class="fas fa-plus"></i>';
        zoomInBtn.className = 'mapa-controle-btn';
        zoomInBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 36px;
            height: 36px;
            background: white;
            border: none;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        mapElement.parentElement.appendChild(zoomInBtn);
        
        const zoomOutBtn = zoomInBtn.cloneNode(true);
        zoomOutBtn.innerHTML = '<i class="fas fa-minus"></i>';
        zoomOutBtn.style.top = '56px';
        mapElement.parentElement.appendChild(zoomOutBtn);

        zoomInBtn.addEventListener('click', () => map.setZoom(map.getZoom() + 1));
        zoomOutBtn.addEventListener('click', () => map.setZoom(map.getZoom() - 1));
    }

    // ============================================
    // MÓDULO: LAZY LOADING
    // ============================================
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores antigos
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        }
    }

    // ============================================
    // MÓDULO: ANIMAÇÕES
    // ============================================
    initAnimations() {
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.categoria-card, .servico-card, .produto-inner');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('fade-in');
                }
            });
        };

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Executar uma vez ao carregar
    }

    // ============================================
    // MÓDULO: CONTEÚDO DINÂMICO
    // ============================================
    loadDynamicContent() {
        // Carregar categorias
        this.renderCategorias();
        
        // Carregar serviços
        this.renderServicos();
    }

    renderCategorias() {
        const container = document.getElementById('categoriasGrid');
        if (!container) return;

        const categorias = [
            {
                icon: 'fas fa-eye',
                title: 'Óculos de Grau',
                desc: 'Lentes corretivas com tecnologia avançada para miopia, hipermetropia e astigmatismo.'
            },
            {
                icon: 'fas fa-sun',
                title: 'Óculos Solar',
                desc: 'Proteção UV completa com estilo. Modelos das melhores marcas com lentes polarizadas.'
            },
            {
                icon: 'fas fa-child',
                title: 'Infantil',
                desc: 'Óculos resistentes e divertidos para crianças, com lentes de segurança e designs encantadores.'
            },
            {
                icon: 'fas fa-eye-dropper',
                title: 'Lentes de Contato',
                desc: 'Conforto e praticidade com nossas lentes de contato de alta qualidade para todos os tipos de visão.'
            }
        ];

        container.innerHTML = categorias.map(cat => `
            <div class="categoria-card fade-in">
                <div class="categoria-icon">
                    <i class="${cat.icon}"></i>
                </div>
                <h3>${cat.title}</h3>
                <p>${cat.desc}</p>
            </div>
        `).join('');
    }

    renderServicos() {
        const container = document.getElementById('servicosGrid');
        if (!container) return;

        const servicos = [
            {
                icon: 'fas fa-eye',
                title: 'Exame de Vista Completo',
                desc: 'Realizamos exames de vista com equipamentos de última geração para diagnóstico preciso.'
            },
            {
                icon: 'fas fa-tools',
                title: 'Manutenção e Ajustes',
                desc: 'Ajustamos seus óculos para maior conforto e realizamos consertos rápidos enquanto você espera.'
            },
            {
                icon: 'fas fa-shipping-fast',
                title: 'Entrega Expressa',
                desc: 'Seus óculos prontos em até 24h. Entregamos em casa ou no trabalho para sua comodidade.'
            }
        ];

        container.innerHTML = servicos.map(serv => `
            <div class="servico-card fade-in">
                <div class="servico-icon">
                    <i class="${serv.icon}"></i>
                </div>
                <h3>${serv.title}</h3>
                <p>${serv.desc}</p>
                <a href="#contato" class="btn btn-secondary">Saiba Mais</a>
            </div>
        `).join('');
    }

    renderProducts() {
        const container = document.getElementById('produtosSlider');
        if (!container) return;

        const products = this.getProducts();
        const track = container.querySelector('.produtos-track');
        
        track.innerHTML = products.map(prod => `
            <div class="produto-card">
                <div class="produto-inner">
                    <div class="produto-img">
                        <i class="${prod.icon}"></i>
                    </div>
                    <div class="produto-info">
                        <span class="produto-categoria">${prod.categoria}</span>
                        <h3 class="produto-titulo">${prod.nome}</h3>
                        <p class="produto-descricao">${prod.descricao}</p>
                        <div class="produto-footer">
                            <div class="produto-preco">${prod.preco}</div>
                            <button class="btn btn-primary btn-comprar" data-produto="${prod.nome}">
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Adicionar event listeners aos botões
        document.querySelectorAll('.btn-comprar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const produto = e.target.dataset.produto;
                this.abrirWhatsApp(`Olá! Gostaria de comprar o produto: ${produto}`);
            });
        });
    }

    // ============================================
    // DADOS DA APLICAÇÃO
    // ============================================
    getProducts() {
        return [
            {
                nome: 'Óculos Ray-Ban Aviador',
                categoria: 'Solar',
                descricao: 'Clássico e atemporal, perfeito para proteção solar com estilo.',
                preco: 'R$ 489,90',
                icon: 'fas fa-glasses'
            },
            {
                nome: 'Óculos de Grau Oakley',
                categoria: 'Grau',
                descricao: 'Tecnologia avançada para quem busca precisão e conforto.',
                preco: 'R$ 699,90',
                icon: 'fas fa-glasses'
            },
            {
                nome: 'Óculos Infantil Disney',
                categoria: 'Infantil',
                descricao: 'Resistentes e divertidos, seus filhos vão amar usar óculos.',
                preco: 'R$ 329,90',
                icon: 'fas fa-glasses'
            },
            {
                nome: 'Lentes de Contato Acuvue',
                categoria: 'Lentes',
                descricao: 'Conforto por até 12 horas. Pacote com 30 unidades.',
                preco: 'R$ 129,90',
                icon: 'fas fa-eye'
            },
            {
                nome: 'Óculos de Sol Prada',
                categoria: 'Solar',
                descricao: 'Elegância e proteção UV máxima. Modelo exclusivo.',
                preco: 'R$ 799,90',
                icon: 'fas fa-sunglasses'
            },
            {
                nome: 'Óculos de Grau Armani',
                categoria: 'Grau',
                descricao: 'Design italiano e tecnologia de ponta para visão perfeita.',
                preco: 'R$ 899,90',
                icon: 'fas fa-glasses'
            }
        ];
    }

    getDepoimentos() {
        return [
            {
                texto: "Comprei meus óculos de grau na i-deal optics e estou muito satisfeito. O atendimento foi excelente, me ajudaram a escolher e os óculos ficaram perfeitos. Recomendo!",
                nome: "Rafael Garcia",
                info: "Cliente desde 2026"
            },
            {
                texto: "Precisei de óculos para meu filho de 8 anos e a experiência foi incrível. O atendimento para crianças é diferenciado, ele adorou escolher a armação e agora usa os óculos sem reclamar.",
                nome: "Carlos Mendes",
                info: "Pai do João Pedro"
            },
            {
                texto: "Sou usuário de lentes de contato há anos e finalmente encontrei uma ótica que entende minhas necessidades. As lentes são de alta qualidade e o preço é justo. Sempre que preciso, volto para comprar.",
                nome: "Roberto Alves",
                info: "Cliente há 3 anos"
            }
        ];
    }

    // ============================================
    // UTILITÁRIOS
    // ============================================
    abrirWhatsApp(mensagem) {
        const telefone = '5521973366098';
        const texto = encodeURIComponent(mensagem);
        window.open(`https://wa.me/${telefone}?text=${texto}`, '_blank');
    }

    addEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 5px 20px rgba(10, 36, 99, 0.15)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(10, 36, 99, 0.08)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        });

        // Prevenir envio de formulários (se houver)
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Implementar lógica de envio se necessário
            });
        });

        // Otimizar performance
        window.addEventListener('load', () => {
            // Remover preloader se existir
            const preloader = document.getElementById('preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.remove(), 500);
                }, 500);
            }
        });
    }
}

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new IdealOpticsApp();
});

// Fallback para navegadores antigos
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new IdealOpticsApp();
    });
} else {
    new IdealOpticsApp();
}
