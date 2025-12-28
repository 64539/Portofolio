// animasi skill bar
window.addEventListener("scroll", () => {
  document.querySelectorAll(".bar div").forEach(bar => {
    const value = bar.getAttribute("data-skill");
    bar.style.width = value + "%";
  });
});