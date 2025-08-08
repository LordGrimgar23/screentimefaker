function updatePreview() {
    document.getElementById("previewUsername").textContent = document.getElementById("username").value;
    document.getElementById("previewTime").textContent = document.getElementById("time").value;
    document.getElementById("previewDailyAverage").textContent = document.getElementById("dailyAverage").value;
    document.getElementById("previewTotalTime").textContent = document.getElementById("totalTime").value;
    document.getElementById("previewChange").textContent = document.getElementById("changePercent").value;

    let appList = document.getElementById("appList");
    appList.innerHTML = "";
    document.querySelectorAll("#apps .app").forEach(app => {
        let name = app.querySelector(".appName").value;
        let time = app.querySelector(".appTime").value;
        let row = document.createElement("div");
        row.className = "appRow";
        row.innerHTML = `<span class="appIcon">📱</span>
                         <span class="appName">${name}</span>
                         <span class="appTime">${time}</span>`;
        appList.appendChild(row);
    });
}

document.querySelectorAll("#controls input").forEach(input => {
    input.addEventListener("input", updatePreview);
});

document.getElementById("addApp").addEventListener("click", () => {
    let div = document.createElement("div");
    div.className = "app";
    div.innerHTML = `<input type="text" class="appName" value="New App">
                     <input type="text" class="appTime" value="0h 0m">`;
    document.getElementById("apps").appendChild(div);
    div.querySelectorAll("input").forEach(i => i.addEventListener("input", updatePreview));
});

document.getElementById("download").addEventListener("click", () => {
    html2canvas(document.querySelector("#phonePreview"), {scale: 2}).then(canvas => {
        let link = document.createElement("a");
        link.download = "screen_time.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});

updatePreview();
