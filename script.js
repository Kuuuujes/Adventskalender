const calendar = document.querySelector('#calendar');
const dialog = document.querySelector('#surprise');
const modalMedia = document.querySelector('#modal-media');
const imageViewer = document.querySelector('#image-viewer');
const fullscreenImage = document.querySelector('#fullscreen-image');

function getYouTubeId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null;
    if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(parsed.hostname)) return null;
    if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
    return parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || null;
  } catch {
    return null;
  }
}

function renderCalendar(surprises) {
  calendar.replaceChildren();
  surprises.forEach((surprise, index) => {
    const day = index + 1;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'door';
    button.setAttribute('aria-label', `Türchen ${day} öffnen`);
    button.innerHTML = `<span class="door-number">${String(day).padStart(2, '0')}</span><span class="door-sparkle" aria-hidden="true">${index % 4 === 0 ? '✦' : '❄'}</span>`;
    button.addEventListener('click', () => openSurprise(day, surprise));
    calendar.append(button);
  });
}

function openSurprise(day, surprise) {
  document.querySelector('#modal-day').textContent = `TÜRCHEN ${String(day).padStart(2, '0')}`;
  document.querySelector('#modal-title').textContent = surprise.title || `Türchen ${day}`;

  const description = surprise.description || '';
  const copy = document.querySelector('#modal-copy');
  copy.textContent = description;
  copy.hidden = !description;

  modalMedia.replaceChildren();
  if (surprise.image) {
    const imageButton = document.createElement('button');
    imageButton.type = 'button';
    imageButton.className = 'modal-image-trigger';
    imageButton.setAttribute('aria-label', `${surprise.title} im Vollbild öffnen`);

    const image = document.createElement('img');
    image.src = surprise.image;
    image.alt = surprise.imageAlt || surprise.title || '';
    imageButton.append(image);
    imageButton.addEventListener('click', () => {
      fullscreenImage.src = surprise.image;
      fullscreenImage.alt = image.alt;
      imageViewer.showModal();
    });
    modalMedia.append(imageButton);

    if (surprise.url) {
      modalMedia.append(makeExternalLink(surprise.url, surprise.label || 'Projekt öffnen'));
    }
  } else if (surprise.url && getYouTubeId(surprise.url)) {
    const videoId = getYouTubeId(surprise.url);
    const videoFrame = document.createElement('div');
    videoFrame.className = 'youtube-embed-wrap';
    const iframe = document.createElement('iframe');
    iframe.className = 'youtube-embed';
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
    iframe.title = surprise.title || 'YouTube-Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.loading = 'lazy';
    videoFrame.append(iframe);
    modalMedia.append(videoFrame);
    modalMedia.append(makeExternalLink(surprise.url, surprise.label || 'Auf YouTube öffnen'));
  } else if (surprise.url) {
    modalMedia.append(makeExternalLink(surprise.url, surprise.label || 'Projekt öffnen'));
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'media-placeholder';
    placeholder.textContent = 'Hier Link oder Bild eintragen';
    modalMedia.append(placeholder);
  }

  document.querySelector('#modal-author').textContent = `von ${surprise.author || 'Panikfee'}`;
  dialog.showModal();
}

function makeExternalLink(url, label) {
  const link = document.createElement('a');
  link.className = 'media-link';
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = `${label} ↗`;
  return link;
}

document.querySelector('.close').addEventListener('click', () => dialog.close());
document.querySelector('.image-viewer-close').addEventListener('click', () => imageViewer.close());
imageViewer.addEventListener('click', event => {
  if (event.target === imageViewer) imageViewer.close();
});
imageViewer.addEventListener('close', () => fullscreenImage.removeAttribute('src'));
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  const active = document.activeElement;
  if (active && active.classList.contains('door')) active.focus();
});

fetch('./doors.json')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(doors => {
    if (!Array.isArray(doors) || doors.length !== 24) throw new Error('doors.json must contain 24 doors');
    renderCalendar(doors);
  })
  .catch(error => {
    console.error('Could not load doors.json:', error);
    calendar.innerHTML = '<p class="load-error">Der Kalender konnte gerade nicht geladen werden.</p>';
  });
