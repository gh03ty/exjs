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

