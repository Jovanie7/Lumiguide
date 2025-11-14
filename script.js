// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializePainting();
    initializeEventListeners();
    initializeGuidanceFlow();
    createInitialStrokes();
    
    // Add scroll animations
    initializeScrollAnimations();
});

// Initialize all event listeners - FIXED
function initializeEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // Feature cards navigation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                navigateToSection(target);
            }
        });
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            openTab(tabName);
        });
    });
    
    // Psychologist cards
    const psychCards = document.querySelectorAll('.psychologist-card');
    psychCards.forEach(card => {
        card.addEventListener('click', function() {
            const website = this.getAttribute('data-website');
            const location = this.getAttribute('data-location');
            
            if (website) {
                openWebsite(website);
            } else if (location) {
                openMaps(location);
            }
        });
    });
    
    // Reset guidance button
    const resetBtn = document.getElementById('resetGuidance');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGuidance);
    }
    
    // Booth registration
    const registerBtn = document.getElementById('registerBooth');
    if (registerBtn) {
        registerBtn.addEventListener('click', registerBooth);
    }
}

// Handle Search Functionality - FIXED
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        showNotification(`Mencari panduan untuk: "${query}"`);
        
        // Add search animation
        searchInput.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            searchInput.style.animation = '';
        }, 500);
        
        setTimeout(() => {
            navigateToSection('guidance');
        }, 1000);
    } else {
        showNotification('Silakan tuliskan apa yang kamu rasakan terlebih dahulu');
        searchInput.focus();
    }
}

// Navigation function - FIXED
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        showNotification(`Membuka ${getSectionName(sectionId)}...`);
    }
}

function getSectionName(sectionId) {
    const names = {
        'guidance': 'Guidance Hub',
        'sources': 'Sumber Terpercaya',
        'experts': 'Tanya Ahli',
        'booth': 'Booth Event'
    };
    return names[sectionId] || 'Bagian';
}

// Interactive Painting - IMPROVED
function initializePainting() {
    const canvas = document.getElementById('mainCanvas');
    
    // Click on canvas to add random stroke
    if (canvas) {
        canvas.addEventListener('click', function(e) {
            if (e.target === this) {
                addRandomStroke(e.offsetX, e.offsetY);
            }
        });
    }
}

function createInitialStrokes() {
    const canvas = document.getElementById('mainCanvas');
    if (!canvas) return;
    
    // Clear existing strokes
    canvas.innerHTML = '';
    
    // Create initial random strokes
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * (canvas.offsetWidth - 100) + 50;
        const y = Math.random() * (canvas.offsetHeight - 50) + 25;
        createStroke(x, y);
    }
}

function createStroke(x, y) {
    const canvas = document.getElementById('mainCanvas');
    const stroke = document.createElement('div');
    stroke.className = 'paint-stroke';
    
    const width = Math.random() * 120 + 80;
    const height = Math.random() * 25 + 15;
    const rotation = Math.random() * 30 - 15;
    const colors = ['#222663', '#8CA3F5', '#7E6ADC', '#4C47A8', '#04132C', '#4465B5', '#7452B4', '#C4ABF5', '#DFAE6A'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    stroke.style.width = width + 'px';
    stroke.style.height = height + 'px';
    stroke.style.background = color;
    stroke.style.left = (x - width/2) + 'px';
    stroke.style.top = (y - height/2) + 'px';
    stroke.style.transform = `rotate(${rotation}deg)`;
    stroke.style.opacity = '0.7';
    stroke.style.setProperty('--rotation', rotation + 'deg');
    
    // Add click to remove functionality
    stroke.addEventListener('click', function(e) {
        e.stopPropagation();
        removeStroke(this);
    });
    
    if (canvas) {
        canvas.appendChild(stroke);
    }
    
    return stroke;
}

function addRandomStroke() {
    const canvas = document.getElementById('mainCanvas');
    if (!canvas) return;
    
    const x = Math.random() * (canvas.offsetWidth - 100) + 50;
    const y = Math.random() * (canvas.offsetHeight - 50) + 25;
    createStroke(x, y);
    showNotification('Coretan baru ditambahkan...');
}

function clearAllStrokes() {
    const canvas = document.getElementById('mainCanvas');
    if (canvas) {
        const strokes = canvas.querySelectorAll('.paint-stroke');
        strokes.forEach(stroke => {
            removeStroke(stroke);
        });
        showNotification('Semua coretan dihapus... mulai fresh!');
    }
}

function removeStroke(strokeElement) {
    strokeElement.style.opacity = '0';
    strokeElement.style.transform = 'scale(0) rotate(45deg)';
    setTimeout(() => {
        if (strokeElement.parentNode) {
            strokeElement.parentNode.removeChild(strokeElement);
        }
    }, 300);
}

// Guidance Flow Logic - FIXED
let currentStep = 1;
let userSelections = {};

function initializeGuidanceFlow() {
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const step = this.closest('.flow-step').dataset.step;
            const type = Object.keys(this.dataset)[0];
            const value = this.dataset[type];
            
            userSelections[type] = value;
            
            // Add visual feedback with animation
            optionButtons.forEach(btn => {
                btn.style.transform = 'scale(1)';
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
            this.style.transform = 'scale(1.05)';
            
            // Add selection animation
            this.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
            
            // Move to next step after a delay
            setTimeout(() => {
                moveToNextStep();
            }, 800);
        });
    });
}

function moveToNextStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.style.animation = 'fadeOut 0.5s ease';
    }
    
    setTimeout(() => {
        if (currentStepElement) {
            currentStepElement.classList.remove('active');
        }
        
        currentStep++;
        const nextStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        
        if (nextStepElement) {
            nextStepElement.classList.add('active');
            nextStepElement.style.animation = 'fadeIn 0.5s ease';
            
            if (currentStep === 3) {
                generateGuidanceResult();
            }
        }
    }, 500);
}

function generateGuidanceResult() {
    const feeling = userSelections.feeling;
    const frequency = userSelections.frequency;
    
    let additionalAdvice = '';
    let showExpertRecommendation = false;
    
    // Generate advice based on feeling and frequency
    if (frequency === 'selalu' || frequency === 'sering') {
        showExpertRecommendation = true;
        if (feeling === 'cemas' || feeling === 'stres') {
            additionalAdvice = 'Karena perasaan ini sering muncul dan cukup intens, sangat disarankan untuk berkonsultasi dengan profesional. Mereka dapat membantumu memahami akar perasaan dan memberikan strategi coping yang tepat.';
        } else if (feeling === 'sedih') {
            additionalAdvice = 'Perasaan sedih yang sering muncul dan bertahan lama bisa membutuhkan dukungan profesional. Psikolog dapat membantumu mengeksplorasi penyebab dan mengembangkan cara sehat untuk mengelola emosi.';
        } else if (feeling === 'bingung') {
            additionalAdvice = 'Kebingungan yang terus-menerus dapat mengganggu kehidupan sehari-hari. Konsultasi dengan ahli dapat membantumu mendapatkan kejelasan dan arah yang lebih terstruktur.';
        }
    } else if (frequency === 'kadang') {
        if (feeling === 'cemas') {
            additionalAdvice = 'Coba teknik pernapasan 4-7-8: tarik napas 4 detik, tahan 7 detik, buang napas 8 detik. Ulangi 3-4 kali. Juga, coba identifikasi pemicu kecemasan dan buat rencana untuk menghadapinya.';
        } else if (feeling === 'stres') {
            additionalAdvice = 'Luangkan waktu 10 menit untuk berjalan kaki atau peregangan ringan. Fokus pada sensasi fisik untuk mengalihkan pikiran. Break down tugas besar menjadi langkah-langkah kecil.';
        } else if (feeling === 'sedih') {
            additionalAdvice = 'Tuliskan 3 hal yang masih bisa disyukuri hari ini, sekecil apapun itu. Hubungi teman atau keluarga untuk berbagi perasaan. Lakukan aktivitas yang biasanya membawa kesenangan.';
        } else if (feeling === 'bingung') {
            additionalAdvice = 'Coba tuliskan semua pertanyaan dan kekhawatiranmu di kertas. Prioritaskan mana yang paling penting. Beri waktu untuk refleksi tanpa tekanan harus segera menemukan jawaban.';
        }
    }
    
    const resultElement = document.querySelector('.guidance-result');
    if (!resultElement) return;
    
    // Remove existing additional advice if any
    const existingAdvice = resultElement.querySelector('.additional-advice');
    if (existingAdvice) {
        existingAdvice.remove();
    }
    
    // Add new additional advice
    if (additionalAdvice) {
        const adviceDiv = document.createElement('div');
        adviceDiv.className = 'additional-advice';
        adviceDiv.innerHTML = `
            <h4>${showExpertRecommendation ? '💡 Rekomendasi' : '✨ Saran Tambahan'}</h4>
            <p>${additionalAdvice}</p>
            ${showExpertRecommendation ? '<p style="margin-top: 1rem; font-weight: 600;">Kamu bisa menjelajahi bagian <span style="color: #6FA8DC;">Tanya Ahli</span> untuk informasi konsultasi profesional.</p>' : ''}
        `;
        const resetBtn = resultElement.querySelector('.primary-btn');
        if (resetBtn) {
            resultElement.insertBefore(adviceDiv, resetBtn);
        }
    }
}

