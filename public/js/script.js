
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

// Handle story form submission and display stories
document.addEventListener('DOMContentLoaded', function () {
  const storyForm = document.getElementById('storyForm');
  if (storyForm) {
    storyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.querySelector('input').value;
      const story = this.querySelector('textarea').value;

      const storyList = document.getElementById('story-list');
      const storyCard = document.createElement('div');
      storyCard.className = 'story-card';
      storyCard.innerHTML = `<strong>${name}</strong><p>${story}</p>`;
      storyList.appendChild(storyCard);

      this.reset();
    });
  }
});
// Scroll animation for cards, posts, and members
window.addEventListener('scroll', () => {
  const trigger = window.innerHeight * 0.85;

  // Animate cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < trigger) {
      card.classList.add('show');
    }
  });

  // Animate posts
  const posts = document.querySelectorAll('.post');
  posts.forEach(post => {
    const top = post.getBoundingClientRect().top;
    if (top < trigger) {
      post.classList.add('show');
    }
  });

  // Animate team members
  const members = document.querySelectorAll('.member');
  members.forEach(member => {
    const top = member.getBoundingClientRect().top;
    if (top < trigger) {
      member.classList.add('show');
    }
  });
});

// Toggle between anonymous and public mode
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

// Toggle hamburger menu
function toggleMenu() {
  const nav = document.getElementById("nav-links");
  const menuIcon = document.querySelector('.menu-toggle');

  nav.classList.toggle("active");
  if (menuIcon) {
    menuIcon.classList.toggle('open');
  }
}