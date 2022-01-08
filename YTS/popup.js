chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    if(String(url).startsWith('https://www.youtube.com/watch')){
        url = String(url).split("=")[1];
        // document.getElementById('a1').innerHTML=url;
        async function fetchapi() {
            let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');
  headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5000/yts/<string:link>');
  headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5000/yts');
  headers.append('Access-Control-Allow-Credentials', 'true');

  headers.append('GET', 'POST', 'OPTIONS');

            await fetch(`http://127.0.0.1:5000/yts/${url}`, {
                                "method": "GET", headers:headers})
                                .then(response => {
                                return response.json();
                                })
                                .then((dataobj) => {
                                    document.getElementById('a2').innerHTML=dataobj.summary;
                                })
                                .catch(err => {console.error(err);});           
                }
        fetchapi();
    }
});

