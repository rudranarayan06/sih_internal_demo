
const cards = document.querySelectorAll('.card');
window.addEventListener('scroll', () => {
  const trigger = window.innerHeight * 0.85;
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < trigger) {
      card.classList.add('show');
    }
  });
});

const posts = document.querySelectorAll('.post');
window.addEventListener('scroll', () => {
  const trigger = window.innerHeight * 0.85;
  posts.forEach(post => {
    const top = post.getBoundingClientRect().top;
    if (top < trigger) {
      post.classList.add('show');
    }
  });
});

const members = document.querySelectorAll('.member');
window.addEventListener('scroll', () => {
  const trigger = window.innerHeight * 0.85;
  members.forEach(m => {
    const top = m.getBoundingClientRect().top;
    if (top < trigger) { m.classList.add('show'); }
  });
});

function toggleMode() {
  const btn = document.querySelector('.toggle button');
  if (btn.innerText.includes("Anonymous")) {
    btn.innerText = "Switch to Public Mode";
    alert("✅ Anonymous Mode Activated");
  } else {
    btn.innerText = "Switch to Anonymous Mode";
    alert("👤 Public Mode Activated");
  }
}

// Navbar toggle
    function toggleMenu() {
      let menu = document.getElementById("menu");
      let burger = document.querySelector(".hamburger");
      if (menu.style.display === "flex") {
        menu.style.display = "none";
        burger.classList.remove("open");
      } else {
        menu.style.display = "flex";
        burger.classList.add("open");
      }
    }


    const chatbotIcon = document.getElementById("chatbot-icon");
const chatbotPopup = document.getElementById("chatbot-popup");
chatbotIcon.addEventListener("click", () => {
  if (chatbotPopup.style.display === "block") {
    chatbotPopup.style.display = "none";
  } else {
    chatbotPopup.style.display = "block";
  }
});



  // animate testimonials on scroll
  const testimonials = document.querySelectorAll('.testimonial');
  window.addEventListener('scroll', () => {
    const trigger = window.innerHeight * 0.85;
    testimonials.forEach(t => {
      if (t.getBoundingClientRect().top < trigger) {
        t.classList.add('show');
      }
    });
  });

