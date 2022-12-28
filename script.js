(() => {
    const title = [ "Yo", ", the name is DK" ];
    window.onload = (event) => {
        document.getElementById("black").style.display = "none";

        let i = 0, j = 0;
        const titleTyping = () => {
            if (i < title[j].length) {
                document.getElementById("main-title").style.animation = "";
                document.getElementById("main-title").innerHTML += title[j].charAt(i);
                i++;
                setTimeout(titleTyping, 100);
            } else if (j < (title.length - 1)) {
                i = 0;
                j++;
                document.getElementById("main-title").style.animation = "blink-caret 1s steps(1) infinite";
                setTimeout(titleTyping, 1000);
            } else {
                document.getElementById("main-title").style.animation = "blink-caret 1s steps(1) infinite";
            }
        };
        document.getElementById("main-title").style.animation = "blink-caret 1s steps(1) infinite";
        setTimeout(titleTyping, 2000);
    };
})()
