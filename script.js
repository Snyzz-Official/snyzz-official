// Petit effet de parallaxe (désactivé si l'utilisateur préfère moins d'animations)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        const bgHero = document.querySelector('.bg-hero');
        if (bgHero) {
            bgHero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
    });
}

// Gestion générique des modales (À propos / Contact)
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    const openers = [
        { btn: document.getElementById('aboutBtn'), modalId: 'aboutModal' },
        { btn: document.getElementById('contactBtn'), modalId: 'contactModal' }
    ];

    const openModal = (modal) => {
        if (!modal) return;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) closeBtn.focus();
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Ouvrir chaque modale depuis son bouton dédié
    openers.forEach(({ btn, modalId }) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            openModal(document.getElementById(modalId));
        });
    });

    // Fermer avec la croix de chaque modale (clic ou clavier)
    document.querySelectorAll('.close-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal'));
        });
        btn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                closeModal(btn.closest('.modal'));
            }
        });
    });

    // Fermer en cliquant en dehors du contenu
    window.addEventListener('click', (event) => {
        if (event.target.classList && event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // Fermer avec la touche Échap
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modals.forEach((modal) => {
                if (modal.style.display === 'block') closeModal(modal);
            });
        }
    });

    // Copier l'adresse e-mail dans le presse-papiers
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        const originalLabel = copyEmailBtn.textContent;
        copyEmailBtn.addEventListener('click', async () => {
            const email = copyEmailBtn.dataset.email;
            try {
                await navigator.clipboard.writeText(email);
                copyEmailBtn.textContent = 'ADRESSE COPIÉE ✓';
            } catch (err) {
                copyEmailBtn.textContent = 'COPIE INDISPONIBLE';
            }
            setTimeout(() => {
                copyEmailBtn.textContent = originalLabel;
            }, 2000);
        });
    }
});
