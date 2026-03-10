(function () {
  const snacks = [
    {
      slug: "pani-puri",
      name: "Pani Puri Punch",
      desc:
        "Tangy street-style pani puri inspired snack with crunchy texture and bold masala.",
      images: [
        "GAME_PANipuri_Rs.5A.png",
        "GAME_PANipuri_Rs.5B.png",
        "GAME_PANipuri_Rs.5C.png",
        "GAME_PANipuri_Rs.5D.png",
      ],
      tag: "Tangy",
    },
    {
      slug: "masala-chowmein",
      name: "Masala Chowmein Crunch",
      desc:
        "Noodles meet namkeen in this spicy, crunchy treat packed with desi-style seasonings.",
      images: [
        "GAME_MASALA_CHOWMEIN_Rs.5.png",
        "GAME_DESI_CHOWMEIN_Rs.10.png",
      ],
      tag: "Spicy",
    },
    {
      slug: "masala-bhel",
      name: "Masala Bhel Mix",
      desc:
        "A loaded mix inspired by roadside bhel puri, with layers of flavour and crunch.",
      images: [
        "GAME_MASALA_BHEL_Rs.5.png",
        "GAME_TIME_PASS_BHEL_Rs.5.png",
      ],
      tag: "Classic",
    },
    {
      slug: "pav-bhaji",
      name: "Pav Bhaji Bites",
      desc:
        "The nostalgia of pav bhaji reimagined as a handy snack, great for sharing with friends.",
      images: ["GAME_PAV_BHAJI_Rs.5.png", "GAME_LUNCH_BOX_Rs.5.png"],
      tag: "Comfort",
    },
  ];

  function qs(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[s]);
    });
  }

  function renderList(root) {
    const html = snacks
      .map(
        (s) => `
      <article class="card">
        <div class="card-image"><img src="${escapeHtml((s.images && s.images[0]) || s.img)}" alt="${escapeHtml(s.name)}"/></div>
        <div class="card-body">
          <h3>${escapeHtml(s.name)}</h3>
          <p>${escapeHtml(s.desc)}</p>
          <span class="badge">${escapeHtml(s.tag)}</span>
          <div class="card-actions"><a class="btn ghost" href="snack.html?type=${encodeURIComponent(
            s.slug
          )}">View</a></div>
        </div>
      </article>
    `
      )
      .join("\n");

    root.innerHTML = `
      <div class="section-heading">
        <h2>Snacks</h2>
        <p>Browse flavours — click any item to view its detail page.</p>
      </div>
      <div class="cards-grid">${html}</div>
    `;
  }

  function renderDetail(root, slug) {
    const s = snacks.find((x) => x.slug === slug);
    if (!s) {
      root.innerHTML = `
        <div class="section-heading">
          <h2>Snack not found</h2>
          <p>The snack type '${escapeHtml(slug)}' was not recognised.</p>
          <p><a href="snack.html" class="btn ghost">View all snacks</a></p>
        </div>
      `;
      return;
    }

    const imgs = (s.images && s.images.length) ? s.images : [s.img];
    const thumbs = imgs
      .map(
        (u, i) => `<button class="thumb" data-src="${escapeHtml(u)}" aria-label="View image ${i+1}"><img src="${escapeHtml(u)}" alt="${escapeHtml(s.name)} thumbnail"/></button>`
      )
      .join("\n");

    root.innerHTML = `
      <div class="section-heading">
        <h2>${escapeHtml(s.name)}</h2>
        <p>${escapeHtml(s.tag)}</p>
      </div>
      <div class="two-column">
        <div>
          <img id="main-img" src="${escapeHtml(imgs[0])}" alt="${escapeHtml(s.name)}" style="max-width:480px; width:100%;"/>
          <div class="thumb-row">${thumbs}</div>
        </div>
        <div>
          <p>${escapeHtml(s.desc)}</p>
          <p><a href="index.html#menu" class="btn ghost">Back to Menu</a></p>
        </div>
      </div>
    `;

    // wire up thumbnail clicks
    const mainImg = root.querySelector('#main-img');
    root.querySelectorAll('.thumb').forEach((btn) => {
      btn.addEventListener('click', function () {
        const src = this.getAttribute('data-src');
        if (mainImg && src) mainImg.src = src;
      });
    });

    // create a lightbox element (once)
    let lightbox = document.getElementById('image-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'image-lightbox';
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `<div class="lightbox-inner"><img src="" alt=""/><div class="caption"></div></div>`;
      document.body.appendChild(lightbox);

      // close on overlay click
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
          lightbox.classList.remove('open');
        }
      });

      // close on ESC
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && lightbox.classList.contains('open')) {
          lightbox.classList.remove('open');
        }
      });
    }

    // open lightbox when main image is clicked
    if (mainImg) {
      mainImg.style.cursor = 'zoom-in';
      mainImg.addEventListener('click', function () {
        const lbImg = lightbox.querySelector('img');
        const caption = lightbox.querySelector('.caption');
        lbImg.src = this.src;
        lbImg.alt = this.alt || '';
        caption.textContent = this.alt || '';
        lightbox.classList.add('open');
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("snack-root");
    const type = qs("type");
    if (type) {
      renderDetail(root, type);
    } else {
      renderList(root);
    }
  });
})();
