function openEnvelope() {
  localStorage.setItem("shouldPlayMusic", "true");

  // giữ lại tên khách trên URL
  const params = new URLSearchParams(window.location.search);
  let url = "invitation.html";
  if (params.has("guest")) {
    url += "?guest=" + encodeURIComponent(params.get("guest"));
  }

  document.querySelector('.envelope-image-wrapper').style.opacity = 0;
  setTimeout(() => {
    window.location.href = url;
  }, 700);
}

const audio = document.getElementById('bgm');
const toggleBtn = document.getElementById('toggleAudio');
const audioIcon = document.getElementById('audioIcon');
let playing = false;

document.addEventListener('DOMContentLoaded', () => {
  const shouldPlay = localStorage.getItem("shouldPlayMusic") === "true";

  if (shouldPlay && audio) {
    localStorage.removeItem("shouldPlayMusic");
    setTimeout(() => {
      audio.volume = 0.5;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          playing = true;
          audioIcon.className = 'fa-solid fa-volume-high';
        }).catch(() => {
          playing = false;
          audioIcon.className = 'fa-solid fa-volume-xmark';
        });
      }
    }, 200);
  }

  if (typeof Swiper !== 'undefined') {
    new Swiper('.swiper', {
      loop: true,
      autoplay: { delay: 3000 },
      pagination: { el: '.swiper-pagination', clickable: true },
    });
  }
});

toggleBtn?.addEventListener('click', () => {
  if (!audio) return;
  if (playing) {
    audio.pause();
    audioIcon.className = 'fa-solid fa-volume-xmark';
  } else {
    audio.play();
    audioIcon.className = 'fa-solid fa-volume-high';
  }
  playing = !playing;
});


const form = document.getElementById("rsvpForm");
let clickedResponse = "";

// Bắt sự kiện nút được bấm
document.querySelectorAll("#rsvpForm button[type=submit]").forEach(btn => {
  btn.addEventListener("click", () => {
    clickedResponse = btn.value;
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append("response", clickedResponse);

  fetch(form.action, { method: "POST", body: formData })
    .then(res => res.text())
    .then(() => {
      const resp = formData.get("response");
      let message = "";

      if (resp === "Tham dự") {
        message = "🎉 Cảm ơn bạn đã phản hồi! Hẹn gặp tại lễ tốt nghiệp 🎓";
      } else {
        message = "🙏 Cảm ơn bạn đã phản hồi! Hẹn gặp dịp khác nhé 💐";
      }

      document.getElementById("responseMessage").innerHTML = `
        <div class="alert alert-success text-center" role="alert">
          ${message}
        </div>`;
    })
    .catch(() => {
      document.getElementById("responseMessage").innerHTML = `
        <div class="alert alert-danger text-center" role="alert">
          Có lỗi xảy ra, vui lòng thử lại.
        </div>`;
    });
});