function resetGuidance() {
    currentStep = 1;
    userSelections = {};
    
    // Reset all steps with animation
    document.querySelectorAll('.flow-step').forEach(step => {
        step.classList.remove('active');
        step.style.animation = '';
    });
    
    // Show first step
    const firstStep = document.querySelector('[data-step="1"]');
    if (firstStep) {
        firstStep.classList.add('active');
        firstStep.style.animation = 'fadeIn 0.5s ease';
    }
    
    // Clear selections
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.transform = 'scale(1)';
    });
    
    // Remove additional advice
    const existingAdvice = document.querySelector('.additional-advice');
    if (existingAdvice) {
        existingAdvice.remove();
    }
    
    showNotification('Memulai panduan baru...');
}

// Expert Section Tabs - FIXED
function openTab(tabName) {
    // Hide all tab contents with animation
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            tab.classList.remove('active');
        }, 300);
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show the selected tab with animation
    setTimeout(() => {
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
            selectedTab.style.animation = 'fadeIn 0.5s ease';
        }
    }, 300);
    
    // Activate the clicked button
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Open psychologist websites - FIXED
function openWebsite(url) {
    showNotification('Membuka website psikolog...');
    setTimeout(() => {
        window.open(url, '_blank');
    }, 500);
}

function openMaps(location) {
    showNotification('Membuka peta lokasi...');
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
    setTimeout(() => {
        window.open(mapsUrl, '_blank');
    }, 500);
}

// Booth Registration - FIXED
function registerBooth() {
    showNotification('Membuka formulir pendaftaran...');
    
    // Simulate registration process
    setTimeout(() => {
        const name = prompt('Masukkan nama lengkap Anda:');
        if (name) {
            const email = prompt('Masukkan email Anda:');
            if (email) {
                const phone = prompt('Masukkan nomor telepon Anda:');
                if (phone) {
                    showNotification(`Pendaftaran berhasil! Konfirmasi akan dikirim ke ${email}`);
                    
                    setTimeout(() => {
                        alert(`Terima kasih ${name}! Pendaftaran untuk konsultasi di Booth Naviguide berhasil. Kami akan mengirimkan detail lengkap ke email Anda.`);
                    }, 1000);
                }
            }
        }
    }, 500);
}

