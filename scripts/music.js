const table = document.getElementById("result");
const input = document.getElementById("search");
var videoid = '';
var url = new URL(window.location.href);
var phrase = url.searchParams.get("s");
function ListItem(id, title, thumbnail) {
    return '<tr><td><img src="' + thumbnail + '"></td><td>' + title + '</td><td><button class="button" onclick="Play(\'' + id + '\',\'' + thumbnail + '\',\'' + title + '\')"><i style="font-size:24px" class="fa">&#xf04b;</i></button><a class="button" href="youtube.html?id=' + id + '"><i style="font-size:24px" class="fa">&#xf019;</i></a><a class="button" target="_blank" href="https://www.youtube.com/watch?v=' + id + '"><i style="font-size:24px" class="fa">&#xf16a;</i></a></td></tr>';
}
if (localStorage.recentsongs) {
    songlist = localStorage.recentsongs;
    object = JSON.parse(songlist);
    table.innerHTML = '<tr><th colspan="3" style="text-align:center;"><h2>Recent Songs</h2></th></tr><tr><th>Cover</th><th>Title</th><th>Download</th></tr>'
    object.slice().reverse().forEach(music => {
        table.innerHTML += ListItem(music.id, music.title, music.thumb)
    });
    document.getElementById("tablediv").style.display = "block";
}
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        Search()
    }
});
document.getElementById("audio").addEventListener("error", function (e) {
    if (e.currentTarget.error.code = 2 && document.getElementById("audio").getAttribute("src") != "") {
        alert("Error Playing that song! Maybe its blocked in your country")
    }
});
function Search() {
    let data = input.value;
    document.getElementById("loader").style.display = "flex";
    const URL = "https://vid.puffyan.us/api/v1/search?type=video&q=" + encodeURIComponent(data);
    fetch(URL).then(data => {
        return data.json();
    }).then(posts => {
        document.getElementById("loader").style.display = "none";
        table.innerHTML = '<tr><th>Cover</th><th>Title</th><th>Download</th></tr>';
        posts.forEach(post => {
            var title = post.title;
            var thumbnail = post.videoThumbnails[4].url;
            var id = post.videoId;

            var tr = ListItem(id, title, thumbnail)
            table.innerHTML += tr;
        });
        document.getElementById("recommended").innerHTML = "";
        document.getElementById("tablediv").style.display = "block";
    });
}

function Play(id, thumb, title) {
    document.getElementById("thumb").src = thumb;
    document.getElementById("heading").innerHTML = title;
    document.title = title;
    videoid = id;
    const URL = "https://vid.puffyan.us/api/v1/videos/" + id + "?fields=adaptiveFormats,recommendedVideos";
    fetch(URL).then(data => {
        return data.json();
    }).then(posts => {
        var audiourl = posts.adaptiveFormats[1].url;
        document.getElementById("audio").src = audiourl;
        document.getElementById("playerdiv").style.display = "flex";
        const recommend = document.getElementById("recommended");
        recommend.innerHTML = '<tr><th colspan="3" style="text-align:center;"><h2>Suggested Songs</h2></th></tr><tr><th>Cover</th><th>Title</th><th>Download</th></tr>'
        posts.recommendedVideos.forEach(post => {
            var title = post.title;
            var thumbnail = post.videoThumbnails[4].url;
            var id = post.videoId;

            var tr = ListItem(id, title, thumbnail)
            recommend.innerHTML += tr;
        })
    });
    if (localStorage.recentsongs) {
        const lastsong = {
            id: id,
            title: title,
            thumb: thumb
        };
        songlist = JSON.parse(localStorage.recentsongs);
        songlist = songlist.filter(function (x) {
            return x.id != lastsong.id;
        });
        songlist.push(lastsong);
        localStorage.recentsongs = JSON.stringify(songlist);

    } else {
        const newsong = [{
            id: id,
            title: title,
            thumb: thumb
        }];
        localStorage.recentsongs = JSON.stringify(newsong);
    }
}
var videoPlayer = document.getElementById("videopadding");
if (phrase) { input.value = phrase; Search() }