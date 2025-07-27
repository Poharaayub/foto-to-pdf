const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('capture');
const uploadBtn = document.getElementById('upload');
const preview = document.getElementById('preview');
const statusText = document.getElementById('status');

// AKSES KAMERA BELAKANG
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } },
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  }
}

startCamera();

let latestImageBlob = null;

captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Buat format Hari, Tanggal, dan Jam
  const time = new Date();
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  const hari = days[time.getDay()];
  const tanggal = time.getDate();
  const bulan = months[time.getMonth()];
  const tahun = time.getFullYear();
  const jam = time.getHours().toString().padStart(2, '0');
  const menit = time.getMinutes().toString().padStart(2, '0');
  const detik = time.getSeconds().toString().padStart(2, '0');

  const text = `${hari}, ${tanggal} ${bulan} ${tahun} ${jam}:${menit}:${detik}`;

  // Tambahkan ke gambar
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(text, 10, canvas.height - 20);

  canvas.toBlob(blob => {
    latestImageBlob = blob;
    const url = URL.createObjectURL(blob);
    preview.src = url;
    preview.style.display = 'block';
    statusText.textContent = '';
  }, 'image/jpeg', 0.95);
});

uploadBtn.addEventListener('click', () => {
  if (!latestImageBlob) {
    alert('Ambil foto terlebih dahulu!');
    return;
  }

  const fileName = `Foto_${new Date().toISOString().replace(/[:.]/g, '-')}.jpg`;

  const accessToken = 'sl.u.AF7R8k_YP7ADhIWp3U7CDSkPmD4BCYQzO_jAhb-JHKQvgSBkODeupO7W2JzOCWHFINQnwmVUTXUprk6EWgNLLYJYIGG0GgAhBZHuxSHjq-0g3jz6_QAyww0QB1qtzLXLlnHee6e60jnFUcXydrC2Pt9pItvqs_duo8j7CyutPAKIliU7QQGJO1ex0dv7nb_ftPlbaFsvEc2NpeJ09MJzgEtMtUUkq2Yo04d0WGFLBq667nX6KGb3tTl9Ba6XII3ihrNrtHcRj2_mcJw7Zx4aHN_PlPpvsONBK1t2Ih318z3z3H5YTyF1J1ULR1ydO79wyc32ffsY9Kuowislg7Wb5M0VDcL4pfcACFoR5d5V8vKmcVNrMKiNOAtFD7vpWapT4oAML4uQe50xVXbfKm5bJ3SaSX6drlMgetKMFyfGrb-rP-ZWkdFoMaww5SNnC_d190GMaueE0zz3_GZINjSdXyGc9ZRi5C8lDKt_0md4noV3ALr0VhZTRChaFGwqiJYjyYzGrjh3FS4DVhSQsndCjtrvtkMBg5nnSTGHWMBDiMaUl5Hgmpcpi4T4ogsDrvsin0CEwqYPpCIkNmGTE05a0rkNpjo3gBfdgj9vh-5x5ahrWFPtZf1PHWAz1lav6AWYuqvHyDYanwVsU76EyH6uT2CruD4ElYUJXJT5gs5_tjz8s01paHHJGIi1AgB3mseeHsaTpRGJ9LvxQDEw8Gqdy-JOLpa2_a2MS_Y9s8LuJcSdMfn_LIlBGJKtijUDbc7xVBKj2R8ob9n6fy_2GOcSE9nKRKSX3s1Ne03alr_P_5QnGKde0DRMC0G9Cr4v21jdm-mDDVR0Gz2g7CIYBJQkTdG0_Q7dwIztz48dWh9Do4ue1Ff9pN4UPfyFLyls5h3ovICKwrqHI-pT4SjKeBs9oErSmkO4YE7BzNn0P_P8sDUnNkK0QC8z6xOJNOEEXIRFafms1Gv4X2vqhnjCW22t8GOGkZI7a9kXai0rpvmke9pkSksfb7ZETMQUmkfxuJULe6ghr0qTCCtKAkCILrYZCshr1fK51FkjFF3dYcY7_YwgacJ7F7bIM0ALf2utpEBwR01CpSHZW5kYmfFEpTUPX65ouVPNvHlISZgNX0maWVvOsJKjS2FwTTnk3P5_VM-7c-JeHeXap14IahpkcTo3DFHlIfcknpMGtMJb2ha0V1pMGCZ5gew_lOlQ3zhCExRX4h9RCIIPj9fcBhQ964Ho1-fGa7yNQP4W8H5boK-SUGGlfXPhpJgH06wAC6KNfUeYDusz6koEXVEaqslfM7IGf4300x92FYsZbpksm-2E83bYjsX2wn0wefcRNrti3I1o83nCdhuE9WnDhU3FQkOhJDyuiwllu3vzrhXPtwwrnZEfoWvGYoinDTDA1RLP8cemA6IBOPNJRfbY0CMxUdzvMRSJ';

  fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Dropbox-API-Arg': JSON.stringify({
        path: '/' + fileName,
        mode: 'add',
        autorename: true,
        mute: false
      }),
      'Content-Type': 'application/octet-stream'
    },
    body: latestImageBlob
  })
  .then(response => response.json())
  .then(data => {
    statusText.textContent = '✅ Terimakasih foto sudah diupload. Tetap semangat OCS NFI Teams!!';
  })
  .catch(error => {
    alert('❌ Gagal upload: ' + error.message);
  });
});