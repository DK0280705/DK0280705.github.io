(() => {
    const title = "The name is DK"

    window.onload = (event) => {
        document.getElementById("black").style.display = "none";

        let i = 0;
        const titleTyping = () => {
            if (i < title.length) {
                document.getElementById("main-title").innerHTML += title.charAt(i);
                i++;
                setTimeout(titleTyping, 100);
            } else {
                document.getElementById("main-title").style.animation = "blink-caret 1s steps(1) infinite";
            }
        };
        titleTyping();
    };
})()
