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
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Credentials', 'true');

  headers.append('GET', 'POST', 'OPTIONS');

            await fetch(`http://127.0.0.1:5000/yts/${url}`, {
                                "method": "GET", headers:headers})
                                .then(response => {
                                return response.json();
                                })
                                .then((dataobj) => {
                                    document.getElementById('a2').innerHTML=dataobj.summary;
                                    chrome.tabs.executeScript({
                                        code: `var injectElement = document.createElement('div');
                                        injectElement.id = 'injectedelement1';
                                        injectElement.innerHTML = "<br></br><h1 style='color:white;text-align:center;'>Summary</h1><br></br><h2 style='color:white;text-align:center;'>${dataobj.summary}</h2>";
                                        document.querySelector("#meta-contents > ytd-video-secondary-info-renderer").appendChild(injectElement);`
                                      });
                                })
                                .catch(err => {console.error(err);document.getElementById('a2').innerHTML="unable to get summary!";chrome.tabs.executeScript({
                                    code: `var injectElement = document.createElement('div');
                                    injectElement.id = 'injectedelement1';
                                    injectElement.innerHTML = '<br></br><h1 style="color:white;text-align:center;">Unable to fetch Summary</h1>';
                                    document.querySelector("#meta-contents > ytd-video-secondary-info-renderer").appendChild(injectElement);`
                                  });});           
                }
        fetchapi();
    }
});