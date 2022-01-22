window.onload = function () {
    document.getElementById("save").onclick = function() {
    localStorage.setItem("lines", document.getElementById("lines").value);
    localStorage.setItem("spl", document.getElementById("spl").value);
    document.getElementById('a4').innerHTML="Saved";};
}