let token; 
let genre = "";
    const but = document.getElementById("submit");
    but.addEventListener("click",fetchData);

async function getToken() {

        const date = await fetch('config.json')
        const date1 = await date.json();

        const clientID = date1.CLIENT_ID;
        const clientSecret = date1.CLIENT_SECRET;

        const result = await fetch('https://accounts.spotify.com/api/token' , {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa( clientID + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        //console.log(data.access_token);
        return data.access_token;
    }
async function fetchData() {
    try{
        genre="";
        document.getElementById('link').innerText = "";
        document.getElementById('link').href = "";
        document.getElementById('followers').innerText = "";
        document.getElementById('genres').innerText = genre;
        document.getElementById('link').innerText = "FINDING....";
        document.getElementById('link').href = "";
        let artist = document.getElementById("input").value;
        if(artist.length == 0){
            document.getElementById('link').innerText = "Nothing Given";
            throw new Error;
        }
        artist = artist.replace(" ","_");
        token = await getToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=3`,{
            method: "GET",
            headers: {'Authorization': 'Bearer ' + token}
        });
        if(!response.ok){
            throw new Error("Not found");
        }
        const data = await response.json();
        console.log(data.artists);
        document.getElementById('link').innerText = data.artists.items[0].name;
        document.getElementById('link').href = data.artists.items[0].external_urls.spotify;
        document.getElementById('followers').innerText = `Followers: ${data.artists.items[0].followers.total.toLocaleString("en-US")}`;
        for(let i=0;i<data.artists.items[0].genres.length;i++){
            genre = genre+`${data.artists.items[0].genres[i]}\n`;
        }
        console.log(data.artists.items[0].genres.length);
        document.getElementById('genres').innerText = genre;
    }
    catch(error){
        console.error(error);
    }
}