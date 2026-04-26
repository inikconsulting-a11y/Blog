document.querySelectorAll('.lightbox-img').forEach((img) => {
  img.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:9999';
    const clone = document.createElement('img');
    clone.src = img.src;
    clone.style.cssText = 'max-width:95vw;max-height:95vh;border-radius:10px';
    modal.appendChild(clone);
    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
  });
});
