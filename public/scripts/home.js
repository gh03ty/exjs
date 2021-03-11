
    /* Button Toggle for Sidebar */
    function toggleChannel(button) {
        switch (button.value) {
            case "ON":
                document.getElementById("sidebar").style.width = "0";
                document.getElementById("main-sidebar").style.marginLeft = "0";
                button.value = "OFF";
                break;

            case "OFF":
                document.getElementById("sidebar").style.width = "250px";
                document.getElementById("main-sidebar").style.marginLeft = "250px";
                button.value = "ON";
                break;
        }
    }
    /* ######################### */

    /* Button Toggle for Message Box */
    function toggleMessageBox(button) {
        switch (button.value) {
            case "ON":
                document.getElementById("message-button").innerHTML = "Close Message Box";
                button.value = "OFF";
                break;
            case "OFF":
                document.getElementById("message-button").innerHTML = "Open Message Box";
                button.value = "ON";
                break;
        }
    }
    /* ############################# */

    document.addEventListener("DOMContentLoaded", function(event) {

    document.getElementById('message-board-container').addEventListener('click', pos_track, true)

    function pos_track(pos) {
        let rect = pos.target.getBoundingClientRect();
        let X = pos.clientX - rect.left
        let Y = pos.clientY - rect.top
        console.log(X + " " + Y)
    }

    document.getElementById('message-board-container').addEventListener('click', createMessage, true)

    function createMessage(e){
        let rect = e.target.getBoundingClientRect();
        let X = e.clientX - rect.left
        let Y = e.clientY - rect.top

        document.querySelector("#modal").classList.add("modal--shown")
        document.querySelector('#X').value = X
        document.querySelector('#Y').value = Y
    }
});