// Notification System - FIXED
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--secondary-blue);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.8s ease';
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .option-btn.selected {
        background: var(--secondary-blue) !important;
        color: white !important;
        border-color: var(--secondary-blue) !important;
        box-shadow: 0 5px 15px rgba(111, 168, 220, 0.4) !important;
    }
    
    .action-steps {
        margin: 2rem 0;
    }
    
    .action-steps ul {
        text-align: left;
        margin: 1.5rem 0;
        padding-left: 1.5rem;
    }
    
    .action-steps li {
        margin: 1rem 0;
        color: #555;
        line-height: 1.5;
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log(`%c
🧭 Selamat datang di Naviguide! 
Your Compass for Clarity, Not Just Answers.

"Tidak perlu tahu semua jawabannya sekarang.
Perasaanmu tetap valid meski belum terdefinisi."

Membantumu dimengerti, bukan dibebani.
`, 'color: #6FA8DC; font-family: Poppins; font-size: 14px; font-weight: 600;');

// ===== URGENT SECTION FUNCTIONALITY =====

/**
 * Fungsi utama untuk membuka Healing119
 * Menangani redirect ke website Healing119 dengan konfirmasi
 */
function openHealing119() {
    // Show urgent notification
    showNotification('🚨 Mengarahkan ke Healing119 - Bantuan segera tersedia!');
    
    // Add urgent animation to button
    const button = event?.target?.closest('.urgent-super-btn');
    if (button) {
        button.style.animation = 'pulse 0.5s ease 3';
    }
    
    // Immediate redirect dengan konfirmasi
    setTimeout(() => {
        const userChoice = confirm(
            '🚨 BANTUAN SEGERA\n\n' +
            'Anda akan diarahkan ke Healing119 untuk konseling GRATIS dengan konselor profesional.\n\n' +
            '✅ Gratis 100%\n' +
            '✅ Konselor berpengalaman\n' +
            '✅ Privasi terjaga\n\n' +
            'Klik OK untuk langsung mendapatkan bantuan!'
        );
        
        if (userChoice) {
            // Direct redirect ke Healing119
            window.open('https://www.healing119.id/', '_blank', 'noopener,noreferrer');
            
            // Show success message
            setTimeout(() => {
                showNotification('💚 Semoga kamu mendapatkan bantuan yang dibutuhkan! Kamu tidak sendirian.');
            }, 1000);
        } else {
            showNotification('❓ Bantuan tetap tersedia kapan saja kamu butuh. Jangan ragu untuk kembali!');
        }
    }, 800);
}

/**
 * Notification system untuk urgent section
 * @param {string} message - Pesan notifikasi
 */
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.urgent-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'urgent-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Auto-scroll to urgent section jika ada parameter URL
 */
function checkUrgentParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('urgent') === 'true') {
        setTimeout(() => {
            navigateToSection('urgent');
            showNotification('🚨 Bantuan tersedia untukmu! Klik tombol besar di bawah.');
        }, 1000);
    }
}

/**
 * Navigate to section dengan smooth scroll
 * @param {string} sectionId - ID section tujuan
 */
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    checkUrgentParameter();
    
    // Add event listener untuk urgent button
    const urgentButton = document.querySelector('.urgent-super-btn');
    if (urgentButton) {
        urgentButton.addEventListener('click', openHealing119);
    }
});

// Console message untuk debugging
console.log('🚨 Urgent Section - Healing119 Integration Loaded');


const dustContainer = document.querySelector('.magic-dust');

// generate 25–40 partikel acak
for (let i = 0; i < 35; i++) {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');

  // set variabel CSS custom acak
  sparkle.style.setProperty('--size', `${Math.random() * 6 + 3}px`);
  sparkle.style.setProperty('--duration', `${3 + Math.random() * 4}s`);
  sparkle.style.setProperty('--moveX', `${Math.random() * 80 - 40}px`);
  sparkle.style.setProperty('--moveY', `${Math.random() * 80 - 40}px`);
  sparkle.style.top = `${Math.random() * 100}%`;
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.animationDelay = `${Math.random() * 3}s`;

  dustContainer.appendChild(sparkle);
}

// Script untuk hide/show navbar pada scroll mobile
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const scrollThreshold = 50; // Jarak scroll minimal sebelum navbar disembunyikan

window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) { // Hanya berlaku untuk mobile
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scroll ke bawah - sembunyikan navbar
            navbar.classList.add('hide-nav');
            navbar.classList.remove('show-nav');
        } else {
            // Scroll ke atas - tampilkan navbar
            navbar.classList.remove('hide-nav');
            navbar.classList.add('show-nav');
        }
        
        lastScrollTop = scrollTop;
    }
});

// Reset navbar state ketika resize ke desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        navbar.classList.remove('hide-nav', 'show-nav');
    }
});

