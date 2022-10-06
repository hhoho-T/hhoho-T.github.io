/**
 * Xây dựng các chức năng sau 
 * render songs(thêm nhạc)
 * scroll top (chỉ đến bài hát hiện tại)
 * play / pause / peek (chạy / dừng / tiếp theo)
 * CD rotate ()
 * next / prew (tiếp theo / lùi lại)
 * random (ngẫu nhiên)
 * Next / repeat When ended
 * Active song
 * scroll active song into view 
 * play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


// đặt thêm 1 cái constom
const PLAYER_STORAGE_KEY = 'music-player'

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
    // lấy ra Element của cd để lấy kích thước sau đó làm nhỏ dần nó lại 
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress')
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
// tạo ra 1 Object 

const app = {
    // dùng currentIndex để lấy ra chỉ mục đầu tiên của mảng
    currentIndex: 1,
    // khi play thì xét nó là true 
    isPlaying: false,
    // sự kiện click vào thì thêm click tiếp thì xóa
    isRandom: false,
    // tạo sự kiện lặp lại bài hát
    isRepeat: false,
    // tạo ra 1 property để lưu các bài hát vào

    // tạo thêm 1 cái setting để sau này có thể cài đặt thêm 1 số thứ .  MẶC ĐỊNH NÓ KHÔNG CÓ THÌ TA LÁY 1 CÁI Object
    config: JSON.parse(localStorage.getItem('PLAYER_STORAGE_KEY')) || {},
    songs: [{
            name: 'Chiều hôm ấy Remix',
            singer: 'by JayKii, DJ',
            path: './asset/music/ChieuHomAyRemix-JayKiiDJ-5187432.mp3',
            img: './asset/img/ảnh của nhạc/chieuhomay.jpg'
        },
        {
            name: 'Beach',
            singer: 'MBB',
            path: './asset/music/Beach-MBB-5622658.mp3',
            img: './asset/img/ảnh của nhạc/tải xuống.jfif'
        },
        {
            name: 'Beijing',
            singer: 'Clare',
            path: './asset/music/Beijing-Clare-5103413.mp3',
            img: './asset/img/ảnh của nhạc/bijjon.jpg'
        },
        {
            name: 'ChinaJVIPMix',
            singer: 'VA',
            path: './asset/music/ChinaJVIPMix-VA-5979145.mp3',
            img: './asset/img/ảnh của nhạc/China (J VIP Mix).jfif'
        },
        {
            name: 'Đông phong chí',
            singer: 'HaleeRoyal',
            path: './asset/music/DongPhongChi-HaleeRoyal-5394555.mp3',
            img: './asset/img/ảnh của nhạc/dongphongchit.jpg'
        },
        {
            name: 'Lonely Dance',
            singer: 'Vexento',
            path: './asset/music/LonelyDance-Vexento-5381657.mp3',
            img: '/asset/img/ảnh của nhạc/lonely dance.jfif'
        },
        {
            name: 'Ngẫu hứng',
            singer: 'Hoaprox',
            path: './asset/music/NgauHung-Hoaprox-4120043.mp3',
            img: '/asset/img/ảnh của nhạc/ngau hung.jpg'
        },
        {
            name: 'Take Me Hand Htrol Remix',
            singer: 'VA',
            path: './asset/music/TakeMeHandHtrolRemix-VA-6042669.mp3',
            img: '/asset/img/ảnh của nhạc/sddefault.jpg'
        },
        {
            name: 'TevoOriginalMix',
            singer: 'Vexento',
            path: './asset/music/TevoOriginalMix-Vexento-4515378.mp3',
            img: './asset/img/ảnh của nhạc/ab67616d0000b273760e89459da59d7c8ad9adc4.jfif'
        },
        {
            name: 'Vietnam',
            singer: 'FredEddy',
            path: './asset/music/Vietnam-FredEddy-5522200.mp3',
            img: './asset/img/ảnh của nhạc/vietnam.jfif'
        }
    ],
    // đặt ra hàm set config nhận đối số key và value 
    setConfig: function(key, value) {
        // xét vào Object đó 
        this.config[key] = value;
        // sau khi xét thì lưu vào Storage get là lấy ra set là thêm vào. thêm JSON Stringtify lưu vào mã hóa ra chuỗi
        localStorage.setItem('PLAYER_STORAGE_KEY', JSON.stringify(this.config));

    },
    // tạo thêm hàm render để render ra cái view của chúng ta 
    render: function() {
        // nếu playlisst lặp lại thì đặt biến
        // const playlist = $(this.playlist)
        // console.log(123) test thử xem hàm render đã vào start chưa
        // dùng this.songs để chọc vào object songs và dùng phương thức map để lấy ra từng cái song 1

        const htmls = this.songs.map((song, index) => {
                // sau đó render ra cái html bài hát đặt data-index để xg dưới có thể dùng dataset
                return `
             <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                 <div class="thumb"
                     style="background-image: url('${song.img}')">
                  </div>
                 <div class="body">
                     <h3 class="title">${song.name}</h3>
                     <p class="author">${song.singer}</p>
                 </div>
                 <div class="option">
                     <i class="fas fa-ellipsis-h"></i>
                 </div>
             </div>
         `
            })
            // đổi ra thành biến playlist 
        playlist.innerHTML = htmls.join('')
    },
    // tất cả các định nghĩa trong Object này sẽ được đưa vào đây 
    defineProperties() {
        // dùng getter 
        // defineProperty nó có thể thay đổi giá trị sản phẩm 
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    // tạo thêm 1 hàm handleEvents để xử lý sự kiện trong trang này
    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const that = this;


        //-  xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            // lặp lại vô hạn 
            iterations: Infinity
        })
        cdThumbAnimate.pause();


        // lắng nghe sự kiện của document , onscroll là lắng nghe sự kiện kéo thanh scroll trên document của chúng ta
        document.onscroll = function() {
            // gộp 2 điều kiện cho từng trường hợp cho các trình duyệt khác nhau 
            // window là đại diện cho cửa sổ của trình duyệt, scrollY là chiều dọc
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            // tạo 1 cái hàm kích thước mới 
            const newcdWidth = cdWidth - scrollTop

            // dùng check để tránh trường hợp âm 
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            // lấy kích thước mới chia kích thước cũ là ra tỉ lệ opaciti
            cd.style.opacity = newcdWidth / cdWidth;
        }



        // - Xử lý khi click play
        playBtn.onclick = function() {
                if (that.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
            //-  khi được thực sự play 
        audio.onplay = function() {
                that.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play()
            }
            // - khi được thực sự pause 
        audio.onpause = function() {
                that.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause()

            }
            // - khi tiến độ bài hát được thay đổi
        audio.ontimeupdate = function() {
                // currentTime nó sẽ lấy ra thời gian hiện tại
                // duration  là tính ra phần trăm thanh chạy trên trình duyệt 
                if (audio.duration) {
                    // tính ra số phần trăm và làm tròn theo thời gian chạy bài hát 
                    const progressPecent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPecent
                }
            }
            // - khi tua bài hát 
        progress.oninput = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            // - next bài hát
        nextBtn.onclick = function() {
                if (that.isRandom) {
                    that.playRandomSong()
                } else {

                    that.nextSong()
                }
                audio.play()
                that.render()
                that.scrollToActiveSong()

            }
            // -  prev bài hát
        prevBtn.onclick = function() {
                if (that.isRandom) {
                    that.playRandomSong()
                } else {

                    that.prevSong()
                }
                audio.play()
                that.render()
                that.scrollToActiveSong()


            }
            // - click bật tắt random
        randomBtn.onclick = function(e) {
                // not chính nó là nó đảo ngược lại 
                that.isRandom = !that.isRandom
                that.setConfig('isRandom', that.isRandom)
                    // truyên đối số thứ 2 là that.isRandom và nếu là true thì nó sẽ add còn false thì sẽ remove
                randomBtn.classList.toggle('active', that.isRandom)
            }
            // - xử lý next khi hết bài Next / repeat When ended (onended là thuộc tính kết thúc sẽ dừng lại nên themem click để tự chuyển bài )
        repeatBtn.onclick = function(e) {
            that.isRepeat = !that.isRepeat
            that.setConfig('isRepeat', that.isRepeat)
            repeatBtn.classList.toggle('active', that.isRepeat)

        }
        audio.onended = function() {
            if (that.isRepeat) {
                audio.play();
            } else {

                nextBtn.click()
            }
            that.render()

        }

        // lắng nghe hành vi click vào playlist và sẽ in ra thể đó là gì luôn 
        playlist.onclick = function(e) {
                // e là event ta nhận được ở đây target là chỉ đích đên khi click 
                // console.log(e.target)
                // closest là 1 là trả về chính nó 2 là thẻ cha của nó 
                // not(.active) có nghĩa là trừ đi những thàng có active ra 
                // xử lý khi click vào song thì chúng ta chuyển đến bài đố
                // tạo biến sau này dùng cho dê
                const songElement = e.target.closest('.song:not(.active)')
                if ((songElement) || e.target.closest('.option')) {
                    // xử lý click vào song
                    if (songElement) {
                        // khi songElement.dataset.index nó sẽ là chuỗi nếu muốn chuyển thành số thì thêm Number
                        that.currentIndex = Number(songElement.dataset.index)
                            // để click vào sẽ chỉ đến bài hát đó do có index bên tr
                        that.loadCurrentSong()
                            // thêm render để nó in ra view của trang 
                        that.render()
                            // sau đó audio.play cho nó tự động chạy
                        audio.play()
                    }
                    // xử lý khi click vào song option tự thêm chức năng khi click vào chỗ có dấu ...
                    if (e.target.closest('.option')) {

                    }
                }
            }
            // - click để lặp lại bài hát
    },
    // tạo scroll để kéo theo nhạc 
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                // behavior là thêm thuoocjtinhss mượt
                behavior: 'smooth',
                //  phạm vi mình nhìn tháy trên màn hình 
                block: 'nearest'
            })
        }, 300)
    },
    // load ra thông tin bài hát hiện tại 
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    // next bài hát
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    // prev bài hát
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        // dùng do - while để lặp lại ngẫu nhiên 
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
                // lặp cho đến khi nào không trùng thì thôi 
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },

    // tạo thêm phương thức start để bắt đầu 
    start: function() {
        // gán cấu hình từ config `
        this.loadConfig()
            // ngay khi đc this.start thì ta gọi hàm defineProperties định nghĩa ra các thuộc tính
        this.defineProperties();
        // lắng nghe và xử lý các sự kiện (DOM event)
        this.handleEvents();

        // gọi  hàm thông tin bài hát ra để chạy 
        this.loadCurrentSong();

        // làm như này mọi thứ sẽ nằm trong thẻ start thôi không cần gọi thêm nhiều 
        // render playlist
        this.render()


        // hiển thị trạng thái ban đầu  của button repeat & random
        randomBtn.classList.toggle('active', that.isRandom)
        repeatBtn.classList.toggle('active', that.isRepeat)
    }
}
app.start()