// Petit effet de parallaxe
window.addEventListener('scroll', () => {
    const bgHero = document.querySelector('.bg-hero');
    if (bgHero) {
        bgHero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
});

// Gestion de la modale "Qui est SNYZZ"
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("aboutModal");
    const btn = document.getElementById("aboutBtn");
    const span = document.querySelector(".close-btn");

    // Ouvrir la modale
    if (btn) {
        btn.onclick = function() {
            modal.style.display = "block";
            document.body.style.overflow = "hidden"; // Empêche de scroller quand la modale est ouverte
        }
    }

    // Fermer la modale avec la croix
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    // Fermer la modale en cliquant en dehors
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});