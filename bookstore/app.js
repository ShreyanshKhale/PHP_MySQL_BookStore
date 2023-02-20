export function readAllBooks(){
    const url = "http://localhost:4000/fetchMember"
    var xhr = new XMLHttpRequest();
    // we defined the xhr

    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data)
            // we get the returned data
        }
        // end of state change: it can be after some time (async)
    };
    xhr.open('GET', url, true);
    xhr.send();
}