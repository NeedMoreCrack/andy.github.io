function getCurrentLanguage() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    let language =
        params.get("lang")
        || localStorage.getItem("language")
        || "zh";

    if (
        language !== "zh"
        &&
        language !== "en"
    ) {
        language = "zh";
    }

    return language;
}


function applyLanguage(translations) {

    const language =
        getCurrentLanguage();

    // 儲存語言
    localStorage.setItem(
        "language",
        language
    );

    // 修改 html lang
    document.documentElement.lang =
        language === "zh"
            ? "zh-TW"
            : "en";


    // 翻譯有 data-i18n 的元素
    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            const value =
                translations?.[language]?.[key];

            if (value !== undefined) {
                element.innerHTML = value;
            }

        });

    // 翻譯 logo hover 的 CSS 偽元素文字
    document
        .querySelectorAll(".logo-container")
        .forEach(element => {

            element.style.setProperty(
                "--back-home-text",
                language === "zh"
                    ? '"返回主畫面"'
                    : '"Back to Home"'
            );

        });


    // 自動把語言參數傳給所有 HTML 連結
    document
        .querySelectorAll("a[href]")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }


            // #top、javascript:、mailto: 等不要處理
            if (
                href.startsWith("#")
                ||
                href.startsWith("javascript:")
                ||
                href.startsWith("mailto:")
                ||
                href.startsWith("tel:")
            ) {
                return;
            }


            try {

                const url =
                    new URL(
                        href,
                        window.location.href
                    );


                /*
                 * 只處理自己網站內部網址
                 * 不修改外部網站
                 */
                if (
                    url.origin ===
                    window.location.origin
                ) {

                    if (
                        url.pathname.endsWith(".html")
                        ||
                        url.pathname.endsWith("/")
                    ) {
                        url.searchParams.set(
                            "lang",
                            language
                        );

                        link.href =
                            url.toString();
                    }

                }

            } catch (error) {

                console.warn(
                    "無法處理網址：",
                    href
                );

            }

        });


    return language;
}